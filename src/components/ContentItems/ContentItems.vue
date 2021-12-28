<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container>
        <h2 class="mb-3">{{ $t('message.contentItems') }}</h2>
        <v-select
                :items="contentItemTypes"
                item-text="name"
                :return-object="true"
                v-model="selectedContentItemType"
                label="Select type"
        ></v-select>
        <div v-if="selectedContentItemType">
            <v-data-table
                    :headers="visibleHeaders"
                    :hide-default-header="true"
                    :items="contentItems"
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
              <template v-slot:top>
                <v-col lg="2" md="2" sm="6" offset-md="0" offset-sm="3" class="mb-md-0 mb-sm-4" align-self="center">
                <v-btn color="primary" block @click="searchContent">{{ $t('buttons.search') }}</v-btn>
                </v-col>
              </template>
              <template v-slot:header="props">
                <tr>
                  <th
                    v-for="header in visibleHeaders"
                    :key="header.text"
                  >
                    <v-text-field
                    :label="header.text"
                    append-icon="mdi-magnify"
                    class="md-4"
                    v-model="search[header.text]"
                    @keyup.enter.native="searchContent"
                    ></v-text-field>
                  </th>
                </tr>
              </template>
            </v-data-table>
        </div>
    </v-container>
</template>

<script>
export default {
  data: function () {
    return {
      search: {},
      selectedContentItemType: null,
      contentItems: [],
      totalContentItems: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      loadFields: 'id, name',
      loading: true,
      options: {},
      headers: [
        {
          text: 'ID',
          align: 'left',
          value: 'id'
        },
        { text: 'Name', value: 'name' }
      ]
    }
  },
  watch: {
    options: {
      handler () {
        // this.$store.dispatch('clientLoadContentItemsByTypeName', { typeName: this.selectedContentItemType.name, fields: this.loadFields, limit: this.options.itemsPerPage, offset: (this.options.page - 1) * this.options.itemsPerPage })
        var search = this.search
        Object.keys(search).forEach(key => search[key] === '' && delete search[key])
        // if (Object.keys(search).length) {
        this.searchContent()
        // } else {
        //   this.$store.dispatch('clientLoadContentItemsByTypeName', { typeName: this.selectedContentItemType.name, fields: this.loadFields, limit: this.options.itemsPerPage, offset: (this.options.page - 1) * this.options.itemsPerPage })
        // }
      },
      deep: true
    },
    selectedContentItemType: function (val) {
      if (val) {
        this.search = {}
        this.page = 1
        var fieldsString = ''
        var tableHeaders = []
        for (var key in JSON.parse(val.data)) {
          if (fieldsString.length > 0) {
            fieldsString += ','
          }
          fieldsString += key
          tableHeaders.push({
            text: key,
            align: 'left',
            value: key
          })
        }
        fieldsString += ',srcId, typeId'
        this.loadFields = fieldsString
        this.headers = tableHeaders
        this.headers.forEach(i => {
          this.search[i.value] = ''
        })
        console.log(this.headers)
        this.searchContent()
        // this.$store.dispatch('clientLoadContentItemsByTypeName', { typeName: val.name, fields: this.loadFields, limit: this.options.itemsPerPage, offset: (this.options.page - 1) * this.options.itemsPerPage })
      }
    }
  },
  methods: {
    searchContent () {
      var search = this.search
      Object.keys(search).forEach(key => search[key] === '' && delete search[key])
      this.$store.dispatch('clientSearchContentItems', {
        typeName: this.selectedContentItemType.name,
        search: search,
        fields: this.loadFields,
        limit: this.options.itemsPerPage,
        offset: (this.options.page - 1) * this.options.itemsPerPage
      }).then(data => {
        this.contentItems = data.content
        this.totalContentItems = data.totalElements
      })
    }
  },
  computed: {
    visibleHeaders: function () {
      return this.headers
    },
    totalItemsCount: function () {
      return this.totalContentItems
    },
    contentItemTypes: function () {
      return this.$store.getters.getContentItemTypes
    }
  }
}
</script>
