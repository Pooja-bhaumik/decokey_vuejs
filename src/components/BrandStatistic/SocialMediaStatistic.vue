<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container v-resize="changePageView">
    <portal to="header-items-portal">
      <div style="display: inline-block;">
        <v-menu
            color="white"
            v-model="datesMenu"
            :close-on-content-click="false"
            transition="scale-transition"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
                class="colorOfDateRange"
                color="white"
                v-model="dateRangeText"
                label="Date range"
                v-on="on"
                readonly
                append-icon="mdi-calendar"
                hide-details
            ></v-text-field>
          </template>
          <v-date-picker v-model="dateRange" min="2020-03-11" date-format="YYYY-MM-DD  HH:mm" range @input="dateChangeHandle" ></v-date-picker>
        </v-menu>
      </div>
      <div style="width: 100px; display: inline-block; margin-left: 10px">
        <v-menu>
          <template v-slot:activator="{ on }">
            <v-btn
                color="primary"
                dark
                v-on="on"
                block
                style="margin-top: 10px"
            >
              Periods
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="dateRange=[$moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm'),$moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate = null">
              <v-list-item-title >Yesterday</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().startOf('isoWeek').format('YYYY-MM-DD HH:mm'),$moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>This week (Monday-yesterday)</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD HH:mm'),$moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>Last 7 days</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD HH:mm'),$moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>Last week (Monday-Sunday)</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().startOf('day').subtract(14, 'days').format('YYYY-MM-DD HH:mm'),$moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>Last 14 days</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().startOf('month').format('YYYY-MM-DD HH:mm'),$moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>This month (until Yesterday)</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().startOf('day').subtract(28, 'days').format('YYYY-MM-DD HH:mm'),$moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>Last 28 days</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().startOf('day').subtract(30, 'days').format('YYYY-MM-DD HH:mm'),$moment().endOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>Last 30 days</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dateRange=[$moment().subtract(1,'months').startOf('month').format('YYYY-MM-DD HH:mm'),$moment().subtract(1,'months').endOf('month').format('YYYY-MM-DD HH:mm')]; calendarSelectedDate=null">
              <v-list-item-title>Last month</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
   <div style="padding-top: 0; padding-left: 5px; padding-right: 5px; display: inline-block">
              <v-select :items="availableBrands" :hide-details="true" append-icon="" class="withoutLine" v-model="selectedBrand" style="height: 56px">
                <template slot="selection" slot-scope="data">
                  <div @click="setSelectedBrand(data.item)">
                  <v-list-item-content v-if="data.item.logo" style="padding: unset; height: 46px">
                    <img  style="max-width: 110px; max-height: 36px; margin-top: auto; margin-bottom: auto" :src="'https://s3-eu-west-1.amazonaws.com/c2c1/decokay2015/files/' + data.item.logo" alt="No logo" />
                  </v-list-item-content>
                  <v-list-item-content v-if="!data.item.logo" style="padding: unset; height: 56px; overflow: inherit; color: white">
                    <v-list-item-title class="…pl-10" v-text="data.item.name"></v-list-item-title>
                  </v-list-item-content>
                  </div>
                </template>
                <template slot="item" slot-scope="data" >
                  <div  @click="setSelectedBrand(data.item)" class="mt-1" :style="{ width: data.item.logo ? '35%' : '0%' }">
                    <v-img contain style="max-width: 110px; max-height: 46px;" :src="'https://s3-eu-west-1.amazonaws.com/c2c1/decokay2015/files/' + data.item.logo" alt="No logo" />
                  </div>
                  <div  @click="setSelectedBrand(data.item)" :style="{ width: data.item.logo ? '65%' : '100%' }">
                    <div class="pl-10" v-text="data.item.name"></div>
                  </div>
                </template>
              </v-select>
            </div>
      <!-----end------>
    </portal>
  <v-tabs v-model="activetab"  color="red">
    <v-tab key="online_reach">Online reach</v-tab>
     <v-tab key="post_overview" v-if="selectedBrand.id >0" >Post overview</v-tab>
    <v-tab-item key="online_reach" class="mt-3" eager>
      <v-card lg="12" sm="12" cols="12"
              class="mx-auto"
              outlined
      >
        <v-list-item>
          <v-list-item-content class="pb-0">
            <v-list-item-title class="headline mb-1">{{ $t('statisticDashboard.onlineEngagement') }}
              <span v-if="webStatDateMoved" style="color: gray; font-size: 0.75rem">*last available date {{$moment().endOf('day').subtract(2, 'days').format('MMM-DD')}}</span>
            </v-list-item-title>
          </v-list-item-content>

        </v-list-item>
        <v-card-text class="pt-0">
          <v-row no-gutters>
            <v-col>
              <v-card class="pa-2" color="rgb(51,149,255)" outlined tile>
                <v-checkbox color="white" class="checkbox-white-label"
                            v-model="totalWebImpressionsChecked"
                            :label="`Total Online Engagement`"
                ></v-checkbox>
                <h2 style="color: white">{{new Intl.NumberFormat('de-DE').format(engagementReachCounts.eng)}}</h2>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-2" color="rgb(237,134,4)" outlined tile>
                <v-checkbox color="white" class="checkbox-white-label"
                            v-model="totalWebSessionsChecked"
                            :label="`Total Online Reach`"
                ></v-checkbox>
                <h2 style="color: white">{{new Intl.NumberFormat('de-DE').format(engagementReachCounts.reach)}}</h2>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-4" outlined tile>
                <v-card-text v-text="`Average Online Engagement`" style="font-size:1.1rem" class="pl-0" />
                <h2>{{new Intl.NumberFormat('de-DE').format(avgWebImpressionsCount)}}%</h2>
              </v-card>
            </v-col>
          </v-row>
          <canvas ref="webChartContainer"></canvas>
        </v-card-text>

        <v-row align="center"
               justify="center" style="padding-bottom: 4px;"
        >
          <v-col col="12" lg="12">
            <v-btn-toggle
                class="d-flex justify-center"
                v-model="webChartType"
                tile
                group
                mandatory
            >
              <v-btn value="ALL" :fab="buttonGroupOptions.fab" :large="buttonGroupOptions.large" :small="buttonGroupOptions.small" :x-small="buttonGroupOptions.xSmall">
                Total
              </v-btn>

              <v-btn value="GOOGLE" :fab="buttonGroupOptions.fab" :large="buttonGroupOptions.large" :small="buttonGroupOptions.small" :x-small="buttonGroupOptions.xSmall">
                Google
              </v-btn>

              <v-btn value="FACEBOOK" :fab="buttonGroupOptions.fab" :large="buttonGroupOptions.large" :small="buttonGroupOptions.small" :x-small="buttonGroupOptions.xSmall">
                Facebook
              </v-btn>

              <v-btn value="INSTAGRAM" :fab="buttonGroupOptions.fab" :large="buttonGroupOptions.large" :small="buttonGroupOptions.small" :x-small="buttonGroupOptions.xSmall">
                Instagram
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="4" style="padding-right: 0">
            <JSCharting :options="engagementReachOptions" />
          </v-col>
          <v-col cols="4" align="center" style="padding-right: 0; padding-left: 0">
            <div v-if="reachCounts.instagram !== -1 && reachCounts.facebook !== -1 && reachCounts.google !== -1">
              <JSCharting :options="reachOptions" />
            </div>
          </v-col>
          <v-col cols="4" align="center" style="padding-left: 0">
            <div v-if="engagementCounts.instagram !== -1 && engagementCounts.facebook !== -1 && engagementCounts.google !== -1">
              <JSCharting :options="engagementOptions" />
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-tab-item>

      <v-tab-item key="post_overview" class="mt-3" eager>
       <PostOverview  :allPosts = 'trimmedPosts' :handleChooseNetwork = 'handleChooseNetwork' :SortPostChange = 'SortPostChange' :ChooseNumOfPost = 'ChooseNumOfPost'/>
    </v-tab-item>
  </v-tabs>
  </v-container>
</template>

<script>
import Chart from 'chart.js'
import JSCharting from 'jscharting-vue'
import Role from '../../store/roles'
import PostOverview from './PostOverview'
import img from '../../assets/profile1.jpg'

export default {
  name: 'SocialMediaStatistic',
  components: {
    JSCharting,
    PostOverview
  },
  data: function () {
    return {
      totalWebImpressionsChecked: true,
      img: img,
      totalWebSessionsChecked: true,
      avgWebImpressionsCount: 0,
      availableBrands: [],
      ChooseNetwork: null,
      trimmedPosts: null,
      sortPostvalue: null,
      numOfPostValue: 2,
      brandId: undefined,
      selectedBrand: null,
      allPosts: [],
      webChartType: 'ALL',
      datesMenu: false,
      dateRange: [this.$moment().startOf('day').subtract(1, 'months').add(1, 'days').format('YYYY-MM-DD HH:mm'), this.$moment().subtract(1, 'days').endOf('day').format('YYYY-MM-DD HH:mm')],
      buttonGroupOptions: {
        fab: false,
        large: true,
        small: false,
        xSmall: false
      },
      webStatDateMoved: false,
      activetab: 0,
      calendarSelectedDate: null,
      chartFont: 12,
      engagementChartInfo: null,
      chartWebEngInstance: null,
      engagementReachCounts: {
        eng: 0,
        reach: 0
      },
      colors: ['rgb(66,165,245)', 'rgb(238,0,6)', 'rgb(249,168,37)'],
      engagementCounts: {
        facebook: -1,
        instagram: -1,
        google: -1
      },
      reachCounts: {
        facebook: -1,
        instagram: -1,
        google: -1
      }
    }
  },

  mounted () {
    // load chart initial
    // this.loadChartSocialNetworksStatistic()
    // this.loadGoogleSearchStatistic()
    // this.loadFacebookStatistic()
    // this.loadInstagramStatistic()
    // this.changePageView()
    this.$store.dispatch('loadBrandContentItems').then(() => {
      this.availableBrands = this.$store.getters.getBrandContentItems
      console.log('available::::::', this.availableBrands)
      // this.$store.dispatch('loadStatisticBrandIds').then(
      //         (statisticBrandIds) => {
      //   statisticBrandIds.forEach(brandId => {
      //     this.availableBrands.push(allBrands.find(brand => {
      //       return +brandId === +brand.id
      //     }))
      //   })
      this.availableBrands = this.availableBrands.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
      if (this.$store.getters.userHasRoles(Role.Root)) {
        this.availableBrands.unshift({ name: 'All brands', id: 0, logo: '' })
      }
      this.selectedBrand = this.availableBrands[0]
      console.log('SEECTEED BRANDDDDD: ', this.selectedBrand)
      // this.selectedBrand = availableBrands.find(brand => brand.id === this.selectedBrand.id)
      // console.log('TESTING::: Availableeee brands ', this.availableBrands)
      // })
    })
    this.reloadProductGroups()
    this.changePageView()
  },
  updated () {
    this.brandId = this.selectedBrand.id
  },
  // mounted () {
  //   this.loadChartSocialNetworksStatistic()
  //   this.loadGoogleSearchStatistic()
  //   this.loadFacebookStatistic()
  //   this.loadInstagramStatistic()
  //   this.changePageView()
  // },
  beforeDestroy () {
    if (this.chartWebEngInstance) {
      this.chartWebEngInstance.destroy()
      this.chartWebEngInstance = null
    }
  },
  computed: {
    dateRangeText () {
      return this.$moment(this.dateRangeCalendarFixed[0]).startOf('day').format('YYYY-MM-DD') + ' - ' + this.$moment(this.dateRangeCalendarFixed[1]).endOf('day').format('YYYY-MM-DD')
    },
    dateRangeCalendarFixed () {
      if (this.calendarSelectedDate) {
        return [this.calendarSelectedDate, this.calendarSelectedDate]
      } else if (this.dateRange[1] < this.dateRange[0]) {
        return [this.dateRange[1], this.dateRange[0]]
      } else {
        return this.dateRange
      }
    },
    engagementReachOptions () {
      return {
        title: {
          position: 'center'
        },
        type: 'pie',
        template: '{%percentOfTotal:n1}% %icon %name',
        legend: {
          position: 'inside bottom'
        },
        margin: 0,
        defaultEntry: { description: '%name' },
        palette: 'colorVision3',
        defaultPoint: {
          label_text: '<b>%name</b>'
        },
        title_label_text: 'Engagement & Reach',
        series: [
          {
            name: 'total',
            points: [
              { name: 'Engagement', y: this.engagementReachCounts.eng },
              { name: 'Reach', y: this.engagementReachCounts.reach }
            ]
          }
        ]
      }
    },
    engagementOptions () {
      return {
        title: {
          position: 'center'
        },
        type: 'pie',
        template: '{%percentOfTotal:n1}% %icon %name',
        legend: {
          position: 'inside bottom'
        },
        margin: 0,
        defaultEntry: { description: '%name' },
        palette: 'colorVision3',
        defaultPoint: {
          label_text: '<b>%name</b>'
        },
        title_label_text: 'Engagement',
        series: [
          {
            name: 'Engagement',
            points: [
              { name: 'Google', y: this.engagementCounts.google },
              { name: 'Facebook', y: this.engagementCounts.facebook },
              { name: 'Instagram', y: this.engagementCounts.instagram }
            ]
          }
        ]
      }
    },
    reachOptions () {
      return {
        title: {
          position: 'center'
        },
        type: 'pie',
        template: '{%percentOfTotal:n1}% %icon %name',
        legend: {
          position: 'inside bottom'
        },
        margin: 0,
        defaultEntry: { description: '%name' },
        palette: 'colorVision3',
        defaultPoint: {
          label_text: '<b>%name</b>'
        },
        title_label_text: 'Reach',
        series: [
          {
            name: 'Reach',
            points: [
              { name: 'Google', y: this.reachCounts.google },
              { name: 'Facebook', y: this.reachCounts.facebook },
              { name: 'Instagram', y: this.reachCounts.instagram }
            ]
          }
        ]
      }
    }
  },
  watch: {
    allPosts () {
      this.trimmedPosts = this.allPosts.slice(0, this.numOfPostValue)
    },
    numOfPostValue (v) {
      const result = (v === 2) ? (
        this.allPosts.slice(0, v)
      ) : (
        v === 5 ? (
          this.allPosts.slice(0, v)
        ) : (
          this.allPosts.slice(0, v)
        )
      )
      this.trimmedPosts = result
    },
    sortPostvalue (v) {
      v === 'Old' ? this.allPosts.sort((a, b) => (a.post_date > b.post_date) ? 1 : ((b.post_date > a.post_date) ? -1 : 0)) : this.allPosts.sort((a, b) => (a.post_date > b.post_date) ? -1 : ((b.post_date > a.post_date) ? 1 : 0))
      // if (v === 'Old') {
      //   this.allPosts.sort((a, b) => (a.post_date > b.post_date) ? 1 : ((b.post_date > a.post_date) ? -1 : 0))
      //   console.log('sortDate::::', updatedPostByDate)
      // } else {
      //   this.allPosts.sort((a, b) => (a.post_date > b.post_date) ? -1 : ((b.post_date > a.post_date) ? 1 : 0))
      // }
    },
    ChooseNetwork () {
      const data = {
        brandId: this.brandId,
        fromDate: this.formatDateString(this.dateRange[0]),
        toDate: this.formatDateString(this.dateRange[1]),
        socialNetwork: this.webChartType
      }
      this.$store.dispatch('loadSocialStatisticsDataWithPost', data)
        .then(() => {
          this.allPosts = this.$store.getters.getTotalSocialNetworkEngagementWithPost
        })
    },
    brandId () {
      const data = {
        brandId: this.brandId,
        fromDate: this.formatDateString(this.dateRange[0]),
        toDate: this.formatDateString(this.dateRange[1]),
        socialNetwork: this.webChartType
      }
      this.$store.dispatch('loadSocialStatisticsDataWithPost', data)
        .then(() => {
          this.allPosts = this.$store.getters.getTotalSocialNetworkEngagementWithPost
        })
    },
    chartFont (val) {
      if (this.engagementChartInfo) {
        this.buildWebEngagementChart(this.engagementChartInfo.dataset, this.engagementChartInfo.labels, this.engagementChartInfo.allReachMin, this.engagementChartInfo.allClickMin)
      }
    },
    engagementChartInfo (val) {
      this.buildWebEngagementChart(val.dataset, val.labels, val.allReachMin, val.allClickMin)
    },
    webChartType (v) {
      if (v) {
        this.loadChartSocialNetworksStatistic()
      }
    },
    dateRangeCalendarFixed (v) {
      this.loadChartSocialNetworksStatistic()
      this.engagementCounts.google = -1
      this.reachCounts.google = -1
      this.engagementCounts.facebook = -1
      this.reachCounts.facebook = -1
      this.engagementCounts.instagram = -1
      this.reachCounts.instagram = -1
      this.loadGoogleSearchStatistic()
      this.loadFacebookStatistic()
      this.loadInstagramStatistic()
    },
    totalWebImpressionsChecked (v) {
      if (this.chartWebEngInstance) {
        this.chartWebEngInstance.getDatasetMeta(1).hidden = !v
        this.chartWebEngInstance.update()
      }
    },
    totalWebSessionsChecked (v) {
      if (this.chartWebEngInstance) {
        this.chartWebEngInstance.getDatasetMeta(0).hidden = !v
        this.chartWebEngInstance.update()
      }
    }
  },
  props: {
    post: Object
  },
  methods: {
    SortPostChange (event) {
      this.sortPostvalue = event.target.value
    },
    handleChooseNetwork (event) {
      const { value } = event.target
      this.ChooseNetwork = value
      this.webChartType = value && value.toUpperCase()
    },
    ChooseNumOfPost (event) {
      this.numOfPostValue = event.target.value
    },
    setSelectedBrand (item) {
      console.log('ITEM::::: ', item)
      this.selectedBrand = item
      if (item.id > 0) {
        this.activetab = 1
      } else {
        this.activetab = 0
      }
    },
    dateChangeHandle (newDateRange) {
      if (newDateRange.length === 1) {
        this.calendarSelectedDate = newDateRange[0]
      } else {
        this.dateRange[0] = newDateRange[0]
        this.dateRange[1] = newDateRange[1]
        this.calendarSelectedDate = null
      }
    },

    formatDateString (dateStr) {
      let momentObj = this.$moment(dateStr)
      let momentString = momentObj.format('YYYY-MM-DDTHH:mm:ssZ')
      return momentString
    },

    buildWebEngagementChart (dataset, labels, allReachMin, allClickMin) {
      let self = this
      let ctx = this.$refs.webChartContainer.getContext('2d')
      let chartWebEngInstance = this.chartWebEngInstance

      if (chartWebEngInstance) {
        chartWebEngInstance.destroy()
      }
      chartWebEngInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: dataset
        },
        options: {
          legend: {
            display: false,
            labels: {
              generateLabels: function (chart) {
                let data = chart.data
                return Chart.helpers.isArray(data.datasets) ? data.datasets.map(function (dataset, i) {
                  return {
                    text: dataset.legendText,
                    fillStyle: dataset.backgroundColor,
                    hidden: !chart.isDatasetVisible(i),
                    lineCap: dataset.borderCapStyle,
                    lineDash: dataset.borderDash,
                    lineDashOffset: dataset.borderDashOffset,
                    lineJoin: dataset.borderJoinStyle,
                    lineWidth: dataset.borderWidth,
                    strokeStyle: dataset.borderColor,
                    datasetIndex: i
                  }
                }, this) : []
              }
            }
          },
          responsive: true,
          title: {
            display: true
          },
          tooltips: {
            mode: 'point',
            intersect: false
          },
          hover: {
            mode: 'index',
            intersect: false
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Date'
              }
            }],
            yAxes: [{
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              scaleLabel: {
                display: true,
                fontSize: self.chartFont,
                labelString: 'Total Online Engagement'
              },
              id: 'y-axis-1',
              ticks: {
                min: Math.floor(allClickMin / 2),
                fontSize: self.chartFont,
                callback: function (value) { if (value % 1 === 0) { return value } }
              }
            }, {
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'right',
              scaleLabel: {
                display: true,
                fontSize: self.chartFont,
                labelString: 'Total Online Reach'
              },
              id: 'y-axis-2',
              ticks: {
                min: Math.floor(allReachMin / 2),
                fontSize: self.chartFont,
                callback: function (value) { if (value % 1 === 0) { return value } }
              },
              // grid line settings
              gridLines: {
                drawOnChartArea: false // only want the grid lines for one axis to show up
              }
            }]
          }
        }
      })
      this.chartWebEngInstance = chartWebEngInstance
    },

    loadChartSocialNetworksStatistic () {
      let self = this
      let allReachMin = Number.MAX_SAFE_INTEGER
      console.log('ALLREACHMIN::::', allReachMin)
      let allClickMin = Number.MAX_SAFE_INTEGER
      self.webChartLoading = true
      self.webStatDateMoved = false
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      if (this.$moment(toDate).endOf('day').isAfter(this.$moment().endOf('day').subtract(3, 'days'))) {
        toDate = this.$moment().endOf('day').subtract(3, 'days')
        self.webStatDateMoved = true
        if (this.$moment(fromDate).isAfter(toDate)) {
          fromDate = this.$moment(toDate)
        }
      }
      if (this.$moment(fromDate).startOf('day').isBefore(this.$moment('2020-03-11').startOf('day'))) {
        fromDate = this.$moment('2020-03-11').startOf('day')
        if (this.$moment(toDate).isBefore(fromDate)) {
          toDate = this.$moment(fromDate).endOf('day')
        }
      }
      let deltaDays = this.$moment(toDate).add(1, 'minutes').diff(this.$moment(fromDate).startOf('day'), 'days') + 1

      this.$store.dispatch('loadAggSocialNetworkStatistic', {
        fromDate: this.formatDateString(fromDate),
        toDate: this.formatDateString(toDate),
        socialNetwork: this.webChartType
      }).then(function (data) {
        console.log('SOCIALINGAGEDATA++++++::::', data)
        self.webChartLoading = false
        let dataset = []
        let labels = []

        if (data.data.getTotalSocialNetworkEngagement && data.data.getTotalSocialNetworkEngagement) {
          let series = data.data.getTotalSocialNetworkEngagement
          console.log('SERIESOFSOCIAL----------', series)
          let totalImpress = 0
          let avgImpress = 0
          let avgClick = 0
          let totalClick = 0
          let impressionData = []
          let clickData = []
          let checkEndDate = self.$moment(self.dateRangeCalendarFixed[1])
          series.forEach((s) => {
            let date = self.$moment(s.keys[0])
            console.log('DATESOCIAL::::', date)
            if (date.isBefore(checkEndDate)) {
              impressionData.push(s.impressions)
              totalImpress += s.impressions
              clickData.push(s.clicks)
              totalClick += s.clicks
              labels.push(date.format('MMM-DD'))
              if (s.impressions < allReachMin) {
                allReachMin = s.impressions
              }
              if (s.clicks < allClickMin) {
                allClickMin = s.clicks
              }
            }
          })
          if (clickData.length === 1) {
            clickData.push(clickData[0])
            labels.push(labels[0])
          }
          if (impressionData.length === 1) {
            impressionData.push(impressionData[0])
          }

          let rounderReach = (allReachMin > 1000 ? 1000 : 100)
          let rounderClick = (allClickMin > 1000 ? 1000 : 100)
          allReachMin = Math.round(allReachMin / rounderReach) * rounderReach
          allClickMin = Math.round(allClickMin / rounderClick) * rounderClick
          avgImpress = parseInt(deltaDays > 0 ? totalImpress / deltaDays : 0)
          avgClick = Math.round(((totalClick === 0 ? 0 : totalClick / totalImpress * 100) + Number.EPSILON) * 100) / 100 // parseInt(deltaDays > 0 ? totalClick / deltaDays : 0)

          self.engagementReachCounts = {
            eng: totalClick,
            reach: totalImpress
          }
          self.avgWebImpressionsCount = avgClick
          let imporessionDataset = {
            label: 'Total Online Reach',
            legendText: 'Total Online : ' + totalImpress + (avgImpress > 0 ? ' daily AVG: ' + avgImpress : ''),
            data: impressionData,
            borderColor: 'rgb(255,74,0)',
            backgroundColor: 'rgb(237,134,4)',
            borderWidth: 1,
            yAxisID: 'y-axis-2'
          }
          let clickDataset = {
            label: 'Total Online Engagement',
            legendText: 'Total Online Engagementt: ' + totalClick + (avgClick > 0 ? ' daily AVG: ' + avgClick : ''),
            data: clickData,
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgb(51,149,255)',
            borderWidth: 1,
            yAxisID: 'y-axis-1'
          }
          dataset = [imporessionDataset, clickDataset]
        }
        self.engagementChartInfo = {
          dataset: dataset,
          labels: labels,
          allReachMin: allReachMin,
          allClickMin: allClickMin
        }
      })
    },
    loadGoogleSearchStatistic () {
      let self = this
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      this.$store.dispatch('loadGoogleSearchStatistic', {
        fromDate: this.formatDateString(fromDate),
        toDate: this.formatDateString(toDate)
      }).then(data => data.data.getGoogleSearchEngagement.statisticSiteData).then(function (googleData) {
        let eng = 0
        let reach = 0

        for (let statSiteData of googleData) {
          for (let data of statSiteData.data) {
            eng += data.clicks
            reach += data.impressions
          }
        }
        self.engagementCounts.google = eng
        self.reachCounts.google = reach
      })
    },
    loadFacebookStatistic () {
      let self = this
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      this.$store.dispatch('loadFacebookStatistic', {
        fromDate: this.formatDateString(fromDate),
        toDate: this.formatDateString(toDate)
      }).then(data => data.data.getFacebookEngagement.statisticSiteData).then(function (facebookData) {
        let eng = 0
        let reach = 0

        for (let statSiteData of facebookData) {
          for (let data of statSiteData.data) {
            eng += data.clicks
            reach += data.impressions
          }
        }

        self.engagementCounts.facebook = eng
        self.reachCounts.facebook = reach
      })
    },
    loadInstagramStatistic () {
      let self = this
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      this.$store.dispatch('loadInstagramStatistic', {
        fromDate: this.formatDateString(fromDate),
        toDate: this.formatDateString(toDate)
      }).then(data => data.data.getInstagramEngagement.statisticSiteData).then(function (instagramData) {
        let eng = 0
        let reach = 0

        for (let statSiteData of instagramData) {
          for (let data of statSiteData.data) {
            eng += data.clicks
            reach += data.impressions
          }
        }

        self.engagementCounts.instagram = eng
        self.reachCounts.instagram = reach
      })
    },
    changePageView () {
      const options = this.buttonGroupOptions
      Object.keys(options).forEach(option => {
        options[option] = false
      })

      if (window.innerWidth < 1904 && window.innerWidth > 1432) {
        options.fab = true
        options.small = true
        this.chartFont = 15
      } else if (window.innerWidth < 1431 && window.innerWidth > 1263) {
        options.fab = true
        options.xSmall = true
        this.chartFont = 15
      } else if (window.innerWidth < 1264 && window.innerWidth > 675) {
        options.large = true
        this.chartFont = 11
      } else if (window.innerWidth < 676 && window.innerWidth > 600) {
        options.fab = true
        options.small = true
        this.chartFont = 9
      } else if (window.innerWidth < 601) {
        options.fab = true
        options.xSmall = true
        this.footerProps = {}
        this.hideFooter = true
        this.chartFont = 4
      }
    }
  }
}
</script>

<style scoped>
.colorOfDateRange.v-text-field > div{
  margin-top: 15px
}
.colorOfDateRange.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot  input {
  color: white;
  padding-top: 5px;
}
.colorOfDateRange.v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot > .v-label {
  padding-top: 5px
}
.checkbox-white-label .v-label {
  color: white;
}
</style>
