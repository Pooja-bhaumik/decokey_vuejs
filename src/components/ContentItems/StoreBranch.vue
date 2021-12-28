<template>
  <v-container>
    <data-table-dialog
      :dialog.sync="editOn"
      :editedItem="editedItem"
      :dialogFields="editedItemFields"
      @saveChanges="saveEditedItem"
      dialogTitle="Edit store branch"
    ></data-table-dialog>
    <data-table-dialog
        :dialog.sync="createOn"
        :editedItem="createdItem"
        :dialogFields="createdItemFields"
        :createdDialogMode="true"
        @saveChanges="createItem"
        dialogTitle="Create new store branch"
    ></data-table-dialog>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-row>
      <v-col lg="9" md="9" sm="6">
        <h2>Store branch info</h2>
      </v-col>
      <v-col lg="3" md="3" sm="6" align-self="center">
        <v-btn color="primary" block @click="createOn = true">Create store branch</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :loadInfo="loadStoreBranchInfo"
          :items="storeBranchesInfo"
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
      storeBranchesInfo: [],
      totalItemsCount: 0,
      itemsPerPage: 10,
      page: 1,
      headers: [
        { text: 'ID', value: 'id', searchValue: 'id', width: '100px' },
        { text: 'Name', value: 'name', searchValue: 'name', sortBy: true },
        { text: 'Src uuid', value: 'srcUuid', searchValue: 'name' },
        { text: 'Actions', value: 'action', align: 'center', sortable: false }
      ],
      search: {
        id: '',
        name: ''
      },

      editedItemFields: [
        { label: 'ID', model: 'id', readonly: true },
        { label: 'Name', model: 'name', required: true },
        { label: 'Src uuid', model: 'srcUuid', required: true, cols: 12 }
      ],
      editedItem: null,
      editOn: false,

      createdItemFields: [
        { label: 'Name', model: 'name', required: true, cols: 12 },
        { label: 'Src uuid', model: 'srcUuid', required: true, cols: 12 }
      ],
      createdItem: {},
      createOn: false
    }
  },

  watch: {
    options () {
      this.loadStoreBranchInfo()
    }
  },

  methods: {
    editItem (item) {
      this.editOn = true
      this.editedItem = item
    },

    saveEditedItem () {
      let saveRequest = Object.assign({}, this.editedItem)
      this.$store.dispatch('saveContentTypeItem', { typeName: 'Branch', item: saveRequest }).then(
        response => {
          if (response.data.saveBranch) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadStoreBranchInfo()
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
      this.$store.dispatch('saveContentTypeItem', { typeName: 'Branch', item: saveRequest }).then(
        response => {
          if (response.data.saveBranch) {
            this.$root.$emit('infoMessage', 'Created')
            this.loadStoreBranchInfo()
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
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this store branch?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteContentTypeItemById', { typeName: 'Branch', contentTypeItemId: item.id }).then(
            response => {
              if (response.data.deleteBranchById) {
                this.$root.$emit('infoMessage', `Store branch ${item.name} deleted`)
                this.loadStoreBranchInfo()
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

    loadStoreBranchInfo () {
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
        typeName: 'Branch',
        pageable,
        searchPattern,
        sortPattern,
        fields: 'id name srcUuid'
      }).then(response => {
        this.storeBranchesInfo = response.content
        this.totalItemsCount = response.totalElements
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadStoreBranchInfo()
  },

  components: {
    CustomDataTable,
    DataTableDialog,
    ConfirmDialog
  }
}
</script>
