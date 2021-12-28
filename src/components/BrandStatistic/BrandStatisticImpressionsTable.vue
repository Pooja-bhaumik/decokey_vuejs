<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <v-row>
    <v-col md="12" sm="12" cols="12">
      <v-card class="mx-auto" outlined>
        <v-tabs v-model="activeTab">
          <v-tab key="pages">Pages</v-tab>
          <v-tab key="websites">Websites</v-tab>

          <v-tab-item key="pages" class="mt-3">
            <v-row>
              <v-col cols="12" lg="12">
                <v-btn-toggle
                  v-model="tablePagesType"
                  borderless
                  mandatory
                  tile
                  class="btn-group-custom"
                >
                  <v-btn
                    value="total"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Total
                  </v-btn>

                  <v-btn
                    value="BRAND_CONTENT_ITEM"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Brand content
                  </v-btn>

                  <v-btn
                    value="BRAND_LOGO"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Brand logo
                  </v-btn>

                  <v-btn
                    value="BRAND_PROFILE"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Brand profile
                  </v-btn>

                  <v-btn
                    value="AD_BANNER"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Ad banner
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" lg="12">
                <v-data-table
                  :loading="loading"
                  :headers="headersByPages"
                  :items="impressionStatisticByPages"
                  :sort-by="['impressed']"
                  :sort-desc="[true]"
                  :page.sync="pageByPages"
                  :items-per-page="itemsPerPage"
                  :footer-props="footerProps"
                  :hide-default-footer="hideFooter"
                >
                  <template v-slot:item.pageTitle="{ item }">
                    <a :href="item.pageUrl" target="_blank" :html="item.pageDomain">{{item.pageTitle}}</a>
                  </template>
                  <template v-slot:item.impressed="{ item }">
                    {{ new Intl.NumberFormat('de-DE').format(item.impressed) }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row
              v-if="
                hideFooter &&
                  impressionStatisticByPages.length !== 0 &&
                  itemsPerPage < impressionStatisticByPages.length
              "
            >
              <v-col cols="8" offset="2">
                <v-btn block color="primary" @click="showMoreImpressions">
                  + More impressions
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>

          <v-tab-item key="websites" class="mt-3">
            <v-row>
              <v-col col="12" lg="12">
                <v-btn-toggle
                  v-model="tableWebsitesType"
                  borderless
                  mandatory
                  tile
                  class="btn-group-custom"
                >
                  <v-btn
                    value="total"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Total
                  </v-btn>

                  <v-btn
                    value="BRAND_CONTENT_ITEM"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Brand content
                  </v-btn>

                  <v-btn
                    value="BRAND_LOGO"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Brand logo
                  </v-btn>

                  <v-btn
                    value="BRAND_PROFILE"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Brand profile
                  </v-btn>

                  <v-btn
                    value="AD_BANNER"
                    :fab="buttonGroupOptions.fab"
                    :large="buttonGroupOptions.large"
                    :small="buttonGroupOptions.small"
                    :x-small="buttonGroupOptions.xSmall"
                  >
                    Ad banner
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row>
              <v-col col="12" lg="12">
                <v-data-table
                  :loading="loading"
                  :headers="headersByWebsites"
                  :items="impressionStatisticByWebsites"
                  :sort-by="['impressed']"
                  :sort-desc="[true]"
                  :page.sync="pageByWebsites"
                  :items-per-page="itemsPerPage"
                  :footer-props="footerProps"
                  :hide-default-footer="hideFooter"
                >
                  <template v-slot:item.pageDomain="{ item }">
                    <a :href="'https://'+item.pageDomain" target="_blank" :html="item.pageDomain">{{item.pageDomain}}</a>
                  </template>
                  <template v-slot:item.impressed="{ item }">
                    {{ new Intl.NumberFormat('de-DE').format(item.impressed) }}
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row
              v-if="
                hideFooter &&
                  impressionStatisticByPages.length !== 0 &&
                  itemsPerPage < impressionStatisticByWebsites.length
              "
            >
              <v-col cols="8" offset="2">
                <v-btn block color="primary" @click="showMoreImpressions">
                  + More impressions
                </v-btn>
              </v-col>
            </v-row>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    brand: Object,
    buttonGroupOptions: Object,
    dateRange: Array,
    footerProps: Object,
    hideFooter: Boolean,
    formatDateString: Function
  },
  data: () => ({
    loading: false,
    activeTab: 0,
    tablePagesType: 'total',
    tableWebsitesType: 'total',
    impressionStatisticByPages: [],
    impressionStatisticByPagesTotal: 0,
    impressionStatisticByWebsites: [],
    impressionStatisticByWebsitesTotal: 0,
    headersByPages: [
      { text: 'Page', value: 'pageTitle' },
      { text: 'Impressions', value: 'impressed' }
    ],
    headersByWebsites: [
      { text: 'Domain', value: 'pageDomain' },
      { text: 'Impressions', value: 'impressed' }
    ],
    pageByPages: 1,
    pageByWebsites: 1,
    itemsPerPage: 10
  }),
  computed: {
    getImpressionTablePagesSelectedTypes () {
      return this.tablePagesType === 'total' ? ['BRAND_CONTENT_ITEM', 'BRAND_LOGO', 'BRAND_PROFILE', 'AD_BANNER'] : this.tablePagesType
    },
    getImpressionTableWebsitesSelectedTypes () {
      return this.tableWebsitesType === 'total' ? ['BRAND_CONTENT_ITEM', 'BRAND_LOGO', 'BRAND_PROFILE', 'AD_BANNER'] : this.tableWebsitesType
    }
  },
  watch: {
    brand () {
      this.loading = true
      this.activeTab = 0
      this.pageByPages = 1
      this.pageByWebsites = 1
      this.tablePagesType = 'total'
      this.tableWebsitesType = 'total'
      this.loadImpressionStatisticByPages()
    },

    dateRange () {
      this.loadImpressionStatisticByPages()
      this.loadImpressionStatisticByWebsites()
    },

    activeTab (val) {
      this.itemsPerPage = 10
      if (this.impressionStatisticByWebsites.length === 0) {
        this.loadImpressionStatisticByWebsites()
      }
    },
    tablePagesType (val) {
      if (this.brand) {
        this.loading = true
        this.loadImpressionStatisticByPages()
      }
    },
    tableWebsitesType (val) {
      if (this.brand) {
        this.loading = true
        this.loadImpressionStatisticByWebsites()
      }
    }
  },
  methods: {
    showMoreImpressions () {
      this.itemsPerPage += 10
    },

    loadImpressionStatisticByPages () {
      this.$store.dispatch('loadImpressionStatisticByPages', { fromDate: this.formatDateString(this.dateRange[0]), toDate: this.formatDateString(this.dateRange[1]), brandId: this.brand.id, contentType: this.getImpressionTablePagesSelectedTypes }).then(response => {
        this.impressionStatisticByPages = this.$store.getters.getImpressionStatisticByPages
        this.impressionStatisticByPagesTotal = this.impressionStatisticByPages.reduce(function (sum, item) {
          return sum + item.impressed
        }, 0)
        this.loading = false
        this.pageByPages = 1
        this.itemsPerPage = 10
      })
    },

    loadImpressionStatisticByWebsites () {
      this.$store.dispatch('loadImpressionStatisticByWebsites', { fromDate: this.formatDateString(this.dateRange[0]), toDate: this.formatDateString(this.dateRange[1]), brandId: this.brand.id, contentType: this.getImpressionTableWebsitesSelectedTypes }).then(response => {
        this.impressionStatisticByWebsites = this.$store.getters.getImpressionStatisticByWebsites
        this.impressionStatisticByWebsitesTotal = this.impressionStatisticByWebsites.reduce(function (sum, item) {
          return sum + item.impressed
        }, 0)
        this.loading = false
        this.pageByWebsites = 1
        this.itemsPerPage = 10
      })
    }
  }
}
</script>
