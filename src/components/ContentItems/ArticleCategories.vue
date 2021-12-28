<template>
  <v-container>
    <data-table-dialog
      :dialog.sync="editOn"
      :editedItem="editedItem"
      :dialogFields="editedItemFields"
      @saveChanges="saveEditedItem"
      :dialogTitle="editedDialogTitle"
    >
      <template v-slot:popups="{ editedItem }">
        <!-- Product Groups Dialog -->
        <v-dialog v-model="productGroupsOn" max-width="800px">
          <v-card>
            <v-card-title class="text-center">
              <span class="headline font-weight-bold">Product Groups</span>
            </v-card-title>
            <v-card-text>
              <product-groups
                :dialogMode="productGroupsOn"
                :selectable="true"
                :selectedItems="editedItem ? [editedItem.productGroup] : []"
                @newSelectedItems="getProductGroupsItems"
              ></product-groups>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="productGroupsOn = false">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click.stop="productGroupsOn = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Target Audiences Dialog -->
        <v-dialog v-model="targetAudiencesOn" max-width="800px">
          <v-card>
            <v-card-title class="text-center">
              <span class="headline font-weight-bold">Target Audiences</span>
            </v-card-title>
            <v-card-text>
              <target-audiences
                :dialogMode="targetAudiencesOn"
                :selectable="true"
                :selectedItems="editedItem ? [editedItem.targetAudience] : []"
                @newSelectedItems="getTargetAudiencesItems"
              ></target-audiences>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="targetAudiencesOn = false">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click.stop="targetAudiencesOn = false">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>

      <template v-slot:text-field="{ editedItem }">
        <v-col cols="12" sm="12" md="12" lg="12">
          <v-select
            :value="editedItem.productGroup"
            :items="editedItem.productGroup ? [editedItem.productGroup] : []"
            item-value="id"
            item-text="name"
            label="Product group"
            readonly
            outlined
            hide-details
            append-outer-icon="mdi-plus"
            @click:append-outer="productGroupsOn = true"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="12" md="12" lg="12">
          <v-select
            :value="editedItem.targetAudience"
            :items="editedItem.targetAudience ? [editedItem.targetAudience] : []"
            item-value="id"
            item-text="name"
            label="Target audience"
            readonly
            outlined
            hide-details
            append-outer-icon="mdi-plus"
            @click:append-outer="targetAudiencesOn = true"
          ></v-select>
        </v-col>
      </template>
    </data-table-dialog>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-row>
      <v-col lg="9" md="9" sm="6">
        <h2>Article categories info</h2>
      </v-col>
      <v-col lg="3" md="3" sm="6" align-self="center">
        <v-btn color="primary" block @click="openEditedItem({}, 'create')">Create article category</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :loadInfo="loadArticleCategoriesInfo"
          :items="articleCategoriesInfo"
          :headers="headers"
          :totalItemsCount="totalItemsCount"
          :itemsPerPage="itemsPerPage"
          :page.sync="page"
          :options.sync="options"
          :search="search"
          :loading="loading"
          :editItem="openEditedItem"
          :deleteItem="deleteItem"
        ></custom-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CustomDataTable from '@/components/TableParts/CustomDataTable'
import DataTableDialog from '@/components/TableParts/DataTableDialog'
import ProductGroups from '@/components/ContentItems/ProductGroups'
import TargetAudiences from '@/components/ContentItems/TargetAudiences'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  data: function () {
    return {
      loading: false,
      options: {},
      articleCategoriesInfo: [],
      totalItemsCount: 0,
      itemsPerPage: 10,
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

      editOn: false,
      editedItem: {},
      editedItemFields: [],
      editedDialogTitle: '',
      productGroupsOn: false,
      targetAudiencesOn: false
    }
  },

  watch: {
    options () {
      this.loadArticleCategoriesInfo()
    }
  },

  methods: {
    openEditedItem (item, mode) {
      if (mode === 'create') {
        this.editedItemFields = [
          { label: 'Name', model: 'name', required: true, cols: 12 }
        ]
        this.editedDialogTitle = 'Create new article category'
      } else {
        this.editedItemFields = [
          { label: 'ID', model: 'id', readonly: true },
          { label: 'Name', model: 'name', required: true }
        ]
        this.editedDialogTitle = 'Edit article category'
      }
      this.editOn = true
      this.editedItem = item
    },

    getProductGroupsItems (selectedItems) {
      const productGroups = selectedItems.map(selectedItem => {
        if (selectedItem) {
          return {
            id: selectedItem.id,
            name: selectedItem.name
          }
        }
        return []
      })
      this.editedItem.productGroup = productGroups[0]
      this.editedItem.productGroupId = productGroups[0].id
    },

    getTargetAudiencesItems (selectedItems) {
      const targetAudiences = selectedItems.map(selectedItem => {
        if (selectedItem) {
          return {
            id: selectedItem.id,
            name: selectedItem.name
          }
        }
        return []
      })
      this.editedItem.targetAudience = targetAudiences[0]
      this.editedItem.targetAudienceId = targetAudiences[0].id
    },

    saveEditedItem () {
      let saveRequest = Object.assign({}, this.editedItem)
      this.$store.dispatch('saveContentTypeItem', { typeName: 'ArticleCategory', item: saveRequest }).then(
        response => {
          if (response.data.saveArticleCategory) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadArticleCategoriesInfo()
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
      this.$store.dispatch('saveContentTypeItem', { typeName: 'ArticleCategory', item: saveRequest }).then(
        response => {
          if (response.data.saveArticleCategory) {
            this.$root.$emit('infoMessage', 'Created')
            this.loadArticleCategoriesInfo()
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
          this.$store.dispatch('deleteContentTypeItemById', { typeName: 'ArticleCategory', contentTypeItemId: item.id }).then(
            response => {
              if (response.data.deleteArticleCategoryById) {
                this.$root.$emit('infoMessage', `Article category ${item.name} deleted`)
                this.loadArticleCategoriesInfo()
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

    loadArticleCategoriesInfo () {
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
        typeName: 'ArticleCategory',
        pageable,
        searchPattern,
        sortPattern,
        fields: 'id name productGroup { id name } productGroupId targetAudience { id name } targetAudienceId'
      }).then(response => {
        if (response) {
          this.articleCategoriesInfo = response.content
          this.totalItemsCount = response.totalElements
        }
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadArticleCategoriesInfo()
  },

  components: {
    CustomDataTable,
    DataTableDialog,
    ConfirmDialog,
    ProductGroups,
    TargetAudiences
  }
}
</script>
