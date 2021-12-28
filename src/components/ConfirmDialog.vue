<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{title}}{{ $t(titleLocalizable) }}</v-card-title>
        <v-card-text v-show="!!message || !!messageLocalizable">{{ message }} {{$t(messageLocalizable)}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="cancel">Cancel</v-btn>
          <v-btn color="primary" text @click="agree">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    message: null,
    title: null,
    titleLocalizable: null,
    messageLocalizable: null
  }),
  methods: {
    open (title, message) {
      this.dialog = true
      this.title = title
      this.message = message
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    openLocalizable (titleLocalizable, messageLocalizable) {
      this.dialog = true
      this.titleLocalizable = titleLocalizable
      this.messageLocalizable = messageLocalizable
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree () {
      this.resolve(true)
      this.dialog = false
    },
    cancel () {
      this.resolve(false)
      this.dialog = false
    }
  }
}
</script>
