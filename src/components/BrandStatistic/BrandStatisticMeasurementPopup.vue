<template>
  <v-dialog v-model="measurementPopup" max-width="50%">
    <v-card>
      <v-card-title>
        Impressions of {{ tableTitle }}
        <v-spacer></v-spacer>
        <v-icon style="cursor: pointer" @click="close()">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <v-data-table
            :headers="headers"
            :items="brandStatisticList"
            :search="titleValue"
            :loading="loading"
            :sort-by="sortColumn"
            :sort-desc="true"
            :page.sync="page"
            :items-per-page.sync="itemsPerPage"
            :footer-props="{
              'items-per-page-options': [10, 25, 50, 100, 250, 500]
            }"
        >
          <template v-slot:top>
            <v-container>
              <v-row>
                <v-col xs="12">
                  <v-text-field
                    v-model="titleValue"
                    append-icon="mdi-magnify"
                    hide-details
                    label="Page Title"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </template>
          <template v-slot:item.pageTitle="{ item }">
            <a :href="item.pageUrl" target="_blank" style="color: rgba(0, 0, 0, 0.87);; text-decoration: none">{{ item.pageTitle }}</a>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    measurementPopupOn: Boolean,
    brandInfo: Object,
    formatDateString: Function,
    parseBrandStatistic: Function
  },
  data: () => ({
    tableTitle: '',
    titleValue: '',
    loading: false,
    headers: '',
    brandStatisticList: [],
    sortColumn: '',
    page: 1,
    itemsPerPage: 10
  }),
  computed: {
    measurementPopup: {
      get () {
        return this.measurementPopupOn
      },
      set (val) {
        this.$emit('update:measurementPopupOn', val)
      }
    }
  },
  watch: {
    brandInfo (brandInfo) {
      const brandContentTypes = {
        BRAND_CONTENT_ITEM: 'Brand Content Item',
        BRAND_PROFILE: 'Brand Profile',
        BRAND_LOGO: 'Brand Logo',
        BRAND_ADBANNER: 'Brand Adbanner'
      }
      this.page = 1
      this.itemsPerPage = 10
      this.titleValue = ''
      this.sortColumn = `measurement.${brandInfo.measurement}`
      this.headers = [
        { text: 'Page title', value: 'pageTitle' },
        {
          text: brandInfo.measurement,
          value: `measurement.${brandInfo.measurement}`,
          filterable: false
        }
      ]
      this.tableTitle = brandContentTypes[brandInfo.contentType]
      this.loadBrandStatisticByContentType(brandInfo.brandId, brandInfo.contentType, brandInfo.measurement, brandInfo.dateTime)
    }
  },
  methods: {
    close () {
      this.measurementPopup = false
    },

    loadBrandStatisticByContentType (brandId, contentType, measurement, dateTime) {
      const startDate = this.formatDateString(dateTime[0])
      const endDate = dateTime[1] ? this.formatDateString(dateTime[1]) : null
      this.brandStatisticList = []
      this.loading = true
      this.$store.dispatch('loadBrandStatistic', {
        fromDate: startDate,
        toDate: endDate,
        contentType: [contentType],
        brandId: brandId,
        measurements: measurement,
        pageInfo: 'pageTitle, pageUrl'
      }).then(() => {
        const brandStatistic = this.$store.getters.getBrandStatistic
        this.brandStatisticList = brandStatistic[0].statistic
        this.loading = false
      })
    }
  }
}
</script>
