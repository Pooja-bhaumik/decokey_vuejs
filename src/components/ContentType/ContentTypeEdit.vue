// todo make universal component for edit entities
<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-dialog v-model="editDialog" persistent fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-card-title>
                <span class="headline">{{ $t('message.editContentType') }}</span>
            </v-card-title>

            <v-card-text>
                <v-container>
                    <v-form ref="form" v-model="valid" >
                    <v-row>
                        <v-col cols="6" sm="6" md="4">
                            <v-text-field color="pink" v-model="editedItem.id" readonly label="ID"></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="4">
                            <v-text-field color="pink" v-model="editedItem.name" :rules="requiredRules" required label="Name"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-divider></v-divider>
                        </v-col>
                        <v-col v-for="(field, index) in fields" :key="index" cols="12" sm="12" md="12">
                            <v-row>
                                <v-col  cols="3" sm="3" md="3">
                                    <v-text-field cols="12" sm="6" md="6" v-model="field.name" :rules="requiredRules" required label="Field name"></v-text-field>
                                </v-col>
                                <v-col  cols="3" sm="3" md="3">
                                    <v-select v-model="field.type" :items="graphqlTypes" required label="Field type"></v-select>
                                </v-col>
                                <v-col  cols="3" sm="3" md="3">
                                    <v-checkbox v-model="field.required" label="Required"></v-checkbox>
                                </v-col>
                                <v-col  cols="3" sm="3" md="3">
                                    <v-icon v-text="'mdi-trash-can'" @click="fields = fields.filter(f => f.name != field.name)"></v-icon>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="12" md="12">
                            <v-icon v-text="'mdi-file-document-box-plus-outline'" @click="fields.push({name:'', type:'String', required: false})"></v-icon>
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
    graphqlTypes: ['String', 'Int', 'Float', 'Boolean', 'ID'],
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
    fields: []
  }),
  watch: {
    editedItem: { handler: function (v, o) {
      this.fields = []
      this.parsedItemData = {}
      if (v.data) {
        this.parsedItemData = JSON.parse(v.data)
        for (var key in this.parsedItemData) {
          this.fields.push({ name: key, type: this.parsedItemData[key].replace(/!/g, ''), required: this.parsedItemData[key].includes('!') })
        }
      }
    }
    }
  },
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
        saveRequest.data = this.fields.reduce(function (o, val) {
          o[val.name] = val.type + (val.required ? '!' : '')
          return o
        }, {})
        saveRequest.data = JSON.stringify(saveRequest.data)
        this.$store.dispatch('saveContentItemType', saveRequest).then(
          response => {
            if (response.data.saveContentItemType.errors && response.data.saveContentItemType.errors.length > 0) {
              this.errorMessages = response.data.saveContentItemType.errors
            } else {
              if (response.data.saveContentItemType.id) {
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
