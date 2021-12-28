import gql from 'graphql-tag'
import { apolloProvider } from '../main'

export default {
  actions: {
    async clientSearchContentItems (state, { typeName, search, limit, offset, fields }) {
      const response = await apolloProvider.clients.external.query({
        query: gql('query ' + typeName + 'SearchPage($searchPattern: ' + typeName + 'Input!, $limit: Int!, $offset: Long!) {' +
          typeName + 'SearchPage(searchPattern: $searchPattern, limit: $limit, offset: $offset)' +
          ' {' +
          '   content {' +
                fields +
          '   },' +
          '   totalElements' +
          ' }' +
          '}'),
        variables: { searchPattern: search, limit: limit || 10, offset: offset || 0 },
        fetchPolicy: 'no-cache'
      })
      return response.data[typeName + 'SearchPage']
    },
    getAllContentItemsPromise (state, contentItemTypeId) {
      return apolloProvider.clients.internal.query({
        query: gql`query getAllContentItems($typeId:  Int!) {
        getAllContentItems(typeId: $typeId)
        {
          id,
          name
        }
      }`,
        variables: { typeId: contentItemTypeId },
        fetchPolicy: 'no-cache'
      })
    },
    searchCmsContentItemMainTextByWebsite (state, { websiteId, searchPhrase }) {
      return apolloProvider.clients.internal.query({
        query: gql`query searchCmsContentItemMainTextByWebsiteAndSearchPhrase ($websiteId: Int!, $searchPhrase: String) {
          searchCmsContentItemMainTextByWebsiteAndSearchPhrase (websiteId: $websiteId, searchPhrase: $searchPhrase)
        }`,
        variables: { websiteId: websiteId, searchPhrase: searchPhrase },
        fetchPolicy: 'no-cache'
      })
    },
    getTargetAudiences (state) {
      return apolloProvider.clients.internal.query({
        query: gql`query getTargetAudiences {
          getTargetAudiences {
            srcUuid, name, id
          }
        }`,
        fetchPolicy: 'no-cache'
      })
    },
    getTargetAudiencesForWebsite (state, websiteId) {
      return apolloProvider.clients.internal.query({
        query: gql`query getTargetAudiencesForWebsite($websiteId: Int! ) {
          getTargetAudiencesForWebsite (websiteId: $websiteId) {
            srcUuid, name, id
          }
        }`,
        variables: { websiteId: websiteId },
        fetchPolicy: 'no-cache'
      })
    },
    getProductGroupForWebsiteByTargetAudience (state, { websiteId, targetAudienceId }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getProductGroupForWebsiteByTargetAudience($websiteId: Int!, $targetAudienceId: Int! ) {
          getProductGroupForWebsiteByTargetAudience (websiteId: $websiteId, targetAudienceId: $targetAudienceId) {
            srcUuid, name, id
          }
        }`,
        variables: { websiteId: websiteId, targetAudienceId: targetAudienceId },
        fetchPolicy: 'no-cache'
      })
    },
    getArticleCategoryForWebshopByProductGroup (state, { websiteId, productGroupId }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getArticleCategoryForWebshopByProductGroup($websiteId: Int!, $productGroupId: Int! ) {
          getArticleCategoryForWebshopByProductGroup (websiteId: $websiteId, productGroupId: $productGroupId) {
            srcUuid, name, id
          }
        }`,
        variables: { websiteId: websiteId, productGroupId: productGroupId },
        fetchPolicy: 'no-cache'
      })
    },
    getTargetAudienceById (state, targetAudienceId) {
      return apolloProvider.clients.internal.query({
        query: gql`query getTargetAudienceById($targetAudienceId:  Int!) {
          getTargetAudienceById(id: $targetAudienceId) {
            srcUuid, name, id
            productGroups {
              name, id
            }
          }
        }`,
        variables: { targetAudienceId: targetAudienceId },
        fetchPolicy: 'no-cache'
      })
    },
    getProductGroupById (state, productGroupId) {
      return apolloProvider.clients.internal.query({
        query: gql`query getProductGroupById($productGroupId:  Int!) {
          getProductGroupById(id: $productGroupId) {
            srcUuid, name, id
            articleCategories {
              name, id
            }
          }
        }`,
        variables: { productGroupId: productGroupId },
        fetchPolicy: 'no-cache'
      })
    },
    getArticleCategoryById (state, articleCategoryId) {
      return apolloProvider.clients.internal.query({
        query: gql`query getArticleCategoryById($articleCategoryId:  Int!) {
          getArticleCategoryById(id: $articleCategoryId) {
            srcUuid, name, id
            brands {
              name, id
            }
          }
        }`,
        variables: { articleCategoryId: articleCategoryId },
        fetchPolicy: 'no-cache'
      })
    },
    getBrands (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getBrandPage($searchPattern: BrandInput,
                                      $pageable: PageableExInput ) {
          getBrandPage(searchPattern: $searchPattern, pageable: $pageable) {
            content {
              name, id
            }
            totalElements
          }
        }`,
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } },
        fetchPolicy: 'no-cache'
      })
    },
    getBrandsForWebsite (state, { websiteId }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getBrandsForWebsite($websiteId: Int! ) {
          getBrandsForWebsite(websiteId: $websiteId) {
              name, id
          }
        }`,
        variables: { websiteId: websiteId },
        fetchPolicy: 'no-cache'
      })
    },
    getContentTagsForWebsite (state, websiteId) {
      return apolloProvider.clients.internal.query({
        query: gql`query getContentTagsForWebsite($websiteId: Int! ) {
          getContentTagsForWebsite(websiteId: $websiteId) {
              name, id
          }
        }`,
        variables: { websiteId: websiteId },
        fetchPolicy: 'no-cache'
      })
    },
    getContentTags (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getContentTagPage($searchPattern: ContentTagInput,
                                      $pageable: PageableExInput ) {
          getContentTagPage(searchPattern: $searchPattern, pageable: $pageable) {
            content {
              name, id
            }
            totalElements
          }
        }`,
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } },
        fetchPolicy: 'no-cache'
      })
    },
    getAuthorById (state, authorId) {
      return apolloProvider.clients.internal.query({
        query: gql`query getAuthorById($authorId:  Int!) {
          getAuthorById(id: $authorId) {
            name, id
          }
        }`,
        variables: { authorId: authorId },
        fetchPolicy: 'no-cache'
      })
    }
  }
}
