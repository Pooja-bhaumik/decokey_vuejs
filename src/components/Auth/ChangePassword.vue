<template>
  <v-dialog v-model="changePasswordOn" max-width="500px">
    <v-card>
      <v-card-title class="text-center justify-center">
        <span class="headline font-weight-bold">Change Password</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="mainForm" v-model="validMain">
            <v-row>
              <v-col cols="12" sm="12" md="12" lg="12">
                <v-text-field
                  v-model="oldPassword"
                  :rules="requiredRules"
                  label="Old password"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" lg="12">
                <v-text-field
                  v-model="newPassword"
                  :rules="requiredRules"
                  required
                  label="New password"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="changePasswordOn = false">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click.stop="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    changePasswordDialog: Boolean
  },

  data: () => ({
    valid: false,
    validMain: false,
    requiredRules: [(v) => !!v || ' is required'],
    errorMessages: [],
    newPassword: '',
    oldPassword: ''
  }),

  computed: {
    changePasswordOn: {
      get () {
        return this.changePasswordDialog
      },
      set (isOpen) {
        this.$emit('update:changePasswordDialog', isOpen)
      }
    }
  },

  watch: {
    changePasswordOn (isOpen) {
      if (isOpen) {
        this.newPassword = ''
        this.oldPassword = ''
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
        let passwords = {
          newPassword: this.newPassword,
          oldPassword: this.oldPassword
        }
        this.$store.dispatch('changePassword', passwords).then(
          response => {
            if (response) {
              this.$root.$emit('infoMessage', 'Password changed')
              this.changePasswordOn = false
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
