// import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Url from './store/url'
import store from './store'
import router from './router'
import { ApolloClient } from 'apollo-client'
import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import DatetimePicker from 'vuetify-datetime-picker'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import { onError } from 'apollo-link-error'
import VueI18n from 'vue-i18n'
import messages from './plugins/i18nMessages'
import PortalVue from 'portal-vue'
import VueLazyload from 'vue-lazyload'
// import WYSIWYG editor
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

Vue.use(VueApollo)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: 'dist/error.png',
  loading: 'dist/loading.gif',
  attempt: 1
})
Vue.use(DatetimePicker)
Vue.use(PortalVue)
Vue.use(VueMoment, {
  moment
})
Vue.use(VueI18n)
const iCache = new InMemoryCache({ addTypename: false })
const eCache = new InMemoryCache({ addTypename: false })
const impressionsCache = new InMemoryCache({ addTypename: false })
const internalGraphqlEndpoint = createHttpLink({
  uri: Url.internalGraphqlEndpoint,
  credentials: 'include'
})

const externalGraphqlEndpoint = createHttpLink({
  uri: Url.externalGraphqlEndpoint,
  credentials: 'include'
})

const impressionsGraphqlEndpoint = createHttpLink({
  uri: Url.impressionsGraphqlEndpoint,
  credentials: 'include'
})

// const authLink = setContext((_, { headers }) => {
//   return {
//     headers: {
//       Authorization: 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI4MDU2NzYxLCJ1aWQiOjg2MTU0NTIsImlhZCI6IjIwMTktMTItMDUgMTI6NTE6MjggVVRDIiwicGVyIjoibWU6d3JpdGUifQ.RKD5hSMrePJxAsJ0uDwOWf3-bbD7XTcsUqTOgcW9Ao8'
//     }
//   }
// })

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      Authorization: 'Basic Y291bnRlcjpDb3VudGVyMTIjJDU='
    }
  }
})

const linkError = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message.includes('Access is denied') || (path && path[0] === 'authDetails')) {
        app.$router.push('/login').catch(() => { })
      } else {
        app.$root.$emit('infoMessage', 'Error on server call: ' + message)
      }
      console.log(
        '[GraphQL error]' + message
      )
    }
    )
  }
  if (networkError) {
    app.$root.$emit('infoMessage', 'Network error: ' + networkError.message)
    console.log('[Network error]:' + networkError)
  }
})

const internal = new ApolloClient({
  cache: iCache,
  link: linkError.concat(internalGraphqlEndpoint),
  credentials: 'include'
})

const external = new ApolloClient({
  cache: eCache,
  link: linkError.concat(externalGraphqlEndpoint),
  credentials: 'include'
})

const impressionsLink = new ApolloClient({
  cache: impressionsCache,
  link: authLink.concat(linkError).concat(impressionsGraphqlEndpoint)
})

const apolloProvider = new VueApollo({
  clients: {
    internal,
    external,
    impressionsLink
  },
  defaultClient: internal
})

const i18n = new VueI18n({
  locale: 'en',
  messages
})

Vue.use(TiptapVuetifyPlugin, {
  vuetify,
  iconsGroup: 'mdi'
})

const app = new Vue({
  router,
  store,
  vuetify,
  i18n,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')

export {
  app,
  apolloProvider
}
