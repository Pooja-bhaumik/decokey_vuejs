<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <h2>{{ $t('message.adBanner') }} </h2>
      <v-icon @click="editItem(null)" v-text="'mdi-text-box-plus-outline'"></v-icon>
    <ad-banner-edit :id="editedItemId" :edit-dialog.sync="editOn" @bannerWasSaved="handleBannerWasSaved" ></ad-banner-edit>
    <v-data-table
      :headers="headers"
      :items="adBanners"
      :page.sync="page"
      :options.sync="options"
      :server-items-length="totalItemsCount"
      :items-per-page="itemsPerPage"
      :footer-props="{
                        'items-per-page-options': [5, 10, 20, 30, 40, 50]
                      }"
      class="elevation-1"
      @page-count="pageCount = $event"
    >
        <template v-slot:header="props">
            <tr>
                <th
                        v-for="header in headers"
                        :key="header.searchValue"
                >
                    <v-container v-if="header.searchValue">
                    <v-text-field v-if="!header.typeId && !header.typeName"
                            :label="header.text"
                            append-icon="mdi-magnify"
                            @click:append="() => (loadAdBanners())"
                            class="md-4"
                            v-model="search[header.value]"
                            @keyup.enter.native="loadAdBanners"
                    ></v-text-field>
                    <vue-2-datepicker v-else-if="header.searchValue === 'startAt'" :dateTime.sync="startAt" :showTimePanelToggle="true"></vue-2-datepicker>
                    <vue-2-datepicker v-else-if="header.searchValue === 'endAt'" :dateTime.sync="endAt" :showTimePanelToggle="true"></vue-2-datepicker>
                    <item-filter v-else v-model="search[header.searchValue]" @input="loadAdBanners" :type-id="header.typeId" :type-name="header.typeName" :label="header.text" ></item-filter>
                    </v-container>
                </th>
            </tr>
        </template>

      <template v-slot:item.action="{ item }">
          <v-tooltip top>
              <template v-slot:activator="{ on }">
                  <v-icon @click="editItem(item)" v-text="'mdi-file-document-edit-outline'" v-on="on"></v-icon>
              </template>
              <span>{{ $t('buttons.edit') }}</span>
          </v-tooltip>
          <v-tooltip top v-if="item.data && item.data.renderSnapshot">
              <template v-slot:activator="{ on }">
                  <v-icon @click="previewRenderSnapshot(item.data.renderSnapshot)" v-text="'mdi-eye'" v-on="on"></v-icon>
              </template>
              <span>Preview</span>
          </v-tooltip>
        <v-tooltip top v-if="item.data && item.data.activated">
          <template v-slot:activator="{ on }">
            <v-switch v-on="on" v-model="item.data.activated"
              class="mt-0"
              color="primary"
              inset
              hide-details
              @change="showDeactivationDialog(item)"
            ></v-switch>
          </template>
          <span>Unpublish</span>
        </v-tooltip>
      </template>
    </v-data-table>
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
    <confirm-dialog ref="deactivationDialog"></confirm-dialog>
  </v-container>
</template>

<script>
import AdBannerEdit from '@/components/Banners/AdBannerEdit'
import ItemFilter from '@/components/ContentItems/ItemFilter'
import ItemType from '../../store/itemType'
import ConfirmDialog from '@/components/ConfirmDialog'
import Vue2Datepicker from '@/components/BrandStatistic/Vue2Datepicker'

export default {
  data: () => ({
    editedItemId: undefined,
    editOn: false,
    search: {},
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    options: {},
    previewTemplateHtml: null,
    previewTemplateOn: false,
    totalItemsCount: 0,
    startAt: [null, null],
    endAt: [null, null],
    headers: [
      { text: 'Id', value: 'id', searchValue: 'id' },
      { text: 'Brand', value: 'brand.name', searchValue: 'brand.id', typeId: ItemType.Brand },
      { text: 'Target audience', value: 'targetAudience.name', searchValue: 'targetAudience.id', typeId: ItemType.Target_Audience },
      { text: 'Product group', value: 'productGroup.name', searchValue: 'productGroup.id', typeId: ItemType.Product_Group },
      { text: 'Article category', value: 'articleCategory.name', searchValue: 'articleCategory.id', typeId: ItemType.Article_Category },
      { text: 'Title', value: 'data.title', searchValue: 'data.title' },
      { text: 'Start date', value: 'data.startAt', searchValue: 'startAt', typeName: 'dateTime' },
      { text: 'End date', value: 'data.endAt', searchValue: 'endAt', typeName: 'dateTime' },
      { text: 'Actions', value: 'action', sortable: false }
    ]
  }),
  computed: {
    adBanners: function () {
      return this.$store.getters.getAdBanners ? this.$store.getters.getAdBanners.content : []
    }
  },
  mounted () {
    this.loadAdBanners()
  },
  watch: {
    options: {
      handler () {
        this.loadAdBanners()
      }
    },
    editOn: function (val) {
      if (!val) {
        this.editedItemId = undefined
      }
    },
    startAt () {
      this.loadAdBanners()
    },
    endAt () {
      this.loadAdBanners()
    }
  },
  methods: {
    editItem: function (item) {
      this.editedItemId = item ? item.id : null
      this.editOn = true
    },
    showDeactivationDialog (item) {
      this.$refs.deactivationDialog.openLocalizable('message.deactivationTitle', 'message.deactivationQuestion').then(confirm => {
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
    handleBannerWasSaved () {
      this.loadAdBanners()
    },
    previewRenderSnapshot (templateHtml) {
      this.previewTemplateOn = true
      this.previewTemplateHtml = templateHtml
      setTimeout(() => {
        const previewImg = document.querySelector('div a img')
        previewImg.style.marginRight = '24px'
        previewImg.style.border = '7px solid gray'
      }, 0)
    },
    loadAdBanners () {
      let pageable = { size: this.options.itemsPerPage, offset: (this.options.page - 1) * this.options.itemsPerPage }
      let sortPattern = {}
      let self = this
      if (this.options.sortBy.length) {
        let orders = []
        this.options.sortBy.forEach((v, i) => {
          orders.push(v + ',' + (self.options.sortDesc[i] ? 'desc' : 'asc'))
        })
        sortPattern.orders = orders
      }
      var searchPattern = Object.assign({}, this.search)
      let additional = {}

      if (this.startAt[0] && this.startAt[1]) {
        additional.startAtFrom = this.formatDateString(this.startAt[0])
        additional.startAtTo = this.formatDateString(this.startAt[1])
      }

      if (this.endAt[0] && this.endAt[1]) {
        additional.endAtFrom = this.formatDateString(this.endAt[0])
        additional.endAtTo = this.formatDateString(this.endAt[1])
      }

      Object.keys(searchPattern).forEach(key => {
        let val = searchPattern[key]
        if (val === '' || key === 'data.startAt' || key === 'data.endAt') {
          delete searchPattern[key]
        } else {
          delete searchPattern[key]
          Object.assign(searchPattern, self.pathToObject({}, key, val))
        }
      })

      this.$store.dispatch('loadAdBunnersPage', { sortPattern: sortPattern, additional: additional, searchPattern: searchPattern, pageable: pageable }).then((data) => {
        this.totalItemsCount = data.totalElements
      })
    },
    formatDateString (dateStr) {
      if (dateStr === null) {
        return null
      }
      let momentObj = this.$moment(dateStr)
      return momentObj.format('YYYY-MM-DDTHH:mm:ss.SSS')
    },
    pathToObject (obj, path, value = null) {
      path = typeof path === 'string' ? path.split('.') : path
      let current = obj
      while (path.length > 1) {
        const [head, ...tail] = path
        path = tail
        if (current[head] === undefined) {
          current[head] = {}
        }
        current = current[head]
      }
      current[path[0]] = value
      return obj
    }
  },
  components: {
    AdBannerEdit,
    ItemFilter,
    ConfirmDialog,
    Vue2Datepicker
  }

}
</script>
