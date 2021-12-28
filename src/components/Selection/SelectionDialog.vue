<template>
  <v-dialog v-model="visible" persistent max-width="800px">
    <v-card>
      <v-card-title class="text-center">
        <span class="headline font-weight-bold">{{ title }}</span>
      </v-card-title>
      <v-card-text>
        <common-data-table :headers="headers" :metadata="metadata">
          <template #action_check="{item, on}" >
            <v-checkbox v-bind:input-value="(items && items.filter(i => i.id === item.id).length)" @change="changeItem(item)" color="primary" class="mx-2" v-on="on"></v-checkbox>
          </template>
        </common-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="$emit('update:visible', false)">Cancel</v-btn>
        <v-btn color="blue darken-1" text @click.stop="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CommonDataTable from '@/components/TableParts/CommonDataTable'

export default {
  name: 'SelectionDialog',
  props: {
    title: String,
    model: String,
    checked: Array,
    visible: Boolean
  },
  components: {
    CommonDataTable
  },
  data: function () {
    return {
      headers: [{ label: 'Id', path: 'id' },
        { label: 'Name', path: 'name' }
      ],
      metadata: {
        className: this.model,
        actions: [
          { name: 'check' }
        ]
      },
      items: JSON.parse(JSON.stringify(this.checked))
    }
  },
  watch: {
    visible (isOpen) {
      if (isOpen) {
        this.items = JSON.parse(JSON.stringify(this.checked))
      }
    }
  },
  methods: {
    changeItem (item) {
      if (this.items.filter(i => i.id === item.id).length) {
        this.items = this.items.filter(i => i.id !== item.id)
      } else {
        this.items.push(item)
      }
    },
    save () {
      this.$emit('update:visible', false)
      this.$emit('update:items', this.items)
    }
  }
}
</script>
