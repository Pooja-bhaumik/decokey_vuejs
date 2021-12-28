import gql from 'graphql-tag'
import { apolloProvider } from '../main'

export default {
  state: {
    adBanners: [],
    cmsContentItems: [],
    banners: null,
    contentTypeFields: null
  },
  getters: {
    getBanners (state) {
      return state.banners
    },
    getAdBanners (state) {
      return state.adBanners
    },
    getContentTypes (state) {
      return state.contentTypes
    },
    getContentTypeFields (state) {
      return state.contentTypeFields
    },
    getCmsContentItems (state) {
      return state.cmsContentItems
    }
  },
  mutations: {
    setBanners (state, payload) {
      state.banners = payload
    },
    setAdBanners (state, payload) {
      state.adBanners = payload
    },
    setContentTypeFields (state, payload) {
      state.contentTypeFields = payload
    },
    setCmsContentItems (state, payload) {
      state.cmsContentItems = payload
    }
  },
  actions: {
    async getAdBannerItemById (state, id) {
      return apolloProvider.clients.internal.query({
        query: gql`query ($id: Int!) {
          getAdBannerItemById(id:$id)
          {
            id,
              data {
                activated,
                url,
                startAt,
                endAt,
                title,
                imageUrls,
                imageStyles,
                imageActivated,
                defaultTemplate,
                overviewImageUrls,
                overviewImageActivated,
                overviewTitle,
                overviewDescription, 
                bigTitle, 
                overviewFinalUrl, 
                overviewCTA,
                overviewEndDate,
                overviewSliderActivated
              }
              excludedBranches {
                id,
                name,
                srcUuid
              },
              targetAudience {
                id,
                name,
                srcUuid
              },
              productGroup {
                id,
                name,
                srcUuid
              },
              articleCategory {
                id,
                name,
                srcUuid
              },
              brands {
                id,
                name
              }
          }
        }
        `,
        variables: { id },
        fetchPolicy: 'no-cache'
      })
    },
    saveAdBannerItem (state, item) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputAdBannerItem: SaveAdBannerItemRequestInput!) {
          saveAdBannerItem(inputAdBannerItem:$inputAdBannerItem)
          {
            id
          }
        }
        `,
        variables: { inputAdBannerItem: item }
      })
    },
    cloneAdBannerItem (state, item) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputAdBannerItemId: Int!) {
          cloneAdBannerItem(inputAdBannerItemId:$inputAdBannerItemId)
          {
            id
          }
        }
        `,
        variables: { inputAdBannerItemId: item }
      })
    },
    deactivateAdBanner (state, adBannerId) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($adBannerId: Int!) {
          saveAdBannerActivation(inputAdBannerId:$adBannerId, activated: false)
          {
            id
            data {
              activated
            }
          }
        }
        `,
        variables: { adBannerId: adBannerId }
      })
    },
    async loadCmsContentItemPage (state, { sortPattern, additional, searchPattern, pageable }) {
      this.commit('setCmsContentItems', [])
      const response = await apolloProvider.clients.internal.query({
        query: gql`query getCmsContentItemPage($sortPattern: SortPatternInput,
          $additional: AdBannerItemAdditionalSearchPatternInput,
          $searchPattern: CmsContentItemInput,
          $pageable: PageableExInput ) {
          getCmsContentItemPage(sortPattern: $sortPattern, additional: $additional, searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              start,
              end,
              title,
              active,
              seoBrowserTitle,
              seoMetaDescription,
              url,
              canonicalUrl,
              deprecatedUrl,
              shortUrl,
              titleExtra,
              intro,
              introReferral,
              useTextSecondary,
              secondary,
              mainText,
              ctaTitle,
              ctaSubTitle,
              ctaBackground,
              title,
              excludedBrands {
                id,
                name
              },
              targetAudience {
                id,
                name
              },
              productGroup {
                id,
                name
              },
              articleCategory {
                id,
                name
              }
              brand {
                id,
                name
              },
              website {
                id,
                name              
              }
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { sortPattern: sortPattern, additional: additional, searchPattern: searchPattern, pageable: pageable }
      })
      this.commit('setCmsContentItems', response.data.getCmsContentItemPage)
      return response.data.getCmsContentItemPage
    },
    async getFacebookLinkPostsPage (state, { sortPattern, additional, searchPattern, pageable }) {
      /* Facebook cms page */
      // this.commit('setFacebookLinkPosts', [])
      const response = await apolloProvider.clients.internal.query({
        query: gql`query getFacebookLinkPostsPage($sortPattern: SortPatternInput,
          $searchPattern: FacebookLinkPostInput,
          $pageable: PageableExInput ) {
          getFacebookLinkPostsPage(sortPattern: $sortPattern, searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              postUrl,
              name,
              link,
              published,
              scheduledAt
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { sortPattern: sortPattern, searchPattern: searchPattern, pageable: pageable }
      })
      console.log('FacebookLinkPosts Called')
      console.log(response)
      // this.commit('setFacebookLinkPosts', response.data.getFacebookLinkPostItemPage)
      return response.data.getFacebookLinkPostsPage
    },
    async getFacebookLinkPostById (state, id) {
      return apolloProvider.clients.internal.query({
        query: gql`query ($id: Int!) {
          getFacebookLinkPostById(id:$id)
          {
            id,
            postId,
            postUrl,            
            name,            
            description,
            message,
            link,
            iconUrl,
            facebookLinkType,
            startDateTime,
            published,
            scheduledAt,
            createdAt,
            updatedAt
          }
        }
        `,
        variables: { id },
        fetchPolicy: 'no-cache'
      })
    },
    saveFacebookLinkPost (state, item) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputLinkPost: FacebookLinkPostInput!) {
          saveFacebookLinkPost(inputLinkPost: $inputLinkPost)
          {
            id
          }
        }
        `,
        variables: { inputLinkPost: item }
      })
    },
    async getCmsContentItemById (state, id) {
      return apolloProvider.clients.internal.query({
        query: gql`query ($id: Int!) {
          getCmsContentItemById(id:$id)
          {
            id,
            start,
            end,            
            title,            
            active,
            jiraIssue,
            approvedByClient,
            amp,
            approvedByClic2Connect,
            mainImage,
            headerImage,
            seoBrowserTitle,
            seoMetaDescription,
            url,
            canonicalUrl,
            deprecatedUrl,
            shortUrl,
            titleExtra,
            intro,
            introReferral,
            useTextSecondary,
            mainText,
            ctaTitle,
            ctaSubTitle,
            ctaBackground,
            secondary,
            excludedBrands {
              id,
              name
            },
            contentTags {
              id,
              name
            }
            targetAudience {
              id,
              name
            },
            productGroup {
              id,
              name
            },
            articleCategory {
              id,
              name
            }
            brand {
              id,
              name
            }
            website {
              id,
              name,
              relatedWebsites {
                  id,
                  name
              }
            },
            secondaryWebsites {
              id,
              name
            }
            author {
              id,
              name
            }
            displayOrder,
            references {
              cmsContentItemId,
              referentCmsContentItemId,
              referralLink,
              referralTitle,
              referralTitleAlt,
              referralImageUrl,
              referralRanking,
              directLink
            },
            reverseReferences {
              cmsContentItemId,
              referentCmsContentItemId,
              referralLink,
              referralTitle,
              referralTitleAlt,
              referralImageUrl,
              referralRanking,
              directLink
            }
          }
        }
        `,
        variables: { id },
        fetchPolicy: 'no-cache'
      })
    },
    saveCmsContentItem (state, item) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputCmsContentItem: CmsContentItemInput!) {
          saveCmsContentItem(inputCmsContentItem:$inputCmsContentItem)
          {
            id
          }
        }
        `,
        variables: { inputCmsContentItem: item }
      })
    }
  }
}
