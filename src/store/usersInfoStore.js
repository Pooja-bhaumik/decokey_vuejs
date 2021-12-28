import gql from 'graphql-tag'
import {
  apolloProvider
} from '../main'

export default {
  state: {
    usersInfo: []
  },
  getters: {
    getUsersInfo (state) {
      return state.usersInfo
    }
  },
  mutations: {
    setUsersInfo (state, payload) {
      state.usersInfo = payload
    }
  },
  actions: {
    async loadUsersList (state, {
      pageable,
      searchPattern,
      sortPattern
    }) {
      this.commit('setUsersInfo', [])
      const response = await apolloProvider.clients.internal.query({
        query: gql`
          query getAppUserPage(
            $pageable: PageableExInput,
            $searchPattern: AppUserInput,
            $sortPattern: SortPatternInput
          ) {
            getAppUserPage(pageable: $pageable, searchPattern: $searchPattern, sortPattern: $sortPattern) {
              content {
                  id
                  username
                  authorities {
                      authority
                      id
                  }
                  projects {
                    id
                    logo
                    name
                  }
              }
              totalElements
            }
          }
        `,
        variables: {
          pageable: pageable,
          searchPattern: searchPattern,
          sortPattern: sortPattern
        },
        fetchPolicy: 'no-cache'
      })

      this.commit('setUsersInfo', response.data.getAppUserPage.content)
      return response.data.getAppUserPage
    },

    async getAppUserById (state, userId) {
      const response = await apolloProvider.clients.internal.query({
        query: gql`
          query getAppUserById(
            $userId: Int!
          ) {
            getAppUserById(id: $userId) {
              id
              username
              authorities {
                  authority
                  id
              }
            }
          }
        `,
        variables: { userId: userId },
        fetchPolicy: 'no-cache'
      })

      return response.data.getAppUserById
    },

    saveUser (state, item) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation ($inputAppUser: AppUserInput!) {
            saveAppUser(inputAppUser:$inputAppUser)
          }
        `,
        variables: { inputAppUser: item }
      })
    },

    deleteUser (state, appUserId) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`
          mutation($appUserId: Int!) {
            deleteAppUserById(id: $appUserId)
          }
        `,
        variables: { appUserId: appUserId }
      })
    }
  }
}
