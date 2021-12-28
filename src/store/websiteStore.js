import gql from 'graphql-tag'
import { apolloProvider } from '../main'

export default {
  actions: {
    loadWebsiteUsers (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getAppUserPage($searchPattern: AppUserInput, 
                                        $pageable: PageableExInput ) {
            getAppUserPage(searchPattern: $searchPattern, pageable: $pageable){
              content {
                  id,
                  username
              },
              totalElements
            }
          }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    async getWebsiteById (state, id) {
      return apolloProvider.clients.internal.query({
        query: gql`query ($id: Int!) {
          getWebsiteById(id:$id)
          {
            id,
            url,
            name,
            users {
              id,
              username
              enabled
            }
            authors {
              id,
              name
            }
            brands {
              id,
              name
            },
            targetAudiences {
              id,
              name
            },
            productGroups {
              id,
              name
            },
            articleCategories {
              id,
              name
            },
            contentTags {
              id,
              name
            },
            settings {
              jiraIssue, author, approvedByClient, approvedByClic2Connect, amp, 
              displayOrder, targetAudience, productGroup, articleCategory, brand, 
              brandsToBeExcluded, contentTag, titleExtra, intro, mainText, secondary,
              useTextSecondary, introReferral, storeBranch, ctaTitle, ctaSubtitle, 
              ctaBackground, mainImage, headerImage, seoMetaDescription, 
              canonicalUrl, deprecatedUrl, shortUrl
            },
            relatedWebsites{
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
    saveWebsite (state, item) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputWebsite: WebsiteInput!) {
          saveWebsite(inputWebsite:$inputWebsite) {
            id
          }
        }`,
        variables: { inputWebsite: item }
      })
    },
    loadWebsiteAuthors (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getAuthorPage($searchPattern: AuthorInput,
          $pageable: PageableExInput ) {
          getAuthorPage(searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              name
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    loadWebsiteTargetAudiences (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getTargetAudiencePage($searchPattern: TargetAudienceInput,
          $pageable: PageableExInput ) {
          getTargetAudiencePage(searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              name
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    loadWebsiteProductGroups (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getProductGroupPage($searchPattern: ProductGroupInput,
          $pageable: PageableExInput ) {
          getProductGroupPage(searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              name
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    loadWebsiteArticleCategories (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getArticleCategoryPage($searchPattern: ArticleCategoryInput,
          $pageable: PageableExInput ) {
          getArticleCategoryPage(searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              name
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    loadWebsiteBrands (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getBrandPage($searchPattern: BrandInput,
          $pageable: PageableExInput ) {
          getBrandPage(searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              name
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    loadWebsiteContentTags (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getContentTagPage($searchPattern: ContentTagInput,
          $pageable: PageableExInput ) {
          getContentTagPage(searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              name
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    loadWebsiteBranches (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getBranchPage($searchPattern: BranchInput,
          $pageable: PageableExInput ) {
          getBranchPage(searchPattern: $searchPattern, pageable: $pageable){
            content {
              id,
              name
            },
            totalElements
          }
        }`,
        fetchPolicy: 'no-cache',
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } }
      })
    },
    getWebsites () {
      return apolloProvider.clients.internal.query({
        query: gql`query getWebsites {
          getWebsites {
            id,
            name
          }
        }`,
        fetchPolicy: 'no-cache'
      })
    },
    getWebsitePage (state, { search, limit, offset }) {
      return apolloProvider.clients.internal.query({
        query: gql`query getWebsitePage($searchPattern: WebsiteInput,
                                      $pageable: PageableExInput ) {
          getWebsitePage(searchPattern: $searchPattern, pageable: $pageable) {
            content {
              name, id
            }
            totalElements
          }
        }`,
        variables: { searchPattern: search, pageable: { size: limit, offset: offset } },
        fetchPolicy: 'no-cache'
      })
    }
  }
}
