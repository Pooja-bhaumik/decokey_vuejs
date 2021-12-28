<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-dialog hide-overlay transition="dialog-bottom-transition" v-model="show">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('message.searchFor') }}  {{title}}</span>
          <v-spacer></v-spacer>
            <v-text-field v-if="showGlobalSearch"
              v-model="globalSearch"
              @keyup.enter.native="textfilter"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="useHeaders"
            :hide-default-header="hideHeaders"
            :items="items"
            :options.sync="options"
            :server-items-length="total"
            :footer-props="{ 'items-per-page-options': [5, 10, 20, 30, 40, 50] }"
            @click:row="rowClick" item-key="id" single-select
            class="elevation-1">
            <template v-slot:top>
              <v-col lg="2" md="2" sm="6" offset-md="0" offset-sm="3" class="mb-md-0 mb-sm-4" align-self="center">
                <v-btn color="primary" block @click="filter">{{ $t('buttons.search') }}</v-btn>
              </v-col>
            </template>
            <template v-slot:body.prepend>
              <tr>
                <th v-for="header in useHeaders" :key="header.text">
                  <v-text-field v-if="!header.isHideFilter"
                      :label="header.title"
                      append-icon="mdi-magnify"
                      class="md-4"
                      v-model="search[header.value]"
                      @keyup.enter.native="filter">
                      >
                    </v-text-field>
                </th>
              </tr>
            </template>
            <template v-slot:item.id="{ item }" v-if="applyCustomForRerference">
              <a :href="'/#/cmsContentItems?id='+ item.id" target="_self">
                {{ item.id }}
              </a>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  props: {
    load: {
      type: Function,
      required: true
    },
    responseMapper: {
      type: Function,
      required: true
    },
    nameMapper: {
      type: Function,
      default: function (item) {
        return item.name
      }
    },
    overrideHeaders: {
      type: Function,
      required: false
    },
    title: String,
    visible: Boolean,
    hideHeaders: {
      type: Boolean,
      default: true
    },
    applyCustomForRerference: {
      type: Boolean,
      default: false
    },
    showGlobalSearch: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    headers: [{
      text: 'id',
      value: 'id',
      title: 'ID'
    }, {
      text: 'name', value: 'name', title: 'Name'
    }],
    search: {},
    options: {},
    items: [],
    total: 0,
    globalSearch: ''
  }),
  watch: {
    options: {
      handler () {
        this.filter()
      },
      deep: true
    }
  },
  computed: {
    show: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    },
    searchFiltered () {
      const withoutEmpties = JSON.parse(JSON.stringify(this.search))
      Object.keys(withoutEmpties).forEach(key => {
        if (!withoutEmpties[key]) {
          delete withoutEmpties[key]
        }
      })
      return withoutEmpties
    },
    useHeaders () {
      return this.overrideHeaders ? this.overrideHeaders() : this.headers
    }
  },
  methods: {
    filter () {
      let self = this
      self.load({
        search: self.searchFiltered,
        limit: self.options.itemsPerPage,
        offset: (self.options.page - 1) * self.options.itemsPerPage
      }).then(response => {
        let data = this.responseMapper(response)
        if (this.overrideHeaders) {
          self.items = data.content
        } else {
          self.items = data.content.map(item => {
            return { id: item.id, name: this.nameMapper(item) }
          })
        }
        self.total = data.totalElements
      })
    },
    textfilter () {
      let self = this
      self.load({
        search: { 'textTitleSearch': self.globalSearch },
        limit: self.options.itemsPerPage,
        offset: (self.options.page - 1) * self.options.itemsPerPage
      }).then(response => {
        let data = this.responseMapper(response)
        if (this.overrideHeaders) {
          self.items = data.content
        } else {
          self.items = data.content.map(item => {
            return { id: item.id, name: this.nameMapper(item) }
          })
        }
        self.total = data.totalElements
      })
    },
    rowClick (item) {
      this.$emit('selected', item)
      this.show = false
    },
    customFilter (value, search, item) {
      return value != null && search != null && typeof value === 'string' && value.toString().indexOf(search) !== -1
    }
  }
}
</script>
