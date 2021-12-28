<template>
  <div>
    <v-data-table
      :loading="loading"
      :headers="headers"
      :sort-by="sortBy ? sortBy : []"
      :sort-desc="sortDesc ? sortDesc : []"
      :items="items"
      :opions.sync="options"
      :page.sync="tablePage"
      :options.sync="tableOptions"
      :server-items-length="totalItemsCount"
      :items-per-page="itemsPerPage"
      :footer-props="{
      'items-per-page-options': [5, 10, 20, 30, 40, 50]
      }"
    >
      <template v-slot:header>
        <tr class="search-inputs-wrapper">
          <th v-for="header in headers" :key="header.value">
            <v-text-field
              v-if="header.searchValue"
              :label="header.text"
              append-icon="mdi-magnify"
              @click:append="() => loadInfo()"
              class="md-4"
              v-model="search[header.value]"
              @keyup.enter.native="loadInfo"
            ></v-text-field>
          </th>
        </tr>
      </template>

      <!-- eslint-disable -->
      <template v-for="(header, idx) in headers" v-slot:[dynamicItemSlots[idx]]="{ item }">
        <slot :name="header.value" :item="item" :isUserRoot="isUserRoot">
          {{ item[header.value] }}
        </slot>
      </template>
      <!-- eslint-enable -->

      <template v-slot:item.action="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on }" v-if="!withoutStandartActions">
            <v-icon @click="editItem(item)" v-text="'mdi-pencil'" v-on="on"></v-icon>
          </template>
          <span>Edit</span>
        </v-tooltip>
        <slot name="actions" v-bind:isUserRoot="isUserRoot" v-bind:item="item"></slot>
        <v-tooltip top>
          <template v-slot:activator="{ on }" v-if="!withoutStandartActions">
            <v-icon v-if="isUserRoot" @click="deleteItem(item)" v-text="'mdi-delete'" v-on="on" class="ml-3"></v-icon>
          </template>
          <span>Delete</span>
        </v-tooltip>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import Role from '../../store/roles'

export default {
  props: {
    withoutStandartActions: Boolean,
    headers: Array,
    items: Array,
    options: Object,
    search: Object,
    totalItemsCount: Number,
    itemsPerPage: Number,
    page: Number,
    loading: Boolean,

    loadInfo: Function,
    editItem: Function,
    deleteItem: Function
  },

  computed: {
    dynamicItemSlots () {
      return this.headers.map(header => `item.${header.value}`)
    },

    testedSlot () {
      return ['item.productGroups', 'item.name']
    },

    isUserRoot () {
      return this.$store.getters.userHasRoles(Role.Root)
    },

    tableOptions: {
      get () {
        return this.options
      },
      set (newOptions) {
        this.$emit('update:options', newOptions)
      }
    },

    tablePage: {
      get () {
        return this.page
      },
      set (newPage) {
        this.$emit('update:page', newPage)
      }
    },

    sortBy () {
      return this.headers.filter(header => {
        if (header.sortBy) {
          return true
        }
      }).map(header => header.value)
    },

    sortDesc () {
      return this.headers.filter(header => {
        if (header.sortDesc) {
          return true
        }
      }).map(header => header.value)
    }
  }
}
</script>
