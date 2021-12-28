<template>
  <v-text-field v-model="commaSeparatedItems" readonly :label="title" append-outer-icon="mdi-file-document-edit-outline"
                @click:append-outer="$emit('selectionDialogVisible')" :rules="requiredRules" :required="requiredRules.length"
                @change="$emit('change', $event)"></v-text-field>
</template>

<script>
export default {
  name: 'SelectionTextField',
  props: {
    title: String,
    items: Array,
    requiredRules: Array
  },
  computed: {
    commaSeparatedItems () {
      let res = ''
      for (let i = 0; i < this.items.length - 1; i++) {
        res += this.items[i].name + ', '
      }
      if (this.items.length) {
        res += this.items[this.items.length - 1].name
      }
      return res
    }
  }
}
</script>
