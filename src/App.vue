<template>
  <v-app id="">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      app
    >
      <v-list shaped>
        <v-subheader>MENU</v-subheader>

        <v-list-group
          v-if="this.$store.getters.getUserDetails"
          prepend-icon="mdi-account-circle"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-title>Profile</v-list-item-title>
          </template>
          <v-list-item link @click="changePasswordDialog = true">
              <v-list-item-title v-text="'Change password'"></v-list-item-title>
              <v-list-item-icon>
                <v-icon v-text="'mdi-lock-question'"></v-icon>
              </v-list-item-icon>
          </v-list-item>
        </v-list-group>

        <div v-for="link in availableLinks" :key="link.title">
          <v-list-group
            v-if="link.childrens"
            :prepend-icon="link.icon"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-title>{{ link.title }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="childrenLink in link.childrens"
              :key="childrenLink.title"
              link
              :to="childrenLink.url"
            >
                <v-list-item-title v-text="childrenLink.title"></v-list-item-title>
                <v-list-item-icon>
                  <v-icon v-text="childrenLink.icon"></v-icon>
                </v-list-item-icon>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :to="link.url"
            color="primary"
          >
            <v-list-item-icon>
              <v-icon v-text="link.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="link.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary white--text"
      :height="longAppBar ? '155px' : '56px'"
    >
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer"/>
      <v-select v-if="this.$store.getters.getUserDetails"
                :items="projects" append-icon="" class="withoutLine" v-model="currentProject" style="height: 56px; max-width: 200px; padding-top: 4px"
      @input="projectChanged">
        <template slot="selection" slot-scope="data">
          <v-list-item-content v-if="data.item.logo" style="padding: unset; height: 46px">
            <img style="max-width: 110px; max-height: 46px; margin-top: auto; margin-bottom: auto" :src="data.item.logo" alt="No logo" />
          </v-list-item-content>
          <v-list-item-content v-if="!data.item.logo" style="padding: unset; height: 56px; overflow: inherit; color: white">
            <v-list-item-title class="pl-10" v-text="data.item.name"></v-list-item-title>
          </v-list-item-content>
        </template>
        <template slot="item" slot-scope="data">
          <!------logo-------->
          <div class="mt-1" :style="{ width: data.item.logo ? '35%' : '0%' }" v-if="data.item.logo">
            <v-img contain style="max-width: 110px; max-height: 46px;" :src="data.item.logo" alt="No logo" />
          </div>
          <div :style="{ width: data.item.logo ? '65%' : '100%' }">
            <div class="pl-10" v-text="data.item.name"></div>
          </div>
        </template>
      </v-select>
      <portal-target class="portal-target" name="header-items-portal"></portal-target>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          icon
          @click="onLogout"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
      <change-password :changePasswordDialog.sync="changePasswordDialog"></change-password>
    </v-content>
    <v-footer
      color="primary"
      app
    >
      <v-snackbar v-model="showInfoMessages" :multi-line="true">
        <span v-for="info in infoMessages" :key="info">{{ info }}</span>
        <v-btn  color="red" text @click="infoMessages = []">Close</v-btn>
      </v-snackbar>
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
import Role from './store/roles'
import ChangePassword from '@/components/Auth/ChangePassword.vue'

export default {
  beforeCreate () {
    this.$store.dispatch('initialize')
    this.$store.dispatch('loadUserDetails')
  },
  mounted () {
    this.$root.$on('infoMessage', e => {
      this.infoMessages.push(e)
    })
    this.$root.$on('drawerVisible', e => {
      this.drawer = e
    })
    this.$root.$on('longAppBar', e => {
      this.longAppBar = e
    })
  },
  data: () => ({
    drawer: false,
    longAppBar: false,
    selectProjectLink: {
      title: 'Projects', icon: 'mdi-box-shadow', url: '/projects', role: [Role.Root]
    },
    decokayLinks: [
      {
        title: 'Enviroments',
        icon: 'mdi-format-list-bulleted',
        url: '/contentType',
        role: [Role.Root],
        childrens: [
          {
            title: 'ContentType', url: '/contentType', role: [Role.Root]
          },
          {
            title: 'Data Source', url: '/dataSource', role: [Role.Root]
          },
          {
            title: 'Content items', url: '/contentItems', role: [Role.Root]
          },
          {
            title: 'Users', url: '/usersInfo', role: [Role.Root]
          },
          {
            title: 'Suppliers', url: '/suppliersInfo', role: [Role.Root]
          },
          {
            title: 'Website', url: '/websites', role: [Role.Root]
          },
          {
            title: 'Content tag', url: '/contentTags', role: [Role.Root]
          },
          {
            title: 'Authors', url: '/authors', role: [Role.Root]
          },
          {
            title: 'Article categories', url: '/articleCategories', role: [Role.Root]
          },
          {
            title: 'Product groups', url: '/productGroups', role: [Role.Root]
          },
          {
            title: 'Target audiences', url: '/targetAudiences', role: [Role.Root]
          },
          {
            title: 'Brands', url: '/brands', role: [Role.Root]
          },
          {
            title: 'Store branch', url: '/storeBranch', role: [Role.Root]
          }
        ]
      },
      {
        title: 'Ad Banner Sets', icon: 'mdi-box-shadow', url: '/banners', role: [Role.Root]
      },
      {
        title: 'Сontent items List', icon: 'mdi-box-shadow', url: '/cmsContentItems', role: [Role.Root, Role.ContentManager]
      },
      {
        title: 'Brand statistic', icon: 'mdi-clipboard-text-multiple-outline', url: '/brandStatistic', role: [Role.Root]
      },
      {
        title: 'Brand statistic dashboard', icon: 'mdi-clipboard-text-multiple-outline', url: '/brandStatisticDashboard', role: [Role.Root, Role.Supplier]
      },
      {
        title: 'Social Media Statistics', icon: 'mdi-clipboard-text-multiple-outline', url: '/socialMediaStatisticDashboard', role: [Role.Root, Role.Supplier]
      },
      {
        title: 'Campaign strategy sandbox', icon: 'mdi-clipboard-text-multiple-outline', url: '/campaignStrategyTest', role: [Role.Root]
      },
      {
        title: 'CTA statistic', icon: 'mdi-clipboard-text-multiple-outline', url: '/ctaStat', role: [Role.Root]
      }
      // {
      //   title: 'New Banner', icon: 'mdi-file-document-edit', url: '/banner'
      // }
    ],
    lightAndLivingLinks: [
      {
        title: 'Enviroments',
        icon: 'mdi-format-list-bulleted',
        url: '/contentType',
        role: [Role.Root],
        childrens: []
      }
    ],
    infoMessages: [],
    project: null,
    changePasswordDialog: false
  }),
  computed: {
    showInfoMessages: {
      get () {
        return this.infoMessages.length > 0
      },
      set (newVal) {
        this.infoMessages = []
      }
    },
    availableLinks () {
      if (!this.$store.getters.getUserDetails) {
        return []
      }
      let list = [this.selectProjectLink]

      if (this.currentProject) {
        if (this.currentProject.name === 'Decokay') {
          list = list.concat(this.decokayLinks)
        } else {
          list = list.concat(this.lightAndLivingLinks)
        }
      }
      return list.filter(link => !link.role || link.role.length === 0 || this.$store.getters.userHasRoles(link.role))
    },
    projects () {
      return this.$store.getters.getProjects
    },
    userDetails () {
      return this.$store.getters.getUserDetails
    },
    currentProject: {
      get () {
        return this.project
      },
      set (newVal) {
        if (newVal) {
          this.project = newVal
        }
      }
    }
  },
  methods: {
    onLogout () {
      this.project = null
      this.$store.dispatch('logout')
      this.$router.push('/login').catch(() => { })
    },
    projectChanged () {
      if (this.$router.currentRoute.path !== '/projects' && this.$store.getters.userHasRoles('ROLE_ROOT')) {
        console.log(this.$router.currentRoute)
        this.$router.replace('/projects')
      }
    }
  },
  watch: {
    drawer (val) {
      this.$root.$emit('drawer', val)
    },
    projects (newProjects) {
      if (!this.currentProject) {
        this.currentProject = newProjects[0]
      }
    },
    userDetails (newUserDetails) {
      if (newUserDetails) {
        this.$store.dispatch('getProjectsAll')
      }
    }
  },
  components: {
    ChangePassword
  }
}
</script>

<style scoped>
  .pointer{
    cursor: pointer;
  }
  .withoutLine.v-text-field > .v-input__control > .v-input__slot:after {
    border-style: none;
  }
  .withoutLine.v-text-field > .v-input__control > .v-input__slot:before {
    border-style: none;
  }
  .withoutLine.v-text-field > .v-input__control > .v-input__slot  input {
    display: none;
    height: 56px;
  }
</style>
