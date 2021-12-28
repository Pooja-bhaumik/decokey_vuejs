<template>
  <v-container>
    <data-table-dialog
      :dialog.sync="editOn"
      :editedItem="editedItem"
      :dialogFields="editedItemFields"
      @saveChanges="saveEditedItem"
      dialogTitle="Edit author"
    ></data-table-dialog>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-row>
      <v-col lg="10" md="10" sm="6">
        <h2>Content tags info</h2>
      </v-col>
      <v-col lg="2" md="2" sm="6" align-self="center">
        <data-table-dialog
          :dialog.sync="createOn"
          :editedItem="createdItem"
          :dialogFields="createdItemFields"
          @saveChanges="createItem"
          dialogTitle="Create new author"
        ></data-table-dialog>
        <v-btn color="primary" block @click="createOn = true">Create author</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :loadInfo="loadAuthorsInfo"
          :items="authorsInfo"
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
      authorsInfo: [],
      totalItemsCount: 0,
      itemsPerPage: 10,
      page: 1,
      headers: [
        { text: 'ID', value: 'id', searchValue: 'id', width: '100px' },
        { text: 'Name', value: 'name', searchValue: 'name' },
        { text: 'Actions', value: 'action', align: 'center', sortable: false }
      ],
      search: {
        id: '',
        value: ''
      },

      editedItemFields: [
        { label: 'ID', model: 'id', readonly: true, cols: 6 },
        { label: 'Name', model: 'name', required: true, cols: 6 }
      ],
      editedItem: null,
      editOn: false,

      createdItemFields: [
        { label: 'Name', model: 'name', required: true }
      ],
      createdItem: {},
      createOn: false
    }
  },

  watch: {
    options () {
      this.loadAuthorsInfo()
    }
  },

  methods: {
    editItem (item) {
      this.editOn = true
      this.editedItem = item
    },

    saveEditedItem () {
      let saveRequest = Object.assign({}, this.editedItem)
      this.$store.dispatch('saveContentTypeItem', { typeName: 'Author', item: saveRequest }).then(
        response => {
          if (response.data.saveAuthor) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadAuthorsInfo()
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
      this.$store.dispatch('saveContentTypeItem', { typeName: 'Author', item: saveRequest }).then(
        response => {
          if (response.data.saveAuthor) {
            this.$root.$emit('infoMessage', 'Created')
            this.loadAuthorsInfo()
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
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this author?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteContentTypeItemById', { typeName: 'Author', contentTypeItemId: item.id }).then(
            response => {
              if (response.data.deleteAuthorById) {
                this.$root.$emit('infoMessage', `Author ${item.name} deleted`)
                this.loadAuthorsInfo()
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

    loadAuthorsInfo () {
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
        typeName: 'Author',
        pageable,
        searchPattern,
        sortPattern,
        fields: 'id name'
      }).then(response => {
        this.authorsInfo = response.content
        this.totalItemsCount = response.totalElements
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadAuthorsInfo()
  },

  components: {
    CustomDataTable,
    DataTableDialog,
    ConfirmDialog
  }
}
</script>
