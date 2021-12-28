import gql from 'graphql-tag'
import { apolloProvider } from '../main'

export default {
  state: {
    brandStatistic: [],
    brandContentItems: [],
    statisticProductGroups: [],
    impressionStatisticByPages: [],
    impressionStatisticByWebsites: [],
    pgImpressionStatisticByPages: [],
    pgImpressionStatisticByWebsites: [],
    ctaStatistic: [],
    totalSocialNetworkEngagementWithPost: [],
    productGroups: [],
    brandIdRelatedImpressionReachEngagement: null
  },
  getters: {
    getBrandStatistic (state) {
      return state.brandStatistic
    },
    getBrandContentItems (state) {
      return state.brandContentItems
    },
    getStatisticProductGroups (state) {
      return state.statisticProductGroups
    },
    getImpressionStatisticByPages (state) {
      return state.impressionStatisticByPages
    },
    getImpressionStatisticByWebsites (state) {
      return state.impressionStatisticByWebsites
    },
    getPgImpressionStatisticByPages (state) {
      return state.pgImpressionStatisticByPages
    },
    getPgImpressionStatisticByWebsites (state) {
      return state.pgImpressionStatisticByWebsites
    },
    getCTAStatistic (state) {
      return state.ctaStatisticmy
    },
    getTotalSocialNetworkEngagementWithPost (state) {
      return state.totalSocialNetworkEngagementWithPost
    },
    getProductGroups (state) {
      return state.productGroups
    },
    getBrandIdRelatedImpressionReachEngagement (state) {
      return state.brandIdRelatedImpressionReachEngagement
    }
  },
  mutations: {
    setBrandStatistic (state, payload) {
      state.brandStatistic = payload
    },
    setBrandContentItems (state, payload) {
      state.brandContentItems = payload
    },
    setStatisticProductGroups (state, payload) {
      state.statisticProductGroups = payload
    },
    setImpressionStatisticByPages (state, payload) {
      state.impressionStatisticByPages = payload
    },
    setImpressionStatisticByWebsites (state, payload) {
      state.impressionStatisticByWebsites = payload
    },
    setPgImpressionStatisticByPages (state, payload) {
      state.pgImpressionStatisticByPages = payload
    },
    setPgImpressionStatisticByWebsites (state, payload) {
      state.pgImpressionStatisticByWebsites = payload
    },
    setCTAStatistic (state, payload) {
      state.ctaStatistic = payload
    },
    setTotalSocialNetworkEngagement (state, payload) {
      state.totalSocialNetworkEngagementWithPost = payload
    },
    setProductGroups (state, payload) {
      state.productGroups = payload
    },
    setBrandIdRelatedImpressionReachEngagement (state, payload) {
      state.brandIdRelatedImpressionReachEngagement = payload
    }
  },
  actions: {
    loadEngagementReachRelatedByProductIdWithGraphQlParams (
      state,
      { fromDate, toDate, productGroupId, socialNetwork }
    ) {
      return apolloProvider.clients.impressionsLink.query({
        query: gql`
          query getProductGroupNetworkEngagementWithProductId(
            $fromDate: OffsetDateTime!
            $toDate: OffsetDateTime!
            $socialNetwork: SocialNetwork!
            $product_id: Int!
          ) {
            getProductGroupNetworkEngagementWithProductId(
              from: $fromDate
              till: $toDate
              socialNetwork: $socialNetwork
              product_id: $product_id
            ) {
              product_id
              productData {
                clicks
                impressions
                keys
              }
              clicks
              impressions
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          product_id: productGroupId,
          socialNetwork: socialNetwork
        },
        fetchPolicy: 'no-cache'
      })
    },

    loadEngagementReachRelatedByBrandIdWithGraphQlParams (
      state,
      { fromDate, toDate, brandId, socialNetwork }
    ) {
      return apolloProvider.clients.impressionsLink.query({
        query: gql`
          query getBrandRelatedReachAndEnagement(
            $fromDate: OffsetDateTime!
            $toDate: OffsetDateTime!
            $socialNetwork: SocialNetwork!
            $brand_id: Int!
          ) {
            getBrandRelatedReachAndEnagement(
              from: $fromDate
              till: $toDate
              socialNetwork: $socialNetwork
              brand_id: $brand_id
            ) {
              brand_id
              brandsData {
                clicks
                impressions
                keys
              }
              clicks
              impressions
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          brand_id: brandId,
          socialNetwork: socialNetwork
        },
        fetchPolicy: 'no-cache'
      })
    },
    async loadProductGroups (state, { brandId }) {
      this.commit('setProductGroups', [])
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query getProductsGroupsWithBrandIds($brand_id: Int!) {
            getProductsGroupsWithBrandIds(brand_id: $brand_id) {
              brand_id
              products {
                product_name
                product_group_id
              }
            }
          }
        `,
        variables: {
          brand_id: brandId
        },
        fetchPolicy: 'no-cache'
      })

      this.commit(
        'setProductGroups',
        response.data.getProductsGroupsWithBrandIds
      )
      console.log(
        'setProductGroups:::',
        response.data.getProductsGroupsWithBrandIds
      )
    },
    async loadBrandStatistic (
      state,
      { fromDate, toDate, contentType, brandId, pageInfo, measurements }
    ) {
      this.commit('setBrandStatistic', [])
      const impressionsMeasurements =
        measurements || 'created, delivered, impressed, uniqueImpressed'
      const impressionsPageInfo = pageInfo || ''
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query impressionStatistic($fromDate: DateTime!, $toDate: DateTime, $brandId: Int, $contentType: [ContentItemStatisticType!]) {
            impressionStatistic(from: $fromDate, to: $toDate, brandId: $brandId) {
              brandId
              statistic(contentTypes: $contentType) {
                contentType
                ${impressionsPageInfo}
                measurement {
                  ${impressionsMeasurements}
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate,
          toDate: toDate || null,
          brandId: brandId,
          contentType: contentType || [
            'BRAND_CONTENT_ITEM',
            'BRAND_LOGO',
            'BRAND_PROFILE',
            'AD_BANNER'
          ]
        },
        fetchPolicy: 'no-cache'
      })
      this.commit('setBrandStatistic', response.data.impressionStatistic)
    },
    async loadCTAStatistic (
      state,
      {
        fromDate,
        toDate,
        ctaId,
        ctaName,
        ctaTypeCf,
        productGroupId,
        articleCategoryId,
        userBranchId
      }
    ) {
      this.commit('setCTAStatistic', [])
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query impressionStatistic(
            $fromDate: DateTime!
            $toDate: DateTime
            $ctaId: Int
            $ctaName: String
            $ctaTypeCf: String
            $productGroupId: Int
            $articleCategoryId: Int
            $userBranchId: Int
          ) {
            impressionStatistic(
              from: $fromDate
              to: $toDate
              ctaId: $ctaId
              ctaName: $ctaName
              ctaTypeCf: $ctaTypeCf
              productGroupId: $productGroupId
              articleCategoryId: $articleCategoryId
              userBranchId: $userBranchId
            ) {
              statistic(contentTypes: [CTA]) {
                articleCategory
                articleCategoryId
                productGroup
                productGroupId
                branch
                branchId
                ctaName
                ctaNameCf
                ctaType
                ctaTypeCf
                ctaId
                pageType
                measurement {
                  impressed
                  ctaClicked
                  ctaSubmitted
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate,
          toDate: toDate,
          ctaId: ctaId,
          ctaName: ctaName,
          ctaTypeCf: ctaTypeCf,
          productGroupId: productGroupId,
          articleCategoryId: articleCategoryId,
          userBranchId: userBranchId
        },
        fetchPolicy: 'no-cache'
      })

      this.commit('setCTAStatistic', response.data.impressionStatistic)
    },

    async loadImpressionStatisticByPages (
      state,
      { fromDate, toDate, brandId, contentType }
    ) {
      this.commit('setImpressionStatisticByPages', [])
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query impressionPageStatistic(
            $fromDate: DateTime!
            $toDate: DateTime!
            $brandId: Int
            $contentType: [ContentItemStatisticType!]
          ) {
            impressionPageStatistic(
              from: $fromDate
              to: $toDate
              brandId: $brandId
            ) {
              statistic(contentTypes: $contentType) {
                pageUrl
                pageTitle
                impressed
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          brandId: brandId,
          contentType: contentType
        },
        fetchPolicy: 'no-cache'
      })

      this.commit(
        'setImpressionStatisticByPages',
        response.data.impressionPageStatistic[0]
          ? response.data.impressionPageStatistic[0].statistic
          : response.data.impressionPageStatistic
      )
    },
    async loadSocialStatisticsDataWithPost (
      state,
      { fromDate, toDate, socialNetwork, brandId }
    ) {
      this.commit('setTotalSocialNetworkEngagement', [])
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query getSocialNetworkEngagementWithPostId(
            $fromDate: OffsetDateTime!
            $toDate: OffsetDateTime!
            $socialNetwork: SocialNetwork!
            $brand_id: Int!
          ) {
            getSocialNetworkEngagementWithPostId(
              from: $fromDate
              till: $toDate
              socialNetwork: $socialNetwork
              brand_id: $brand_id
            ) {
              brand_id
              post_id
              post_image
              description
              engaged_user
              impression
              post_date
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2021-10-27T00:00:00+05:30',
          toDate: toDate || '2021-11-23T23:59:59+05:30',
          brand_id: brandId,
          socialNetwork: socialNetwork
        },
        fetchPolicy: 'no-cache'
      })
      this.commit(
        'setTotalSocialNetworkEngagement',
        response.data.getSocialNetworkEngagementWithPostId
      )
    },

    async loadImpressionStatisticByWebsites (
      state,
      { fromDate, toDate, brandId, contentType }
    ) {
      this.commit('setImpressionStatisticByWebsites', [])
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query impressionPageStatistic(
            $fromDate: DateTime!
            $toDate: DateTime!
            $brandId: Int
            $contentType: [ContentItemStatisticType!]
          ) {
            impressionPageStatiloadCTAStatisticstic(
              from: $fromDate
              to: $toDate
              brandId: $brandId
            ) {
              statistic(contentTypes: $contentType) {
                pageDomain
                impressed
              }
              loadUserDetails
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          brandId: brandId,
          contentType: Array.isArray(contentType) ? contentType : [contentType]
        },
        fetchPolicy: 'no-cache'
      })

      this.commit(
        'setImpressionStatisticByWebsites',
        response.data.impressionPageStatistic[0]
          ? response.data.impressionPageStatistic[0].statistic
          : response.data.impressionPageStatistic
      )
    },

    async loadPgImpressionStatisticByPages (
      state,
      { fromDate, toDate, brandId, brandIds, contentType }
    ) {
      this.commit('setPgImpressionStatisticByPages', [])
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query impressionStatistic(
            $fromDate: DateTime!
            $toDate: DateTime!
            $brandId: Int
            $brandIds: [Int]
            $contentType: [ContentItemStatisticType!]
          ) {
            impressionStatistic(
              from: $fromDate
              to: $toDate
              brandId: $brandId
              brandIds: $brandIds
            ) {
              statistic(contentTypes: $contentType) {
                pageUrl
                pageTitle
                measurement {
                  impressed
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          brandId: brandId,
          contentType: contentType
        },
        fetchPolicy: 'no-cache'
      })

      this.commit(
        'setPgImpressionStatisticByPages',
        response.data.impressionStatistic[0]
          ? response.data.impressionStatistic[0].statistic
          : response.data.impressionStatistic
      )
    },

    async loadPgImpressionStatisticByWebsites (
      state,
      { fromDate, toDate, brandId, brandIds, contentType }
    ) {
      this.commit('setPgImpressionStatisticByWebsites', [])
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query impressionStatistic(
            $fromDate: DateTime!
            $toDate: DateTime!
            $brandId: Int
            $brandIds: [Int]
            $contentType: [ContentItemStatisticType!]
          ) {
            impressionStatistic(
              from: $fromDate
              to: $toDate
              brandId: $brandId
              brandIds: $brandIds
            ) {
              statistic(contentTypes: $contentType) {
                pageDomain
                measurement {
                  impressed
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          brandId: brandId,
          contentType: Array.isArray(contentType) ? contentType : [contentType]
        },
        fetchPolicy: 'no-cache'
      })

      this.commit(
        'setPgImpressionStatisticByWebsites',
        response.data.impressionStatistic[0]
          ? response.data.impressionStatistic[0].statistic
          : response.data.impressionStatistic
      )
    },

    async loadChartImpressionStatistic (
      state,
      { fromDate, toDate, brandId, pgBrandIds, contentType, devices }
    ) {
      return apolloProvider.clients.impressionsLink.query({
        query: gql`
          query impressionChartSeries(
            $fromDate: DateTime!
            $toDate: DateTime!
            $brandId: Int!
            $pgBrandIds: [Int]
            $contentType: [ContentItemStatisticType!]
            $devices: [ImpressionDeviceType!]
          ) {
            impressionChartSeries(
              from: $fromDate
              to: $toDate
              brandId: $brandId
              pgBrandIds: $pgBrandIds
              seriesCount: -31
            ) {
              brandId
              chartSeries(contentTypes: $contentType) {
                #contentType
                series(devices: $devices) {
                  start
                  end
                  measurement {
                    # created
                    # delivered
                    impressed
                    pageImpressed
                    # uniqueImpressed
                    #sessionImpressed
                    userSessions
                    userImpressed
                  }
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          brandId: brandId,
          pgBrandIds: pgBrandIds,
          contentType: contentType,
          devices: devices
        },
        fetchPolicy: 'no-cache'
      })
    },
    async loadImpressionsForProductGroup (
      state,
      { fromDate, toDate, productGroupId, contentTypes, devices }
    ) {
      const response = await apolloProvider.clients.internal.query({
        query: gql`
          query getBrandsByProductGroupId($productGroupId: Int!) {
            getBrandsByProductGroupId(productGroupId: $productGroupId) {
              id
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: { productGroupId: productGroupId }
      })
      let brandIds = response.data.getBrandsByProductGroupId.map(
        (item) => item.id
      )
      if (!brandIds.length) {
        return Promise.resolve([])
      }

      return apolloProvider.clients.impressionsLink
        .query({
          query: gql`
            query impressionChartSeries(
              $fromDate: DateTime!
              $toDate: DateTime!
              $pgBrandIds: [Int]
              $contentTypes: [ContentItemStatisticType!]
              $devices: [ImpressionDeviceType!]
              $productGroupId: Int
            ) {
              impressionChartSeries(
                from: $fromDate
                to: $toDate
                pgBrandIds: $pgBrandIds
                seriesCount: -31
                productGroupId: $productGroupId
              ) {
                chartSeries(contentTypes: $contentTypes) {
                  series(devices: $devices) {
                    measurement {
                      impressed
                      pageImpressed
                      userSessions
                    }
                  }
                }
              }
            }
          `,
          variables: {
            fromDate: fromDate || '2020-02-01T12:00:00+01:00',
            toDate: toDate || '2020-02-29T12:00:00+01:00',
            pgBrandIds: brandIds,
            contentTypes: contentTypes,
            devices: devices,
            productGroupId: productGroupId
          },
          fetchPolicy: 'no-cache'
        })
        .then((data) => {
          if (
            data.data.impressionChartSeries &&
            data.data.impressionChartSeries.length
          ) {
            let chartSeries = data.data.impressionChartSeries[0].chartSeries
            if (chartSeries && chartSeries.length) {
              let series = chartSeries[0].series
              if (series && series.length) {
                return series.map((serie) => {
                  return {
                    impressed: serie.measurement.impressed,
                    pageImpressed: serie.measurement.pageImpressed,
                    userSessions: serie.measurement.userSessions
                  }
                })
              }
            }
          }
          return []
        })
    },

    async loadAggSocialNetworkStatistic (
      state,
      { fromDate, toDate, socialNetwork }
    ) {
      return apolloProvider.clients.internal.query({
        query: gql`
          query getTotalSocialNetworkEngagement(
            $fromDate: OffsetDateTime!
            $toDate: OffsetDateTime!
            $socialNetwork: SocialNetwork
          ) {
            getTotalSocialNetworkEngagement(
              from: $fromDate
              till: $toDate
              socialNetwork: $socialNetwork
            ) {
              clicks
              impressions
              keys
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00',
          socialNetwork: socialNetwork
        },
        fetchPolicy: 'no-cache'
      })
    },
    async loadGoogleSearchStatistic (state, { fromDate, toDate }) {
      return apolloProvider.clients.internal.query({
        query: gql`
          query getGoogleSearchEngagement(
            $fromDate: OffsetDateTime!
            $toDate: OffsetDateTime!
          ) {
            getGoogleSearchEngagement(from: $fromDate, till: $toDate) {
              statisticSiteData {
                data {
                  clicks
                  impressions
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00'
        },
        fetchPolicy: 'no-cache'
      })
    },
    async loadFacebookStatistic (state, { fromDate, toDate }) {
      return apolloProvider.clients.internal.query({
        query: gql`
          query getFacebookEngagement(
            $fromDate: OffsetDateTime!
            $toDate: OffsetDateTime!
          ) {
            getFacebookEngagement(from: $fromDate, till: $toDate) {
              statisticSiteData {
                data {
                  clicks
                  impressions
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00'
        },
        fetchPolicy: 'no-cache'
      })
    },
    async loadInstagramStatistic (state, { fromDate, toDate }) {
      return apolloProvider.clients.internal.query({
        query: gql`
          query getInstagramEngagement(
            $fromDate: OffsetDateTime!
            $toDate: OffsetDateTime!
          ) {
            getInstagramEngagement(from: $fromDate, till: $toDate) {
              statisticSiteData {
                data {
                  clicks
                  impressions
                }
              }
            }
          }
        `,
        variables: {
          fromDate: fromDate || '2020-02-01T12:00:00+01:00',
          toDate: toDate || '2020-02-29T12:00:00+01:00'
        },
        fetchPolicy: 'no-cache'
      })
    },

    async loadBrandContentItems (state) {
      this.commit('setBrandContentItems', [])
      const response = await apolloProvider.clients.internal.query({
        query: gql`
          query getBrandsAll {
            getBrandsAll {
              id
              name
              logo
            }
          }
        `,
        fetchPolicy: 'no-cache'
      })
      this.commit('setBrandContentItems', response.data.getBrandsAll)
    },

    async loadStatisticBrandIds (state) {
      const response = await apolloProvider.clients.impressionsLink.query({
        query: gql`
          query getStatisticBrandIds {
            getStatisticBrandIds
          }
        `,
        fetchPolicy: 'no-cache'
      })
      return response.data.getStatisticBrandIds
    },
    async loadStatisticProductGroups (state) {
      const response = await apolloProvider.clients.internal.query({
        query: gql`
          query getStatisticProductGroups {
            getStatisticProductGroups {
              id
              name
            }
          }
        `,
        fetchPolicy: 'no-cache'
      })
      this.commit(
        'setStatisticProductGroups',
        response.data.getStatisticProductGroups
      )
    },

    async loadBrandsByProductGroupId (state, { productGroupId }) {
      return apolloProvider.clients.internal.query({
        query: gql`
          query getBrandsByProductGroupId($productGroupId: Int!) {
            getBrandsByProductGroupId(productGroupId: $productGroupId) {
              id
              name
              logo
            }
          }
        `,
        variables: { productGroupId: productGroupId },
        fetchPolicy: 'no-cache'
      })
    }
  }
}
