<template>
  <div>
    <slot name="popups" v-bind:editedItem="editedItem"></slot>
    <v-dialog v-model="dialogOn" max-width="500px" persistent>
      <v-card v-if="editedItem">
        <v-card-title class="text-center justify-center">
          <span class="headline font-weight-bold">{{ dialogTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
              <v-form ref="mainForm" v-model="validMain">
                <v-row>
                  <v-col
                    cols="12"
                    sm="12"
                    :md="field.cols || 6"
                    :lg="field.cols || 6"
                    v-for="field in dialogFields"
                    :key="field.model"
                  >
                    <v-select
                      v-if="field.type === 'select'"
                      :items="field.items"
                      :item-text="field.itemText || 'text'"
                      :item-value="field.itemValue || 'value'"
                      :label="field.label"
                      :rules="field.required ? requiredRules : []"
                      v-model="editedItem[field.model]"
                      outlined
                    ></v-select>
                    <v-text-field
                      v-else
                      :rules="field.required ? requiredRules : []"
                      :label="field.label"
                      :readonly="field.readonly"
                      v-model="editedItem[field.model]"
                    ></v-text-field>
                  </v-col>
                  <slot name="text-field" v-bind:editedItem="editedItem"></slot>
                </v-row>
              </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogOn = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click.stop="save">{{ createdDialogMode ? 'Create' : 'Save'}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog: Boolean,
    dialogTitle: String,
    editedItem: Object,
    dialogFields: Array,
    createdDialogMode: Boolean
  },

  data: () => ({
    valid: false,
    validMain: false,
    requiredRules: [
      v => !!v || ' is required'
    ]
  }),

  computed: {
    dialogOn: {
      get () {
        return this.dialog
      },

      set (isOpen) {
        this.$emit('update:dialog', isOpen)
      }
    }
  },

  methods: {
    validate () {
      this.$refs.mainForm.validate()
      this.valid = this.validMain
    },

    save () {
      this.validate()
      if (this.valid) {
        this.$emit('saveChanges')
      }
    }
  }
}
</script>

<style></style>
