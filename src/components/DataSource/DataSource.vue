// todo make universal component for list entities
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container>
        <h2>{{ $t('message.dataSources') }} <v-icon @click="editItem({data:{}})" v-text="'mdi-file-document-box-plus-outline'"></v-icon> </h2>
        <data-source-edit :edited-item="editedItem" :edit-dialog.sync="editOn"  />
        <div>
            <v-data-table
                    :headers="headers"
                    :items="contentDataSources"
                    :page.sync="page"
                    :items-per-page="itemsPerPage"
                    hide-default-footer
                    class="elevation-1"
                    @page-count="pageCount = $event"
            >
                <template v-slot:item.action="{ item }">
                    <v-icon @click="editItem(item)" v-text="'mdi-file-document-edit-outline'"></v-icon>
                    <v-icon @click="copyItem(item)" v-text="'mdi-file-document-box-multiple-outline'"></v-icon>
                </template>

            </v-data-table>
            <div class="text-center pt-2">
                <v-pagination v-model="page" :length="pageCount"></v-pagination>
                <v-text-field
                        :value="itemsPerPage"
                        label="Items per page"
                        type="number"
                        min="-1"
                        max="15"
                        @input="itemsPerPage = parseInt($event, 10)"
                ></v-text-field>
            </div>
        </div>
    </v-container>
</template>

<script>
import DataSourceEdit from '@/components/DataSource/DataSourceEdit'

export default {
  data: () => ({
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    headers: [
      {
        text: 'ID',
        align: 'left',
        sortable: true,
        value: 'id'
      },
      { text: 'Name', value: 'name' },
      { text: 'Host', value: 'data.host' },
      { text: 'DB name', value: 'data.db' },
      { text: 'Action', value: 'action' }
    ],
    editedItem: {
      data: {}
    },
    editOn: false
  }),
  computed: {
    contentDataSources: function () {
      return this.$store.getters.getContentDataSources
    }
  },
  mounted: function () {
    this.$store.dispatch('loadContentDataSources')
  },
  methods: {
    editItem: function (item) {
      this.editedItem = Object.assign({}, item)
      this.editOn = true
    },
    copyItem: function (item) {
      this.editedItem = Object.assign({}, item)
      this.editedItem.id = null
      this.editOn = true
    }
  },
  components: {
    DataSourceEdit
  }

}
</script>
