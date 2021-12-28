import gql from 'graphql-tag'
import { apolloProvider } from '../main'

export default {
  state: {
    suppliersInfo: [],
    articleCategories: [],
    ctaTypes: []
  },
  getters: {
    getSuppliersInfo (state) {
      return state.suppliersInfo
    },
    getArticleCategories (state) {
      return state.articleCategories
    },
    getCtaTypes (state) {
      return state.ctaTypes
    }
  },
  mutations: {
    setSuppliersInfo (state, payload) {
      state.suppliersInfo = payload
    },
    setArticleCategories (state, payload) {
      state.articleCategories = payload
    },
    setCtaTypes (state, payload) {
      state.ctaTypes = payload
    }
  },
  actions: {
    async loadSuppliersList (state, { pageable, searchPattern, sortPattern }) {
      this.commit('setSuppliersInfo', [])
      const response = await apolloProvider.clients.internal.query({
        query: gql`
          query getSupplierPage(
            $pageable: PageableExInput
            $searchPattern: SupplierInput
            $sortPattern: SortPatternInput
          ) {
            getSupplierPage(
              pageable: $pageable
              searchPattern: $searchPattern
              sortPattern: $sortPattern
            ) {
              content {
                id,
                name,
                supplierBrands {
                  brandDescription
                  brandId
                  brandSrcId
                  supplierId
                }
              },
              totalElements
            }
          }
        `,
        variables: {
          pageable: pageable,
          searchPattern: searchPattern,
          sortPattern: sortPattern
        },
        fetchPolicy: 'network-only'
      })

      this.commit('setSuppliersInfo', response.data.getSupplierPage.content)
      return response.data.getSupplierPage
    },

    saveSupplier (state, { inputSupplier, supplierPassword }) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation(
            $inputSupplier: SupplierInput!
            $supplierPassword: String
          ) {
            saveSupplier(
              inputSupplier: $inputSupplier
              inputSupplierPassword: $supplierPassword
            )
            {
              id
            }
          }
        `,
        variables: { inputSupplier: inputSupplier, supplierPassword: supplierPassword }
      })
    },

    deleteSupplier (state, supplierId) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation($supplierId: Int!) {
            deleteSupplierById(id: $supplierId)
          }
        `,
        variables: { supplierId: supplierId }
      })
    },

    getArticleCategoriesByProductGroup (state, productGroupId) {
      this.commit('setArticleCategories', [])
      return apolloProvider.clients.internal.query({
        query: gql`
            query getArticleCategoriesByProductGroup(
            $productGroupId: Int!
            ) {
            getArticleCategoriesByProductGroup(
                productGroupId: $productGroupId
            ) {
                  id,
                name
            }
            }
        `,
        variables: {
          productGroupId: productGroupId
        }
      }).then(res => {
        let articleCategories = res.data.getArticleCategoriesByProductGroup
        this.commit('setArticleCategories', articleCategories)
        return articleCategories
      })
    },
    getArticleCategories (state) {
      this.commit('setArticleCategories', [])
      return apolloProvider.clients.internal.query({
        query: gql`
          query getArticleCategories {
            getArticleCategories {
              id,
              name
            }
          }
        `
      }).then(res => {
        let articleCategories = res.data.getArticleCategories
        this.commit('setArticleCategories', articleCategories)
        return articleCategories
      })
    },
    getCtaTypes (state) {
      this.commit('setCtaTypes', [])
      return apolloProvider.clients.internal.query({
        query: gql`
          query getCtaTypes {
            getCtaTypes {
              id,
              name
            }
          }
        `
      }).then(res => {
        let ctaTypes = res.data.getCtaTypes
        this.commit('setCtaTypes', ctaTypes)
        return ctaTypes
      })
    }
  }
}
