import gql from 'graphql-tag'
import { apolloProvider } from '@/main'

export default {
  actions: {
    async loadPage (state, { className, searchPattern, additional, sortPattern, pageable, template }) {
      let response = null
      if (additional !== null) {
        response = await apolloProvider.clients.internal.query({
          query: gql`
          query get${className}Page(
            $searchPattern: ${className}Input!,
            $additional: ${className}AdditionalSearchPatternInput
            $sortPattern: SortPatternInput,
            $pageable: PageableExInput
          ) {
            get${className}Page(
              searchPattern: $searchPattern,
              additional: $additional,
              sortPattern: $sortPattern,
              pageable: $pageable
            ) {
              content
                ${template}
              ,
              totalElements
            }
          }
        `,
          variables: {
            searchPattern: searchPattern,
            additional: additional,
            sortPattern: sortPattern,
            pageable: pageable
          },
          fetchPolicy: 'no-cache'
        })
      } else {
        response = await apolloProvider.clients.internal.query({
          query: gql`
          query get${className}Page(
            $searchPattern: ${className}Input!,
            $sortPattern: SortPatternInput,
            $pageable: PageableExInput
          ) {
            get${className}Page(
              searchPattern: $searchPattern,
              sortPattern: $sortPattern,
              pageable: $pageable
            ) {
              content
                ${template}
              ,
              totalElements
            }
          }
        `,
          variables: {
            searchPattern: searchPattern,
            sortPattern: sortPattern,
            pageable: pageable
          },
          fetchPolicy: 'no-cache'
        })
      }
      return response.data[`get${className}Page`]
    },
    deleteById (state, { className, id }) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation($id: Int!) {
            delete${className}ById(id: $id)
          }
        `,
        variables: { id: id }
      })
    },
    forceDeleteById (state, { className, id }) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation($id: Int!) {
            forceDelete${className}ById(id: $id)
          }
        `,
        variables: { id: id }
      })
    }
  }
}
