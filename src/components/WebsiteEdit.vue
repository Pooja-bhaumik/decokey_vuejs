<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container>
    <v-dialog v-model="editDialog" persistent transition="dialog-bottom-transition" max-width="850px" :scrollable="true">
      <edit-component
          dialog-title="message.editWebsite"
          :sections="sections"
          @close="close"
          @save="save"
          :visible="visible"
          :saveDisabled="saveDisabled">

        <template v-slot:header>
          <v-col cols="12" sm="12" md="12">
            <v-form ref="titleForm">
              <v-text-field v-model="website.name"
                            @change="validate('titleForm')"
                            label="Title"
                            required
                            :rules="[checkRequired]"
              ></v-text-field>
            </v-form>
          </v-col>
        </template>

        <template v-slot:0>
          <v-form ref="settingsForm" v-model="sections[0].valid">
            <v-container mt-0 pt-0>
              <v-tabs
                  :show-arrows="true"
                  v-model="currentTabItem">
                <v-tab v-for="(section, position) in contentSections" :key="`content-${position}`" :href="`#content-${position}`">
                  <v-badge color="red lighten-1" overlap class="validationBadge" >
                    <span slot="default">{{ section.title }}</span>
                  </v-badge>
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="currentTabItem">
                <v-tab-item key="content-0" value='content-0' :eager="true">
                  <v-row dense>
                    <v-col cols="12">
                      <v-text-field v-model="website.url"
                                    label="Url"
                                    required
                                    :rules="[checkRequired]"
                                    @change="validate('settingsForm')"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.jiraIssue"
                          label="Jira Issue"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.author"
                          label="Author"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.approvedByClient"
                          label="Approved by client"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.approvedByClic2Connect"
                          label="Approved by c2c"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.amp"
                          label="AMP"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.displayOrder"
                          label="Display order"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item key="content-1" value='content-1' :eager="true">
                  <v-row dense>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.targetAudience"
                          label="Target Audience"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details
                          @change='handleTargetAudienceSettingChanged'></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.productGroup"
                          label="Product Group"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details
                          @change='handleProductGroupSettingChanged'></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.articleCategory"
                          label="Article Category"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details
                          @change='handleArticleCategorySettingChanged'></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.brand"
                          label="Target Brand"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.brandsToBeExcluded"
                          label="Brands To be Excluded"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.contentTag"
                          label="Content Tag"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.storeBranch"
                          label="Store Branch"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item key="content-2" value='content-2' :eager="true">
                  <v-row dense>
                    <v-col cols="6">
                      <v-switch
                              v-model="website.settings.titleExtra"
                              label="Additional Text Title"
                              class="mt-0"
                              color="primary"
                              inset
                              hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                              v-model="website.settings.intro"
                              label="Intro Text"
                              class="mt-0"
                              color="primary"
                              inset
                              hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                              v-model="website.settings.mainText"
                              label="Main Text"
                              class="mt-0"
                              color="primary"
                              inset
                              hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                              v-model="website.settings.secondary"
                              label="Secondary Text"
                              class="mt-0"
                              color="primary"
                              inset
                              hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                              v-model="website.settings.useTextSecondary"
                              label="Secondary to next Main Text"
                              class="mt-0"
                              color="primary"
                              inset
                              hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                              v-model="website.settings.introReferral"
                              label="Referral Intro Text"
                              class="mt-0"
                              color="primary"
                              inset
                              hide-details></v-switch>
                    </v-col>
                  <v-col cols="6">
                    <v-switch
                        v-model="website.settings.ctaTitle"
                        label="CTA Title"
                        class="mt-0"
                        color="primary"
                        inset
                        hide-details></v-switch>
                  </v-col>
                  <v-col cols="6">
                    <v-switch
                        v-model="website.settings.ctaSubtitle"
                        label="CTA Subtitle"
                        class="mt-0"
                        color="primary"
                        inset
                        hide-details></v-switch>
                  </v-col>
                  <v-col cols="6">
                    <v-switch
                        v-model="website.settings.ctaBackground"
                        label="CTA Background Color"
                        class="mt-0"
                        color="primary"
                        inset
                        hide-details></v-switch>
                  </v-col>
                  </v-row>
                </v-tab-item>
                <v-tab-item key="content-3" value='content-3' :eager="true">
                  <v-row dense>
                  <v-col cols="6">
                    <v-switch
                        v-model="website.settings.mainImage"
                        label="Main Image"
                        class="mt-0"
                        color="primary"
                        inset
                        hide-details></v-switch>
                  </v-col>
                  <v-col cols="6">
                    <v-switch
                        v-model="website.settings.headerImage"
                        label="Header Image"
                        class="mt-0"
                        color="primary"
                        inset
                        hide-details></v-switch>
                  </v-col>
                </v-row>
                </v-tab-item>
                <v-tab-item key="content-4" value='content-4' :eager="true">
                  <v-row dense>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.seoMetaDescription"
                          label="SEO Meta Description"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.canonicalUrl"
                          label="URL Canonical"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.deprecatedUrl"
                          label="URL Deprecated"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                    <v-col cols="6">
                      <v-switch
                          v-model="website.settings.shortUrl"
                          label="URL Short"
                          class="mt-0"
                          color="primary"
                          inset
                          hide-details></v-switch>
                    </v-col>
                  </v-row>
                </v-tab-item>
              </v-tabs-items>
            </v-container>
          </v-form>
        </template>
        <template v-slot:1>
          <v-container>
              <switchable-data-table
                  :load='loadUsers' :items-on="website.users"
                  :responseMapper='mapUser'
                  :nameMapper='mapUserName'
                  @changed='handleUserChanged'></switchable-data-table>
          </v-container>
        </template>
        <template v-slot:2>
          <v-container>
              <switchable-data-table
                  :load='loadAuthors' :items-on="website.authors"
                  :responseMapper='mapAuthor'
                  @changed='handleAuthorChanged'></switchable-data-table>
          </v-container>
        </template>
        <template v-slot:3>
          <v-container>
              <switchable-data-table
                  :load='loadTargetAudiences' :items-on="website.targetAudiences"
                  :responseMapper='mapTargetAudience'
                  @changed='handleTargetAudienceChanged'></switchable-data-table>
          </v-container>
        </template>
        <template v-slot:4>
          <v-container>
              <switchable-data-table
                  :load='loadProductGroups' :items-on="website.productGroups"
                  :responseMapper='mapProductGroup'
                  @changed='handleProductGroupChanged'></switchable-data-table>
          </v-container>
        </template>
        <template v-slot:5>
          <v-container>
              <switchable-data-table
                  :load='loadArticleCategories' :items-on="website.articleCategories"
                  :responseMapper='mapArticleCategory'
                  @changed='handleArticleCategoryChanged'></switchable-data-table>
          </v-container>
        </template>
        <template v-slot:6>
          <v-container>
              <switchable-data-table
                  :load='loadBrands' :items-on="website.brands"
                  :responseMapper='mapBrand'
                  @changed='handleBrandChanged'></switchable-data-table>
          </v-container>
        </template>
        <template v-slot:7>
          <v-container>
              <switchable-data-table
                  :load='loadContentTags' :items-on="website.contentTags"
                  :responseMapper='mapContentTag'
                  @changed='handleContentTagChanged'></switchable-data-table>
          </v-container>
        </template>
        <template v-slot:8>
          <v-container>
              <switchable-data-table
                  :load='loadBranches' :items-on="website.branches"
                  :responseMapper='mapBranch'
                  @changed='handleBranchChanged'></switchable-data-table>
          </v-container>
        </template>
        <!-- Changes for Related websites -->
        <template v-slot:9>
          <v-container>
              <switchable-data-table
                  :load='loadRelatedWebsites' :items-on="website.relatedWebsites"
                  :responseMapper='mapRelatedWebsites'
                  @changed='handleRelatedWebsitesChanged'></switchable-data-table>
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
</style>
<script>
import EditComponent from '@/components/EditComponent'
import SwitchableDataTable from '@/components/SwitchableDataTable'

export default {
  props: [ 'editDialog', 'id' ],
  data: () => ({
    website: {
      url: null,
      name: '',
      settings: { jiraIssue: true, author: true, approvedByClient: true, approvedByClic2Connect: true, amp: true, displayOrder: true, targetAudience: true, productGroup: true, articleCategory: true, brand: true, brandsToBeExcluded: true, contentTag: true, storeBranch: true, titleExtra: true, intro: true, mainText: true, secondary: true, useTextSecondary: true, introReferral: true, ctaTitle: true, ctaSubtitle: true, ctaBackground: true, mainImage: true, headerImage: true, seoMetaDescription: true, canonicalUrl: true, deprecatedUrl: true, shortUrl: true },
      users: [],
      authors: [],
      targetAudiences: [],
      productGroups: [],
      articleCategories: [],
      brands: [],
      contentTags: [],
      branches: [],
      relatedWebsites: []
    },
    requiredRules: [
      v => !!v || ' is required'
    ],
    errorMessages: [],
    sections: [{ title: 'Content', valid: false },
      { title: 'Users', valid: true },
      { title: 'Authors', valid: true },
      { title: 'Target audiences', valid: true },
      { title: 'Product groups', valid: true },
      { title: 'Article categories', valid: true },
      { title: 'Brands', valid: true },
      { title: 'Content Tags', valid: true },
      { title: 'Store Branches', valid: true },
      { title: 'Related Website', valid: true }
    ],
    contentSections: [{ title: 'Settings' },
      { title: 'Targeting' },
      { title: 'Content' },
      { title: 'Images' },
      { title: 'SEO' }],
    visible: false,
    currentTabItem: 'content-0'
  }),
  computed: {
    currentTab () {
      if (this.currentTabItem) {
        return this.currentTabItem.substring('content-'.length, this.currentTabItem.length)
      }
      return null
    },
    saveDisabled () {
      return this.website.name === null || this.website.name.trim().length === 0
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
    id: {
      handler: function (idValue, oldIdValue) {
        if (idValue) {
          let self = this
          this.$store.dispatch('getWebsiteById', idValue).then(response => {
            self.website = Object.assign({}, response.data.getWebsiteById)
            if (!self.website.settings) {
              self.website.settings = { jiraIssue: true, author: true, approvedByClient: true, approvedByClic2Connect: true, amp: true, displayOrder: true, targetAudience: true, productGroup: true, articleCategory: true, brand: true, brandsToBeExcluded: true, contentTag: true, storeBranch: true, titleExtra: true, intro: true, mainText: true, secondary: true, useTextSecondary: true, introReferral: true, ctaTitle: true, ctaSubtitle: true, ctaBackground: true, mainImage: true, headerImage: true, seoMetaDescription: true, canonicalUrl: true, deprecatedUrl: true, shortUrl: true }
            } else {
              if (self.website.settings.jiraIssue === null) {
                self.website.settings.jiraIssue = true
              }
              if (self.website.settings.author === null) {
                self.website.settings.author = true
              }
              if (self.website.settings.approvedByClient === null) {
                self.website.settings.approvedByClient = true
              }
              if (self.website.settings.approvedByClic2Connect === null) {
                self.website.settings.approvedByClic2Connect = true
              }
              if (self.website.settings.amp === null) {
                self.website.settings.amp = true
              }
              if (self.website.settings.displayOrder === null) {
                self.website.settings.displayOrder = true
              }
              if (self.website.settings.targetAudience === null) {
                self.website.settings.targetAudience = true
              }
              if (self.website.settings.productGroup === null) {
                self.website.settings.productGroup = true
              }
              if (self.website.settings.articleCategory === null) {
                self.website.settings.articleCategory = true
              }
              if (self.website.settings.brand === null) {
                self.website.settings.brand = true
              }
              if (self.website.settings.brandsToBeExcluded === null) {
                self.website.settings.brandsToBeExcluded = true
              }
              if (self.website.settings.contentTag === null) {
                self.website.settings.contentTag = true
              }
              if (self.website.settings.storeBranch === null) {
                self.website.settings.storeBranch = true
              }
              if (self.website.settings.titleExtra === null) {
                self.website.settings.titleExtra = true
              }
              if (self.website.settings.intro === null) {
                self.website.settings.intro = true
              }
              if (self.website.settings.mainText === null) {
                self.website.settings.mainText = true
              }
              if (self.website.settings.secondary === null) {
                self.website.settings.secondary = true
              }
              if (self.website.settings.useTextSecondary === null) {
                self.website.settings.useTextSecondary = true
              }
              if (self.website.settings.introReferral === null) {
                self.website.settings.introReferral = true
              }
              if (self.website.settings.ctaTitle === null) {
                self.website.settings.ctaTitle = true
              }
              if (self.website.settings.ctaSubtitle === null) {
                self.website.settings.ctaSubtitle = true
              }
              if (self.website.settings.ctaBackground === null) {
                self.website.settings.ctaBackground = true
              }
              if (self.website.settings.mainImage === null) {
                self.website.settings.mainImage = true
              }
              if (self.website.settings.headerImage === null) {
                self.website.settings.headerImage = true
              }
              if (self.website.settings.seoMetaDescription === null) {
                self.website.settings.seoMetaDescription = true
              }
              if (self.website.settings.canonicalUrl === null) {
                self.website.settings.canonicalUrl = true
              }
              if (self.website.settings.deprecatedUrl === null) {
                self.website.settings.deprecatedUrl = true
              }
              if (self.website.settings.shortUrl === null) {
                self.website.settings.shortUrl = true
              }
            }
            self.website = Object.assign({}, self.website)
            this.$nextTick(function () {
              this.visible = true
              this.validateAll()
            })
          })
        } else if (idValue === null) {
          this.website = {
            url: null,
            name: '',
            settings: { jiraIssue: true, author: true, approvedByClient: true, approvedByClic2Connect: true, amp: true, displayOrder: true, targetAudience: true, productGroup: true, articleCategory: true, brand: true, brandsToBeExcluded: true, contentTag: true, storeBranch: true, titleExtra: true, intro: true, mainText: true, secondary: true, useTextSecondary: true, introReferral: true, ctaTitle: true, ctaSubtitle: true, ctaBackground: true, mainImage: true, headerImage: true, seoMetaDescription: true, canonicalUrl: true, deprecatedUrl: true, shortUrl: true },
            users: [],
            authors: [],
            targetAudiences: [],
            productGroups: [],
            articleCategories: [],
            brands: [],
            contentTags: [],
            branches: [],
            relatedWebsites: []
          }
          this.website = Object.assign({}, this.website)
          this.$nextTick(function () {
            this.visible = true
            this.validateAll()
          })
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
    close () {
      this.visible = false
    },
    validate (ref) {
      this.$refs[ref].validate()
    },
    validateAll () {
      this.validate('titleForm')
      this.validate('settingsForm')
    },
    save (saveFailed) {
      let saveRequest = JSON.parse(JSON.stringify(this.website))

      this.$store.dispatch('saveWebsite', saveRequest).then(
        response => {
          if (response.data.saveWebsite.errors && response.data.saveWebsite.errors.length > 0) {
            this.errorMessages = response.data.saveWebsite.errors
          } else {
            if (response.data.saveWebsite.id) {
              this.$root.$emit('infoMessage', 'Saved')
              this.$emit('websiteSaved')
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
    loadUsers ({ search, limit, offset }) {
      let contentManagerUserSearch = Object()
      if (search.name) {
        contentManagerUserSearch.username = search.name
      }
      if (search.id) {
        contentManagerUserSearch.id = search.id
      }
      contentManagerUserSearch.enabled = true
      contentManagerUserSearch.authorities = Object()
      contentManagerUserSearch.authorities.authority = 'ROLE_CONTENT_MANAGER'

      search = Object.assign({}, contentManagerUserSearch)
      return this.$store.dispatch('loadWebsiteUsers', { search, limit, offset })
    },
    mapUser (response) {
      return response.data.getAppUserPage
    },
    mapUserName (item) {
      return item.username
    },
    handleUserChanged (user) {
      let userExist = this.website.users.some(item => item.id === user.id)
      if (!userExist) {
        let userObj = { id: user.id, username: user.name, enabled: true }
        this.website.users.push(userObj)
      } else {
        this.website.users = this.website.users.filter(function (userToDelete) {
          return userToDelete.id !== user.id
        })
      }
      this.website = Object.assign({}, this.website)
    },
    loadAuthors ({ search, limit, offset }) {
      return this.$store.dispatch('loadWebsiteAuthors', { search, limit, offset })
    },
    mapAuthor (response) {
      return response.data.getAuthorPage
    },
    handleAuthorChanged (author) {
      let authorExist = this.website.authors.some(item => item.id === author.id)
      if (!authorExist) {
        let authorObj = { id: author.id, name: author.name }
        this.website.authors.push(authorObj)
      } else {
        this.website.authors = this.website.authors.filter(function (authorToDelete) {
          return authorToDelete.id !== author.id
        })
      }
      this.website = Object.assign({}, this.website)
    },
    handleTargetAudienceSettingChanged (on) {
      this.website.settings.productGroup = on
      this.handleProductGroupSettingChanged(on)
    },
    handleProductGroupSettingChanged (on) {
      this.website.settings.articleCategory = on
      this.handleArticleCategorySettingChanged(on)
    },
    handleArticleCategorySettingChanged (on) {
      this.website.settings.brand = on
      this.website.settings.brandsToBeExcluded = on
      this.website.settings.contentTag = on
      this.website.settings.storeBranch = on
      this.website = Object.assign({}, this.website)
    },
    loadTargetAudiences ({ search, limit, offset }) {
      return this.$store.dispatch('loadWebsiteTargetAudiences', { search, limit, offset })
    },
    mapTargetAudience (response) {
      return response.data.getTargetAudiencePage
    },
    handleTargetAudienceChanged (targetAudience) {
      let targetAudienceExist = this.website.targetAudiences.some(item => item.id === targetAudience.id)
      if (!targetAudienceExist) {
        let targetAudienceObj = { id: targetAudience.id, name: targetAudience.name }
        this.website.targetAudiences.push(targetAudienceObj)
        this.addProductGroups(targetAudience)
      } else {
        this.website.targetAudiences = this.website.targetAudiences.filter(function (targetAudienceToDelete) {
          return targetAudienceToDelete.id !== targetAudience.id
        })
        this.removeProductGroups(targetAudience)
      }
    },
    removeProductGroups (targetAudience) {
      this.$store.dispatch('getTargetAudienceById', targetAudience.id).then((data) => {
        let targetAudienceById = data.data.getTargetAudienceById
        let productGroups = targetAudienceById.productGroups
        let productGroupIds = productGroups.map((item) => item.id)
        this.website.productGroups = this.website.productGroups.filter(item => productGroupIds.every((productGroupId) => item.id !== productGroupId))
        productGroups.forEach(productGroup => this.removeArticleCategories(productGroup))
      })
    },
    addProductGroups (targetAudience) {
      this.$store.dispatch('getTargetAudienceById', targetAudience.id).then((data) => {
        let targetAudienceById = data.data.getTargetAudienceById
        let productGroups = targetAudienceById.productGroups
        productGroups.forEach((productGroup) => {
          this.website.productGroups.push(productGroup)
          this.addArticleCategories(productGroup)
        })
      })
    },
    loadProductGroups ({ search, limit, offset }) {
      return this.$store.dispatch('loadWebsiteProductGroups', { search, limit, offset })
    },
    mapProductGroup (response) {
      return response.data.getProductGroupPage
    },
    handleProductGroupChanged (productGroup) {
      let productGroupExist = this.website.productGroups.some(item => item.id === productGroup.id)
      if (!productGroupExist) {
        let productGroupObj = { id: productGroup.id, name: productGroup.name }
        this.website.productGroups.push(productGroupObj)
        this.addArticleCategories(productGroup)
      } else {
        this.website.productGroups = this.website.productGroups.filter(function (productGroupToDelete) {
          return productGroupToDelete.id !== productGroup.id
        })
        this.removeArticleCategories(productGroup)
      }
    },
    removeArticleCategories (productGroup) {
      this.$store.dispatch('getProductGroupById', productGroup.id).then((data) => {
        let productGroupById = data.data.getProductGroupById
        let articleCategories = productGroupById.articleCategories
        let articleCategoryIds = articleCategories.map((item) => item.id)
        this.website.articleCategories = this.website.articleCategories.filter(item => articleCategoryIds.every((articleCategoryId) => item.id !== articleCategoryId))
        articleCategories.forEach(articleCategory => {
          this.removeBrands(articleCategory)
        })
      })
    },
    addArticleCategories (productGroup) {
      this.$store.dispatch('getProductGroupById', productGroup.id).then((data) => {
        let productGroupById = data.data.getProductGroupById
        let articleCategories = productGroupById.articleCategories
        articleCategories.forEach((articleCategory) => {
          this.website.articleCategories.push(articleCategory)
          this.addBrands(articleCategory)
        })
      })
    },
    loadArticleCategories ({ search, limit, offset }) {
      return this.$store.dispatch('loadWebsiteArticleCategories', { search, limit, offset })
    },
    mapArticleCategory (response) {
      return response.data.getArticleCategoryPage
    },
    handleArticleCategoryChanged (articleCategory) {
      let articleCategoryExist = this.website.articleCategories.some(item => item.id === articleCategory.id)
      if (!articleCategoryExist) {
        let articleCategoryObj = { id: articleCategory.id, name: articleCategory.name }
        this.website.articleCategories.push(articleCategoryObj)
        this.addBrands(articleCategory)
      } else {
        this.website.articleCategories = this.website.articleCategories.filter(function (articleCategoryToDelete) {
          return articleCategoryToDelete.id !== articleCategory.id
        })
        this.removeBrands(articleCategory)
      }
    },
    removeBrands (articleCategory) {
      this.$store.dispatch('getArticleCategoryById', articleCategory.id).then((data) => {
        let articleCategoryById = data.data.getArticleCategoryById
        let brands = articleCategoryById.brands
        let brandIds = brands.map((item) => item.id)
        this.website.brands = this.website.brands.filter(item => brandIds.every((brandId) => item.id !== brandId))
        this.website = Object.assign({}, this.website)
      })
    },
    addBrands (articleCategory) {
      this.$store.dispatch('getArticleCategoryById', articleCategory.id).then((data) => {
        let articleCategoryById = data.data.getArticleCategoryById
        let brands = articleCategoryById.brands
        brands.forEach((brand) => {
          this.website.brands.push(brand)
        })
        this.website = Object.assign({}, this.website)
      })
    },
    loadBrands ({ search, limit, offset }) {
      return this.$store.dispatch('loadWebsiteBrands', { search, limit, offset })
    },
    mapBrand (response) {
      return response.data.getBrandPage
    },
    handleBrandChanged (brand) {
      let brandExist = this.website.brands.some(item => item.id === brand.id)
      if (!brandExist) {
        let brandObj = { id: brand.id, name: brand.name }
        this.website.brands.push(brandObj)
      } else {
        this.website.brands = this.website.brands.filter(function (brandToDelete) {
          return brandToDelete.id !== brand.id
        })
      }
      this.website = Object.assign({}, this.website)
    },
    loadContentTags ({ search, limit, offset }) {
      return this.$store.dispatch('loadWebsiteContentTags', { search, limit, offset })
    },
    mapContentTag (response) {
      return response.data.getContentTagPage
    },
    handleContentTagChanged (contentTag) {
      let contentTagExist = this.website.contentTags.some(item => item.id === contentTag.id)
      if (!contentTagExist) {
        let contentTagObj = { id: contentTag.id, name: contentTag.name }
        this.website.contentTags.push(contentTagObj)
      } else {
        this.website.contentTags = this.website.contentTags.filter(function (contentTagToDelete) {
          return contentTagToDelete.id !== contentTag.id
        })
      }
      this.website = Object.assign({}, this.website)
    },
    loadBranches ({ search, limit, offset }) {
      return this.$store.dispatch('loadWebsiteBranches', { search, limit, offset })
    },
    mapBranch (response) {
      return response.data.getBranchPage
    },
    handleBranchChanged (branch) {
      let branchExist = this.website.branches.some(item => item.id === branch.id)
      if (!branchExist) {
        let branchObj = { id: branch.id, name: branch.name }
        this.website.branches.push(branchObj)
      } else {
        this.website.branches = this.website.branches.filter(function (branchToDelete) {
          return branchToDelete.id !== branch.id
        })
      }
      this.website = Object.assign({}, this.website)
    },
    // Related website code start here
    loadRelatedWebsites ({ search, limit, offset }) {
      return this.$store.dispatch('getWebsitePage', { search, limit, offset })
    },
    mapRelatedWebsites (response) {
      return response.data.getWebsitePage
    },
    handleRelatedWebsitesChanged (relatedWebsite) {
      if (!this.website.relatedWebsites) {
        this.website.relatedWebsites = []
      }
      let relatedWebsiteExist = this.website.relatedWebsites.some(item => item.id === relatedWebsite.id)
      if (!relatedWebsiteExist) {
        let relatedWebsiteObj = { id: relatedWebsite.id, name: relatedWebsite.name }
        this.website.relatedWebsites.push(relatedWebsiteObj)
      } else {
        this.website.relatedWebsites = this.website.relatedWebsites.filter(function (relatedWebsiteToDelete) {
          return relatedWebsiteToDelete.id !== relatedWebsite.id
        })
      }
      this.website = Object.assign({}, this.website)
    } //  Related website code end here
  },
  components: {
    SwitchableDataTable,
    EditComponent
  }
}

</script>
