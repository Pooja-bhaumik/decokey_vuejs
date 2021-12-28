<template>
  <div>
    <v-data-table
        :loading="loading"
        :headers="dataTableHeaders"
        :items="dataTableItems"
        :options.sync="options"
        :server-items-length="count"
        :items-per-page="10"
        :footer-props="{
          'items-per-page-options': [5, 10, 20, 30, 40, 50]
        }"
        class="elevation-1">
      <template v-slot:header>
        <tr class="search-inputs-wrapper">
          <th v-for="header in headers" :key="'header' + header.label">
            <div>
              <v-text-field
                  :label="header.label"
                  v-if="header.freeText === undefined || header.freeText"
                  append-icon="mdi-magnify"
                  @click:append="() => load()"
                  class="md-4"
                  v-model="search[header.path]"
                  @keyup.enter.native="load"></v-text-field>
              <slot name="filter" v-else :header="header" :search="search" :load="load"></slot>
            </div>
          </th>
        </tr>
      </template>

      <template v-if="metadata.actions" v-slot:item.action="{ item }">
        <div v-for="action in metadata.actions" :key="'action' + action.name">
          <v-tooltip top v-if="!action.visible || action.visible(item)">
            <template v-slot:activator="{ on }">
              <v-icon v-if="action.name === 'delete'" @click="deleteItem(item)" v-text="'mdi-delete'" v-on="on" class="ml-3"></v-icon>
              <v-icon v-else-if="action.name === 'edit'" @click="$emit('edit', item)" v-text="'mdi-file-document-edit-outline'" v-on="on"></v-icon>
              <v-icon v-else-if="action.name === 'preview'" @click="$emit('preview', item)" v-text="'mdi-eye'" v-on="on"></v-icon>
              <slot :name="'action_' + action.name" v-else :item="item" :on="on"></slot>
            </template>
            <span v-if="action.label">{{action.label}}</span>
            <span v-else-if="action.name === 'delete'">Delete</span>
            <span v-else-if="action.name === 'edit'">Edit</span>
            <span v-else-if="action.name === 'preview'">Preview</span>
            <span v-else-if="action.name === 'check'">{{ $t('buttons.select') }}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
  </div>
</template>
<style type="text/css">
.v-data-table-header th {
  white-space: nowrap;
}
</style>

<script>
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  name: 'CommonDataTable',
  props: {
    /* Array of objects of next structure
     * {
     *   ordinary: Boolean, (default true)
     *   sortable: Boolean, (default true)
     *   label: String,
     *   path: Path - path to the property being displayed (see below what is Path)
     *   freeText: Boolean - if search handled by simple edit text or require more refined handling
     * }
     *
     * Path usage:
     * For nested objects use "." as delimiter.
     * Let's assume, backend configured to have 2 objects: AdBanner and TargetAudience
     * class TargetAudience {
     *   private String name;
     * }
     * class AdBanner {
     *   private TargetAudience targetAudience;
     *   private String name;
     * }
     *
     * Then to display list of ad banners:
     * 1. with column target audience name, you need to specify path = 'targetAudience.name'
     * 2. with column name, you need to specify path = 'name'
     */
    headers: Array,
    /* Expected to be object of next structure:
     * {
     *   className: String,
     *   actions: Array of {name: String, label: String, visible: Function} objects.
     *     Name should be one of next: edit, delete, preview, check.
     *     If name == 'check', then action can be customized by slot action_check.
     *     Label used to describe action. If not specified, then default label set up
     *     Visible is function of next template: (item) => Boolean
     *   payload: Object to be loaded in graphql query
     * }
     */
    metadata: Object,
    /*
     * Additional search pattern used in queries
     */
    additionalSearchPattern: Object
  },
  data: () => ({
    loading: true,
    items: [],
    options: undefined,
    count: 0,
    search: {},
    previousSearchPattern: null
  }),
  mounted () {
    this.load()
  },
  watch: {
    options: {
      handler () {
        this.load()
      }
    },
    additionalSearchPattern: {
      handler () {
        this.load()
      }
    }
  },
  computed: {
    dataTableHeaders () {
      let res = this.headers.map(item => {
        return {
          text: item.label,
          value: item.path,
          sortable: item.sortable === undefined || item.sortable,
          align: 'center'
        }
      })
      if (this.metadata.actions && this.metadata.actions.length) {
        res.push({ text: 'Actions', value: 'action', sortable: false })
      }
      return res
    },
    searchWithoutEmpties () {
      const withoutEmpties = JSON.parse(JSON.stringify(this.search))
      Object.keys(withoutEmpties).forEach(key => {
        if (!withoutEmpties[key]) {
          delete withoutEmpties[key]
        }
      })
      return withoutEmpties
    },
    dataTableItems () {
      return this.items.map(item => this.replaceArrayWithStrings(item))
    }
  },
  methods: {
    load () {
      this.loading = true

      let self = this
      let pageable = { size: this.options.itemsPerPage, offset: (this.options.page - 1) * this.options.itemsPerPage }
      let sortPattern = {}
      if (this.options.sortBy.length) {
        let orders = []
        this.options.sortBy.forEach((v, i) => {
          orders.push(v + ',' + (self.options.sortDesc[i] ? 'desc' : 'asc'))
        })
        sortPattern.orders = orders
      }

      const searchPattern = Object.assign({}, this.searchWithoutEmpties)

      Object.keys(searchPattern).forEach(key => {
        let val = searchPattern[key]
        delete searchPattern[key]
        let notOrdinaryHeader = self.headers.filter(header => header.ordinary !== undefined && !header.ordinary)
          .map(header => header.path).filter(headerKey => headerKey === key)
        if (notOrdinaryHeader != null) {
          Object.assign(searchPattern, self.pathToObject(key, val))
        }
      })

      let template = {}
      for (let i = 0; i < this.headers.length; i++) {
        let header = this.headers[i]
        template = this.mergeDeep(template, this.pathToObject(header.path))
      }

      if (this.metadata.payload) {
        template = this.mergeDeep(template, this.metadata.payload)
      }

      let additional = null
      if (this.additionalSearchPattern) {
        additional = this.additionalSearchPattern
      }

      if (this.previousSearchPattern !== JSON.stringify(searchPattern)) {
        pageable = Object.assign(pageable, { offset: 0 })
        this.options.page = 1
        this.previousSearchPattern = JSON.stringify(searchPattern)
      }

      this.$store.dispatch('loadPage', {
        className: self.metadata.className,
        searchPattern,
        additional,
        sortPattern,
        pageable,
        template: self.toTemplate(template)
      }).then(response => {
        if (response) {
          self.items = response.content
          self.count = response.totalElements
        }
        self.loading = false
      })
    },
    pathToObject (path, value = null) {
      let paths = path.split('.')

      let template = ''
      for (let i = 0; i < paths.length; i++) {
        if (i === 0) {
          template += '{\n'
        } else {
          template += ': {\n'
        }
        template += '"' + paths[i] + '"'
      }
      if (value == null) {
        template += ': ' + value + '\n'
      } else {
        template += ': "' + value + '"\n'
      }
      for (let i = 0; i < paths.length; i++) {
        template += '}'
      }

      return JSON.parse(template)
    },
    mergeDeep (target, ...sources) {
      if (!sources.length) return target
      const source = sources.shift()

      if (this.isObject(target) && this.isObject(source)) {
        for (const key in source) {
          if (this.isObject(source[key])) {
            if (!target[key]) Object.assign(target, { [key]: {} })
            this.mergeDeep(target[key], source[key])
          } else {
            Object.assign(target, { [key]: source[key] })
          }
        }
      }

      return this.mergeDeep(target, ...sources)
    },
    isObject (item) {
      return (item && typeof item === 'object' && !Array.isArray(item))
    },
    toTemplate (nullableObject) {
      let template = JSON.stringify(nullableObject)
      return template.replaceAll(':null', '').replaceAll('"', '').replaceAll(':', '')
    },
    deleteItem (item) {
      let self = this
      this.$refs.confirmDialog.open('Delete', 'Are you sure you want to delete this item?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteById', { className: self.metadata.className, id: item.id }).then(
            _ => {
              self.$root.$emit('infoMessage', `Item successfully deleted`)
              self.load()
            },
            failure => {
              console.log(failure)
            }
          )
        }
      })
    },
    replaceArrayWithStrings (item) {
      let self = this
      if (Array.isArray(item)) {
        let res = {}
        if (item.length) {
          res = this.replaceArrayWithStrings(item[0])

          for (let i = 1; i < item.length; i++) {
            res = self.concat(res, item[i])
          }
        }
        return res
      }
      Object.keys(item).forEach(key => {
        let val = item[key]
        if (Array.isArray(val)) {
          delete item[key]
          item[key] = self.replaceArrayWithStrings(val)
        }
      })
      return item
    },
    concat (first, second) {
      let self = this
      let res = {}
      Object.keys(first).forEach(key => {
        if (self.isObject(first[key])) {
          res[key] = self.concat(first[key], second[key])
        } else {
          res[key] = first[key] + ', ' + second[key]
        }
      })
      return res
    }
  },
  components: {
    ConfirmDialog
  }
}
</script>
