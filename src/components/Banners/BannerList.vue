<template>
  <v-container>
    <h2>{{ $t('message.adBanner') }} </h2>
    <v-icon @click="editItem(null)" v-text="'mdi-text-box-plus-outline'"></v-icon>
    <ad-banner-edit :id="editedItemId" :edit-dialog.sync="editOn" @bannerWasSaved="handleBannerWasSaved" ></ad-banner-edit>
    <common-data-table :headers="headers" :metadata="metadata" :additional-search-pattern="additionalSearchPattern"
                       ref="banners" @edit="editItem($event)" @preview="previewRenderSnapshot($event)">
      <template #filter="{header, search, load}" >
        <item-filter v-if="header.typeId" v-model="search[header.idPath]" @input="load" :type-id="header.typeId" :type-name="null" :label="header.label" ></item-filter>
        <vue2-datepicker v-else-if="header.path === 'data.startAt'" :dateTime.sync="startAt" :showTimePanelToggle="true"></vue2-datepicker>
        <vue2-datepicker v-else-if="header.path === 'data.endAt'" :dateTime.sync="endAt" :showTimePanelToggle="true"></vue2-datepicker>
      </template>
      <template #action_check="{item, on}" >
        <v-switch v-on="on" v-model="item.data.activated"
                  class="mt-0"
                  color="primary"
                  inset
                  hide-details
                  @change="showDeactivationDialog(item)"
        ></v-switch>
      </template>
      <template #action_clone="{item, on}" >
        <v-icon v-on="on"
                v-text="'mdi-content-duplicate'"
                  class="mt-0"
                  inset
                  hide-details
                  @click="cloneBanner(item)"
        ></v-icon>
      </template>
    </common-data-table>
    <confirm-dialog ref="dialog"></confirm-dialog>
    <v-dialog v-model="previewTemplateOn" max-width="1100" scrollable>
      <v-card>
        <v-card-title class="headline">Preview</v-card-title>
        <v-card-text v-html="previewTemplateHtml"></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="previewTemplateOn = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CommonDataTable from '@/components/TableParts/CommonDataTable'
import ItemFilter from '@/components/ContentItems/ItemFilter'
import ItemType from '../../store/itemType'
import ConfirmDialog from '@/components/ConfirmDialog'
import Vue2Datepicker from '@/components/BrandStatistic/Vue2Datepicker'
import AdBannerEdit from '@/components/Banners/AdBannerEdit'

export default {
  name: 'BannerList',
  components: {
    CommonDataTable,
    ItemFilter,
    ConfirmDialog,
    Vue2Datepicker,
    AdBannerEdit
  },
  data: () => ({
    headers: [ { label: 'Id', path: 'id' },
      { label: 'Brand', path: 'brands.name', freeText: false, idPath: 'brands.id', typeId: ItemType.Brand, sortable: false },
      { label: 'Target audience', path: 'targetAudience.name', freeText: false, idPath: 'targetAudience.id', typeId: ItemType.Target_Audience },
      { label: 'Product group', path: 'productGroup.name', freeText: false, idPath: 'productGroup.id', typeId: ItemType.Product_Group },
      { label: 'Article category', path: 'articleCategory.name', freeText: false, idPath: 'articleCategory.id', typeId: ItemType.Article_Category },
      { label: 'Title', path: 'data.title' },
      { label: 'Start date', path: 'data.startAt', freeText: false, ordinary: false },
      { label: 'End date', path: 'data.endAt', freeText: false, ordinary: false }
    ],
    metadata: { className: 'AdBannerItem',
      actions: [
        { name: 'edit' },
        { name: 'preview', visible: (item) => item.data && (item.data.imageUrls.length || (item.data.overviewImageUrls && item.data.overviewImageUrls.length)) },
        { name: 'check', label: 'Unpublish', visible: (item) => item.data && item.data.activated },
        { name: 'clone', label: 'Clone' }
      ],
      payload: { data: { activated: null, imageUrls: null, overviewImageUrls: null, defaultTemplate: null } }
    },
    startAt: [null, null],
    endAt: [null, null],
    editedItemId: undefined,
    editOn: false,
    previewTemplateHtml: null,
    previewTemplateOn: false
  }),
  computed: {
    additionalSearchPattern () {
      let additional = {}

      if (this.startAt[0] && this.startAt[1]) {
        additional.startAtFrom = this.formatDateString(this.startAt[0])
        additional.startAtTo = this.formatDateString(this.startAt[1])
      }

      if (this.endAt[0] && this.endAt[1]) {
        additional.endAtFrom = this.formatDateString(this.endAt[0])
        additional.endAtTo = this.formatDateString(this.endAt[1])
      }
      return additional
    }
  },
  watch: {
    editOn: function (val) {
      if (!val) {
        this.editedItemId = undefined
      }
    }
  },
  methods: {
    formatDateString (dateStr) {
      if (dateStr === null) {
        return null
      }
      let momentObj = this.$moment(dateStr)
      return momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS')
    },
    showDeactivationDialog (item) {
      this.$refs.dialog.openLocalizable('message.deactivationTitle', 'message.deactivationQuestion').then(confirm => {
        if (confirm) {
          this.$store.dispatch('deactivateAdBanner', item.id).then(
            response => {
              item.data.activated = response.data.saveAdBannerActivation.data.activated
            },
            failure => {
              this.errorMessages = [failure.message]
            }
          )
        } else {
          item.data.activated = true
        }
      })
    },
    cloneBanner (item) {
      let self = this
      this.$refs.dialog.open('Cloning', 'Are you sure, you want to clone this banner?').then(confirm => {
        if (confirm) {
          this.$store.dispatch('cloneAdBannerItem', item.id).then(
            response => {
              self.editItem(response.data.cloneAdBannerItem)
            },
            failure => {
              this.errorMessages = [failure.message]
            }
          )
        }
      })
    },
    editItem: function (item) {
      this.editedItemId = item ? item.id : null
      this.editOn = true
    },
    renderSnapshot (item) {
      console.log(item)
      if (item.data && item.data.defaultTemplate) {
        let filled = ''
        let template = item.data.defaultTemplate
        item.data.imageUrls.forEach((val) => {
          filled += template.replace(new RegExp('@{imageUrls}', 'gm'), val || '')
        })
        item.data.overviewImageUrls.forEach((val) => {
          filled += template.replace(new RegExp('@{imageUrls}', 'gm'), val || '')
        })
        return filled
      }
      return ''
    },
    previewRenderSnapshot (item) {
      this.previewTemplateOn = true
      this.previewTemplateHtml = this.renderSnapshot(item)
      setTimeout(() => {
        const previewImgs = document.querySelectorAll('div img')
        previewImgs.forEach(previewImg => {
          previewImg.style.marginRight = '24px'
          previewImg.style.border = '7px solid gray'
        })
      }, 0)
    },
    handleBannerWasSaved () {
      this.$refs.banners.load()
    }
  }
}
</script>
