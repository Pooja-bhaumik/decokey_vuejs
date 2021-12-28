<template>
  <v-container>
    <v-row>
      <v-col lg="10" md="10" sm="6">
        <h2>Suppliers info</h2>
      </v-col>
      <v-col lg="2" md="2" sm="6" align-self="center">

        <data-table-dialog
          :dialog.sync="createOn"
          :editedItem="createdSupplier"
          :dialogFields="createdSupplierFields"
          @saveChanges="createSupplier"
          dialogTitle="Create new supplier"
        >
          <template v-slot:popups="{ editedItem }">
            <brands-popup :brands-popup.sync="createdBrandPopupOn" :supplier-brands.sync="editedItem.supplierBrands" :supplier-id="editedItem.id"></brands-popup>
          </template>
          <template v-slot:text-field="{ editedItem }">
            <v-col cols="12" sm="12" md="12" lg="12">
              <v-select
                v-model="editedItem.supplierBrands"
                :items="editedItem.supplierBrands"
                item-text="brandDescription"
                item-disabled="brandId"
                label="Brands"
                outlined
                multiple
                append-outer-icon="mdi-plus"
                @click:append-outer="createdBrandPopupOn = true"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index === 0">
                    <span>{{ item.brandDescription }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="grey--text caption"
                  >(+{{ editedItem.supplierBrands.length - 1 }} others)</span>
                </template>
              </v-select>
            </v-col>
          </template>
        </data-table-dialog>
        <v-btn color="primary" block @click="createOn = true">Create supplier</v-btn>
      </v-col>
    </v-row>
    <data-table-dialog
      :dialog.sync="editUserOn"
      :editedItem="editedUser"
      :dialogFields="editedUserFields"
      @saveChanges="saveEditedUserItem"
      dialogTitle="Edit user info"
    ></data-table-dialog>

    <data-table-dialog
      :dialog.sync="editSupplierOn"
      :editedItem="editedSupplier"
      :dialogFields="editedSupplierFields"
      @saveChanges="saveEditedSupplierItem"
      dialogTitle="Edit supplier info"
    >
      <template v-slot:popups="{ editedItem }">
        <brands-popup :brands-popup.sync="editedBrandsPopupOn" :supplier-brands.sync="editedItem.supplierBrands" :supplier-id="editedItem.id"></brands-popup>
      </template>
      <template v-slot:text-field="{ editedItem }">
        <v-col cols="12" sm="12" md="12" lg="12">
          <v-select
            v-model="editedItem.supplierBrands"
            :items="editedItem.supplierBrands"
            item-text="brandDescription"
            item-disabled="brandId"
            label="Brands"
            outlined
            multiple
            append-outer-icon="mdi-plus"
            @click:append-outer="editedBrandsPopupOn = true"
          >
            <template v-slot:selection="{ item, index }">
              <v-chip v-if="index === 0">
                <span>{{ item.brandDescription }}</span>
              </v-chip>
              <span
                v-if="index === 1"
                class="grey--text caption"
              >(+{{ editedItem.supplierBrands.length - 1 }} others)</span>
            </template>
          </v-select>
        </v-col>
      </template>
    </data-table-dialog>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :loadInfo="loadSuppliersInfo"
          :headers="headers"
          :items="suppliersInfo"
          :page.sync="page"
          :options.sync="options"
          :totalItemsCount="totalItemsCount"
          :itemsPerPage="itemsPerPage"
          :loading="loading"
          :editItem="editItem"
          :deleteItem="deleteItem"
          :search="search"
        >
          <template v-slot:actions="{ isUserRoot, item }">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-icon v-if="isUserRoot" @click="editUserInfo(item.id)" v-text="'mdi-account-edit'" v-on="on" class="ml-3"></v-icon>
              </template>
              <span>Edit user info</span>
            </v-tooltip>
          </template>
        </custom-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog'
import CustomDataTable from '@/components/TableParts/CustomDataTable'
import DataTableDialog from '@/components/TableParts/DataTableDialog'
import BrandsPopup from '@/components/SuppliersInfo/BrandsPopup'
import Role from '../../store/roles'

export default {
  data: () => ({
    loading: false,
    options: {},
    itemsPerPage: 10,
    page: 1,
    search: {
      id: '',
      name: ''
    },
    totalItemsCount: 0,
    headers: [
      { text: 'ID', value: 'id', searchValue: 'id', width: '100px' },
      { text: 'Username', value: 'name', searchValue: 'name' },
      { text: 'Actions', value: 'action', align: 'center', sortable: false }
    ],

    editedBrandsPopupOn: false,
    createdBrandPopupOn: false,

    editedSupplierFields: [
      { label: 'ID', model: 'id', readonly: true },
      { label: 'Username', model: 'name', required: true }
    ],
    editSupplierOn: false,
    editedSupplier: {},

    editedUserFields: [
      { label: 'ID', model: 'id', readonly: true },
      { label: 'Username', model: 'username', required: true, readonly: true },
      { label: 'Password', model: 'password', required: true, cols: 12 },
      {
        label: 'Authority',
        model: 'authorities',
        type: 'select',
        items: [
          {
            name: 'ROLE_ROOT',
            authorities: [
              {
                id: 1,
                authority: 'ROLE_ROOT'
              }
            ]
          },
          {
            name: 'ROLE_SUPPLIER',
            authorities: [
              {
                id: 2,
                authority: 'ROLE_SUPPLIER'
              }
            ]
          }
        ],
        itemText: 'name',
        itemValue: 'authorities',
        required: true,
        cols: 12
      }
    ],
    editUserOn: false,
    editedUser: null,

    createdSupplierFields: [
      { label: 'Username', model: 'name', required: true },
      { label: 'Password', model: 'password', required: true }
    ],
    createOn: false,
    createdSupplier: {},

    deleteDialog: false
  }),

  watch: {
    options: {
      handler () {
        this.loadSuppliersInfo()
      }
    }
  },

  computed: {
    suppliersInfo () {
      return this.$store.getters.getSuppliersInfo ? this.$store.getters.getSuppliersInfo : []
    },

    isUserRoot () {
      return this.$store.getters.userHasRoles(Role.Root)
    }
  },

  methods: {
    editItem (item) {
      this.editedSupplier = item
      this.editSupplierOn = true
    },

    editUserInfo (supplierId) {
      this.$store.dispatch('getAppUserById', supplierId).then(user => {
        this.editedUser = user
        this.editUserOn = true
      })
    },

    saveEditedSupplierItem () {
      let saveRequest = Object.assign({}, this.editedSupplier)
      let sBrands = []
      for (var key in this.editedSupplier.supplierBrands) {
        if (this.editedSupplier.supplierBrands.hasOwnProperty(key)) {
          sBrands.push(this.editedSupplier.supplierBrands[key])
        }
      }
      saveRequest.supplierBrands = sBrands
      this.$store.dispatch('saveSupplier', { inputSupplier: saveRequest }).then(
        response => {
          if (response.data.saveSupplier) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadSuppliersInfo()
            this.editSupplierOn = false
          }
          console.log(response)
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
        }
      )
    },

    createSupplier () {
      let saveRequest = Object.assign({}, this.createdSupplier)
      const supplierPassword = saveRequest.password
      delete saveRequest.password
      this.$store.dispatch('saveSupplier', {
        inputSupplier: saveRequest,
        supplierPassword: supplierPassword
      }).then(
        response => {
          if (response.data.saveSupplier) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadSuppliersInfo()
            this.createOn = false
          }
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
        }
      )
    },

    deleteItem (supplier) {
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this supplier?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteSupplier', supplier.id).then(
            response => {
              if (response.data.deleteSupplierById) {
                this.$root.$emit('infoMessage', `Supplier ${supplier.name} deleted`)
                this.loadSuppliersInfo()
              } else {
                this.$root.$emit('infoMessage', 'Response returned false')
              }
              console.log(response)
            },
            failure => {
              this.errorMessages = [failure.message]
              console.log(failure)
            }
          )
        }
      })
    },

    saveEditedUserItem () {
      let saveRequest = Object.assign({}, this.editedUser)
      saveRequest.enabled = true
      console.log(saveRequest)
      this.$store.dispatch('saveUser', saveRequest).then(
        response => {
          if (response.data.saveAppUser) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadSuppliersInfo()
            this.editUserOn = false
          }
          console.log(response)
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
        }
      )
    },

    handleSupplierWasSaved () {
      this.loadSuppliersInfo()
    },

    loadSuppliersInfo () {
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

      this.$store.dispatch('loadSuppliersList', { pageable: pageable, searchPattern: searchPattern, sortPattern: sortPattern }).then((data) => {
        this.totalItemsCount = data.totalElements
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadSuppliersInfo()
  },

  components: {
    ConfirmDialog,
    CustomDataTable,
    DataTableDialog,
    BrandsPopup
  }
}
</script>
