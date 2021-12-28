<template>
  <v-container>
    <h2>{{ $t('message.brandStats') }}</h2>
    <brand-statistic-measurement-popup
      :measurementPopupOn.sync="measurementPopupOn"
      :brandInfo="brandInfo"
      :formatDateString="formatDateString"
      :parseBrandStatistic="parseBrandStatistic"
    ></brand-statistic-measurement-popup>
    <v-data-table
        :headers="headers"
        :items="brandStatisticList"
        :sort-by="['brandName']"
        :loading="loading"
    >
      <template v-slot:top>
        <v-container>
          <v-row>
            <v-col lg="2" md="2" sm="6" offset-md="0" offset-sm="3" class="mb-md-0 mb-sm-4" align-self="center">
              <v-btn color="primary" block @click="searchContent">Search</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex align-center" lg="4" md="4" sm="4">
              <vue-2-datepicker :dateTime.sync="dateTime" :showTimePanelToggle="true"></vue-2-datepicker>
            </v-col>
            <v-col class="d-flex align-center" lg="4" md="4" sm="4" xs="4">
               <v-select
                v-model="filterMeasurements"
                :items="measurements"
                attach
                small-chips
                label="Measurements"
                multiple
              ></v-select>
            </v-col>
            <v-col class="d-flex align-center" lg="1" md="1" sm="1" xs="1" >
              <v-icon v-text="'mdi-reload'" style="cursor: pointer" :style="[dateTime[1] ? reloadOpacityStyles : '']" @click="refreshTable()"></v-icon>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.brandLogo="{ item }">
        <img style="max-width: 100px; max-height: 50px" v-bind:src="item.brandLogo">
      </template>
      <template v-slot:item.contentItem="{ item }">
        <div class="measurement-number-wrapper">
          <v-tooltip top open-delay="500" v-for="(measurement, key, idx) in item.contentItem.measurement" :key="idx">
            <template v-slot:activator="{ on }">
              <div
                class="measurement-number"
                v-on="on"
                :style="{ cursor: measurement ? 'pointer' : 'default', textDecoration: measurement ? 'underline' : 'none' }"
                @click="openMeasurementPopup(measurement, item.brandId, item.contentItem.contentType, key)"
              >{{new Intl.NumberFormat('de-DE').format(measurement)}}</div>
            </template>
            <span>{{key}}</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:item.logo="{ item }">
        <div class="measurement-number-wrapper">
          <v-tooltip top open-delay="500" v-for="(measurement, key, idx) in item.logo.measurement" :key="idx">
            <template v-slot:activator="{ on }">
              <div
                class="measurement-number"
                v-on="on"
                :style="{ cursor: measurement ? 'pointer' : 'default', textDecoration: measurement ? 'underline' : 'none' }"
                @click="openMeasurementPopup(measurement, item.brandId, item.logo.contentType, key)"
                >{{new Intl.NumberFormat('de-DE').format(measurement)}}</div>
            </template>
            <span>{{key}}</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:item.profile="{ item }">
        <div class="measurement-number-wrapper">
          <v-tooltip top open-delay="500" v-for="(measurement, key, idx) in item.profile.measurement" :key="idx">
            <template v-slot:activator="{ on }">
              <div
                class="measurement-number"
                v-on="on"
                :style="{ cursor: measurement ? 'pointer' : 'default', textDecoration: measurement ? 'underline' : 'none' }"
                @click="openMeasurementPopup(measurement, item.brandId, item.profile.contentType, key)"
                >{{new Intl.NumberFormat('de-DE').format(measurement)}}</div>
            </template>
            <span>{{key}}</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:item.adBanner="{ item }">
        <div class="measurement-number-wrapper">
          <v-tooltip top open-delay="500" v-for="(measurement, key, idx) in item.adBanner.measurement" :key="idx">
            <template v-slot:activator="{ on }">
              <div
                class="measurement-number"
                v-on="on"
                :style="{ cursor: measurement ? 'pointer' : 'default', textDecoration: measurement ? 'underline' : 'none' }"
                @click="openMeasurementPopup(measurement, item.brandId, item.adBanner.contentType, key)"
                >{{new Intl.NumberFormat('de-DE').format(measurement)}}</div>
            </template>
            <span>{{key}}</span>
          </v-tooltip>
        </div>
      </template>
      <template v-slot:item.total="{ item }">
        <div class="measurement-number-wrapper">
          <v-tooltip top open-delay="500" v-for="(total, key, idx) in item.total.measurement" :key="idx">
            <template v-slot:activator="{ on }">
              <div class="measurement-number measurement-number--default" v-on="on">{{new Intl.NumberFormat('de-DE').format(total)}}</div>
            </template>
            <span>{{key}}</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import BrandStatisticMeasurementPopup from '@/components/BrandStatistic/BrandStatisticMeasurementPopup'
import Vue2Datepicker from '@/components/BrandStatistic/Vue2Datepicker'

export default {
  data: function () {
    return {
      measurementPopupOn: false,
      loading: false,
      dateTime: [
        this.$moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm'),
        this.$moment().format('YYYY-MM-DD HH:mm')
      ],
      headers: [
        { text: 'Brand name', value: 'brandName' },
        { text: 'Brand logo', value: 'brandLogo', align: 'center' },
        { text: 'Content item', value: 'contentItem', align: 'center', sortable: false },
        { text: 'Logo', value: 'logo', align: 'center', sortable: false },
        { text: 'Profile', value: 'profile', align: 'center', sortable: false },
        { text: 'Ad banner', value: 'adBanner', align: 'center', sortable: false },
        { text: 'Total', value: 'total', align: 'center', sortable: false }
      ],
      brandStatisticList: [],
      brandInfo: {},
      filterMeasurements: ['created', 'delivered', 'impressed', 'uniqueImpressed'],
      measurements: [
        {
          text: 'Created',
          value: 'created'
        },
        {
          text: 'Delivered',
          value: 'delivered'
        },
        {
          text: 'Impressed',
          value: 'impressed'
        },
        {
          text: 'Unique impressed',
          value: 'uniqueImpressed'
        }
      ],

      timePreset: '',

      reloadOpacityStyles: {
        opacity: 0.4,
        cursor: 'default'
      }
    }
  },

  watch: {
    dateTime (date) {
      console.log(date)
    }
  },

  methods: {
    searchContent () {
      this.loadBrandStatistic()
    },

    formatDateString (dateStr) {
      let momentObj = this.$moment(dateStr)
      let momentString = momentObj.format('YYYY-MM-DDTHH:mm:ssZ')
      return momentString
    },

    openMeasurementPopup (measurementValue, brandId, contentType, measurement) {
      if (measurementValue > 0) {
        this.measurementPopupOn = true
        this.brandInfo = { brandId, contentType, measurement, dateTime: this.dateTime }
      }
    },

    refreshTable () {
      this.loadBrandStatistic(true)
    },

    loadBrandStatistic (reload) {
      this.loading = true
      if (!this.dateTime || reload) {
        this.dateTime = [
          this.$moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm'),
          this.$moment().format('YYYY-MM-DD HH:mm')
        ]
      }

      const fromDate = this.dateTime[0] ? this.formatDateString(this.dateTime[0]) : this.$moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')
      const toDate = this.dateTime[1] ? this.formatDateString(this.dateTime[1]) : this.$moment().format('YYYY-MM-DD HH:mm')
      const measurements = this.filterMeasurements.join(',')

      this.$store.dispatch('loadBrandStatistic', { fromDate: fromDate, toDate: toDate, measurements: measurements, contentType: ['BRAND_CONTENT_ITEM', 'BRAND_LOGO', 'BRAND_PROFILE', 'AD_BANNER'] }).then(() => {
        const brandStatistic = this.$store.getters.getBrandStatistic
        this.brandStatisticList = []
        this.brandStatisticList = this.parseBrandStatistic(brandStatistic)
        this.loading = false
      })
    },

    parseBrandStatistic (brandStatistic) {
      const brandContentItems = this.$store.getters.getBrandContentItems
      const brandStatisticList = []
      brandStatistic.forEach(brand => {
        let name
        let logoUrl
        let contentItemStatistic = { measurement: {} }
        let logoStatistic = { measurement: {} }
        let profileStatistic = { measurement: {} }
        let adBannerStatistic = { measurement: {} }
        let totalStatistic = { measurement: {} }
        let intermediateObject

        // Set measurements
        brand.statistic.forEach((brandStatistic, idx) => {
          switch (brandStatistic.contentType) {
            case 'BRAND_CONTENT_ITEM':
              contentItemStatistic = brandStatistic
              break
            case 'BRAND_LOGO':
              logoStatistic = brandStatistic
              break
            case 'BRAND_PROFILE':
              profileStatistic = brandStatistic
              break
            case 'AD_BANNER':
              adBannerStatistic = brandStatistic
          }
        })

        // Get object from content items with same id
        intermediateObject = brandContentItems.find(el => {
          return +el.id === +brand.brandId
        });

        // Consider total
        [contentItemStatistic.measurement, logoStatistic.measurement, profileStatistic.measurement, adBannerStatistic.measurement].forEach(obj => {
          Object.keys(obj).forEach(key => {
            totalStatistic.measurement[key] = totalStatistic.measurement[key] !== undefined
              ? totalStatistic.measurement[key] + obj[key]
              : obj[key]
          })
        })

        name = intermediateObject ? intermediateObject.name : brand.brandId
        logoUrl = intermediateObject ? 'https://s3-eu-west-1.amazonaws.com/c2c1/decokay2015/files/' + intermediateObject.logo : ''

        brandStatisticList.push({
          brandId: brand.brandId,
          brandName: name,
          brandLogo: logoUrl,
          contentItem: contentItemStatistic,
          logo: logoStatistic,
          profile: profileStatistic,
          adBanner: adBannerStatistic,
          total: totalStatistic
        })
      })

      return brandStatisticList
    }
  },

  mounted () {
    this.$store.dispatch('loadBrandContentItems').then(() => {
      this.loadBrandStatistic()
    })
  },

  components: {
    BrandStatisticMeasurementPopup,
    Vue2Datepicker
  }
}
</script>

<style>
  .measurement-number-wrapper {
    display: flex;
    justify-content: center;
  }
  .measurement-number {
    width: 60px;
    padding: 0 5px;
    margin-right: -5px;
    word-wrap:break-word;
    text-align: center;
  }
  .measurement-number--default {
    cursor: default;
  }
</style>
