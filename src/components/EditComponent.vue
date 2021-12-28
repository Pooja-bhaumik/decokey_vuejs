<!-- TO use this component, you should follow next algorithm:
  1. Import and add component to your template with slots
  2. Setup data, needed for this component
  3. Make it visible -->
<!-- TODO rename to navigation -->
<template>
  <v-card flat>
    <v-card-title class="mb-3">
      <span class="headline font-weight-bold">{{ $t(dialogTitle) }}</span>
    </v-card-title>
    <v-card-subtitle class="pb-0">
      <v-row dense class="mb-3">
        <slot name="header"></slot>
      </v-row>
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-tabs
              :show-arrows="true"
              v-model="currentTabItem">
            <v-tab v-for="(section, position) in sections" :key="position" :href="`#tabitem-${position}`" :disabled="!visible">
              <v-badge color="red lighten-1" overlap class="validationBadge" :value="!section.valid">
                <span slot="badge">*</span>
                <span slot="default">{{ section.title }}</span>
              </v-badge>
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
    </v-card-subtitle>

    <v-card-text>
      <v-tabs-items v-model="currentTabItem">
        <v-tab-item v-for="(section, position) in sections" :key="position" :value="'tabitem-' + position" :eager="true">
          <slot :name="'' + position">
          </slot>
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>

    <v-card-actions class="px-6">
      <v-container class="px-0">
        <v-row v-if="sections.length !== 1">
          <v-col cols="6">
            <span class="body-1 adBanner-tabs__arrow-text" @click="currentTabItem = 'tabitem-' + (+currentTab - 1)">
              {{ sections[+currentTab - 1] ? `&#60; Back to ${sections[+currentTab - 1].title}` : ''}}
            </span>
          </v-col>
          <v-col cols="6" class="text-right">
            <span class="body-1 adBanner-tabs__arrow-text" @click="currentTabItem = 'tabitem-' +(+currentTab + 1)">
              Forward to {{ sections[+currentTab + 1] ? sections[+currentTab + 1].title : sections[0].title }} &#62;
            </span>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col md="2" sm="3" cols="6">
            <v-btn color="primary" block @click.stop="save" :disabled="!saveEnabled">{{ $t('buttons.save') }}</v-btn>
          </v-col>
          <v-col md="2" sm="3" cols="6">
            <v-btn color="primary" outlined block @click="$emit('close')">{{ $t('buttons.cancel') }}</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    sections: {
      type: Array,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    saveDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data: () => ({
    currentTabItem: 'tabitem-0',
    saveEnabled: true
  }),
  computed: {
    currentTab () {
      if (this.currentTabItem) {
        return this.currentTabItem.substring('tabitem-'.length, this.currentTabItem.length)
      }
      return null
    }
  },
  watch: {
    visible: {
      handler: function (newValue, oldValue) {
        if (!newValue) {
          this.saveEnabled = false
          return
        }
        this.currentTabItem = 'tabitem-0'
        this.saveEnabled = !this.saveDisabled
      }
    },
    saveDisabled: {
      handler: function () {
        if (!this.visible) {
          return
        }
        this.saveEnabled = !this.saveDisabled
      }
    }
  },
  methods: {
    save () {
      let self = this
      if (self.saveEnabled) {
        self.saveEnabled = false
        this.$emit('save', this.saveFailed)
      }
    },
    saveFailed () {
      this.saveEnabled = true
    }
  }
}
</script>
