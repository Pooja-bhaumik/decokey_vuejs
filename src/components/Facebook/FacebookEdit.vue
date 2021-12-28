<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-dialog v-model="editDialog" persistent transition="dialog-bottom-transition" max-width="850px" :scrollable="true">
      <edit-component
          dialog-title="Edit Facebook Link"
          :sections="sections"
          @close="close"
          @save="save"
          :visible="visible">
        <template v-slot:header>
          <v-col cols="12" sm="12" md="12">
            <v-form ref="titleForm">
              <v-text-field v-model="contentItem.name"
                            @change="validate('titleForm')"
                            label="Title"
                            required
                            :rules="[checkRequired]"
              ></v-text-field>
            </v-form>
          </v-col>
        </template>

        <template v-slot:0>
          <v-form ref="facebookEditForm">
            <v-container mt-0 pt-0>
              <v-row>
                <v-col cols="6" sm="6" md="4">
                  <v-text-field v-model="contentItem.name" label="Name" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="6" md="4">
                  <v-textarea v-model="contentItem.description" label="Description" />
                </v-col>
                <v-col cols="6" sm="6" md="4">
                  <v-textarea v-model="contentItem.message" label="Message" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="6" md="4">
                  <v-text-field v-model="contentItem.link" label="Link" />
                </v-col>
                <v-col cols="6" sm="6" md="4">
                  <v-text-field v-model="contentItem.iconUrl" label="Icon URL" />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="6" md="4">
                  <v-radio-group label="Link Type" v-model="contentItem.facebookLinkType">
                    <v-radio
                      key="FEED"
                      label="FEED"
                      :value="contentItem.facebookLinkType">
                    </v-radio>
                    <v-radio
                      key="STORY"
                      label="STORY"
                      :value="contentItem.facebookLinkType">
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="6" sm="6" md="4">
                  <date-time-picker-custom
                          v-model="contentItem.startDateTime"
                          ref="startDate"
                          :text-field-props="{rules: requiredStartAtRules, appendIcon: 'mdi-calendar'}"
                          required
                          label="Start date"
                          @input="handleSettingTabChanged"
                  ></date-time-picker-custom>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" sm="6" md="4">
                  <v-switch
                    v-model="contentItem.published"
                    label="Published"
                    class="mt-0"
                    color="primary"
                    inset
                    hide-details>
                  </v-switch>
                </v-col>
                <v-col cols="6" sm="6" md="4">
                  <date-time-picker-custom
                          v-model="contentItem.scheduledAt"
                          ref="endDate"
                          :text-field-props="{rules: endDateValidation(), appendIcon: 'mdi-calendar'}"
                          label="scheduled At"
                  ></date-time-picker-custom>
                </v-col>
              </v-row>
              <v-row dense>
              </v-row>
              <div v-if="websiteSettings && websiteSettings.settings && contentItem">
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-if="websiteSettings.settings.jiraIssue" v-model="contentItem.jiraIssue" label="Jira Issue" />
                  </v-col>
                </v-row>
                <v-row cols="12" sm="12" md="12">
                  <item-filter :value="contentItem.author" :typeName="'prefilledList'" :preFilledItems="websiteSettings.authors" @input="it => handleSelectedAuthor(it)" autoCompleteLabel="Author" ></item-filter>
                </v-row>
                <v-row dense>
                  <v-col cols="4" v-if="websiteSettings.settings.approvedByClient">
                    <v-switch
                            v-model="contentItem.approvedByClient"
                            :label="contentItem.approvedByClient? 'Approved by client' : 'Not approved by client'"
                            class="mt-0"
                            color="primary"
                            inset
                            hide-details
                            @change="handleSettingTabChanged"
                    ></v-switch>
                  </v-col>
                  <v-col cols="4" v-if="websiteSettings.settings.approvedByClic2Connect">
                    <v-switch
                            v-model="contentItem.approvedByClic2Connect"
                            :label="contentItem.approvedByClic2Connect? 'Approved by c2c' : 'Not approved by c2c'"
                            class="mt-0"
                            color="primary"
                            inset
                            hide-details
                            @change="handleSettingTabChanged"
                    ></v-switch>
                  </v-col>
                  <v-col cols="4" v-if="websiteSettings.settings.amp">
                    <v-switch
                            v-model="contentItem.amp"
                            :label="contentItem.amp ? 'AMP' : 'No AMP'"
                            class="mt-0"
                            color="primary"
                            inset
                            hide-details></v-switch>
                  </v-col>
                </v-row>
                <v-row dense v-if="websiteSettings.settings.displayOrder">
                  <v-col cols="4">
                    <v-text-field v-model.number="contentItem.displayOrder" type="number" min="1" label="Display Order" />
                  </v-col>
                </v-row>
              </div>
            </v-container>
          </v-form>
     </template>

      </edit-component>
      <v-snackbar :value="errorMessages.length > 0" :multi-line="true">
        <span v-for="error in errorMessages" :key="error">{{ error }}</span>
        <v-btn color="red" text @click="errorMessages = []">{{ $t('buttons.close') }}</v-btn>
      </v-snackbar>
    </v-dialog>
  </v-container>
</template>
<style type="text/css">
  .validationBadge .v-badge__badge {
    height: 12px;
    width: 12px;
    min-width: 12px;
  }
  .validationBadge .v-badge__badge span {
    margin-top: -1px;
    margin-left: 1px;
  }

  .tiptap-vuetify-editor__content
    p.tiptap-vuetify-editor__paragraph--is-empty:first-child:before {
    font-style: normal !important;
    color: rgba(0,0,0,.60) !important;
  }

  .maintext-messages {
    display: flex;
    margin-top: 8px;
    font-size: 12px;
    line-height: 1;
  }

  .maintext-rules-error {
    color: #ff5252;
  }

  .maintext-counter {
    margin-left: auto;
    margin-right: 10px;
  }

  .testClass {
    border-color: red
  }
</style>
<script>
import ItemFilter from '@/components/ContentItems/ItemFilter'
import EditComponent from '@/components/EditComponent'
import DateTimePickerCustom from '@/components/DatetimePickerCustom'
import ConfirmDialog from '@/components/ConfirmDialog'
// WYSIWYG editor
import { Heading, Strike, BulletList, OrderedList, ListItem, History, Image } from 'tiptap-vuetify'

export default {
  props: [ 'editDialog', 'id' ],
  data: () => ({
    contentItem: { id: null, postId: null, postUrl: '', name: '', description: '', message: '', link: '', iconUrl: '', facebookLinkType: 'FEED', startDateTime: null, published: false, scheduledAt: null, createdAt: null, updatedAt: null },
    contentTagsVisible: false,
    cmsContentItemForReferenceVisible: false,
    requiredRules: [
      v => !!v || ' is required'
    ],
    requiredStartAtRules: [
      v => !!v || ' is required',
      v => /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.test(v) || ' Format 2020-12-31 23:00'
    ],
    errorMessages: [],
    images: [],
    sections: [{ title: 'Post Detail', valid: false }],
    visible: false,
    websiteSettings: null,
    showSelectImageDialog: false,
    isMainImageSelection: true,
    isReferalImageSelection: false,
    referalImageSelectionId: null,
    referalImageSelectionReferenceId: null,
    showPreview: false,
    previewImageUrl: null,

    contentMainTextActive: true,
    contentItemMainTexts: [],
    contentItemSecondaryTextSearch: '',
    mainTextSymbolsCounter: 0,
    dataFirstLoad: true,
    extensionsOfWYSIWYG: [
      Strike,
      [Heading, {
        options: {
          levels: [1, 2, 3]
        }
      }],
      BulletList,
      OrderedList,
      History,
      Image,
      ListItem
    ],
    colorPickerActive: false
  }),
  mounted () {
    if (this.availableWebsites.length === 0) {
      this.$store.dispatch('getWebsites').then((data) => {
        this.availableWebsites = data.data.getWebsites
      })
    }
  },
  computed: {
    contentMainText () {
      return this.contentItem.mainText
    },
    colorPickerActivatorStyles () {
      const { colorPickerActive, contentItem: { ctaBackground } } = this
      return {
        backgroundColor: ctaBackground,
        cursor: 'pointer',
        height: '30px',
        width: '30px',
        marginBottom: '5px',
        border: ctaBackground ? '' : '1px solid gray',
        borderRadius: colorPickerActive ? '50%' : '4px',
        transition: 'border-radius 200ms ease-in-out'
      }
    }
  },
  watch: {
    contentMainText () {
      if (!this.visible) {
        return
      }
      // Need settimeout, because editor doesn't have time to write a new value to itself in the properties
      setTimeout(() => {
        const maintTextSymbolCounter = this.$refs.tiptapEditorElement.editor.view.state.doc.textContent.length
        this.mainTextSymbolsCounter = maintTextSymbolCounter
        this.handleContentTabChanged(maintTextSymbolCounter)
      }, 0)
    },
    visible: {
      handler: function (newValue) {
        if (!newValue) {
          this.$emit('update:editDialog', false)
        }
      }
    },
    id: {
      handler: function (idValue, oldIdValue) {
        if (idValue) {
          let self = this
          this.$store.dispatch('getFacebookLinkPostById', idValue).then(response => {
            let item = response.data.getFacebookLinkPostById
            console.log('res of getFacebookLinkPostById', item)
            self.contentItem = Object.assign({}, item)
          })
        } else if (idValue === null) {
          this.contentItem = { id: null, postId: null, postUrl: '', name: '', description: '', message: '', link: '', iconUrl: '', facebookLinkType: 'FEED', startDateTime: null, published: false, scheduledAt: null, createdAt: null, updatedAt: null }
          this.showEditComponent()
        }
      }
    },

    contentMainTextActive (isActive) {
      if (!this.dataFirstLoad) {
        this.contentItem.mainText = ''
        this.contentItem.useTextSecondary = !isActive
      }
      this.dataFirstLoad = false
    }
  },
  methods: {
    checkRequired (value) {
      if (value === null || value.length === 0 || ((typeof value === 'string' || value instanceof String) && value.trim().length === 0)) {
        return ' is required'
      } else {
        return true
      }
    },
    endDateValidation (v) {
      return [
        v => this.isEndDateValid(v) || 'End date/time should be after start date/time',
        v => (!v || /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.test(v)) || ' Format 2020-12-31 23:00 '
      ]
    },
    isEndDateValid (endDate) {
      return !endDate || !this.contentItem.start || (!!this.contentItem.start && this.$moment(endDate).isAfter(this.contentItem.start))
    },
    close () {
      this.visible = false
    },
    validate (ref) {
      this.$refs[ref].validate()
    },
    save () {
      // let saveRequest = JSON.parse(JSON.stringify(this.contentItem))
      let saveRequest = JSON.parse('{"description": "New description8 Test", "createdAt": "2020-08-11T23:40:51", "facebookLinkType": "FEED", "iconUrl": null, "id": 6, "link": "https://decopedia.nl/", "message": "Msg", "name": "New name8", "postId": "621475355176802_626385644685773", "postUrl": "https://www.facebook.com/621475355176802/posts/626385644685773/", "published": false, "scheduledAt": null, "startDateTime": "2020-08-11T23:40:51", "updatedAt": "2020-08-11T23:40:51"}')
      if (this.contentItem && this.contentItem.start) {
        saveRequest.start = this.contentItem.start instanceof Date ? (this.contentItem.start.toISOString().split('.')[0]) : JSON.parse(JSON.stringify(this.contentItem.start))
      }
      if (this.contentItem && this.contentItem.end) {
        saveRequest.end = this.contentItem.end instanceof Date ? (this.contentItem.end.toISOString().split('.')[0]) : JSON.parse(JSON.stringify(this.contentItem.end))
      }
      console.log('beforesaveRequest: ', saveRequest)
      this.$store.dispatch('saveFacebookLinkPost', saveRequest).then(
        response => {
          console.log('AfterResponse', response)
          if (response.data.saveCmsContentItem.errors && response.data.saveCmsContentItem.errors.length > 0) {
            this.errorMessages = response.data.saveCmsContentItem.errors
          } else {
            if (response.data.saveCmsContentItem.id) {
              this.$root.$emit('infoMessage', 'Saved')
              this.$emit('cmsContentItemSaved')
              this.close()
            }
          }
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
        }
      )
    },
    showEditComponent () {
      this.handleSettingTabChanged()
      this.$nextTick(function () {
        this.visible = true
      })
    },
    isSettingsValid () {
      if (!this.contentItem.start) {
        return false
      }
      if (this.websiteSettings && (!this.contentItem.end || this.$moment(this.contentItem.end).isAfter(this.contentItem.start))) {
        let isValid = true
        if (this.websiteSettings.settings.approvedByClic2Connect && !this.contentItem.approvedByClic2Connect) {
          isValid = false
        }
        if (this.websiteSettings.settings.approvedByClient && !this.contentItem.approvedByClient) {
          isValid = false
        }
        return isValid
      } else {
        return false
      }
    },
    isSeoValid () {
      if (this.contentItem.seoBrowserTitle && this.contentItem.url) {
        return true
      }
      return false
    },
    isContentValid () {
      if (this.contentItem.mainText) {
        return true
      }
      return false
    },
    isReferenceValid () {
      return true
    },
    loadContentMainTexts (websiteId) {
      this.$store.dispatch('searchCmsContentItemMainTextByWebsite', { websiteId }).then(mainTexts => {
        this.contentItemMainTexts = mainTexts.data.searchCmsContentItemMainTextByWebsiteAndSearchPhrase
      })
    },
    loadBrands ({ search, limit, offset }) {
      search.articleCategoryId = this.contentItem.articleCategory.id
      search = Object.assign({}, search)
      return this.$store.dispatch('getBrands', { search, limit, offset })
    },
    mapBrand (response) {
      return response.data.getBrandPage
    },
    loadContentTags ({ search, limit, offset }) {
      let self = this
      return new Promise(function (resolve, reject) {
        self.$store.dispatch('getContentTagsForWebsite', self.contentItem.website.id).then(result => {
          let items = result.data.getContentTagsForWebsite
          if (search.id) {
            items = items.filter(item => item.id.toString() === search.id.toString())
          }
          if (search.name) {
            items = items.filter(item => item.name.toLowerCase().indexOf(search.name.toLowerCase()) >= 0)
          }
          resolve(items)
        })
      })
    },
    mapContentTag (response) {
      return { totalElements: response.length, content: response }
    },
    loadCmsContentItemForReference ({ search, limit, offset }) {
      let self = this
      // Here should be used also self.contentItem.website.id in additional when will implement DC-310
      return self.$store.dispatch('loadCmsContentItemPage', { sortPattern: {}, additional: {}, searchPattern: search || {}, pageable: { size: limit, offset: offset } })
    },
    mapCmsContentItemForReference (response) {
      return response
    },
    loadSecondaryWebsites ({ search, limit, offset }) {
      search.websiteIdToExclude = this.contentItem.website.id
      search = Object.assign({}, search)
      return this.$store.dispatch('getWebsitePage', { search, limit, offset })
    },
    mapWebsite (response) {
      return response.data.getWebsitePage
    },
    selectMainImage () {
      this.isMainImageSelection = true
      this.isReferalImageSelection = false
      this.showSelectImageDialog = true
    },
    selectHeaderImage () {
      this.isMainImageSelection = false
      this.isReferalImageSelection = false
      this.showSelectImageDialog = true
    },
    selectReferalImage (id, referalId) {
      this.isMainImageSelection = false
      this.isReferalImageSelection = true
      this.showSelectImageDialog = true
      this.referalImageSelectionId = id
      this.referalImageSelectionReferenceId = referalId
    },
    handleImageSelected (imageUrl) {
      if (this.isMainImageSelection) {
        this.contentItem.mainImage = imageUrl
      } else if (!this.isReferalImageSelection) {
        this.contentItem.headerImage = imageUrl
      } else {
        this.contentItem.references.filter(value => value.cmsContentItemId === this.referalImageSelectionId && value.referentCmsContentItemId === this.referalImageSelectionReferenceId).forEach(function (value) { value.referralImageUrl = imageUrl })
        this.contentItem.reverseReferences.filter(value => value.cmsContentItemId === this.referalImageSelectionId && value.referentCmsContentItemId === this.referalImageSelectionReferenceId).forEach(function (value) { value.referralImageUrl = imageUrl })
      }
      this.showSelectImageDialog = false
    },
    previewImage (url) {
      if (url) {
        this.previewImageUrl = url
        this.showPreview = true
      }
    },
    navigateToItem (id) {
      let routeData = this.$router.resolve({ name: 'cmsContentItems', query: { id: id } })
      window.open(routeData.href, '_blank')
    }
  },

  components: {
    ItemFilter,
    EditComponent,
    DateTimePickerCustom,
    ConfirmDialog
  }
}

</script>
