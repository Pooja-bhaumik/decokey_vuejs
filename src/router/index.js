import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import ContentType from '@/components/ContentType/ContentType'
import DataSource from '@/components/DataSource/DataSource'
import ContentItems from '@/components/ContentItems/ContentItems'
import CmsContentItemsList from '@/components/CmsContentItems/CmsContentItemsList'
import NewBanner from '@/components/Banners/NewBanner'
import Login from '@/components/Auth/Login'
import BrandStatistic from '@/components/BrandStatistic/BrandStatistic'
import BrandStatisticDashboard from '@/components/BrandStatistic/BrandStatisticDashboard'
import CampaignStrategyTest from '@/components/test/CampaignStrategyTest'
import UsersInfo from '@/components/UsersInfo/UsersInfo'
import SuppliersInfo from '@/components/SuppliersInfo/SuppliersInfo'
import Websites from '@/components/ContentItems/Websites'
import ContentTags from '@/components/ContentItems/ContentTags'
import Authors from '@/components/ContentItems/Authors'
import ArticleCategories from '@/components/ContentItems/ArticleCategories'
import ProductGroups from '@/components/ContentItems/ProductGroups'
import TargetAudiences from '@/components/ContentItems/TargetAudiences'
import Brands from '@/components/ContentItems/Brands'
import StoreBranch from '@/components/ContentItems/StoreBranch'
import BannerList from '@/components/Banners/BannerList'
import ProjectList from '@/components/Project/ProjectList'
import CTAStatistic from '@/components/BrandStatistic/CTAStatistic'
import SocialMediaStatistic from '@/components/BrandStatistic/SocialMediaStatistic'
import store from '../store'
import Role from '../store/roles'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'home',
    component: Home
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectList,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/contentType',
    name: 'contentType',
    component: ContentType,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/dataSource',
    name: 'dataSource',
    component: DataSource,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/contentItems',
    name: 'contentItems',
    component: ContentItems,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/websites',
    name: 'websites',
    component: Websites,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/contentTags',
    name: 'contentTags',
    component: ContentTags,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/authors',
    name: 'authors',
    component: Authors,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/articleCategories',
    name: 'articleCategories',
    component: ArticleCategories,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/productGroups',
    name: 'productGroups',
    component: ProductGroups,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/targetAudiences',
    name: 'targetAudiences',
    component: TargetAudiences,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/brands',
    name: 'brands',
    component: Brands,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/storeBranch',
    name: 'storeBranch',
    component: StoreBranch,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/banners',
    name: 'banners',
    component: BannerList,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/cmsContentItems',
    name: 'cmsContentItems',
    component: CmsContentItemsList,
    meta: { authorize: [Role.Root, Role.ContentManager] }
  },
  {
    path: '/banner',
    name: 'banner',
    component: NewBanner
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/brandStatistic',
    name: 'brandStatistic',
    component: BrandStatistic,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/brandStatisticDashboard',
    name: 'brandStatisticDashboard',
    component: BrandStatisticDashboard,
    meta: { authorize: [Role.Root, Role.Supplier] }
  },
  {
    path: '/socialMediaStatisticDashboard',
    name: 'socialMediaStatisticDashboard',
    component: SocialMediaStatistic,
    meta: { authorize: [Role.Root, Role.Supplier] }
  },
  {
    path: '/campaignStrategyTest',
    name: 'campaignStrategyTest',
    component: CampaignStrategyTest,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/usersInfo',
    name: 'usersInfo',
    component: UsersInfo,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/suppliersInfo',
    name: 'suppliersInfo',
    component: SuppliersInfo,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '/ctaStat',
    name: 'ctaInfo',
    component: CTAStatistic,
    meta: { authorize: [Role.Root] }
  },
  {
    path: '*',
    component: Home
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize } = to.meta
  let currentUser = store.getters.getUserDetails
  if (from.name === 'brandStatisticDashboard') {
    router.app.$emit('longAppBar', false)
  }

  if (authorize) {
    if (!currentUser) {
      store.dispatch('loadUserDetails').then((resp) => {
        currentUser = resp.data.authDetails
        // check if route is restricted by role
        if (authorize.length && currentUser.authorities.filter(r => authorize.indexOf(r.authority) >= 0).length === 0) {
          // role not authorised so redirect to home page
          router.app.$emit('infoMessage', 'Access denied')
          return next({ path: '/' })
        }
      }, () => {
        // not logged in so redirect to login page with the return url
        return next({ path: '/login', query: { returnUrl: to.path } })
      })
    } else {
      // check if route is restricted by role
      if (authorize.length && currentUser.authorities.filter(r => authorize.indexOf(r.authority) >= 0).length === 0) {
        // role not authorised so redirect to home page
        router.app.$emit('infoMessage', 'Access denied')
        return next({ path: '/' })
      }
    }
  }

  next()
})

export default router
