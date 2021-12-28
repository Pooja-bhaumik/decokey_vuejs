<template>
  <v-data-table
      :headers="headers"
      :hide-default-header="true"
      :items="mappedItems"
      :options.sync="options"
      :server-items-length="total"
      :footer-props="{ 'items-per-page-options': [5, 10, 20, 30, 40, 50] }"
      class="elevation-1">
    <template v-slot:top>
      <v-col lg="2" md="2" sm="6" offset-md="0" offset-sm="3" class="mb-md-0 mb-sm-4" align-self="center">
        <v-btn color="primary" block @click="filter">{{ $t('buttons.search') }}</v-btn>
      </v-col>
    </template>
    <template v-slot:body.prepend>
      <tr>
        <th v-for="header in headers" :key="header.text">
          <v-text-field v-if="header.value !== 'on'"
              :label="header.text"
              append-icon="mdi-magnify"
              class="md-4"
              v-model="search[header.value]"
              @keyup.enter.native="filter">
          </v-text-field>
        </th>
      </tr>
    </template>
    <template #item.on="{item}">
      <v-switch
          v-model="item.on"
          class="mt-0"
          color="primary"
          inset
          hide-details
          @change="rowChange(item)"></v-switch>
    </template>
  </v-data-table>
</template>

<script>
export default {
  props: {
    load: {
      type: Function,
      required: true
    },
    responseMapper: {
      type: Function,
      required: true
    },
    nameMapper: {
      type: Function,
      default: function (item) {
        return item.name
      }
    },
    itemsOn: {
      type: Array,
      required: false,
      default: function () {
        return []
      }
    }
  },
  data: () => ({
    headers: [{
      text: 'ID',
      value: 'id'
    }, {
      text: 'Name', value: 'name'
    }, {
      text: 'On', value: 'on'
    }],
    search: {},
    options: {},
    items: [],
    total: 0
  }),
  watch: {
    options: {
      handler () {
        this.filter()
      },
      deep: true
    }
  },
  computed: {
    mappedItems () {
      if (this.items === undefined) {
        return []
      }
      return this.items.map(item => {
        return { id: item.id, name: this.nameMapper(item), on: this.itemsOn.some(itemToCheck => item.id === itemToCheck.id) }
      })
    }
  },
  methods: {
    filter () {
      let self = this
      self.load({
        search: self.search,
        limit: self.options.itemsPerPage,
        offset: (self.options.page - 1) * self.options.itemsPerPage
      }).then(response => {
        let data = this.responseMapper(response)
        self.items = data.content
        self.total = data.totalElements
      })
    },
    rowChange (item) {
      this.$emit('changed', item)
    }
  }
}
</script>
