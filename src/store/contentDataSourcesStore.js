import gql from 'graphql-tag'
import { apolloProvider } from '../main'
import ItemType from './itemType'
import Url from './url'
import $ from 'jquery'

export default {
  state: {
    initDone: false,
    contentDataSources: [],
    contentItemTypes: []
  },
  getters: {
    getContentDataSources (state) {
      return state.contentDataSources
    },
    getContentItemTypes (state) {
      return state.contentItemTypes
    }
  },
  mutations: {
    setContentDataSources (state, payload) {
      state.contentDataSources = payload
    },
    setContentItemTypes (state, payload) {
      state.contentItemTypes = payload
    },
    initDone (state, payload) {
      state.initDone = true
    }
  },
  actions: {
    async loadContentDataSources () {
      const response = await apolloProvider.clients.internal.query({
        query: gql`query {
          getAllContentDataSources {
            id,
            name,
            systemName,
            type,
            data {
              db,
              host
              host,
              dbUrlPrefix,
              port,
              user,
              driverClass
            }
          }
        }
        `,
        fetchPolicy: 'no-cache'
      })
      this.commit('setContentDataSources', response.data.getAllContentDataSources)
    },
    async loadContentItemTypes () {
      const response = await apolloProvider.clients.internal.query({
        query: gql`query {
          getAllContentItemTypes {
            id,
            name,
            data
          }
        }
        `,
        fetchPolicy: 'no-cache'
      })
      this.commit('setContentItemTypes', response.data.getAllContentItemTypes)
      if (!this.state.initDone) {
        response.data.getAllContentItemTypes.forEach((t) => {
          ItemType[t.name] = t.id
        })
        this.commit('initDone')
      }
    },
    async loadDataSourceTableNames (state, contentDataSourceId) {
      const response = await apolloProvider.clients.internal.query({
        query: gql`query ($contentDataSourceId: ID!) {
          getTableNames(contentDataSourceId:$contentDataSourceId)
        }
        `,
        variables: { contentDataSourceId: contentDataSourceId },
        fetchPolicy: 'no-cache'
      })
      return response.data.getTableNames
    },
    async loadDataSourceTableColumnNames (state, { contentDataSourceId, tableName }) {
      const response = await apolloProvider.clients.internal.query({
        query: gql`query ($contentDataSourceId: ID!, $tableName: String!) {
          getTableColumnsNames(contentDataSourceId:$contentDataSourceId, tableName:$tableName)
          {
            name,
            sqlType
          }
        }
        `,
        variables: { contentDataSourceId: contentDataSourceId, tableName: tableName },
        fetchPolicy: 'no-cache'
      })
      return response.data.getTableColumnsNames
    },
    async getContentDataSourceItemTypeMapping (state, { contentItemTypeId, contentDataSourceId }) {
      const response = await apolloProvider.clients.internal.query({
        query: gql`query ($contentItemTypeId: ID!, $contentDataSourceId: ID!) {
          getContentDataSourceItemTypeMapping(
            contentItemTypeId: $contentItemTypeId, contentDataSourceId: $contentDataSourceId
          ) 
          {
            contentItemTypeId,
            contentDataSourceId,
            data 
          }
        }
        `,
        variables: { contentItemTypeId: contentItemTypeId, contentDataSourceId: contentDataSourceId },
        fetchPolicy: 'no-cache'
      })
      return response.data.getContentDataSourceItemTypeMapping
    },
    async saveContentDataSource (state, inputContentDataSource) {
      return apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputContentDataSource : SaveContentDataSourceRequestInput!) {
            saveContentDataSource(
              inputContentDataSource: $inputContentDataSource
            ){
              id,
              errors
            }
          }`,
        variables: { inputContentDataSource: inputContentDataSource }
      })
    },
    async saveContentItemType (state, inputContentItemType) {
      let data = await apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($inputContentItemType : SaveContentItemTypeRequestInput!) {
            saveContentItemType(
              inputContentItemType: $inputContentItemType
            ){
              id,
              errors
            }
          }`,
        variables: { inputContentItemType: inputContentItemType }
      })
      await this.dispatch('loadContentItemTypes')
      return data
    },
    async saveContentDataSourceItemTypeMapping (state, typeMappingRequestInput) {
      let data = await apolloProvider.clients.internal.mutate({
        mutation: gql`mutation ($typeMappingRequestInput : SaveContentDataSourceItemTypeMappingRequestInput!) {
            saveContentDataSourceItemTypeMapping(
              inputContentDataSourceItemTypeMapping: $typeMappingRequestInput 
            ){
              dataSourceId,
              typeId,
              errors
            }
          }`,
        variables: { typeMappingRequestInput: typeMappingRequestInput }
      })
      return data
    },
    initialize () {
      let self = this
      $.ajax({
        url: Url.internalGraphqlEndpoint,
        data: { operationName: null, variables: {}, query: '{\n  getAllContentItemTypes {\n    id\n    name\n    data\n  }\n}\n' },
        method: 'post',
        dataType: 'json',
        async: false,
        success: function (response) {
          if (response.data) {
            self.commit('setContentItemTypes', response.data.getAllContentItemTypes)
            if (!self.state.initDone) {
              response.data.getAllContentItemTypes.forEach((t) => {
                ItemType[t.name] = t.id
              })
              self.commit('initDone')
            }
          }
        }
      })
    }
  }
}
