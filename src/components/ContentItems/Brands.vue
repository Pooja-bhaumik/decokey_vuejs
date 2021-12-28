<template>
  <v-container>
    <data-table-dialog
      :dialog.sync="editOn"
      :editedItem="editedItem"
      :dialogFields="editedItemFields"
      @saveChanges="saveEditedItem"
      dialogTitle="Edit brand"
    ></data-table-dialog>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-row>
      <v-col lg="10" md="10" sm="6">
        <h2>Brands info</h2>
      </v-col>
      <v-col lg="2" md="2" sm="6" align-self="center">
        <data-table-dialog
          :dialog.sync="createOn"
          :editedItem="createdItem"
          :dialogFields="createdItemFields"
          :createdDialogMode="true"
          @saveChanges="createItem"
          dialogTitle="Create new brand"
        ></data-table-dialog>
        <v-btn color="primary" block @click="createOn = true">Create brand</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :loadInfo="loadBrandsInfo"
          :items="brandsInfo"
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
import DataTableDialog from '@/components/TableParts/DataTableDialog'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  data: function () {
    return {
      loading: false,
      options: {},
      brandsInfo: [],
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
        { label: 'Name', model: 'name', required: true }
      ],
      editedItem: null,
      editOn: false,

      createdItemFields: [
        { label: 'Name', model: 'name', required: true, cols: 12 }
      ],
      createdItem: {},
      createOn: false
    }
  },

  watch: {
    options () {
      this.loadBrandsInfo()
    }
  },

  methods: {
    editItem (item) {
      this.editOn = true
      this.editedItem = item
    },

    saveEditedItem () {
      let saveRequest = Object.assign({}, this.editedItem)
      this.$store.dispatch('saveContentTypeItem', { typeName: 'Brand', item: saveRequest }).then(
        response => {
          if (response.data.saveBrand) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadBrandsInfo()
            this.editOn = false
          }
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
        }
      )
    },

    createItem () {
      let saveRequest = Object.assign({}, this.createdItem)
      this.$store.dispatch('saveContentTypeItem', { typeName: 'Brand', item: saveRequest }).then(
        response => {
          if (response.data.saveBrand) {
            this.$root.$emit('infoMessage', 'Created')
            this.loadBrandsInfo()
            this.createOn = false
            this.createdItem = {}
          }
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
        }
      )
    },

    deleteItem (item) {
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this brand?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteContentTypeItemById', { typeName: 'Brand', contentTypeItemId: item.id }).then(
            response => {
              if (response.data.deleteBrandById) {
                this.$root.$emit('infoMessage', `Brand ${item.name} deleted`)
                this.loadBrandsInfo()
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

    loadBrandsInfo () {
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
        typeName: 'Brand',
        pageable,
        searchPattern,
        sortPattern,
        fields: 'id name'
      }).then(response => {
        this.brandsInfo = response.content
        this.totalItemsCount = response.totalElements
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadBrandsInfo()
  },

  components: {
    CustomDataTable,
    DataTableDialog,
    ConfirmDialog
  }
}
</script>
