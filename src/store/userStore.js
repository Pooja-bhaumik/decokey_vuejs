import gql from 'graphql-tag'
import { apolloProvider, app } from '../main'
import Url from './url'
import $ from 'jquery'
import Role from './roles'

export default {
  state: {
    userDetails: null,
    projects: []
  },
  getters: {
    getUserDetails (state) {
      return state.userDetails
    },
    userHasRoles: (state) => (roles) => {
      if (state.userDetails && state.userDetails.authorities) {
        return state.userDetails.authorities.filter(r => roles.indexOf(r.authority) >= 0).length > 0
      }
      return false
    },
    getProjects (state) {
      return state.projects
    }
  },
  mutations: {
    setUserDetails (state, payload) {
      state.userDetails = payload
    },
    setProjects (state, projects) {
      state.projects = projects
    }
  },
  actions: {
    loadUserDetails () {
      this.commit('setUserDetails', null)
      const response = apolloProvider.clients.internal.query({
        query: gql`query {
          authDetails {
            id,
            authorities{
              authority
            },
            projects {
              name
              id
              logo
            }
            username
          }
        }
        `,
        fetchPolicy: 'no-cache',
        error: function (error) {
          console.log('errors', error.graphqlErrors)
        }
      })
      response.then((resp) => {
        this.commit('setUserDetails', resp.data.authDetails)
      })
      return response
    },
    changePassword (state, inputPasswords) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputPasswords: PasswordsInput!) {
          changePassword(inputPasswords: $inputPasswords) {
            id
          }
        }
        `,
        variables: { inputPasswords: inputPasswords }
      })
    },
    getProjectById (state, id) {
      const response = apolloProvider.clients.internal.query({
        query: gql`query ($id: Int!) {
          getProjectById(id:$id) {
            id,
            name,
            logo
          }
        }`,
        variables: { id },
        fetchPolicy: 'no-cache',
        error: function (error) {
          console.log('errors', error.graphqlErrors)
        }
      })
      return response.then((resp) => resp.data.getProjectById)
    },
    getProjectsAll (state) {
      this.commit('setProjects', [])
      const response = apolloProvider.clients.internal.query({
        query: gql`query {
          getProjectsAll {
            id,
            name,
            logo
          }
        }`,
        fetchPolicy: 'no-cache',
        error: function (error) {
          console.log('errors', error.graphqlErrors)
        }
      })
      return response.then((resp) => {
        let projects = resp.data.getProjectsAll
        this.commit('setProjects', projects)
        return projects
      })
    },
    saveProject (state, project) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputProject: ProjectInput!) {
          saveProject(inputProject: $inputProject) {
            id
          }
        }
        `,
        variables: { inputProject: project }
      })
    },
    login (state, { login, password }) {
      this.commit('setUserDetails', null)
      let self = this
      $.ajax({
        url: Url.login,
        data: { username: login, password: password },
        method: 'POST',
        xhrFields: {
          withCredentials: true
        },
        // async: false,
        success: function (response) {
          if (response) {
            try {
              response = JSON.parse(response)
              if (response.id) {
                self.commit('setUserDetails', response)
                app.$router.push('/')
              } else {
                throw new Error('Login failed')
              }
            } catch (e) {
              app.$root.$emit('infoMessage', 'Login or password is wrong')
            }
            if (self.getters.userHasRoles(Role.Root)) {
              app.$emit('drawerVisible', true)
            } else if (self.getters.userHasRoles(Role.Supplier)) {
              app.$emit('drawerVisible', false)
            }
          }
        },
        error: function (e) {
          app.$root.$emit('infoMessage', 'Login or password is wrong')
        }
      })
    },
    logout (state) {
      this.commit('setUserDetails', null)
      this.commit('setProjects', [])
      let http = new XMLHttpRequest()
      let url = Url.logout
      http.open('GET', url, true)
      http.withCredentials = true
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      http.onreadystatechange = function () {
        app.$router.push('/login').catch(() => { })
      }
      http.send()
    }
  }
}
