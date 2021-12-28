<template>
  <v-container>
    <h2>{{ $t('message.cmsContentItems') }} </h2>
    <v-icon @click="editItem(null)" v-text="'mdi-text-box-plus-outline'"></v-icon>
    <website-edit :id="editedItemId" :edit-dialog.sync="editOn" @websiteSaved="handleWebsiteWasSaved" ></website-edit>

    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :loadInfo="loadWebsitesInfo"
          :items="websitesInfo"
          :headers="headers"
          :totalItemsCount="totalItemsCount"
          :itemsPerPage="itemsPerPage"
          :page.sync="page"
          :options.sync="options"
          :search="search"
          :loading="loading"
          :editItem="editItem"
          :deleteItem="deleteItem"
        ></custom-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomDataTable from '@/components/TableParts/CustomDataTable'
import ConfirmDialog from '@/components/ConfirmDialog'
import WebsiteEdit from '@/components/WebsiteEdit'

export default {
  data: function () {
    return {
      editedItemId: undefined,
      loading: false,
      options: {},
      websitesInfo: [],
      totalItemsCount: 0,
      itemsPerPage: 10,
      page: 1,
      headers: [
        { text: 'ID', value: 'id', searchValue: 'id', width: '100px' },
        { text: 'Name', value: 'name', searchValue: 'name', sortBy: true },
        { text: 'Actions', value: 'action', align: 'center', sortable: false }
      ],
      search: {
        id: '',
        name: ''
      },

      editedItemFields: [
        { label: 'ID', model: 'id', readonly: true },
        { label: 'Name', model: 'name', required: true },
        { label: 'Url', model: 'url', required: true, cols: 12 }
      ],
      editedItem: null,
      editOn: false
    }
  },

  watch: {
    options () {
      this.loadWebsitesInfo()
    },
    editOn: function (val) {
      if (!val) {
        this.editedItemId = undefined
      }
    }
  },

  methods: {
    editItem (item) {
      this.editedItemId = item ? item.id : null
      this.editOn = true
    },

    handleWebsiteWasSaved () {
      this.loadWebsitesInfo()
    },

    deleteItem (item) {
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this website?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteContentTypeItemById', { typeName: 'Website', contentTypeItemId: item.id }).then(
            response => {
              if (response.data.deleteWebsiteById) {
                this.$root.$emit('infoMessage', `Website ${item.name} deleted`)
                this.loadWebsitesInfo()
              } else {
                this.$root.$emit('infoMessage', 'Response returned false')
              }
            },
            failure => {
              this.errorMessages = [failure.message]
              console.log(failure)
            }
          )
        }
      })
    },

    loadWebsitesInfo () {
      this.loading = true
      this.loading = true
      const pageable = { offset: (this.options.page - 1) * this.options.itemsPerPage, size: this.options.itemsPerPage }
      const sortPattern = {}
      const self = this
      let searchPattern = {}

      if (this.options.sortBy.length > 0) {
        let orders = []
        this.options.sortBy.forEach((v, i) => {
          orders.push(v + ',' + (self.options.sortDesc[i] ? 'desc' : 'asc'))
        })
        sortPattern.orders = orders
      }

      searchPattern = this.search
      Object.keys(this.search).forEach(key => searchPattern[key] === '' && delete searchPattern[key])

      this.$store.dispatch('loadContentTypeItemsPage', {
        typeName: 'Website',
        pageable,
        searchPattern,
        sortPattern,
        fields: 'id name url'
      }).then(response => {
        this.websitesInfo = response.content
        this.totalItemsCount = response.totalElements
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadWebsitesInfo()
  },

  components: {
    CustomDataTable,
    ConfirmDialog,
    WebsiteEdit
  }
}
</script>
