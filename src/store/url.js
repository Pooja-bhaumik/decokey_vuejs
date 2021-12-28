const backEndUrl = process.env.VUE_APP_CONTENT_PROVIDER_BASE_URL
const counterUrl = process.env.VUE_APP_COUNTER_BASE_URL
const Url = {
  backEndUrl: backEndUrl,
  internalGraphqlEndpoint: backEndUrl + '/graphql',
  externalGraphqlEndpoint: backEndUrl + '/clientGraphql',
  impressionsGraphqlEndpoint: counterUrl + '/graphql',
  login: backEndUrl + '/j_spring_security_check',
  logout: backEndUrl + '/logout'
}
export default Url
