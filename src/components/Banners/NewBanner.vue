<template>
  <v-container>
      <v-card
      max-width="1200"
      class="mx-auto"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline">{{ $t('message.selectContentType') }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
          <v-radio-group row justify="space-around" v-model="contentTypeGroup">
            <v-radio
              v-for="type in contentTypes"
              :key="type.id"
              :label="type.name"
              :value="type.id"
              @change="selectContentType(type.id)"
            ></v-radio>
          </v-radio-group>
      </v-card-text>
    </v-card>

    <v-card
      max-width="1200"
      class="mx-auto"
      v-if="contentTypeFields"
    >
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="headline" v-text="selectedContentTypeName + '  content'"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-card-text>
        <v-list-item
          v-for="(field, i) in contentTypeFields"
          :key="i"
        >
          <v-list-item-content>
            <v-list-item-title v-text="field.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    contentTypeGroup: null,
    selectedContentTypeName: null
  }),
  computed: {
    contentTypes () {
      return this.$store.getters.getContentTypes
    },
    contentTypeFields () {
      return this.$store.getters.getContentTypeFields
    }
  },
  methods: {
    selectContentType (id) {
      this.selectedContentTypeName = this.contentTypes.find(i => i.id === id).name

      this.$store.dispatch('loadContentTypeFields', id)
    }
  }
}
</script>
