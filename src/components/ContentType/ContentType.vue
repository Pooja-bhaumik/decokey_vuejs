// todo make universal component for list entities
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <h2>{{ $t('message.contentTypes') }} <v-icon @click="editItem({})" v-text="'mdi-file-document-box-plus-outline'"></v-icon> </h2>
    <content-type-edit :edited-item="editedItem" :edit-dialog.sync="editOn"  />
    <content-type-mapping-edit :edited-item="editedMappingItem" :edit-dialog.sync="editMapping"  />
    <div>
      <v-data-table
              :headers="headers"
              :items="contentItemTypes"
              :page.sync="page"
              :items-per-page="itemsPerPage"
              hide-default-footer
              class="elevation-1"
              @page-count="pageCount = $event"
      >
        <template v-slot:item.action="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon @click="editItem(item)" v-text="'mdi-file-document-edit-outline'" v-on="on"></v-icon>
            </template>
            <span>{{ $t('buttons.edit') }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon @click="copyItem(item)" v-text="'mdi-file-document-box-multiple-outline'" v-on="on"></v-icon>
            </template>
            <span>{{ $t('buttons.copy') }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-icon @click="editMappings(item)" v-text="'mdi-file-cabinet'" v-on="on"></v-icon>
            </template>
            <span>{{ $t('buttons.configureMap') }}</span>
          </v-tooltip>
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
import ContentTypeEdit from '@/components/ContentType/ContentTypeEdit'
import ContentTypeMappingEdit from '@/components/ContentType/ContentTypeMappingEdit'

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
    editedItem: {},
    editOn: false,
    editedMappingItem: {},
    editMapping: false
  }),
  computed: {
    contentItemTypes: function () {
      return this.$store.getters.getContentItemTypes
    }
  },
  mounted: function () {
    this.$store.dispatch('loadContentItemTypes')
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
    },
    editMappings: function (item) {
      this.editedMappingItem = Object.assign({}, item)
      this.editMapping = true
    }
  },
  components: {
    ContentTypeEdit,
    ContentTypeMappingEdit
  }

}
</script>
