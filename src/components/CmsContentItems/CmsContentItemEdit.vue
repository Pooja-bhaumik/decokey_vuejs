<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <confirm-dialog ref="confirmDialog"></confirm-dialog>
    <v-dialog v-model="editDialog" persistent transition="dialog-bottom-transition" max-width="850px" :scrollable="true">
      <edit-component
          dialog-title="buttons.editCmsContentItem"
          :sections="sections"
          @close="close"
          @save="save"
          :visible="visible"
          :saveDisabled="saveDisabled">

        <template v-slot:header>
          <v-col cols="12" sm="12" md="12">
            <v-form ref="titleForm">
              <v-text-field v-model="contentItem.title"
                            @change="validate('titleForm')"
                            label="Title"
                            required
                            :rules="[checkRequired]"
              ></v-text-field>
            </v-form>
          </v-col>
          <v-col cols="12" sm="12" md="12">
            <v-switch :value="contentItem.active"
                      :label="contentItem.active? 'Publicated' : 'Not publicated'"
                      class="mt-0"
                      color="rgb(0,180,0)"
                      inset
                      hide-details
                      @change="contentItem.active = $event != null"
                      :readonly="!canBePublicated"
            ></v-switch>
          </v-col>
        </template>

        <template v-slot:0>
          <v-form ref="settingsForm">
            <v-container mt-0 pt-0>
              <v-row cols="12" sm="12" md="12">
                <item-filter :value="contentItem.website" :typeName="'prefilledList'" :preFilledItems="availableWebsites" @input="it => handleSelectedWebsite(it, false)" autoCompleteLabel="Main Website" ></item-filter>
              </v-row>
              <div v-if="contentItem.website">
                <v-row cols="12" sm="12" md="12">
                  <v-container>
                    <v-text-field
                          value="Search Secondary Websites"
                          readonly
                          append-icon="mdi-search-web" @click:append="secondaryWebsitesVisible = true"
                  ></v-text-field>
                  </v-container>
                </v-row>
                <content-items-new :load="loadSecondaryWebsites" :responseMapper="mapWebsite" @selected='handleAddSecondaryWebsite' :visible="secondaryWebsitesVisible" @close="secondaryWebsitesVisible = false" title="Secondary Websites"></content-items-new>
                <v-row dense cols="12" sm="12" md="12" v-if="contentItem.secondaryWebsites && contentItem.secondaryWebsites.length !== 0">
                  <v-col cols="auto" md="auto" sm="auto">
                    Secondary Websites:
                  </v-col>
                  <v-col cols="auto" md="auto" sm="auto" v-for="item in contentItem.secondaryWebsites" :key="item.id">
                    <v-chip
                          close
                          outlined
                          close-icon="mdi-delete"
                          @click:close="handleDeleteSecondaryWebsite(item)">
                      {{item.name}}
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
              <v-row dense>
                <v-col cols="6" sm="6" md="4">
                  <date-time-picker-custom
                          v-model="contentItem.start"
                          ref="startDate"
                          :text-field-props="{rules: [checkStartDate], appendIcon: 'mdi-calendar'}"
                          required
                          label="Start date"
                          @input="handleSettingTabChanged"
                  ></date-time-picker-custom>
                </v-col>
                <v-col cols="6" sm="6" md="4">
                  <date-time-picker-custom
                          v-model="contentItem.end"
                          ref="endDate"
                          :text-field-props="{rules: [checkEndDate], appendIcon: 'mdi-calendar'}"
                          label="End date"
                  ></date-time-picker-custom>
                </v-col>
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
        <template v-slot:1>
          <v-container>
            <v-form ref="targetingForm" v-model="sections[1].valid">
              <div v-if="websiteSettings && websiteSettings.settings && contentItem">
                <v-row cols="12" sm="12" md="12" v-if="websiteSettings.settings.targetAudience">
                  <item-filter :value="contentItem.targetAudience" :typeName="'prefilledList'" :preFilledItems="availableTargetAudiences" @input="it => handleSelectedTargetAudience(it, false)" autoCompleteLabel="Target Audience" ></item-filter>
                </v-row>
                <v-row cols="12" sm="12" md="12"  v-if="websiteSettings.settings.productGroup && contentItem.targetAudience && contentItem.targetAudience.id">
                  <item-filter v-model="contentItem.productGroup" :typeName="'prefilledList'" :preFilledItems="availableProductGroups" @input="it => handleSelectedProductGroup(it, false)" autoCompleteLabel="Product group" ></item-filter>
                </v-row>
                <v-row cols="12" sm="12" md="12" v-if="websiteSettings.settings.articleCategory && contentItem.productGroup && contentItem.productGroup.id">
                  <item-filter v-model="contentItem.articleCategory" :typeName="'prefilledList'" :preFilledItems="availableArticleCategories" @input="handleSelectedArticleCategory" autoCompleteLabel="Article category" ></item-filter>
                </v-row>
                <v-row cols="12" sm="12" md="12" v-if="websiteSettings.settings.brand && contentItem.articleCategory && contentItem.articleCategory.id">
                  <item-filter v-model="contentItem.brand" :typeName="'prefilledList'" :preFilledItems="availableBrands" @input="handleSelectedTargetBrand" autoCompleteLabel="Target brand" ></item-filter>
                </v-row>
                <v-row cols="12" sm="12" md="12" v-if="websiteSettings.settings.brandsToBeExcluded && contentItem.articleCategory && contentItem.articleCategory.id">
                  <v-container>
                    <v-text-field
                        value="Search Brands to be EXCLUDED"
                        readonly
                        append-icon="mdi-search-web" @click:append="excludedBrandsVisible = true"
                    ></v-text-field>
                  </v-container>
                </v-row>
                <div v-if="websiteSettings.settings.brandsToBeExcluded" >
                  <content-items-new :load="loadBrands" :responseMapper="mapBrand" @selected='handleAddBrandToExclude' :visible="excludedBrandsVisible" @close="excludedBrandsVisible = false" title="Brands to be EXCLUDED"></content-items-new>
                  <v-row dense cols="12" sm="12" md="12" v-if="contentItem.excludedBrands.length !== 0">
                    <v-col cols="auto" md="auto" sm="auto">
                      Excluded brands:
                    </v-col>
                    <v-col cols="auto" md="auto" sm="auto" v-for="item in contentItem.excludedBrands" :key="item.id">
                      <v-chip
                          close
                          outlined
                          close-icon="mdi-delete"
                          @click:close="handleDeleteBrandToExclude(item)">
                        {{item.name}}
                      </v-chip>
                    </v-col>
                  </v-row>
                  <div  v-if="contentItem.articleCategory && contentItem.articleCategory.id">
                    N.B.: Add Brands for Targeting EXCLUSION purposes only
                  </div>
                </div>
                <div v-if="websiteSettings.settings.contentTag">
                  <v-row cols="12" sm="12" md="12">
                      <v-container>
                          <v-text-field
                                  value="Search Content tag for add"
                                  readonly
                                  append-icon="mdi-search-web" @click:append="contentTagsVisible = true"
                          ></v-text-field>
                      </v-container>
                  </v-row>
                  <content-items-new :load="loadContentTags" :responseMapper="mapContentTag" @selected='handleAddContentTag' :visible="contentTagsVisible" @close="contentTagsVisible = false" title="Content tags"></content-items-new>
                  <v-row dense cols="12" sm="12" md="12" v-if="contentItem.contentTags.length !== 0">
                      <v-col cols="auto" md="auto" sm="auto">
                          Content tags:
                      </v-col>
                      <v-col cols="auto" md="auto" sm="auto" v-for="item in contentItem.contentTags" :key="item.id">
                          <v-chip
                                  close
                                  outlined
                                  close-icon="mdi-delete"
                                  @click:close="handleDeleteContentTag(item)">
                              {{item.name}}
                          </v-chip>
                      </v-col>
                  </v-row>
                </div>
              </div>
            </v-form>
          </v-container>
        </template>
        <template v-slot:2>
          <v-container>
            <v-form ref="contentForm">
              <v-row>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.titleExtra && contentItem"
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    v-model="contentItem.titleExtra"
                    label="Enter Adittional Title"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.intro && contentItem"
                  cols="12"
                  sm="12"
                  md="12"
                  class="pb-0"
                >
                  <v-textarea
                    v-model="contentItem.intro"
                    counter
                    outlined
                    rows="3"
                    label="Enter Intro Text"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.introReferral && contentItem"
                  cols="12"
                  sm="12"
                  md="12"
                  class="pb-0"
                >
                  <v-textarea
                    v-model="contentItem.introReferral"
                    counter
                    outlined
                    rows="3"
                    label="Enter Referral Intro Text"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.useTextSecondary && contentItem"
                  cols="12"
                  sm="12"
                  md="12"
                  class="pb-0">
                  <v-switch
                    v-model="contentMainTextActive"
                    :label="contentMainTextActive ? 'Main Text' : 'Secondary Text to Main Text'"
                    class="mt-0 ml-3"
                    color="primary"
                    inset
                  ></v-switch>
                </v-col>
                <v-col
                  v-if="!contentMainTextActive && websiteSettings && websiteSettings.settings && websiteSettings.settings.mainText && contentItem"
                  cols="12"
                  sm="12"
                  md="12"
                  class="pb-0"
                >
                  <v-combobox
                    v-model="contentItem.mainText"
                    :items="contentItemMainTexts"
                    :search-input.sync="contentItemSecondaryTextSearch"
                    label="Search Text to Main Text"
                  ></v-combobox>
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.mainText && contentItem"
                  cols="12"
                  sm="12"
                  md="12"
                  class="pb-0">
                  <tiptap-vuetify
                    v-model="contentItem.mainText"
                    :extensions="extensionsOfWYSIWYG"
                    :card-props="{ 'min-height': 250, outlined: true }"
                    ref="tiptapEditorElement"
                    placeholder="Enter Main Text"
                  />
                  <div class="maintext-messages">
                    <div class="maintext-rules-error">{{ sections[2].valid ? '' : 'is required' }}</div>
                    <div class="maintext-counter">{{ mainTextSymbolsCounter }}</div>
                  </div>
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.ctaTitle && contentItem"
                  cols="12"
                  sm="12"
                  md="4"
                  class="pb-0">
                  <v-text-field
                    v-model="contentItem.ctaTitle"
                    label="Enter CTA Title"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.ctaSubtitle && contentItem"
                  cols="12"
                  sm="12"
                  md="4"
                  class="pb-0
                  align-items-end"
                >
                  <v-text-field
                    v-model="contentItem.ctaSubTitle"
                    label="Enter CTA Subtitle"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && websiteSettings.settings.ctaBackground && contentItem"
                  cols="12"
                  sm="12"
                  md="4"
                  class="pb-0"
                >
                  <v-text-field
                    v-model="contentItem.ctaBackground"
                    label="Enter CTA Color"
                    class="mt-0 pt-2"
                  >
                    <template v-slot:append>
                      <v-menu v-model="colorPickerActive" top nudge-bottom="105" nudge-left="16" :close-on-content-click="false">
                        <template v-slot:activator="{ on }">
                          <div :style="colorPickerActivatorStyles" v-on="on" />
                        </template>
                        <v-card>
                          <v-card-text class="pa-0">
                            <v-color-picker v-model="contentItem.ctaBackground" flat />
                          </v-card-text>
                        </v-card>
                      </v-menu>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </template>
        <template v-slot:3>
          <v-form ref="imagesForm">
            <v-container mt-0 pt-0>
              <v-dialog v-model="showPreview" max-width="1100" scrollable>
                <v-card>
                  <v-card-title class="headline">Preview</v-card-title>
                  <v-img
                      :src="previewImageUrl"
                      :lazy-src="previewImageUrl"
                      alt="Preview"
                      aspect-ratio="1"
                      class="white--text align-end"
                      @click="previewImageUrl = null"
                  ></v-img>
                  <v-card-actions style="background: white">
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="showPreview = false">Close</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="showSelectImageDialog" transition="dialog-bottom-transition" max-width="550px" hide-overlay :scrollable="true">
                <v-card flat tile class="d-flex" style="height: 100%">
                  <cms-content-item-image-select :cms-content-item-id="contentItem.id" :is-visible="showSelectImageDialog" @imageSelected="handleImageSelected"></cms-content-item-image-select>
                </v-card>
              </v-dialog>
              <v-row  dense
                      style="border-top: 1px solid #d3d3d3"
              >
                <v-col v-if="websiteSettings && websiteSettings.settings && contentItem && websiteSettings.settings.mainImage"
                        class="d-flex child-flex"
                        lg="6"
                        md="6"
                        sm="6"
                        cols="12"
                >
                  <v-img
                          :src="contentItem.mainImage ? contentItem.mainImage : ''"
                          :lazy-src="contentItem.mainImage ? contentItem.mainImage : ''"
                          alt="Main image"
                          aspect-ratio="1"
                          :max-height="contentItem.mainImage ? '300' : '50'"
                          max-width="300"
                          class="white--text align-end"
                          @click="previewImage(contentItem.mainImage)"
                  >
                    <v-card-title>Main image</v-card-title>
                    <template v-slot:placeholder>
                      <v-row v-if="contentItem.mainImage"
                             class="fill-height ma-0"
                              align="center"
                              justify="center"
                      >
                        <v-progress-circular indeterminate color="grey lighten-3"></v-progress-circular>
                      </v-row>
                    </template>
                    <v-btn color="primary" @click.stop="selectMainImage" block>Select main image</v-btn>
                  </v-img>
                </v-col>
                <v-col v-if="websiteSettings && websiteSettings.settings && contentItem && websiteSettings.settings.headerImage"
                        class="d-flex child-flex"
                        lg="6"
                        md="6"
                        sm="6"
                        cols="12"
                >
                  <v-img
                          :src="contentItem.headerImage ? contentItem.headerImage : ''"
                          :lazy-src="contentItem.headerImage ? contentItem.headerImage : ''"
                          alt="Main image"
                          aspect-ratio="1"
                          :max-height="contentItem.headerImage ? '300' : '50'"
                          max-width="300"
                          class="white--text align-end"
                          @click="previewImage(contentItem.headerImage)"
                  >
                    <v-card-title>Header Image</v-card-title>
                    <template v-slot:placeholder>
                      <v-row v-if="contentItem.headerImage"
                             class="fill-height ma-0"
                              align="center"
                              justify="center"
                      >
                        <v-progress-circular indeterminate color="grey lighten-3"></v-progress-circular>
                      </v-row>
                    </template>
                    <v-btn color="primary" @click.stop="selectHeaderImage" block>Select header image</v-btn>
                  </v-img>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </template>
        <template v-slot:4>
          <v-container>
            <v-form ref="seoForm">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="contentItem.seoBrowserTitle"
                    label="Enter SEO & Browser Title*"
                    :rules="[checkRequired]"
                    @input="handleSeoTabChanged"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && contentItem && websiteSettings.settings.seoMetaDescription"
                  cols="12"
                  sm="12"
                  md="12"
                  class="pb-0"
                >
                  <v-textarea
                    v-model="contentItem.seoMetaDescription"
                    counter
                    outlined
                    rows="2"
                    label="Enter SEO Meta description"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="contentItem.url"
                    label="URL"
                    :rules="[checkRequired]"
                    @input="handleSeoTabChanged"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && contentItem && websiteSettings.settings.canonicalUrl"
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    v-model="contentItem.canonicalUrl"
                    label="URL Canonical"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && contentItem && websiteSettings.settings.deprecatedUrl"
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    v-model="contentItem.deprecatedUrl"
                    label="URL Deprecated"
                  />
                </v-col>
                <v-col
                  v-if="websiteSettings && websiteSettings.settings && contentItem && websiteSettings.settings.shortUrl"
                  cols="12"
                  sm="12"
                  md="12"
                >
                  <v-text-field
                    v-model="contentItem.shortUrl"
                    label="URL Short"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </template>
        <template v-slot:5>
          <v-container><Facebook /></v-container>
            </template>
        <template v-slot:6>
          <v-container>
            <v-form ref="referenceForm">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  Reference items <v-icon @click="cmsContentItemForReferenceVisible = true" v-text="'mdi-text-box-plus-outline'"></v-icon>
                  <content-items-new :showGlobalSearch=true :applyCustomForRerference=true :hideHeaders=false :load="loadCmsContentItemForReference" :override-headers="cmsContentItemForReferenceHeaders" :responseMapper="mapCmsContentItemForReference" @selected='handleAddReference' :visible="cmsContentItemForReferenceVisible" @close="cmsContentItemForReferenceVisible = false" title="Add reference"></content-items-new>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-card v-for="reference in contentItem.references" :key="reference.referentCmsContentItemId"
                      class="mx-auto" v-bind:class="[(reference.cmsContentItemId + '_refer_' + reference.referentCmsContentItemId)]"
                      outlined
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <div class="overline mb-4">
                          <v-row>
                            <v-col cols="1" sm="1" md="1">
                              <v-icon style="padding-top: 30px" @click="navigateToItem(reference.referentCmsContentItemId)" v-text="'mdi-clipboard-text-multiple-outline'"></v-icon>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                            <v-switch
                                v-model="reference.referralLink"
                                label="Referral link"
                                @input="handleReferenceTabChanged"
                            />
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-switch label="Direct link" v-model="reference.directLink"></v-switch>
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field v-model="reference.referralRanking" class="ma-2" type="number" label="Referral ranking"></v-text-field>
                            </v-col>
                          </v-row>
                        </div>
                        <v-list-item-title class="headline mb-1">
                          <v-text-field
                            v-model="reference.referralTitle"
                            label="Referral title"
                            @input="handleReferenceTabChanged"
                          />
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <v-text-field
                              v-model="reference.referralTitleAlt"
                              label="Referral title alt"
                              @input="handleReferenceTabChanged"
                          />
                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-avatar
                          tile
                          size="80"
                          color="grey"
                          @click="reference.referralImageUrl ? previewImage(reference.referralImageUrl) : selectReferalImage(reference.cmsContentItemId, reference.referentCmsContentItemId)"
                      >
                        <v-img v-if="reference.referralImageUrl" :src="reference.referralImageUrl">
                          <v-icon style="padding-top: 50px" @click.stop="selectReferalImage" v-text="'mdi-file-document-edit-outline'"></v-icon>
                        </v-img>
                        <v-img v-else src="/img/placeholder-img-4-300x225.jpg" @click="selectReferalImage(reference.cmsContentItemId, reference.referentCmsContentItemId)">
                        </v-img>
                      </v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                      <v-btn small  v-if="contentItem.reverseReferences && contentItem.reverseReferences.filter(value => value.referentCmsContentItemId === reference.cmsContentItemId && value.referentCmsContentItemId === reference.cmsContentItemId).length > 0"
                             @click="scrollToReverse({behavior: 'smooth'}, reference.cmsContentItemId, reference.referentCmsContentItemId)">To reverse reference</v-btn>
                      <v-btn small color="primary" v-else @click="createReverseReference(reference.cmsContentItemId, reference.referentCmsContentItemId)">Create reverse reference</v-btn>
                      <v-btn small color="error" @click="deleteReference(reference.cmsContentItemId, reference.referentCmsContentItemId, false)" text>Delete</v-btn>
                    </v-card-actions>
                  </v-card>

                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  Reverse reference items
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-card v-for="reference in contentItem.reverseReferences" :key="reference.сmsContentItemId"
                          class="mx-auto" v-bind:class="[(reference.cmsContentItemId + '_refer_' + reference.referentCmsContentItemId)]"
                          outlined
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                        <div class="overline mb-4">
                          <v-row>
                            <v-col cols="1" sm="1" md="1">
                              <v-icon style="padding-top: 30px" @click="navigateToItem(reference.cmsContentItemId)" v-text="'mdi-clipboard-text-multiple-outline'"></v-icon>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                              <v-switch
                                  v-model="reference.referralLink"
                                  label="Referral link"
                                  @input="handleReferenceTabChanged"
                              />
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-switch label="Direct link" v-model="reference.directLink"></v-switch>
                            </v-col>
                            <v-col cols="4" sm="4" md="4">
                              <v-text-field v-model="reference.referralRanking" class="ma-2" type="number" label="Referral ranking"></v-text-field>
                            </v-col>
                          </v-row>
                        </div>
                        <v-list-item-title class="headline mb-1">
                          <v-text-field
                              v-model="reference.referralTitle"
                              label="Reverse referral title"
                              @input="handleReferenceTabChanged"
                          />
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          <v-text-field
                              v-model="reference.referralTitleAlt"
                              label="Reverse referral title alt"
                              @input="handleReferenceTabChanged"
                          />

                        </v-list-item-subtitle>
                      </v-list-item-content>

                      <v-list-item-avatar
                          tile
                          size="80"
                          color="grey"
                          @click="reference.referralImageUrl ? previewImage(reference.referralImageUrl) : selectReferalImage(reference.cmsContentItemId, reference.referentCmsContentItemId)"
                      >
                        <v-img v-if="reference.referralImageUrl" :src="reference.referralImageUrl">
                          <v-icon style="padding-top: 50px" @click.stop="selectReferalImage" v-text="'mdi-file-document-edit-outline'"></v-icon>
                        </v-img>
                        <v-img v-else src="/img/placeholder-img-4-300x225.jpg" @click="selectReferalImage(reference.cmsContentItemId, reference.referentCmsContentItemId)">
                        </v-img>
                      </v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                      <v-btn small v-if="contentItem.references && contentItem.references.filter(value => value.cmsContentItemId === reference.referentCmsContentItemId && value.referentCmsContentItemId === reference.cmsContentItemId).length > 0"
                             @click="scrollToReverse({behavior: 'smooth'}, reference.cmsContentItemId, reference.referentCmsContentItemId)">To reference</v-btn>
                      <v-btn small color="primary" v-else @click="createReference(reference.cmsContentItemId, reference.referentCmsContentItemId)">Create reference</v-btn>
                      <v-btn small color="error" @click="deleteReference(reference.cmsContentItemId, reference.referentCmsContentItemId, true)" text>Delete</v-btn>
                    </v-card-actions>
                  </v-card>

                </v-col>
              </v-row>
            </v-form>
          </v-container>
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
</style>
<script>
import ItemFilter from '@/components/ContentItems/ItemFilter'
import ContentItemsNew from '@/components/ContentItems/ContentItemsNew'
import EditComponent from '@/components/EditComponent'
import DateTimePickerCustom from '@/components/DatetimePickerCustom'
import CmsContentItemImageSelect from '@/components/CmsContentItems/CmsContentItemImageSelect'
import ItemType from '../../store/itemType'
import ConfirmDialog from '@/components/ConfirmDialog'
import Facebook from '@/components/Facebook/Facebook'
// WYSIWYG editor
import { TiptapVuetify, Heading, Strike, BulletList, OrderedList, ListItem, History, Image } from 'tiptap-vuetify'

export default {
  props: [ 'editDialog', 'id' ],
  data: () => ({
    contentItem: { title: '', start: null, end: null, jiraIssue: null, author: null, approvedByClient: null, approvedByClic2Connect: null, amp: false, displayOrder: null, active: false, website: null, secondaryWebsites: [], seoBrowserTitle: '', seoMetaDescription: '', url: '', canonicalUrl: '', deprecatedUrl: '', shortUrl: '', brand: { name: null, id: null }, targetAudience: null, productGroup: null, articleCategory: null, excludedBrands: [], contentTags: [], titleExtra: '', intro: '', introReferral: '', useTextSecondary: false, mainText: '', ctaTitle: '', ctaSubTitle: '', ctaBackground: '', references: [], reverseReferences: [] },
    availableWebsites: [],
    availableTargetAudiences: [],
    availableProductGroups: [],
    availableArticleCategories: [],
    availableBrands: [],
    excludedBrandsVisible: false,
    contentTagsVisible: false,
    brandDialogVisible: false,
    cmsContentItemForReferenceVisible: false,
    secondaryWebsitesVisible: false,
    errorMessages: [],
    images: [],
    sections: [{ title: 'Settings', valid: false },
      { title: 'Targeting', valid: true },
      { title: 'Content', valid: false },
      { title: 'Images', valid: true },
      { title: 'SEO', valid: false },
      { title: 'Social Media', valid: true },
      { title: 'References', valid: true }],
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
    colorPickerActive: false,
    manualPublication: false
  }),
  mounted () {
    if (this.availableWebsites.length === 0) {
      this.$store.dispatch('getWebsites').then((data) => {
        this.availableWebsites = data.data.getWebsites
      })
    }
  },
  computed: {
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
    canBePublicated () {
      return this.isSettingsValid && this.isSeoValid && this.isContentValid
    },
    saveDisabled () {
      return this.contentItem.title === null || this.contentItem.title.trim().length === 0
    },
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
    canBePublicated: {
      handler: function (newValue) {
        if (!this.visible) {
          return
        }
        if (!this.manualPublication) {
          this.contentItem.active = newValue
        } else if (!newValue) {
          this.contentItem.active = false
        }
      }
    },
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
          this.$store.dispatch('getCmsContentItemById', idValue).then(response => {
            let item = response.data.getCmsContentItemById
            self.contentItem = Object.assign({}, item)

            if (self.contentItem.amp === null) {
              self.contentItem.amp = true
            }
            if (self.contentItem.website && self.contentItem.website.id) {
              // TODO ATTENTION!! async call to get website settings
              self.handleSelectedWebsite(self.contentItem.website.id, true)
              self.contentMainTextActive = !self.contentItem.useTextSecondary
            } else {
              self.handleSelectedWebsite(null, true)
            }
          })
        } else if (idValue === null) {
          this.contentItem = { title: '', start: null, end: null, jiraIssue: null, author: null, approvedByClient: null, approvedByClic2Connect: null, amp: false, displayOrder: null, active: false, website: null, secondaryWebsites: [], seoBrowserTitle: '', seoMetaDescription: '', url: '', canonicalUrl: '', deprecatedUrl: '', shortUrl: '', brand: { name: null, id: null }, targetAudience: null, productGroup: null, articleCategory: null, excludedBrands: [], contentTags: [], titleExtra: '', intro: '', introReferral: '', useTextSecondary: false, mainText: '', ctaTitle: '', ctaSubTitle: '', ctaBackground: '' }
          this.websiteSettings = null
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
      if (!this.contentItem.start || endAt.length === 0) {
        return true
      } else if (!/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.test(endAt)) {
        return ' Format 2020-12-31 23:00'
      } else if (!this.$moment(endAt).isAfter(this.contentItem.start)) {
        return 'End date/time should be after start date/time'
      } else {
        return true
      }
    },
    close () {
      this.visible = false
    },
    validate (ref) {
      this.$refs[ref].validate()
    },
    validateAll () {
      this.validate('titleForm')
      this.validate('contentForm')
      this.validate('seoForm')
    },
    save (saveFailed) {
      let saveRequest = JSON.parse(JSON.stringify(this.contentItem))
      if (this.contentItem && this.contentItem.start) {
        saveRequest.start = this.contentItem.start instanceof Date ? (this.contentItem.start.toISOString().split('.')[0]) : JSON.parse(JSON.stringify(this.contentItem.start))
      }
      if (this.contentItem && this.contentItem.end) {
        saveRequest.end = this.contentItem.end instanceof Date ? (this.contentItem.end.toISOString().split('.')[0]) : JSON.parse(JSON.stringify(this.contentItem.end))
      }
      if (saveRequest.website) {
        saveRequest.websiteId = saveRequest.website.id
        delete saveRequest.website
      }
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
      if (saveRequest.brand != null) {
        saveRequest.brandId = saveRequest.brand.id
        delete saveRequest.brand
      }
      if (saveRequest.author != null) {
        saveRequest.authorId = saveRequest.author.id
        delete saveRequest.author
      }

      console.log(saveRequest)

      this.$store.dispatch('saveCmsContentItem', saveRequest).then(
        response => {
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
          saveFailed()
        }
      )
    },
    handleSelectedWebsite (item, loading) {
      if (!item) {
        this.sections[0].valid = false
        this.websiteSettings = null
        this.contentItem.website = null
        this.contentItem.secondaryWebsites = []
        this.contentItem.author = null
        this.contentItem.targetAudience = null
        this.contentItem.productGroup = null
        this.contentItem.articleCategory = null
        this.contentItem.brand = null
        this.contentItem.excludedBrands = []
        this.contentItem.approvedByClic2Connect = null
        this.contentItem.approvedByClient = null
        this.contentItem = Object.assign({}, this.contentItem)

        if (loading) {
          this.showEditComponent()
        }
        return
      } else if (this.contentItem.website && item !== this.contentItem.website.id) {
        this.contentItem.targetAudience = null
        this.contentItem.productGroup = null
        this.contentItem.articleCategory = null
        this.contentItem.brand = null
        this.contentItem.excludedBrands = []
      }
      this.$store.dispatch('getWebsiteById', item).then((data) => {
        let websiteById = data.data.getWebsiteById
        this.websiteSettings = Object.assign({}, websiteById)
        this.loadContentMainTexts(websiteById.id)
        if (loading) {
          this.handleContentTabChanged(this.contentItem.mainText ? this.contentItem.mainText.length : 0)
          this.handleSeoTabChanged()
          this.showEditComponent()
          return
        }
        let website = { id: websiteById.id, name: websiteById.name }
        this.contentItem.website = website
        this.contentItem.secondaryWebsites = []
        this.contentItem.author = null
        this.contentItem = Object.assign({}, this.contentItem)
        this.handleSettingTabChanged()
      })
      this.$store.dispatch('getTargetAudiencesForWebsite', item).then((data) => {
        this.availableTargetAudiences = data.data.getTargetAudiencesForWebsite
      })
    },
    showEditComponent () {
      this.handleSettingTabChanged()
      this.manualPublication = this.canBePublicated && !this.contentItem.active
      this.$nextTick(function () {
        this.visible = true
        this.validateAll()
      })
    },
    handleSelectedAuthor (item) {
      if (item) {
        this.$store.dispatch('getAuthorById', item).then((data) => {
          let authorById = data.data.getAuthorById

          let authorObj = Object()
          authorObj.name = authorById.name
          authorObj.id = authorById.id
          this.contentItem.author = authorObj
          this.contentItem = Object.assign({}, this.contentItem)
        })
      } else {
        this.contentItem.author = null
        this.contentItem = Object.assign({}, this.contentItem)
      }
    },
    handleSettingTabChanged () {
      this.sections[0].valid = this.isSettingsValid
    },
    handleContentTabChanged (symbolsQuantity) {
      this.sections[2].valid = symbolsQuantity ? this.isContentValid : false
    },
    handleSeoTabChanged () {
      this.sections[4].valid = this.isSeoValid
    },
    handleReferenceTabChanged () {
      this.sections[6].valid = this.isReferenceValid()
    },
    loadContentMainTexts (websiteId) {
      this.$store.dispatch('searchCmsContentItemMainTextByWebsite', { websiteId }).then(mainTexts => {
        this.contentItemMainTexts = mainTexts.data.searchCmsContentItemMainTextByWebsiteAndSearchPhrase
      })
    },
    handleSelectedTargetAudience (item, loading) {
      if (item) {
        this.$store.dispatch('getTargetAudienceById', item).then((data) => {
          let targetAudienceById = data.data.getTargetAudienceById
          this.$store.dispatch('getProductGroupForWebsiteByTargetAudience', { websiteId: this.contentItem.website.id, targetAudienceId: item }).then((data) => {
            this.availableProductGroups = data.data.getProductGroupForWebsiteByTargetAudience
          })
          if (loading) {
            return
          }

          let targetAudienceObj = Object()
          targetAudienceObj.name = targetAudienceById.name
          targetAudienceObj.id = targetAudienceById.id
          targetAudienceObj.srcUuid = targetAudienceById.srcUuid
          this.contentItem.targetAudience = targetAudienceObj
          this.contentItem.productGroup = null
          this.contentItem.articleCategory = null
          this.contentItem.brand = null
          this.contentItem.excludedBrands = []
          this.contentItem = Object.assign({}, this.contentItem)
        })
      } else {
        this.availableArticleCategories = []
        this.availableProductGroups = []
        this.contentItem.excludedBrands = []
        this.contentItem.brand = null
        this.contentItem = Object.assign({}, this.contentItem)
      }
    },
    handleSelectedProductGroup (item, loading) {
      if (item) {
        this.$store.dispatch('getProductGroupById', item).then((data) => {
          let productGroupById = data.data.getProductGroupById
          this.$store.dispatch('getArticleCategoryForWebshopByProductGroup', { websiteId: this.contentItem.website.id, productGroupId: item }).then((data) => {
            this.availableArticleCategories = data.data.getArticleCategoryForWebshopByProductGroup
          })

          if (loading) {
            return
          }

          let productGroupObj = Object()
          productGroupObj.name = productGroupById.name
          productGroupObj.id = productGroupById.id
          productGroupObj.srcUuid = productGroupById.srcUuid
          this.contentItem.productGroup = productGroupObj
          this.contentItem.articleCategory = null
          this.contentItem.brand = null
          this.contentItem.excludedBrands = []
          this.contentItem = Object.assign({}, this.contentItem)
        })
      } else {
        this.availableArticleCategories = []
        this.contentItem.brand = null
        this.contentItem.excludedBrands = []
        this.contentItem = Object.assign({}, this.contentItem)
      }
    },
    handleSelectedArticleCategory (item) {
      if (item) {
        this.$store.dispatch('getArticleCategoryById', item).then((data) => {
          let articleCategoryById = data.data.getArticleCategoryById
          let previousArticleCategoryId = this.contentItem.articleCategory ? this.contentItem.articleCategory.id : null
          this.contentItem.articleCategory = { name: articleCategoryById.name, id: articleCategoryById.id, srcUuid: articleCategoryById.srcUuid }
          if (previousArticleCategoryId !== articleCategoryById.id) {
            this.contentItem.excludedBrands = []
            this.contentItem.brand = null
          }
          this.contentItem = Object.assign({}, this.contentItem)
        })
        let search = {}
        search.articleCategoryId = item
        this.$store.dispatch('getBrands', { search: search, limit: 1000, offset: 0 }).then(response => {
          let data = this.mapBrand(response)
          this.availableBrands = data.content.map(item => {
            return { id: item.id, name: item.name }
          })
        })
      } else {
        this.contentItem.brand = null
        this.contentItem.excludedBrands = []
        this.availableBrands = []
        this.contentItem = Object.assign({}, this.contentItem)
      }
    },
    handleSelectedTargetBrand (item) {
      if (!item) {
        this.contentItem.brand = null
      } else {
        this.contentItem.brand = this.availableBrands.filter(brand => brand.id === item)[0]
      }
      this.contentItem = Object.assign({}, this.contentItem)
    },
    handleAddBrandToExclude (item) {
      let existedBrands = this.contentItem.excludedBrands.filter(function (brandToExclude) {
        return brandToExclude.id === item.id
      })
      if (existedBrands.length !== 0) {
        // brand already excluded
        return
      }
      let brandToExclude = Object()
      brandToExclude.id = item.id
      brandToExclude.name = item.name
      this.contentItem.excludedBrands.push(brandToExclude)
      this.contentItem = Object.assign({}, this.contentItem)
    },
    handleAddContentTag (item) {
      let existedTags = this.contentItem.contentTags.filter(function (tag) {
        return tag.id === item.id
      })
      if (existedTags.length !== 0) {
        // tag already added
        return
      }
      let contentTag = Object()
      contentTag.id = item.id
      contentTag.name = item.name
      this.contentItem.contentTags.push(contentTag)
      this.contentItem = Object.assign({}, this.contentItem)
    },
    handleAddReference (item) {
      let existedReference = this.contentItem.references.filter(function (ref) {
        return ref.referentCmsContentItemId === item.id
      })
      if (existedReference.length !== 0) {
        // ref already added
        return
      }
      let newReference = Object()
      newReference.id = this.contentItem.id
      newReference.referralLink = true
      newReference.directLink = true
      newReference.referralRanking = 0
      newReference.referentCmsContentItemId = item.id
      this.contentItem.references.push(newReference)
      this.contentItem = Object.assign({}, this.contentItem)
    },
    handleDeleteBrandToExclude (item) {
      this.contentItem.excludedBrands = this.contentItem.excludedBrands.filter(function (brandToExclude) {
        return brandToExclude.id !== item.id
      })
      this.contentItem = Object.assign({}, this.contentItem)
    },
    handleDeleteContentTag (item) {
      this.contentItem.contentTags = this.contentItem.contentTags.filter(function (tag) {
        return tag.id !== item.id
      })
      this.contentItem = Object.assign({}, this.contentItem)
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
      var searchPattern = Object.assign({}, search)
      let self = this
      Object.keys(searchPattern).forEach(key => {
        let val = searchPattern[key]
        if (val === '' || key === 'start' || key === 'end') {
          delete searchPattern[key]
        } else {
          delete searchPattern[key]
          Object.assign(searchPattern, self.pathToObject({}, key, val))
        }
      })
      // Here should be used also self.contentItem.website.id in additional when will implement DC-310
      return self.$store.dispatch('loadCmsContentItemPage', { sortPattern: {}, additional: {}, searchPattern: searchPattern, pageable: { size: limit, offset: offset } })
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
    handleAddSecondaryWebsite (item) {
      let existedWebsites = this.contentItem.secondaryWebsites.filter(function (website) {
        return website.id === item.id
      })
      if (existedWebsites.length !== 0) {
        // website already added
        return
      }
      let website = Object()
      website.id = item.id
      website.name = item.name
      this.contentItem.secondaryWebsites.push(website)
      this.contentItem = Object.assign({}, this.contentItem)
    },
    handleDeleteSecondaryWebsite (item) {
      this.contentItem.secondaryWebsites = this.contentItem.secondaryWebsites.filter(function (website) {
        return website.id !== item.id
      })
      this.contentItem = Object.assign({}, this.contentItem)
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
    deleteReference (id, referentId, isReversed) {
      this.$refs.confirmDialog.open('Delete', 'Are you sure to delete this reference?').then(confirm => {
        if (confirm) {
          if (!isReversed) {
            this.contentItem.references = this.contentItem.references.filter(value => value.cmsContentItemId !== id || value.referentCmsContentItemId !== referentId)
          } else {
            this.contentItem.reverseReferences = this.contentItem.reverseReferences.filter(value => value.cmsContentItemId !== id || value.referentCmsContentItemId !== referentId)
          }
        }
      })
    },
    scrollToReverse (options, id, referentId) {
      const el = document.getElementsByClassName(referentId + '_refer_' + id)[0]
      if (el) {
        el.scrollIntoView(options)
      }
    },
    createReverseReference (id, referentId) {
      this.contentItem.reverseReferences.push({
        cmsContentItemId: referentId,
        referentCmsContentItemId: id,
        referralLink: null,
        referralTitle: null,
        referralTitleAlt: null,
        referralImageUrl: null,
        referralRanking: null,
        directLink: true
      })
      this.$nextTick(function () {
        this.scrollToReverse(null, referentId, id)
      })
    },
    createReference (id, referentId) {
      this.contentItem.references.push({
        cmsContentItemId: referentId,
        referentCmsContentItemId: id,
        referralLink: true,
        referralTitle: null,
        referralTitleAlt: null,
        referralImageUrl: null,
        referralRanking: null,
        directLink: true
      })
      this.$nextTick(function () {
        this.scrollToReverse(null, referentId, referentId)
      })
    },
    cmsContentItemForReferenceHeaders () {
      return [
        {
          text: 'id',
          value: 'id',
          title: 'ID'
        }, {
          text: 'Target Audience', value: 'targetAudience.name', title: 'Select', searchValue: 'targetAudience.name', typeId: ItemType.Target_Audience
        }, {
          text: 'Product Group', value: 'productGroup.name', title: 'Select', searchValue: 'productGroup.id', typeId: ItemType.Product_Group
        }, {
          text: 'Brand', value: 'brand.name', title: 'Select', searchValue: 'brand.id', typeId: ItemType.Brand
        }, {
          text: 'Article Category', value: 'articleCategory.name', searchValue: 'articleCategory.id', title: 'Select', typeId: ItemType.Article_Category
        }, {
          text: 'Main Text', value: 'mainText', title: 'Select'
        }, {
          text: 'URL', value: 'url', title: 'Select'
        }, {
          text: 'SEO Browser Title', value: 'seoBrowserTitle', title: 'Select'
        }, {
          text: 'Additional Text Title', value: 'secondary', title: 'Select'
        }, {
          text: 'Main Website', value: 'website.name', title: 'Select'
        }, {
          text: 'Active', value: 'active', title: 'Select', filterable: false, filter: null, isHideFilter: true
        }
      ]
    },
    navigateToItem (id) {
      let routeData = this.$router.resolve({ name: 'cmsContentItems', query: { id: id } })
      window.open(routeData.href, '_blank')
    }
  },

  components: {
    ContentItemsNew,
    ItemFilter,
    Facebook,
    EditComponent,
    DateTimePickerCustom,
    CmsContentItemImageSelect,
    TiptapVuetify,
    ConfirmDialog
  }
}

</script>
