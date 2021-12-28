import Vue from 'vue'
import Vuex from 'vuex'
import userStore from './userStore'
import contentDataSourcesStore from './contentDataSourcesStore'
import contentItemsStore from './contentItemsStore'
import bannersStore from './bannersStore'
import brandStatisticStore from './brandStatisticStore'
import usersInfoStore from './usersInfoStore'
import suppliersInfoStore from './suppliersInfoStore'
import fileStore from './fileStore'
import contentTypesStore from './contentTypesStore'
import websiteStore from './websiteStore'
import commonStore from '@/store/commonStore'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    userStore,
    contentDataSourcesStore,
    contentItemsStore,
    bannersStore,
    brandStatisticStore,
    usersInfoStore,
    suppliersInfoStore,
    fileStore,
    contentTypesStore,
    websiteStore,
    commonStore
  }
})

export default store
