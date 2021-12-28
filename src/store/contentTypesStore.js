import gql from 'graphql-tag'
import { apolloProvider } from '../main'

export default {
  actions: {
    async loadContentTypeItemsPage (state, { typeName, searchPattern, sortPattern, pageable, fields }) {
      const response = await apolloProvider.clients.internal.query({
        query: gql`
          query get${typeName}Page(
            $searchPattern: ${typeName}Input!,
            $sortPattern: SortPatternInput,
            $pageable: PageableExInput
          ) {
            get${typeName}Page(
              searchPattern: $searchPattern,
              sortPattern: $sortPattern,
              pageable: $pageable
            ) {
              content {
                ${fields}
              },
              totalElements
            }
          }
        `,
        variables: {
          searchPattern: searchPattern || {},
          sortPattern: sortPattern || {},
          pageable: pageable || { offset: 0, size: 10 }
        },
        fetchPolicy: 'no-cache'
      })
      return response.data[`get${typeName}Page`]
    },

    saveContentTypeItem (state, { typeName, item }) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation ($inputItem: ${typeName}Input!) {
            save${typeName}(input${typeName}:$inputItem) {
              id
            }
          }
        `,
        variables: { inputItem: item }
      })
    },

    deleteContentTypeItemById (state, { typeName, contentTypeItemId }) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation($itemId: Int!) {
            delete${typeName}ById(id: $itemId)
          }
        `,
        variables: { itemId: contentTypeItemId }
      })
    }
  }
}
