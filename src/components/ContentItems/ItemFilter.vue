<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container>
        <v-autocomplete v-if="typeId && !preFilledList"
                :value="value"
                :items="items"
                :search-input.sync="searchInput"
                item-text="name"
                item-value="id"
                :label="composedTitle"
                persistent-hint
                @input="handleInput"
                clearable
        >
        </v-autocomplete>
        <v-autocomplete v-if="preFilledList && preFilledItems.length !== 0"
                        :value="value"
                        :items="preFilledItems"
                        :search-input.sync="searchInput"
                        item-text="name"
                        item-value="id"
                        :label="composedTitle"
                        persistent-hint
                        @input="handleInput"
                        clearable
                        :disabled="disabled"
        >
        </v-autocomplete>
        <datetime-picker-custom v-if="typeName == 'dateTime'" dateFormat="YYYY-MM-DD"  :value="value" @input="handleInput" :label="label"></datetime-picker-custom>
    </v-container>
</template>

<script>
import DatetimePickerCustom from '@/components/DatetimePickerCustom'

export default {
  props: ['typeId', 'typeName', 'label', 'value', 'autoCompleteLabel', 'preFilledItems', 'disabled'],
  data: () => ({
    items: [],
    searchInput: ''
  }),
  computed: {
    composedTitle: function () {
      let title = 'Select'
      if (this.autoCompleteLabel === undefined) {
        return title
      }

      return title + ' ' + this.autoCompleteLabel
    },
    preFilledList: function () {
      // eslint-disable-next-line eqeqeq
      return this.typeName == 'prefilledList'
    }
  },
  mounted () {
    if (this.items.length === 0 && !this.preFilledList && this.typeId) {
      this.$store.dispatch('getAllContentItemsPromise', this.typeId).then(value => {
        this.items = (value.data.getAllContentItems.sort((a, b) => (a.name > b.name) ? 1 : -1))
      })
    }
  },
  watch: {
    typeId: {
      handler: (idValue, oldIdValue) => {
        if (idValue && !this.preFilledList) {
          this.$store.dispatch('getAllContentItemsPromise', idValue).then(value => {
            this.items = (value.data.getAllContentItems.sort((a, b) => (a.name > b.name) ? 1 : -1))
          })
        }
      }
    }
  },
  methods: {
    handleInput (e) {
      this.$emit('input', e)
    }
  },
  components: {
    DatetimePickerCustom
  }
}

</script>
