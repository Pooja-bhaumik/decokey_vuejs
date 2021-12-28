<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-container>
      <v-dialog v-model="editDialog" persistent transition="dialog-bottom-transition" max-width="850px" :scrollable="true">
        <edit-component
          dialog-title="buttons.editAdBanner"
          :sections="sections"
          :visible="visible"
          @close="close"
          @save="save"
          :saveDisabled="saveDisabled">
          <template v-slot:header>
            <v-col cols="12" sm="12" md="12">
              <v-form ref="titleForm">
                <v-text-field v-model="adBanner.data.title"
                            @change="validate('titleForm')"
                            label="Title"
                            required
                            :rules="[checkRequired]"
                ></v-text-field>
              </v-form>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-switch :value="adBanner.data.activated"
                        :label="adBanner.data.activated? 'Publicated' : 'Not publicated'"
                        class="mt-0"
                        color="rgb(0,180,0)"
                        inset
                        hide-details
                        @change="adBanner.data.activated = $event != null"
                        :readonly="!canBePublicated || readOnly"
              ></v-switch>
            </v-col>
            <v-col cols="6" sm="6" md="6">
              <v-switch v-model="slider"
                        :label="slider? 'Slider' : 'Not Slider'"
                        class="mt-0"
                        inset
                        color="primary"
                        hide-details
                        @change="toggleSlider"
              ></v-switch>
            </v-col>
            <v-col cols="12" v-if="readOnly">
              <span style="color:red; font-size: medium">The Banner is disabled post end date. Clone the banner to make a copy.</span>
            </v-col>
          </template>

            <template v-slot:0>
              <v-form ref="settingsForm" v-model="sections[0].valid" >
                <selection-dialog
                    title="Brands" model="Brand"
                    :items.sync="adBanner.brands"
                    :visible.sync="brandDialogVisible" :checked="adBanner.brands"></selection-dialog>
                <v-container mt-0 pt-0>
                  <v-row dense>
                    <v-col cols="12" sm="12" md="12">
                      <selection-text-field
                          title="Brands"
                          :items="adBanner.brands"
                          :required-rules="[checkRequired]"
                          @change="validate('settingsForm')"
                          @selectionDialogVisible="brandDialogVisible = true"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="adBanner.data.url" @change="validate('settingsForm')" :rules="[checkNotOverviewRequired]" required :label="$t('adBanner.landingUrl')"></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <date-time-picker-custom
                        v-model="adBanner.data.startAt"
                        :text-field-props="{rules: [checkStartDate], appendIcon: 'mdi-calendar'}"
                        required
                        label="Start date"
                        @input="validate('settingsForm')"
                      ></date-time-picker-custom>
                    </v-col>
                    <v-col cols="6" sm="6" md="4">
                      <v-text-field v-if="readOnly" :value="adBanner.data.endAt" readonly label="End date" append-icon="mdi-calendar"
                      ></v-text-field>
                      <date-time-picker-custom v-else
                        v-model="adBanner.data.endAt"
                        :text-field-props="{rules: [checkEndDate], appendIcon: 'mdi-calendar'}"
                        label="End date"
                      ></date-time-picker-custom>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </template>
            <template v-slot:1>
              <branches-dialog :visible.sync="branchesToBeExcludedDialogVisible" :branches.sync="adBanner.excludedBranches" :checked="adBanner.excludedBranches"></branches-dialog>
              <v-container>
                <v-form ref="targetingForm" v-model="sections[1].valid">
                  <v-row cols="12" sm="12" md="12">
                    <item-filter :value="adBanner.targetAudience" :typeName="'prefilledList'" :preFilledItems="availableTargetAudiences" @input="it => handleSelectedTargetAudience(it, false)" autoCompleteLabel="Target Audience" ></item-filter>
                  </v-row>
                  <v-row cols="12" sm="12" md="12" v-if="targetAudience && targetAudience.id">
                    <item-filter :value="adBanner.productGroup" :typeName="'prefilledList'" :preFilledItems="availableProductGroups" @input="it => handleSelectedProductGroup(it, false)" autoCompleteLabel="Product group" ></item-filter>
                  </v-row>
                  <v-row cols="12" sm="12" md="12" v-if="productGroup && productGroup.id">
                    <item-filter :value="adBanner.articleCategory" :typeName="'prefilledList'" :preFilledItems="availableArticleCategories" @input="handleSelectedArticleCategory" autoCompleteLabel="Article category" ></item-filter>
                  </v-row>
                  <v-row cols="12" sm="12" md="12" v-if="articleCategory && articleCategory.id">
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="commaSeparatedBranchesToBeExcluded" readonly label="Branches to be EXCLUDED" required append-outer-icon="mdi-file-document-edit-outline"
                                    @click:append-outer="branchesToBeExcludedDialogVisible = true"></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </template>
            <template v-slot:2>
              <v-container class="pt-0">
                <v-form ref="imagesForm">
                  <h3 v-if="adBannerId && images.length === 0" class="my-6 body-1" style="color:red">
                    {{ $t('message.uploadAdBannerImage') }}
                  </h3>
                  <ad-banner-image-section
                      @uploadNewImage="uploadImage"
                      @changedImageActivity="validate('imagesForm')"
                      :images.sync="images"
                      :adBannerId="adBannerId"
                  ></ad-banner-image-section>
                </v-form>
                <v-snackbar v-model="uploading">
                  Image uploading
                </v-snackbar>
              </v-container>
            </template>
            <template v-slot:3>
              <v-container class="pt-0">
                <v-form ref="overviewForm" v-model="sections[3].valid">
                      <v-row cols="12" sm="12" md="12" >
                        <v-container>
                          <ad-banner-image-section
                              @uploadNewImage="uploadImageOverview"
                              @deleteImage="deleteImageOverview"
                              @changedImageActivity="validate('overviewForm')"
                              :images.sync="imagesOverview"
                              :adBannerId="adBannerId"
                              :isOverview="true"
                              deletable
                              title="Select overview image"
                          ></ad-banner-image-section>
                          <v-text-field
                              v-model="adBanner.data.overviewTitle"
                              @change="validate('overviewForm')"
                              :rules="[checkOverviewRequired]" required
                              label="Overview Title"
                          ></v-text-field>
                          <v-text-field
                              v-model="adBanner.data.overviewDescription"
                              @change="validate('overviewForm')"
                              :rules="[checkOverviewRequired]" required
                              label="Overview Description"
                          ></v-text-field>
                          <v-text-field
                              v-model="adBanner.data.bigTitle"
                              label="Big Title (Overview discount)"
                              @change="validate('overviewForm')"
                              :rules="[checkOverviewRequired]" required
                          ></v-text-field>
                          <v-text-field
                              v-model="adBanner.data.overviewCTA"
                              @change="validate('overviewForm')"
                              :rules="[checkOverviewRequired]" required
                              label="Overview CTA"
                          ></v-text-field>
                          <v-text-field
                              v-model="adBanner.data.overviewFinalUrl"
                              label="Overview Final URL Landing Page"
                              @change="validate('overviewForm')"
                              :rules="[checkOverviewRequired]" required
                          ></v-text-field>
                          <date-time-picker-custom
                              v-model="adBanner.data.overviewEndDate"
                              :text-field-props="{rules: [checkOverviewEndDate], appendIcon: 'mdi-calendar'}"
                              label="Overview End date"
                              required
                              @input="validate('overviewForm')"
                          ></date-time-picker-custom>

                          <v-snackbar v-model="overviewUploading">
                            Image uploading
                          </v-snackbar>
                        </v-container>
                      </v-row>
                </v-form>
              </v-container>
            </template>

          </edit-component>
          <v-dialog persistent v-model="uploadFinished" width="270px">
            <v-card>
              <v-card-title class="text-center">
                <span class="headline font-weight-bold text-center">Upload successfully finished</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="uploadFinished = false; ">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog persistent v-model="uploadFailed" width="270px">
            <v-card>
              <v-card-title class="text-center">
                <span class="headline font-weight-bold text-center">Upload failed</span>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="uploadFailed = false; ">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
    .adBanner-tabs__arrow-text {
        color: #1976D2;
        cursor: pointer;
        text-decoration: underline;
    }
</style>
<script>
import AdBannerImageSection from '@/components/Banners/AdBannerImageSection'
import ItemFilter from '@/components/ContentItems/ItemFilter'
import DateTimePickerCustom from '@/components/DatetimePickerCustom'
import EditComponent from '@/components/EditComponent'
import SelectionDialog from '@/components/Selection/SelectionDialog'
import BranchesDialog from '@/components/Dialogs/BranchesDialog'
import SelectionTextField from '@/components/Selection/SelectionTextField'

export default {
  props: [ 'editDialog', 'id' ],
  data: () => ({
    adBanner: { id: null, brands: [], targetAudience: null, productGroup: null, articleCategory: null, excludedBranches: [], data: { activated: false, defaultTemplate: null, url: null, imageUrls: [], imageStyles: [], imageActivated: [], title: null, startAt: null, endAt: null, overviewTitle: null, overviewDescription: null, bigTitle: null, overviewImageUrls: [], overviewImageActivated: [], overviewFinalUrl: null, overviewCTA: null, overviewEndDate: null } },
    availableTargetAudiences: [],
    availableProductGroups: [],
    availableArticleCategories: [],
    brandDialogVisible: false,
    branchesToBeExcludedDialogVisible: false,
    requiredTextRules: [
      v => ((typeof v === 'string' || v instanceof String) && v.trim().length) || ' is required'
    ],
    errorMessages: [],
    images: [],
    imagesOverview: [],
    sections: [{ title: 'Settings', valid: false },
      { title: 'Targeting', valid: true },
      { title: 'Images', valid: false },
      { title: 'Ads Website', valid: true }],
    visible: false,
    uploading: false,
    uploadFinished: false,
    overviewUploading: false,
    uploadFailed: false,
    manualPublication: false,
    slider: false,
    readOnly: false
  }),
  mounted () {
    if (this.availableTargetAudiences.length === 0) {
      this.$store.dispatch('getTargetAudiences').then((data) => {
        this.availableTargetAudiences = data.data.getTargetAudiences
      })
    }
  },
  computed: {
    canBePublicated () {
      if (this.slider) {
        return this.adBanner.brands !== null && this.adBanner.brands.length !== 0 &&
          this.adBanner.data.startAt !== null && this.isAdWebsitesFilled
      }

      if (this.adBanner.data.title === null || this.adBanner.data.title.trim().length === 0) {
        return false
      }
      if (this.adBanner.data.url === null || this.adBanner.data.url.trim().length === 0) {
        return false
      }
      if (!this.adBanner.data.startAt) {
        return false
      }
      if (this.adBanner.data.endAt !== null && !this.$moment(this.adBanner.data.endAt).isAfter(this.adBanner.data.startAt)) {
        return false
      }
      if (!this.isActiveImage(this.images)) {
        return false
      }
      if (this.adBanner.brands === null || this.adBanner.brands.length === 0) {
        return false
      }

      return true
    },
    saveDisabled () {
      if (this.readOnly) {
        return true
      }
      return this.adBanner.data.title === null || this.adBanner.data.title.trim().length === 0
    },
    isAdWebsitesFilled () {
      if (this.adBanner.data.overviewTitle === null || this.adBanner.data.overviewTitle.trim().length === 0) {
        return false
      }
      if (this.adBanner.data.overviewDescription === null || this.adBanner.data.overviewDescription.trim().length === 0) {
        return false
      }
      if (!this.adBanner.data.bigTitle) {
        return false
      }
      if (this.adBanner.data.overviewCTA === null || this.adBanner.data.overviewCTA.trim().length === 0) {
        return false
      }
      if (this.adBanner.data.overviewFinalUrl === null || this.adBanner.data.overviewFinalUrl.trim().length === 0) {
        return false
      }
      if (!this.adBanner.data.overviewEndDate) {
        return false
      }
      if (!this.isActiveImage(this.imagesOverview)) {
        return false
      }
      return true
    },
    commaSeparatedBrands () {
      let res = ''
      for (let i = 0; i < this.adBanner.brands.length - 1; i++) {
        res += this.adBanner.brands[i].name + ', '
      }
      if (this.adBanner.brands.length) {
        res += this.adBanner.brands[this.adBanner.brands.length - 1].name
      }
      return res
    },
    commaSeparatedBranchesToBeExcluded () {
      let res = ''
      for (let i = 0; i < this.adBanner.excludedBranches.length - 1; i++) {
        res += this.adBanner.excludedBranches[i].name + ', '
      }
      if (this.adBanner.excludedBranches.length) {
        res += this.adBanner.excludedBranches[this.adBanner.excludedBranches.length - 1].name
      }
      return res
    },
    targetAudience () {
      return this.adBanner.targetAudience
    },
    productGroup () {
      return this.adBanner.productGroup
    },
    articleCategory () {
      return this.adBanner.articleCategory
    },
    adBannerId () {
      return this.adBanner.id
    }
  },
  watch: {
    visible: {
      handler: function (newValue) {
        if (!newValue) {
          this.$emit('update:editDialog', false)
        }
      }
    },
    canBePublicated: {
      handler: function (newValue) {
        if (!this.visible) {
          return
        }
        if (!this.manualPublication) {
          this.adBanner.data.activated = newValue
        } else if (!newValue) {
          this.adBanner.data.activated = false
        }
      }
    },
    id: {
      handler: function (idValue, oldIdValue) {
        let self = this
        if (idValue) {
          this.$store.dispatch('getAdBannerItemById', idValue).then(response => {
            let item = response.data.getAdBannerItemById

            if (!item.data.defaultTemplate) {
              item.data.defaultTemplate = "<div><img src='@{imageUrls}'/></div>"
            }
            if (!item.data.imageStyles) {
              item.data.imageStyles = []
            }
            if (item.data.endAt) {
              self.readOnly = self.$moment(item.data.endAt).isBefore(self.$moment())
            } else {
              self.readOnly = false
            }
            self.slider = item.data.overviewSliderActivated

            self.adBanner = Object.assign({}, item)
            if (self.adBanner.targetAudience != null) {
              self.handleSelectedTargetAudience(self.adBanner.targetAudience.id, true)
            }
            if (self.adBanner.productGroup != null) {
              self.handleSelectedProductGroup(self.adBanner.productGroup.id, true)
            }

            self.buildImagesOverviewObj(self.adBanner, true)
          })
        } else if (idValue === null) {
          self.readOnly = false
          self.adBanner = { id: null, brands: [], targetAudience: null, productGroup: null, articleCategory: null, excludedBranches: [], data: { activated: false, defaultTemplate: null, url: null, imageUrls: [], imageStyles: [], imageActivated: [], title: null, startAt: null, endAt: null, overviewTitle: null, overviewDescription: null, bigTitle: null, overviewImageUrls: [], overviewImageActivated: [], overviewFinalUrl: null, overviewCTA: null, overviewEndDate: null } }
          self.buildImagesOverviewObj(self.adBanner, true)
        }
      }
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
    checkNotOverviewRequired (value) {
      if (this.slider) {
        return true
      }
      return this.checkRequired(value)
    },
    checkStartDate (startAt) {
      if (startAt.length === 0) {
        return ' is required'
      } else if (!/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.test(startAt)) {
        return ' Format 2020-12-31 23:00'
      } else {
        return true
      }
    },
    checkEndDate (endAt) {
      if (this.slider) {
        return true
      }
      if (!this.adBanner.data.startAt || endAt.length === 0) {
        return true
      } else if (!/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.test(endAt)) {
        return ' Format 2020-12-31 23:00'
      } else if (!this.$moment(endAt).isAfter(this.adBanner.data.startAt)) {
        return 'End date/time should be after start date/time'
      } else {
        return true
      }
    },
    checkOverviewRequired (value) {
      if (!this.slider) {
        return true
      }
      return this.checkRequired(value)
    },
    checkOverviewEndDate (endAt) {
      if (!this.slider) {
        return true
      }
      if (endAt.length === 0) {
        return ' is required'
      } else {
        return this.checkEndDate(endAt)
      }
    },
    isActiveImage (images) {
      return images.some(it => it.active)
    },
    buildImagesObj (adBanner, isOpening) {
      this.uploading = false
      this.images = []
      this.sections[2].valid = false
      if (adBanner.id) {
        this.$store.dispatch('loadAdBannerUserFiles', adBanner.id).then(urls => {
          if (urls.length !== 0 && adBanner.data.imageUrls === null) {
            adBanner.data.imageUrls = []
          }
          urls.forEach(url => {
            if (adBanner.data.imageUrls.indexOf(url) < 0) {
              adBanner.data.imageUrls.push(url)
            }
          })

          if (adBanner.data.imageUrls) {
            this.images = adBanner.data.imageUrls.map((imageUrl, idx) => {
              return {
                url: imageUrl,
                style: adBanner.data.imageStyles ? adBanner.data.imageStyles[idx] : null,
                active: adBanner.data.imageActivated && adBanner.data.imageActivated.length > idx ? !!adBanner.data.imageActivated[idx] : true
              }
            }).sort((a, b) => b.active - a.active)
            this.sections[2].valid = this.isActiveImage(this.images)
          } else {
            this.images = []
            this.sections[2].valid = false
          }

          if (isOpening) {
            this.manualPublication = this.canBePublicated && !adBanner.data.activated
            this.$nextTick(function () {
              this.visible = true
              this.validateAll()
            })
          }
        })
      } else if (isOpening) {
        this.manualPublication = false
        this.$nextTick(function () {
          this.visible = true
          this.validateAll()
        })
      }
    },
    buildImagesOverviewObj (adBanner, isOpening) {
      this.overviewUploading = false
      this.imagesOverview = []
      this.sections[3].valid = false
      const self = this
      if (adBanner.id) {
        this.$store.dispatch('loadAdBannerOverview', adBanner.id).then(urls => {
          if (urls.length !== 0 && adBanner.data.overviewImageUrls === null) {
            adBanner.data.overviewImageUrls = []
          }
          urls.forEach(url => {
            if (adBanner.data.overviewImageUrls.indexOf(url) < 0) {
              adBanner.data.overviewImageUrls.push(url)
            }
          })

          if (adBanner.data.overviewImageUrls) {
            this.imagesOverview = adBanner.data.overviewImageUrls.map((overviewImageUrls, idx) => {
              return {
                url: overviewImageUrls,
                active: adBanner.data.overviewImageActivated && adBanner.data.overviewImageActivated.length > idx ? !!adBanner.data.overviewImageActivated[idx] : true
              }
            }).sort((a, b) => b.active - a.active)
            this.sections[3].valid = true
          } else {
            this.imagesOverview = []
            this.sections[3].valid = false
          }

          if (isOpening) {
            self.buildImagesObj(adBanner, true)
          }
        })
      } else if (isOpening) {
        self.buildImagesObj(adBanner, true)
      }
    },
    uploadImage (file) {
      this.uploading = true
      this.$store.dispatch('uploadAdBannerImage', {
        file,
        adBannerId: this.adBanner.id
      }).done((response) => {
        this.uploadFinished = true
        this.buildImagesObj(this.adBanner, false)
      }).fail(err => {
        this.uploading = false
        this.uploadFailed = true
        console.log('Image upload failed')
        console.log(err)
      })
    },
    uploadImageOverview (file) {
      this.overviewUploading = true
      this.$store.dispatch('uploadAdBannerOverview', {
        file,
        adBannerId: this.adBanner.id
      }).done((response) => {
        this.uploadFinished = true
        this.buildImagesOverviewObj(this.adBanner, false)
      }).fail(err => {
        this.overviewUploading = false
        this.uploadFailed = true
        console.log('Image upload failed')
        console.log(err)
      })
    },
    deleteImageOverview (image) {
      this.$store.dispatch('deleteImageOverview', {
        inputAdBannerItemId: this.adBanner.id,
        inputImageUrl: image.url
      }).then(deleteResponse => {
        this.adBanner.data.overviewImageActivated = deleteResponse.imageActivated
        this.adBanner.data.overviewImageUrls = deleteResponse.imageUrls
        this.buildImagesOverviewObj(this.adBanner, false)
      })
    },
    close () {
      this.visible = false
    },
    validate (ref) {
      this.$refs[ref].validate()
      if (ref === 'imagesForm' || ref === 'overviewForm') {
        if (!this.slider) {
          this.sections[2].valid = this.isActiveImage(this.images)
          this.sections[3].valid = true
        } else {
          this.sections[2].valid = true
          this.sections[3].valid = this.isAdWebsitesFilled
        }
      }
    },
    validateAll () {
      this.validate('titleForm')
      this.validate('settingsForm')
      this.validate('targetingForm')
      this.validate('imagesForm')
      this.validate('overviewForm')
    },
    toggleSlider () {
      this.$nextTick(function () {
        this.validateAll()
      })
    },
    save (saveFailed) {
      let saveRequest = JSON.parse(JSON.stringify(this.adBanner))
      if (this.slider) {
        saveRequest.data.overviewSliderActivated = this.slider
      } else {
        saveRequest.data.overviewSliderActivated = null
      }
      if (this.adBanner && this.adBanner.data.startAt) {
        saveRequest.data.startAt = this.adBanner.data.startAt instanceof Date ? (this.adBanner.data.startAt.toISOString().split('.')[0]) : JSON.parse(JSON.stringify(this.adBanner.data.startAt))
      }
      if (this.adBanner && this.adBanner.data.endAt) {
        saveRequest.data.endAt = this.adBanner.data.endAt instanceof Date ? (this.adBanner.data.endAt.toISOString().split('.')[0]) : JSON.parse(JSON.stringify(this.adBanner.data.endAt))
      }
      if (saveRequest && this.images && this.images.length) {
        saveRequest.data.imageUrls = []
        saveRequest.data.imageStyles = []
        saveRequest.data.imageActivated = []
        this.images.forEach(imageItem => {
          saveRequest.data.imageUrls.push(imageItem.url)
          saveRequest.data.imageStyles.push(imageItem.style)
          saveRequest.data.imageActivated.push(imageItem.active)
        })
      }
      if (saveRequest && this.imagesOverview && this.imagesOverview.length) {
        saveRequest.data.overviewImageUrls = []
        saveRequest.data.overviewImageActivated = []
        this.imagesOverview.forEach(imageItem => {
          saveRequest.data.overviewImageUrls.push(imageItem.url)
          saveRequest.data.overviewImageActivated.push(imageItem.active)
        })
      }

      saveRequest.adBannerItemData = JSON.parse(JSON.stringify(saveRequest.data))
      delete saveRequest.data
      if (saveRequest.targetAudience != null) {
        saveRequest.targetAudienceId = saveRequest.targetAudience.id
        delete saveRequest.targetAudience
      }
      if (saveRequest.productGroup != null) {
        saveRequest.productGroupId = saveRequest.productGroup.id
        delete saveRequest.productGroup
      }
      if (saveRequest.articleCategory != null) {
        saveRequest.articleCategoryId = saveRequest.articleCategory.id
        delete saveRequest.articleCategory
      }

      this.$store.dispatch('saveAdBannerItem', saveRequest).then(
        response => {
          if (response.data.saveAdBannerItem.errors && response.data.saveAdBannerItem.errors.length > 0) {
            this.errorMessages = response.data.saveAdBannerItem.errors
            saveFailed()
            return
          }

          if (response.data.saveAdBannerItem.id) {
            this.$root.$emit('infoMessage', 'Saved')
            this.$emit('bannerWasSaved')
            this.close()
          } else {
            saveFailed()
          }
        },
        failure => {
          this.errorMessages = [failure.message]
          console.log(failure)
          saveFailed()
        }
      )
    },
    handleSelectedTargetAudience (item, loading) {
      if (item) {
        console.log(item)
        this.$store.dispatch('getTargetAudienceById', item).then((data) => {
          let targetAudienceById = data.data.getTargetAudienceById
          this.availableProductGroups = targetAudienceById.productGroups
          if (loading) {
            return
          }

          let targetAudienceObj = Object()
          targetAudienceObj.name = targetAudienceById.name
          targetAudienceObj.id = targetAudienceById.id
          targetAudienceObj.srcUuid = targetAudienceById.srcUuid
          this.adBanner.targetAudience = targetAudienceObj
          this.adBanner.productGroup = null
          this.adBanner.articleCategory = null
          this.adBanner.excludedBranches = []
          this.adBanner = Object.assign({}, this.adBanner)
        })
      } else {
        this.availableArticleCategories = []
        this.availableProductGroups = []
        this.adBanner.excludedBranches = []
        this.adBanner.targetAudience = null
        this.adBanner.productGroup = null
        this.adBanner.articleCategory = null
        this.adBanner = Object.assign({}, this.adBanner)
      }
    },
    handleSelectedProductGroup (item, loading) {
      if (item) {
        this.$store.dispatch('getProductGroupById', item).then((data) => {
          let productGroupById = data.data.getProductGroupById
          this.availableArticleCategories = productGroupById.articleCategories
          if (loading) {
            return
          }

          let productGroupObj = Object()
          productGroupObj.name = productGroupById.name
          productGroupObj.id = productGroupById.id
          productGroupObj.srcUuid = productGroupById.srcUuid
          this.adBanner.productGroup = productGroupObj
          this.adBanner.articleCategory = null
          this.adBanner.excludedBranches = []
          this.adBanner = Object.assign({}, this.adBanner)
        })
      } else {
        this.availableArticleCategories = []
        this.adBanner.excludedBranches = []
        this.adBanner.productGroup = null
        this.adBanner.articleCategory = null
        this.adBanner = Object.assign({}, this.adBanner)
      }
    },
    handleSelectedArticleCategory (item) {
      if (item) {
        this.$store.dispatch('getArticleCategoryById', item).then((data) => {
          let articleCategoryById = data.data.getArticleCategoryById
          let previousArticleCategoryId = this.adBanner.articleCategory ? this.adBanner.articleCategory.id : null
          this.adBanner.articleCategory = { name: articleCategoryById.name, id: articleCategoryById.id, srcUuid: articleCategoryById.srcUuid }
          if (previousArticleCategoryId !== articleCategoryById.id) {
            this.adBanner.excludedBranches = []
          }
          this.adBanner = Object.assign({}, this.adBanner)
        })
      } else {
        this.adBanner.excludedBranches = []
        this.adBanner.articleCategory = null
        this.adBanner = Object.assign({}, this.adBanner)
      }
    }
  },
  components: {
    SelectionTextField,
    SelectionDialog,
    ItemFilter,
    AdBannerImageSection,
    EditComponent,
    DateTimePickerCustom,
    BranchesDialog
  }
}

</script>
