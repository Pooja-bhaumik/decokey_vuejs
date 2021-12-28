<template>
  <v-container>
    <h2>{{ $t('message.project') }} </h2>
    <v-icon @click="editItem(null)" v-text="'mdi-text-box-plus-outline'"></v-icon>
    <common-data-table :headers="headers" :metadata="metadata"
                       ref="projects" @edit="editItem($event)">

      <template #action_del="{item, on}" >
        <v-icon @click="deleteItem(item)" v-text="'mdi-delete'" v-on="on" class="ml-3"></v-icon>
      </template>
    </common-data-table>

    <ProjectEdit :visible="editOn" :project-id="editedItemId" @close="editOn = false" @projectWasSaved="loadProjects" />

    <confirm-dialog ref="confirmDialog"></confirm-dialog>
  </v-container>
</template>

<script>
import CommonDataTable from '@/components/TableParts/CommonDataTable'
import ProjectEdit from '@/components/Project/ProjectEdit'
import ConfirmDialog from '@/components/ConfirmDialog'

export default {
  name: 'SelectProject',
  components: {
    ProjectEdit,
    CommonDataTable,
    ConfirmDialog
  },
  data: () => ({
    headers: [{ label: 'Id', path: 'id' },
      { label: 'Name', path: 'name' }
    ],
    metadata: {
      className: 'Project',
      actions: [
        { name: 'edit' },
        { name: 'del', label: 'Delete' }
      ]
    },
    editedItemId: undefined,
    editOn: false
  }),
  watch: {
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
    loadProjects () {
      this.$refs.projects.load()
      this.$store.dispatch('getProjectsAll')
    },
    deleteItem (item) {
      let self = this
      this.$refs.confirmDialog.open('Delete', 'Are you sure you want to delete this item?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deleteById', { className: 'Project', id: item.id }).then(
            success => {
              if (success.data.deleteProjectById) {
                self.$root.$emit('infoMessage', `Item successfully deleted`)
                self.$refs.projects.load()
              } else {
                self.forceDeleteItem(item)
              }
            },
            failure => {
              console.log(failure)
            }
          )
        }
      })
    },
    forceDeleteItem (item) {
      let self = this
      this.$refs.confirmDialog.open('Delete', 'There are users associated with this project. Do you still want to continue ?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('forceDeleteById', { className: 'Project', id: item.id }).then(
            _ => {
              self.$root.$emit('infoMessage', `Item successfully deleted`)
              self.$refs.projects.load()
            },
            failure => {
              console.log(failure)
            }
          )
        }
      })
    }
  }
}
</script>
