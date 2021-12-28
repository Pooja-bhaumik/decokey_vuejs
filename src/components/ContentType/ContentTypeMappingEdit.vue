<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="editDialog" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-card-title>
                <span class="headline">{{ $t('message.editContentMapping') }} {{ editedItem.name }} [{{ editedItem.id }}]</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-form ref="form" v-model="valid" >
                    <v-row>
                        <v-col cols="6" sm="6" md="4">
                            <v-select v-model="dataSourceId" item-text="name" item-value="id" :items="contentDataSources"  required label="Content data source"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col cols="6" sm="6" md="4">
                            <v-select v-model="parsedMapping.table" :items="tableNames" required label="Tabel name"></v-select>
                        </v-col>
                        <v-col v-for="field in fields" readonly :key="field.name" cols="12" sm="12" md="12">
                            <v-row>
                                <v-col  cols="3" sm="3" md="3">
                                    <v-text-field cols="12" sm="6" md="6" v-model="field.name" :rules="requiredRules" required :label="'Field name ['+field.type +']'"></v-text-field>
                                </v-col>
                                <v-col  cols="3" sm="3" md="3">
                                    <v-combobox :items="tableColumns" item-text="name" v-model="field.column" :rules="requiredRules" label="Column mapping"></v-combobox>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-combobox  v-model="parsedMapping.where" :items="defaultWhere" @input.native="parsedMapping.where=$event.srcElement.value"  label="Default conditions (WHERE) "></v-combobox>
                        </v-col>
                    </v-row>
                    </v-form>
                </v-container>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click.stop="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click.stop="save">Save</v-btn>
            </v-card-actions>
        </v-card>
        <v-snackbar :value="errorMessages.length > 0" :multi-line="true">
            <span v-for="error in errorMessages" :key="error">{{ error }}</span>
            <v-btn  color="red" text @click="errorMessages = []">Close</v-btn>
        </v-snackbar>
    </v-dialog>
</template>

<script>
export default {
  props: [ 'editDialog', 'editedItem' ],
  data: () => ({
    dataSourceId: null,
    tableNames: [],
    tableColumns: [],
    valid: false,
    requiredRules: [
      v => !!v || ' is required'
    ],
    systemNameRules: [
      v => !!v || ' is required',
      v => /^[a-zA-Z_]+$/.test(v) || ' Only A-B a-b and -_ '
    ],
    errorMessages: [],
    parsedItemData: {},
    mappingItem: {},
    parsedMapping: {},
    fields: [],
    defaultWhere: [' cuitemstatus < 20 ']
  }),
  watch: {
    editedItem: { handler: function (v, o) {
      this.fields = []
      this.parsedItemData = {}
      if (v.data) {
        this.parsedItemData = JSON.parse(v.data)
        for (var key in this.parsedItemData) {
          this.fields.push({ name: key, type: this.parsedItemData[key].replace(/!/g, ''), required: this.parsedItemData[key].includes('!'), column: '' })
        }
      }
      this.loadTypeMapping()
    }
    },
    dataSourceId: {
      handler: function (newContentDataSourceId, o) {
        this.loadTypeMapping()
      }
    },
    'parsedMapping.table': {
      handler: function (newTableName, o) {
        var self = this
        this.tableColumns = []
        if (this.dataSourceId && newTableName) {
          self.$store.dispatch('loadDataSourceTableColumnNames', {
            tableName: newTableName,
            contentDataSourceId: this.dataSourceId
          }).then(function (columns) {
            self.tableColumns = columns
          })
        }
      }
    }
  },
  computed: {
    contentDataSources: function () {
      return this.$store.getters.getContentDataSources
    }
  },
  methods: {
    loadTypeMapping () {
      var self = this
      if (self.dataSourceId && self.editedItem && self.editedItem.id) {
        self.$store.dispatch('getContentDataSourceItemTypeMapping', {
          contentItemTypeId: self.editedItem.id,
          contentDataSourceId: self.dataSourceId
        }).then(function (mapping) {
          self.mappingItem = {}
          self.parsedMapping = {}
          if (mapping && mapping.contentDataSourceId && mapping.contentItemTypeId) {
            self.mappingItem = mapping
            self.parsedMapping = JSON.parse(mapping.data)
            if (self.parsedMapping.columns) {
              self.fields.forEach(function (field) { field.column = '' })
              for (let fieldName in self.parsedMapping.columns) {
                self.fields.forEach(function (field) {
                  if (fieldName && field.name === fieldName) {
                    field.column = self.parsedMapping.columns[fieldName]
                  }
                })
              }
            }
          }
          self.tableNames = []
          self.$store.dispatch('loadDataSourceTableNames', self.dataSourceId).then(tableNames => {
            self.tableNames = tableNames
          })
        })
      }
    },
    close () {
      this.$emit('update:editDialog', false)
    },
    validate () {
      this.$refs.form.validate()
    },
    save () {
      this.validate()
      if (this.valid) {
        let self = this
        this.$nextTick().then(function () {
          let saveRequest = { contentDataSourceId: self.dataSourceId, contentItemTypeId: self.editedItem.id }
          saveRequest.data = { table: self.parsedMapping.table, where: self.parsedMapping.where }
          saveRequest.data.columns = {}
          let c = {}
          self.fields.forEach(function (f) {
            c[f.name] = f.column ? f.column : {}
          })
          saveRequest.data.columns = c
          saveRequest.data = JSON.stringify(saveRequest.data)
          self.$store.dispatch('saveContentDataSourceItemTypeMapping', saveRequest).then(
            response => {
              if (response.data.saveContentDataSourceItemTypeMapping.errors && response.data.saveContentDataSourceItemTypeMapping.errors.length > 0) {
                self.errorMessages = response.data.saveContentDataSourceItemTypeMapping.errors
              } else {
                if (response.data.saveContentDataSourceItemTypeMapping.dataSourceId) {
                  self.$root.$emit('infoMessage', 'Saved')
                  self.$emit('update:editDialog', false)
                }
              }
            },
            failure => {
              self.errorMessages = [failure.message]
              console.log(failure)
            }
          )
        })
      }
    }
  },
  mounted: function () {
    this.$store.dispatch('loadContentDataSources')
  }
}
</script>
