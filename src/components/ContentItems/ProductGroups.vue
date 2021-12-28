<template>
  <v-container>
    <data-table-dialog
      :dialog.sync="editOn"
      :editedItem="editedItem"
      :dialogFields="editedItemFields"
      @saveChanges="saveEditedItem"
      dialogTitle="Edit product group"
    ></data-table-dialog>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>

    <v-row v-if="!selectable">
      <v-col lg="9" md="9" sm="6">
        <h2>Product groups info</h2>
      </v-col>
      <v-col lg="3" md="3" sm="6" align-self="center">
        <data-table-dialog
          :dialog.sync="createOn"
          :editedItem="createdItem"
          :dialogFields="createdItemFields"
          :createdDialogMode="true"
          @saveChanges="createItem"
          dialogTitle="Create new product group"
        ></data-table-dialog>
        <v-btn color="primary" block @click="createOn = true">Create product group</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :withoutStandartActions="selectable"
          :loadInfo="loadProductGroupsInfo"
          :items="productGroupsInfo"
          :headers="headers"
          :totalItemsCount="totalItemsCount"
          :itemsPerPage="itemsPerPage"
          :page.sync="page"
          :options.sync="options"
          :search="search"
          :loading="loading"
          :editItem="editItem"
          :deleteItem="deleteItem"
        >
          <template v-slot:actions="{ item }" v-if="selectable">
            <div style="display: inline-block">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-checkbox
                    v-model="item.isActive"
                    @click.stop="selectItem(item)"
                    color="primary"
                    v-on="on"
                    ></v-checkbox>
                </template>
                <span>{{ $t('buttons.select') }}</span>
              </v-tooltip>
            </div>
          </template>
        </custom-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomDataTable from '@/components/TableParts/CustomDataTable'
import DataTableDialog from '@/components/TableParts/DataTableDialog'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  props: {
    dialogMode: Boolean,
    selectable: Boolean,
    selectedItems: Array
  },

  data: function () {
    return {
      loading: false,
      options: {},
      productGroupsInfo: [],
      totalItemsCount: 0,
      page: 1,
      headers: [
        { text: 'ID', value: 'id', searchValue: 'id', width: '100px' },
        { text: 'name', value: 'name', searchValue: 'name' },
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
        { label: 'Name', model: 'name', required: true }
      ],
      createdItem: {},
      createOn: false
    }
  },

  computed: {
    itemsPerPage () {
      return this.selectable ? 5 : 10
    }
  },

  watch: {
    options () {
      this.loadProductGroupsInfo()
    },

    dialogMode (isOpen) {
      if (isOpen) {
        Object.keys(this.search).forEach(searchName => {
          this.search[searchName] = ''
        })
        this.loadProductGroupsInfo()
      }
    }
  },

  methods: {
    selectItem (item) {
      item.isActive = !item.isActive
      if (item.isActive) {
        this.selectedItems[0] = item
        this.productGroupsInfo.forEach(productGroup => {
          productGroup.isActive = +productGroup.id === +item.id
        })
      } else {
        this.selectedItems[0] = null
      }
      this.$emit('newSelectedItems', [this.selectedItems[0]])
    },

    editItem (item) {
      this.editOn = true
      this.editedItem = item
    },

    saveEditedItem () {
      let saveRequest = Object.assign({}, this.editedItem)
      this.$store.dispatch('saveContentTypeItem', { typeName: 'ProductGroup', item: saveRequest }).then(
        response => {
          if (response.data.saveProductGroup) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadProductGroupsInfo()
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
      this.$store.dispatch('saveContentTypeItem', { typeName: 'ProductGroup', item: saveRequest }).then(
        response => {
          if (response.data.saveProductGroup) {
            this.$root.$emit('infoMessage', 'Created')
            this.loadProductGroupsInfo()
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
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this article category?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteContentTypeItemById', { typeName: 'ProductGroup', contentTypeItemId: item.id }).then(
            response => {
              if (response.data.deleteProductGroupById) {
                this.$root.$emit('infoMessage', `Article category ${item.name} deleted`)
                this.loadProductGroupsInfo()
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

    loadProductGroupsInfo () {
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
        typeName: 'ProductGroup',
        pageable,
        searchPattern,
        sortPattern,
        fields: 'id name'
      }).then(response => {
        if (response) {
          // Check for items which already selected
          if (this.selectable) {
            response.content.forEach(productGroup => {
              productGroup.isActive = this.selectedItems.some(selectedItem => {
                if (selectedItem) {
                  return +selectedItem.id === +productGroup.id
                }
              })
            })
          }

          this.productGroupsInfo = response.content
          this.totalItemsCount = response.totalElements
        }
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadProductGroupsInfo()
  },

  components: {
    CustomDataTable,
    DataTableDialog,
    ConfirmDialog
  }
}
</script>
