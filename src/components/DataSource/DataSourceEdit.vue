// todo make universal component for edit entities
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="editDialog" persistent max-width="500px">
        <v-card>
            <v-card-title>
                <span class="headline">{{ $t('message.editDataSource') }}</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-form ref="form" v-model="valid" >
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.id" readonly label="ID"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.name" :rules="requiredRules" required label="DS name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.systemName" :rules="systemNameRules" label="Internal name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-select :items="dataSourcerTypes" v-model="editedItem.type" :rules="requiredRules" label="Type" outlined></v-select>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.data.host" :rules="requiredRules" label="Host"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.data.db" :rules="requiredRules" label="DB name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-combobox :items="dbUrlPrefixes" v-model="editedItem.data.dbUrlPrefix" :rules="requiredRules" label="Url prefix"></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-combobox :items="driverClasses" v-model="editedItem.data.driverClass" :rules="requiredRules" label="Driver class"></v-combobox>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field type="number" v-model="editedItem.data.port" :rules="requiredRules" label="Port"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field v-model="editedItem.data.user" :rules="requiredRules" label="User"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field type="password" :rules="requiredRules" v-model="editedItem.data.password" label="Password"></v-text-field>
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
    dataSourcerTypes: ['JDBC'],
    dbUrlPrefixes: ['jdbc:postgresql://'],
    driverClasses: ['org.postgresql.Driver'],
    valid: false,
    requiredRules: [
      v => !!v || ' is required'
    ],
    systemNameRules: [
      v => !!v || ' is required',
      v => /^[a-zA-Z0-9_]+$/.test(v) || ' Only A-B a-b 0-9 and -_ '
    ],
    errorMessages: []
  }),
  methods: {
    close () {
      this.$emit('update:editDialog', false)
    },
    validate () {
      this.$refs.form.validate()
    },
    save () {
      this.validate()
      if (this.valid) {
        let saveRequest = Object.assign({}, this.editedItem)
        saveRequest.jdbcDataSourceData = saveRequest.data
        delete saveRequest['data']
        this.$store.dispatch('saveContentDataSource', saveRequest).then(
          response => {
            if (response.data.saveContentDataSource.errors && response.data.saveContentDataSource.errors.length > 0) {
              this.errorMessages = response.data.saveContentDataSource.errors
            } else {
              if (response.data.saveContentDataSource.id) {
                this.$root.$emit('infoMessage', 'Saved')
                this.$emit('update:editDialog', false)
              }
            }
          },
          failure => {
            this.errorMessages = [failure.message]
            console.log(failure)
          }
        )
      }
    }
  }
}
</script>
