<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <h2>{{ $t('message.cmsContentItems') }} </h2>
      <v-icon @click="editItem(null)" v-text="'mdi-text-box-plus-outline'"></v-icon>
    <cms-content-item-edit :id="editedItemId" :edit-dialog.sync="editOn" @cmsContentItemSaved="handleCmsContentItemWasSaved" ></cms-content-item-edit>
    <v-data-table
      :headers="headers"
      :items="cmsContentItems"
      :page.sync="page"
      :options.sync="options"
      :server-items-length="totalItemsCount"
      :items-per-page="itemsPerPage"
      :footer-props="{
                        'items-per-page-options': [5, 10, 20, 30, 40, 50]
                      }"
      class="elevation-1"
      @page-count="pageCount = $event"
    >
        <template v-slot:header="props">
            <tr>
                <th
                        v-for="header in headers"
                        :key="header.searchValue"
                >
                    <v-container v-if="header.searchValue">
                    <v-text-field v-if="!header.typeId && !header.typeName"
                            :label="header.text"
                            append-icon="mdi-magnify"
                            @click:append="() => (loadCmsContentItems())"
                            class="md-4"
                            v-model="search[header.value]"
                            @keyup.enter.native="loadCmsContentItems"
                    ></v-text-field>
                      <vue-2-datepicker v-else-if="header.searchValue === 'startAt'" :dateTime.sync="startAt" :showTimePanelToggle="true"></vue-2-datepicker>
                      <vue-2-datepicker v-else-if="header.searchValue === 'endAt'" :dateTime.sync="endAt" :showTimePanelToggle="true"></vue-2-datepicker>
                      <item-filter v-else v-model="search[header.searchValue]" @input="loadCmsContentItems" :type-id="header.typeId" :type-name="header.typeName" :label="header.text" ></item-filter>
                    </v-container>
                </th>
            </tr>
        </template>
        <template v-slot:item.action="{ item }">
            <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <v-icon @click="editItem(item)" v-text="'mdi-file-document-edit-outline'" v-on="on"></v-icon>
                </template>
                <span>{{ $t('buttons.edit') }}</span>
            </v-tooltip>
        </template>
    </v-data-table>
  </v-container>
</template>

<script>
import CmsContentItemEdit from '@/components/CmsContentItems/CmsContentItemEdit'
import ItemFilter from '@/components/ContentItems/ItemFilter'
import ItemType from '../../store/itemType'
import Vue2Datepicker from '@/components/BrandStatistic/Vue2Datepicker'

export default {
  data: () => ({
    editedItemId: undefined,
    editOn: false,
    search: {},
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    options: {},
    totalItemsCount: 0,
    startAt: [null, null],
    endAt: [null, null],
    headers: [
      { text: 'Id', value: 'id', searchValue: 'id' },
      { text: 'Brand', value: 'brand.name', searchValue: 'brand.id', typeId: ItemType.Brand },
      { text: 'Target audience', value: 'targetAudience.name', searchValue: 'targetAudience.id', typeId: ItemType.Target_Audience },
      { text: 'Product group', value: 'productGroup.name', searchValue: 'productGroup.id', typeId: ItemType.Product_Group },
      { text: 'Article category', value: 'articleCategory.name', searchValue: 'articleCategory.id', typeId: ItemType.Article_Category },
      { text: 'Title', value: 'title', searchValue: 'title' },
      { text: 'From', value: 'start', searchValue: 'startAt', typeName: 'dateTime' },
      { text: 'Till', value: 'end', searchValue: 'endAt', typeName: 'dateTime' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    cmsContentItems: function () {
      return this.$store.getters.getCmsContentItems ? this.$store.getters.getCmsContentItems.content : []
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.search = Object.assign({ id: this.$route.query.id }, this.search)
      this.editItem({ id: this.$route.query.id })
    }
    this.loadCmsContentItems()
  },
  watch: {
    options: {
      handler () {
        this.loadCmsContentItems()
      }
    },
    editOn: function (val) {
      if (!val) {
        this.editedItemId = undefined
      }
    },
    startAt () {
      this.loadCmsContentItems()
    },
    endAt () {
      this.loadCmsContentItems()
    }
  },
  methods: {
    editItem: function (item) {
      this.editedItemId = item ? item.id : null
      this.editOn = true
    },
    handleCmsContentItemWasSaved () {
      this.loadCmsContentItems()
    },
    loadCmsContentItems () {
      let pageable = { size: this.options.itemsPerPage, offset: (this.options.page - 1) * this.options.itemsPerPage }
      let sortPattern = {}
      let self = this
      if (this.options.sortBy.length) {
        let orders = []
        this.options.sortBy.forEach((v, i) => {
          orders.push(v + ',' + (self.options.sortDesc[i] ? 'desc' : 'asc'))
        })
        sortPattern.orders = orders
      }
      var searchPattern = Object.assign({}, this.search)
      let additional = {}

      if (this.startAt[0] && this.startAt[1]) {
        additional.startAtFrom = this.formatDateString(this.startAt[0])
        additional.startAtTo = this.formatDateString(this.startAt[1])
      }

      if (this.endAt[0] && this.endAt[1]) {
        additional.endAtFrom = this.formatDateString(this.endAt[0])
        additional.endAtTo = this.formatDateString(this.endAt[1])
      }

      Object.keys(searchPattern).forEach(key => {
        let val = searchPattern[key]
        if (val === '' || key === 'start' || key === 'end') {
          delete searchPattern[key]
        } else {
          delete searchPattern[key]
          Object.assign(searchPattern, self.pathToObject({}, key, val))
        }
      })

      this.$store.dispatch('loadCmsContentItemPage', { sortPattern: sortPattern, additional: additional, searchPattern: searchPattern, pageable: pageable }).then((data) => {
        this.totalItemsCount = data.totalElements
      })
    },
    formatDateString (dateStr) {
      if (dateStr === null) {
        return null
      }
      let momentObj = this.$moment(dateStr)
      return momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS')
    },
    pathToObject (obj, path, value = null) {
      path = typeof path === 'string' ? path.split('.') : path
      let current = obj
      while (path.length > 1) {
        const [head, ...tail] = path
        path = tail
        if (current[head] === undefined) {
          current[head] = {}
        }
        current = current[head]
      }
      current[path[0]] = value
      return obj
    }
  },
  components: {
    ItemFilter,
    'cms-content-item-edit': CmsContentItemEdit,
    Vue2Datepicker
  }

}
</script>
