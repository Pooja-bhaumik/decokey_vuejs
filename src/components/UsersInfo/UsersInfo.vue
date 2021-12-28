<template>
  <v-container>
    <selection-dialog
        title="Projects" model="Project"
        :items.sync="createProjects"
        :visible.sync="createUserProjectsVisible" :checked="createProjects" />
    <Dialog
        title="Create new user"
        save-label="Create"
        :visible.sync="createOn"
        @save="createItem"
    >
      <v-form ref="createUserForm" v-model="createUserValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
                :rules="requiredRules"
                label="Username"
                v-model="createdItem['username']"
                @change="$refs.createUserForm.validate()"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
                :rules="requiredRules"
                label="Password"
                v-model="createdItem['password']"
                @change="$refs.createUserForm.validate()"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
                :items="roles"
                label="Authority"
                item-text="name"
                item-value="authorities"
                :rules="requiredRules"
                v-model="createdItem['authorities']"
                @change="$refs.createUserForm.validate()"
                outlined/>
          </v-col>
          <v-col cols="12" md="6">
            <selection-text-field
                title="Projects"
                :items="createProjects"
                :required-rules="requiredRules"
                @change="$refs.createUserForm.validate()"
                @selectionDialogVisible="createUserProjectsVisible = true" />
          </v-col>
        </v-row>
      </v-form>
    </Dialog>

    <selection-dialog
        title="Projects" model="Project"
        :items.sync="editProjects"
        :visible.sync="editUserProjectsVisible" :checked="editProjects" />
    <Dialog
        title="User info edit"
        save-label="Save"
        :visible.sync="editOn"
        @save="saveEditedItem"
    >
      <v-form ref="editUserForm" v-model="editUserValid">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
                :rules="requiredRules"
                label="Username"
                v-model="editedItem['username']"
                @change="$refs.editUserForm.validate()"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
                :rules="requiredRules"
                label="Password"
                v-model="editedItem['password']"
                @change="$refs.editUserForm.validate()"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
                :items="roles"
                label="Authority"
                item-text="name"
                item-value="authorities"
                :rules="requiredRules"
                v-model="editedItem['authorities']"
                @change="$refs.editUserForm.validate()"
                outlined/>
          </v-col>
          <v-col cols="12" md="6">
            <selection-text-field
                title="Projects"
                :items="editProjects"
                :required-rules="requiredRules"
                @change="$refs.editUserForm.validate()"
                @selectionDialogVisible="editUserProjectsVisible = true" />
          </v-col>
        </v-row>
      </v-form>
    </Dialog>
    <v-row>
      <v-col lg="10" md="10" sm="6">
        <h2>Users info</h2>
      </v-col>
      <v-col lg="2" md="2" sm="6" align-self="center">
        <v-btn color="primary" block @click="createOn = true">create user</v-btn>
      </v-col>
    </v-row>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-row>
      <v-col lg="12" sm="12">
        <custom-data-table
          :loading="loading"
          :headers="headers"
          :items="usersInfo"
          :search="search"
          :page.sync="page"
          :options.sync="options"
          :totalItemsCount="totalItemsCount"
          :itemPerPage="itemsPerPage"
          :loadInfo="loadUsersInfo"
          :editItem="editItem"
          :deleteItem="deleteItem"
        >
        </custom-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ConfirmDialog from '@/components/ConfirmDialog'
import CustomDataTable from '@/components/TableParts/CustomDataTable'
import Role from '../../store/roles'
import Dialog from '@/components/Dialogs/Dialog'
import SelectionDialog from '@/components/Selection/SelectionDialog'
import SelectionTextField from '@/components/Selection/SelectionTextField'

export default {
  data: () => ({
    loading: false,
    options: {},
    itemsPerPage: 10,
    page: 1,
    search: {
      id: '',
      username: ''
    },
    totalItemsCount: 0,
    headers: [
      { text: 'ID', value: 'id', searchValue: 'id', width: '100px' },
      { text: 'Username', value: 'username', searchValue: 'username' },
      { text: 'Authority', value: 'authorities[0].authority', sortable: false },
      { text: 'Actions', value: 'action', align: 'center', sortable: false }
    ],

    editUserValid: false,
    editUserProjectsVisible: false,
    editProjects: [],
    editedItem: {},
    editOn: false,

    requiredRules: [
      v => !!v || ' is required'
    ],
    createUserValid: false,
    createUserProjectsVisible: false,
    createProjects: [],
    createdItem: {},
    createOn: false,
    roles: [{
      name: 'ROLE_ROOT',
      authorities: [
        {
          id: 1,
          authority: 'ROLE_ROOT'
        }
      ]
    }, {
      name: 'ROLE_SUPPLIER',
      authorities: [
        {
          id: 2,
          authority: 'ROLE_SUPPLIER'
        }
      ]
    }, {
      name: 'ROLE_CONTENT_MANAGER',
      authorities: [
        {
          id: 3,
          authority: 'ROLE_CONTENT_MANAGER'
        }
      ]
    }]
  }),

  watch: {
    options: {
      handler () {
        this.loadUsersInfo()
      }
    }
  },

  computed: {
    usersInfo () {
      return this.$store.getters.getUsersInfo ? this.$store.getters.getUsersInfo : []
    },

    isUserRoot () {
      return this.$store.getters.userHasRoles(Role.Root)
    }
  },

  methods: {
    editItem (item) {
      this.editedItem = item
      this.editProjects = JSON.parse(JSON.stringify(item.projects))
      this.editOn = true
    },

    saveEditedItem () {
      if (!this.editUserValid) {
        this.editOn = true
        return
      }
      let saveRequest = Object.assign({}, this.editedItem)
      saveRequest.projects = Object.assign([], this.editProjects)
      saveRequest.enabled = true
      this.$store.dispatch('saveUser', saveRequest).then(
        response => {
          if (response.data.saveAppUser) {
            this.$root.$emit('infoMessage', 'Saved')
            this.loadUsersInfo()
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
      if (!this.createUserValid) {
        this.createOn = true
        return
      }
      let saveRequest = Object.assign({}, this.createdItem)
      saveRequest.projects = Object.assign([], this.createProjects)
      saveRequest.enabled = true
      this.$store.dispatch('saveUser', saveRequest).then(
        response => {
          if (response.data.saveAppUser) {
            this.$root.$emit('infoMessage', 'Created')
            this.loadUsersInfo()
            this.createOn = false
          }
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
        }
      )
    },

    deleteItem (appUser) {
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this user?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteUser', appUser.id).then(
            response => {
              if (response.data.deleteAppUserById) {
                this.$root.$emit('infoMessage', `User ${appUser.username} deleted`)
                this.loadUsersInfo()
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

    handleUserWasSaved () {
      this.loadUsersInfo()
      this.createOn = false
      this.editOn = false
    },

    loadUsersInfo () {
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
      searchPattern.enabled = true

      this.$store.dispatch('loadUsersList', { pageable: pageable, searchPattern: searchPattern, sortPattern: sortPattern }).then((data) => {
        this.totalItemsCount = data.totalElements
        this.loading = false
      })
    }
  },

  mounted () {
    this.loadUsersInfo()
  },

  components: {
    SelectionTextField,
    SelectionDialog,
    Dialog,
    ConfirmDialog,
    CustomDataTable
  }
}
</script>

<style>
   @media (max-width: 599px) {
     .search-inputs-wrapper {
       display: flex;
       flex-direction: column;
     }
   }
</style>
