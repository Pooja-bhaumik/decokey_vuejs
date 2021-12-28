<template>
  <v-dialog v-model="visible" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-center justify-center">
        <span class="headline font-weight-bold">{{ title }}</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <slot />
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('update:visible', false)">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click.stop="save">{{ saveLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    title: String,
    visible: Boolean,
    saveLabel: {
      type: String,
      required: false,
      default: 'Save'
    }
  },
  methods: {
    save () {
      this.$emit('update:visible', false)
      this.$emit('save')
    }
  }
}
</script>

<style scoped>

</style>
