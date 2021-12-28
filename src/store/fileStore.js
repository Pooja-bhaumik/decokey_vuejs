import Url from '../store/url'
import $ from 'jquery'
import { apolloProvider } from '@/main'
import gql from 'graphql-tag'

export default {
  state: {
    adBannerUserFiles: [],
    adBannerOverviewFiles: []
  },
  getters: {
    listAdBannerUserFiles (state) {
      return state.adBannerUserFiles
    },
    listAdBannerOverviewFiles (state) {
      return state.adBannerOverviewFiles
    },
    getBaseStoreUrl () {
      return Url.baseS3Url
    }
  },
  mutations: {
    setAdBannerUserFiles (state, payload) {
      state.adBannerUserFiles = payload
    },
    setAdBannerOverviewFiles (state, payload) {
      state.adBannerOverviewFiles = payload
    }
  },
  actions: {
    async loadAdBannerUserFiles (state, adBannerId) {
      this.commit('setAdBannerUserFiles', [])
      let storedFiles = await $.ajax({
        url: Url.backEndUrl + '/listAdBannerImages/' + adBannerId,
        xhrFields: {
          withCredentials: true
        },
        type: 'GET'
      })
      // if (storedFiles && storedFiles.length) {
      //   storedFiles.forEach((part, index, theArray) => {
      //     theArray[index] = Url.baseS3Url + part
      //   })
      // }

      this.commit('setAdBannerUserFiles', storedFiles)

      return storedFiles
    },
    async loadAdBannerOverview (state, adBannerId) {
      this.commit('setAdBannerOverviewFiles', [])
      let storedFiles = await $.ajax({
        url: Url.backEndUrl + '/listAdBannerOverviewImages/' + adBannerId,
        xhrFields: {
          withCredentials: true
        },
        type: 'GET'
      })
      this.commit('setAdBannerOverviewFiles', storedFiles)

      return storedFiles
    },
    async loadCmsContentItemImages (state, cmsContentItemId) {
      return $.ajax({
        url: Url.backEndUrl + '/listCmsContentItemImages/' + cmsContentItemId,
        xhrFields: {
          withCredentials: true
        },
        type: 'GET'
      })
    },
    uploadAdBannerImage (state, { file, adBannerId }) {
      let data = new FormData()
      data.append('file', file)
      return $.ajax({
        url: Url.backEndUrl + '/uploadAdBannerImg/' + adBannerId,
        xhrFields: {
          withCredentials: true
        },
        data: data,
        processData: false,
        contentType: false,
        type: 'POST'
      })
    },
    uploadAdBannerOverview (state, { file, adBannerId }) {
      let data = new FormData()
      data.append('file', file)
      return $.ajax({
        url: Url.backEndUrl + '/uploadAdBannerOverviewImg/' + adBannerId,
        xhrFields: {
          withCredentials: true
        },
        data: data,
        processData: false,
        contentType: false,
        type: 'POST'
      })
    },
    deleteImageOverview (state, { inputAdBannerItemId, inputImageUrl }) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputAdBannerItemId: Int!, $inputImageUrl: String!) {
          deleteOverviewImage(inputAdBannerItemId:$inputAdBannerItemId, inputImageUrl: $inputImageUrl)
          {
            imageActivated,
            imageUrls
          }
        }
        `,
        variables: { inputAdBannerItemId: inputAdBannerItemId, inputImageUrl: inputImageUrl }
      }).then(response => response.data.deleteOverviewImage)
    },
    uploadCmsContentItemImage (state, { file, cmsContentItemId }) {
      let data = new FormData()
      data.append('file', file)
      return $.ajax({
        url: Url.backEndUrl + '/uploadCmsContentItemImg/' + cmsContentItemId,
        xhrFields: {
          withCredentials: true
        },
        data: data,
        processData: false,
        contentType: false,
        type: 'POST'
      })
    },
    deleteAdBannerUserImage (state, imageUrl) {
      return $.ajax({
        url: Url.backEndUrl + '/deleteAdBannerImg',
        xhrFields: {
          withCredentials: true
        },
        data: { name: imageUrl.substr(imageUrl.lastIndexOf('/') + 1) },
        type: 'GET'
      })
    },
    deleteCmsContentItemImage (state, { imageUrl, cmsContentItemId }) {
      return $.ajax({
        url: Url.backEndUrl + '/deleteCmsContentItemImg/' + cmsContentItemId,
        xhrFields: {
          withCredentials: true
        },
        data: { name: imageUrl.substr(imageUrl.lastIndexOf('/') + 1) },
        type: 'GET'
      })
    },
    uploadProjectLogo (state, { file, projectId }) {
      let data = new FormData()
      data.append('file', file)
      return $.ajax({
        url: Url.backEndUrl + '/uploadProjectLogo/' + projectId,
        xhrFields: {
          withCredentials: true
        },
        data: data,
        processData: false,
        contentType: false,
        type: 'POST'
      })
    },
    async loadProjectLogo (state, projectId) {
      return $.ajax({
        url: Url.backEndUrl + '/getProjectLogo/' + projectId,
        xhrFields: {
          withCredentials: true
        },
        type: 'GET'
      })
    }
  }
}
