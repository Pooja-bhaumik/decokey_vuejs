<template
  xmlns:v-slot="http://www.w3.org/1999/XSL/Transform"
  xmlns:v-bind="http://www.w3.org/1999/xhtml"
>
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
          <v-date-picker
            v-model="dateRange"
            min="2020-03-11"
            date-format="YYYY-MM-DD  HH:mm"
            range
            @input="dateChangeHandle"
          ></v-date-picker>
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
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .startOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .endOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title>Yesterday</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .startOf('isoWeek')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .endOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title
                >This week (Monday-yesterday)</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .startOf('day')
                    .subtract(7, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .endOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title>Last 7 days</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .subtract(1, 'week')
                    .startOf('isoWeek')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .subtract(1, 'week')
                    .endOf('isoWeek')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title>Last week (Monday-Sunday)</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .startOf('day')
                    .subtract(14, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .endOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title>Last 14 days</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .startOf('month')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .endOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title
                >This month (until Yesterday)</v-list-item-title
              >
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .startOf('day')
                    .subtract(28, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .endOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title>Last 28 days</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .startOf('day')
                    .subtract(30, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .endOf('day')
                    .subtract(1, 'days')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title>Last 30 days</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="
                dateRange = [
                  $moment()
                    .subtract(1, 'months')
                    .startOf('month')
                    .format('YYYY-MM-DD HH:mm'),
                  $moment()
                    .subtract(1, 'months')
                    .endOf('month')
                    .format('YYYY-MM-DD HH:mm'),
                ];
                calendarSelectedDate = null;
              "
            >
              <v-list-item-title>Last month</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <div
        style="padding-top: 0; padding-left: 5px; padding-right: 5px; display: inline-block"
      >
        <v-select
          :items="availableBrands"
          :hide-details="true"
          append-icon=""
          class="withoutLine"
          v-model="selectedBrand"
          style="height: 56px"
        >
          <template slot="selection" slot-scope="data">
            <v-list-item-content
              @click="toggle()"
              v-if="data.item.logo"
              style="padding: unset; height: 46px"
            >
              <img
                @click="toggle()"
                style="max-width: 110px; max-height: 36px; margin-top: auto; margin-bottom: auto"
                :src="
                  'https://s3-eu-west-1.amazonaws.com/c2c1/decokay2015/files/' +
                    data.item.logo
                "
                alt="No logo"
              />
            </v-list-item-content>
            <v-list-item-content
              v-if="!data.item.logo"
              style="padding: unset; height: 56px; overflow: inherit; color: white"
            >
              <v-list-item-title
                @click="toggle()"
                class="pl-10"
                v-text="data.item.name"
              ></v-list-item-title>
            </v-list-item-content>
          </template>
          <template slot="item" slot-scope="data">
            <div class="mt-1" :style="{ width: data.item.logo ? '35%' : '0%' }">
              <v-img
                @click="toggle()"
                contain
                style="max-width: 110px; max-height: 46px;"
                :src="
                  'https://s3-eu-west-1.amazonaws.com/c2c1/decokay2015/files/' +
                    data.item.logo
                "
                alt="No logo"
              />
            </div>
            <div :style="{ width: data.item.logo ? '65%' : '100%' }">
              <div
                @click="toggle()"
                class="pl-10"
                v-text="data.item.name"
              ></div>
            </div>
          </template>
        </v-select>
      </div>
      <ProductGroupList
        :graphDataHandler="graphDataHandler"
        v-if="this.selectedBrand.id > 0"
        :handleToggle="toggle"
        :allProductsGroups="allProductsGroups"
      />
    </portal>
    <v-tabs v-model="activeTab" color="red">
      <v-tab key="brand_impressions">Brand impressions</v-tab>
      <v-tab-item key="brand_impressions" class="mt-3" eager>
        <v-slide-group show-arrows ref="statisticProductGroups">
          <product-group-statistic
            v-for="productGroup in availableProductGroups"
            :key="productGroup.id"
            :product-group="productGroup"
            :statistic-info="statisticInfo"
          />
        </v-slide-group>
        <v-row lg="12" sm="12" cols="12">
          <v-col>
            <v-card class="mx-auto" outlined>
              <v-list-item>
                <v-list-item-content class="pb-0">
                  <v-list-item-title class="headline mb-1"
                    ><h3
                      style="float: left"
                      v-if="selectedBrand"
                      v-text="selectedBrand.name"
                      class="pr-1"
                    ></h3>
                    {{ $t("statisticDashboard.brandTitle") }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-card-text class="pt-0">
                <v-row no-gutters>
                  <v-col>
                    <v-card class="pa-2" color="rgb(51,149,255)" outlined tile>
                      <v-checkbox
                        color="white"
                        class="checkbox-white-label"
                        v-model="totalWebImpressionsChecked"
                        :label="`Total Online Engagement`"
                      ></v-checkbox>
                      <h2 style="color: white">
                        {{
                          new Intl.NumberFormat("de-DE").format(
                            engagementReachCounts.eng
                          )
                        }}
                      </h2>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="pa-2" color="rgb(237,134,4)" outlined tile>
                      <v-checkbox
                        color="white"
                        class="checkbox-white-label"
                        v-model="totalWebSessionsChecked"
                        :label="`Total Online Reach`"
                      ></v-checkbox>
                      <h2 style="color: white">
                        {{
                          new Intl.NumberFormat("de-DE").format(
                            engagementReachCounts.reach
                          )
                        }}
                      </h2>
                    </v-card>
                  </v-col>
                  <v-col>
                    <v-card class="pa-4" outlined tile>
                      <v-card-text
                        v-text="`Average Online Engagement`"
                        style="font-size:1.1rem"
                        class="pl-0"
                      />
                      <h2>
                        {{
                          new Intl.NumberFormat("de-DE").format(
                            avgWebImpressionsCount
                          )
                        }}%
                      </h2>
                    </v-card>
                  </v-col>
                </v-row>
                <canvas ref="webChartContainer"></canvas>
              </v-card-text>
              <v-row align="center" justify="center" style="margin-top: auto">
                <v-col lg="12" col="12">
                  <v-btn-toggle
                    class="btn-group-custom mb-3"
                    v-model="mainChartSrcType"
                    borderless
                    mandatory
                    tile
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
                      value="DESKTOP"
                      :fab="buttonGroupOptions.fab"
                      :large="buttonGroupOptions.large"
                      :small="buttonGroupOptions.small"
                      :x-small="buttonGroupOptions.xSmall"
                    >
                      Desktop
                    </v-btn>

                    <v-btn
                      value="MOBILE"
                      :fab="buttonGroupOptions.fab"
                      :large="buttonGroupOptions.large"
                      :small="buttonGroupOptions.small"
                      :x-small="buttonGroupOptions.xSmall"
                    >
                      Mobile
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
              <v-row align="center" justify="center" style="margin-top: auto">
                <v-col lg="12" col="12">
                  <v-btn-toggle
                    class="btn-group-custom mb-3"
                    v-model="mainChartType"
                    borderless
                    mandatory
                    tile
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
            </v-card>
          </v-col>
        </v-row>
        <brand-statistic-impressions-table
          lg="12"
          sm="12"
          cols="12"
          :brand="selectedBrand"
          :buttonGroupOptions="buttonGroupOptions"
          :dateRange="dateRangeCalendarFixed"
          :footerProps="footerProps"
          :hideFooter="hideFooter"
          :formatDateString="formatDateString"
        ></brand-statistic-impressions-table>
      </v-tab-item>
      <v-tab key="brand_engagement" v-if="selectedBrand.id > 0"
        >Brand Engagement</v-tab
      >
      <v-tab-item key="brand_engagement" class="mt-3" eager>
        <!-- <ProductGroupList :graphDataHandler="graphDataHandler" v-if = "!hiddenToggle" :handleToggle = "toggle" :allProductsGroups = "allProductsGroups"/> -->
        <v-card lg="12" sm="12" cols="12" class="mx-auto" outlined>
          <v-list-item>
            <v-list-item-content class="pb-0">
              <v-list-item-title class="headline mb-1">
                The online reach of Brand and Product Groups
                <span
                  v-if="webStatDateMoved"
                  style="color: gray; font-size: 0.75rem"
                  >*last available date
                  {{
                    $moment()
                      .endOf("day")
                      .subtract(2, "days")
                      .format("MMM-DD")
                  }}</span
                >
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-text class="pt-0">
            <v-row no-gutters>
              <v-col>
                <v-card class="pa-2" color="rgb(51,149,255)" outlined tile>
                  <v-checkbox
                    color="white"
                    class="checkbox-white-label"
                    v-model="totalWebImpressionsChecked"
                    :label="`Total Online Engagement`"
                  ></v-checkbox>
                  <h2 style="color: white">
                    {{
                      new Intl.NumberFormat("de-DE").format(
                        countEngagement || 0
                      )
                    }}
                  </h2>
                </v-card>
              </v-col>
              <v-col>
                <v-card class="pa-2" color="rgb(237,134,4)" outlined tile>
                  <v-checkbox
                    color="white"
                    class="checkbox-white-label"
                    v-model="totalWebSessionsChecked"
                    :label="`Total Online Reach`"
                  ></v-checkbox>
                  <h2 style="color: white">
                    {{
                      new Intl.NumberFormat("de-DE").format(
                        countImpression || 0
                      )
                    }}
                  </h2>
                </v-card>
              </v-col>
              <v-col>
                <v-card class="pa-4" outlined tile>
                  <v-card-text
                    v-text="`Average Online Engagement`"
                    style="font-size:1.1rem"
                    class="pl-0"
                  />
                  <h2>
                    {{
                      new Intl.NumberFormat("de-DE").format(
                        countImpression && countEngagement
                          ? avgWebImpressionsCount
                          : 0
                      )
                    }}%
                  </h2>
                </v-card>
              </v-col>
            </v-row>
            <canvas ref="webChartContainer"></canvas>
          </v-card-text>

          <v-row align="center" justify="center" style="padding-bottom: 4px;">
            <v-col col="12" lg="12">
              <v-btn-toggle
                class="d-flex justify-center"
                v-model="webChartType"
                tile
                group
                mandatory
              >
                <v-btn
                  value="ALL"
                  :fab="buttonGroupOptions.fab"
                  :large="buttonGroupOptions.large"
                  :small="buttonGroupOptions.small"
                  :x-small="buttonGroupOptions.xSmall"
                >
                  Total
                </v-btn>

                <v-btn
                  value="GOOGLE"
                  :fab="buttonGroupOptions.fab"
                  :large="buttonGroupOptions.large"
                  :small="buttonGroupOptions.small"
                  :x-small="buttonGroupOptions.xSmall"
                >
                  Google
                </v-btn>

                <v-btn
                  value="FACEBOOK"
                  :fab="buttonGroupOptions.fab"
                  :large="buttonGroupOptions.large"
                  :small="buttonGroupOptions.small"
                  :x-small="buttonGroupOptions.xSmall"
                >
                  Facebook
                </v-btn>

                <v-btn
                  value="INSTAGRAM"
                  :fab="buttonGroupOptions.fab"
                  :large="buttonGroupOptions.large"
                  :small="buttonGroupOptions.small"
                  :x-small="buttonGroupOptions.xSmall"
                >
                  Instagram
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" sm="4" style="padding-right: 0">
              <JSCharting :options="engagementReachOptions" />
            </v-col>
            <v-col
              cols="4"
              align="center"
              style="padding-right: 0; padding-left: 0"
            >
              <div
                v-if="
                  reachCounts.instagram !== -1 &&
                    reachCounts.facebook !== -1 &&
                    reachCounts.google !== -1
                "
              >
                <JSCharting :options="reachOptions" />
              </div>
            </v-col>
            <v-col cols="4" align="center" style="padding-left: 0">
              <div
                v-if="
                  engagementCounts.instagram !== -1 &&
                    engagementCounts.facebook !== -1 &&
                    engagementCounts.google !== -1
                "
              >
                <JSCharting :options="engagementOptions" />
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<style type="text/css">
.withoutLine.v-text-field > .v-input__control > .v-input__slot:after {
  border-style: none;
}
.withoutLine.v-text-field > .v-input__control > .v-input__slot:before {
  border-style: none;
}
.withoutLine.v-text-field > .v-input__control > .v-input__slot input {
  display: none;
  height: 56px;
}
.colorOfDateRange.v-text-field > div {
  margin-top: 15px;
}
.colorOfDateRange.v-text-field
  > .v-input__control
  > .v-input__slot
  > .v-text-field__slot
  input {
  color: white;
  padding-top: 5px;
}
.colorOfDateRange.v-text-field
  > .v-input__control
  > .v-input__slot
  > .v-text-field__slot
  > .v-label {
  padding-top: 5px;
}
.checkbox-hidden-control .v-icon {
  display: none;
}
.checkbox-hidden-control .v-input--selection-controls__ripple {
  display: none;
}
.checkbox-white-label .v-label {
  color: white;
}
</style>

<script>
import Chart from 'chart.js'
import BrandStatisticImpressionsTable from '@/components/BrandStatistic/BrandStatisticImpressionsTable'
import Role from '../../store/roles'
import JSCharting from 'jscharting-vue'
import ProductGroupStatistic from '@/components/BrandStatistic/ProductGroupStatistic'
import ProductGroupList from './ProductGroupsList'
// import Url from '../../store/url'
// import $ from 'jquery'

export default {
  data: function () {
    return {
      totalBrandImpressionsChecked: true,
      totalBrandImpressionsCount: 0,
      totalBrandSessionsChecked: true,
      totalBrandSessionsCount: 0,
      avgBrandImpressionsCount: 0,
      totalPageImpressionsChecked: true,
      totalPageImpressionsCount: 0,
      avgPageImpressionsCount: 0,
      totalUserImpressionsChecked: true,
      totalUserImpressionsCount: 0,
      avgUserImpressionsCount: 0,
      productGroupId: undefined,
      mainChartType: 'total',
      mainChartSrcType: 'total',
      hiddenToggle: true,
      track: 0,
      selectedBrand: null,
      availableBrands: [],
      availableProductGroups: [],
      selectedProductGroup: null,
      datesMenu: false,
      countEngagement: 0,
      countImpression: 0,
      dateRange: [
        this.$moment()
          .startOf('day')
          .subtract(1, 'months')
          .add(1, 'days')
          .format('YYYY-MM-DD HH:mm'),
        this.$moment()
          .subtract(1, 'days')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm')
      ],
      allProductsGroups: [],
      EngagementReachDataByBrandId: [],
      chartInstance: null,
      chartWebEngInstance: null,
      engagementChartInfo: null,
      footerProps: {
        'items-per-page-options': [10, 25, 50, 100, 250, 500]
      },
      buttonGroupOptions: {
        fab: false,
        large: true,
        small: false,
        xSmall: false
      },
      hideFooter: false,
      chartOverlayOpacity: 0,
      chartLoading: false,
      activeTab: 0,
      calendarSelectedDate: null,
      chartFont: 12,
      impressionsChartInfo: null,
      longAppBar: false,
      brandId: undefined,
      webStatDateMoved: false,
      totalWebImpressionsChecked: true,
      engagementReachCounts: {
        eng: 0,
        reach: 0
      },
      engagementReachCountsForBrands: {
        eng: 0,
        reach: 0
      },
      totalWebSessionsChecked: true,
      avgWebImpressionsCount: 0,
      webChartType: 'ALL',
      reachCounts: {
        facebook: -1,
        instagram: -1,
        google: -1
      },
      engagementCounts: {
        facebook: -1,
        instagram: -1,
        google: -1
      },
      reachCountsForBrands: {
        facebook: -1,
        instagram: -1,
        google: -1
      },
      engagementCountsForBrands: {
        facebook: -1,
        instagram: -1,
        google: -1
      },
      isGraphData: true
    }
  },
  computed: {
    dateRangeCalendarFixed (v) {
      if (this.calendarSelectedDate) {
        return [this.calendarSelectedDate, this.calendarSelectedDate]
      } else if (this.dateRange[1] < this.dateRange[0]) {
        return [this.dateRange[1], this.dateRange[0]]
      } else {
        return this.dateRange
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
              {
                name: 'Engagement',
                y: this.countEngagement ? this.countEngagement : 0
              },
              {
                name: 'Reach',
                y: this.countImpression ? this.countImpression : 0
              }
            ]
          }
        ]
      }
    },
    dateRangeText () {
      return (
        this.$moment(this.dateRangeCalendarFixed[0])
          .startOf('day')
          .format('YYYY-MM-DD') +
        ' - ' +
        this.$moment(this.dateRangeCalendarFixed[1])
          .endOf('day')
          .format('YYYY-MM-DD')
      )
    },

    getImpressionChartSelectedTypes () {
      return this.mainChartType === 'total'
        ? ['BRAND_CONTENT_ITEM', 'BRAND_LOGO', 'BRAND_PROFILE', 'AD_BANNER']
        : [this.mainChartType]
    },
    statisticInfo () {
      return {
        from: this.dateRangeCalendarFixed[0],
        to: this.$moment(this.dateRangeCalendarFixed[1]).endOf('day'),
        contentTypes: this.getImpressionChartSelectedTypes,
        devices:
          this.mainChartSrcType === 'total'
            ? ['DESKTOP', 'MOBILE']
            : [this.mainChartSrcType]
      }
    }
  },
  watch: {
    productGroupId () {
      this.loadChartSocialNetworksStatistic()
    },
    isGraphData () {
      this.loadChartSocialNetworksStatistic()
    },
    brandId () {
      this.isGraphData = true
      this.loadChartSocialNetworksStatistic()
      const data = {
        brandId: this.brandId
      }
      this.$store.dispatch('loadProductGroups', data).then(() => {
        this.allProductsGroups = this.$store.getters.getProductGroups.products
      })
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
    webChartType (v) {
      if (v) {
        this.loadChartSocialNetworksStatistic()
      }
    },
    totalWebSessionsChecked (v) {
      if (this.chartWebEngInstance) {
        this.chartWebEngInstance.getDatasetMeta(0).hidden = !v
        this.chartWebEngInstance.update()
      }
    },
    totalWebImpressionsChecked (v) {
      if (this.chartWebEngInstance) {
        this.chartWebEngInstance.getDatasetMeta(1).hidden = !v
        this.chartWebEngInstance.update()
      }
    },
    chartFont (val) {
      if (this.impressionsChartInfo) {
        this.buildChart(
          this.impressionsChartInfo.dataset,
          this.impressionsChartInfo.labels
        )
      }
      if (this.engagementChartInfo) {
        this.buildWebEngagementChart(
          this.engagementChartInfo.dataset,
          this.engagementChartInfo.labels,
          this.engagementChartInfo.allReachMin,
          this.engagementChartInfo.allClickMin
        )
      }
    },
    engagementChartInfo (val) {
      this.buildWebEngagementChart(
        val.dataset,
        val.labels,
        val.allReachMin,
        val.allClickMin
      )
    },
    impressionsChartInfo (val) {
      this.buildChart(val.dataset, val.labels)
    },
    selectedBrand (val) {
      if (val) {
        const data = {
          brandId: this.brandId,
          fromDate: this.formatDateString(this.dateRange[0]),
          toDate: this.formatDateString(this.dateRange[1]),
          socialNetwork: this.webChartType
        }
        this.$store
          .dispatch(
            'loadEngagementReachRelatedByBrandIdWithGraphQlParams',
            data
          )
          .then((data) => {
            this.EngagementReachDataByBrandId =
              data.data.getBrandRelatedReachAndEnagement
            this.engagementReachCountsForBrands.eng = this.EngagementReachDataByBrandId.clicks
            this.engagementReachCountsForBrands.reach = this.EngagementReachDataByBrandId.impressions
          })
        if (val.id > 0) {
          this.activeTab = 1
        }
      }
    },

    mainChartType (v) {
      // console.log('MAINCHSRTTYPE::::::::',val)
      if (v && this.selectedBrand && this.selectedBrand.id != null) {
        this.loadChartImpressionStatistic()
      }
    },
    mainChartSrcType (v) {
      if (v && this.selectedBrand && this.selectedBrand.id != null) {
        this.loadChartImpressionStatistic()
      }
    },
    totalBrandImpressionsChecked (v) {
      if (this.chartInstance) {
        this.chartInstance.getDatasetMeta(0).hidden = !v
        this.chartInstance.update()
      }
    },
    totalPageImpressionsChecked (v) {
      if (this.chartInstance) {
        this.chartInstance.getDatasetMeta(1).hidden = !v
        this.chartInstance.update()
      }
    },
    totalBrandSessionsChecked (v) {
      if (this.chartInstance) {
        this.chartInstance.getDatasetMeta(2).hidden = !v
        this.chartInstance.update()
      }
    },
    totalUserImpressionsChecked (v) {
      if (this.chartInstance) {
        this.chartInstance.getDatasetMeta(3).hidden = !v
        this.chartInstance.update()
      }
    }
  },
  methods: {
    toggle: function (v = null) {
      if (!v) {
        this.track++
        this.hiddenToggle = false
        return
      }
      this.hiddenToggle = !this.hiddenToggle
    },

    graphDataHandler: function (prodGroupId) {
      this.isGraphData = false
      this.productGroupId = prodGroupId
      console.log('Product Group Id: ', this.productGroupId)
      const data = {
        productGroupId: this.productGroupId,
        fromDate: this.formatDateString(this.dateRange[0]),
        toDate: this.formatDateString(this.dateRange[1]),
        socialNetwork: this.webChartType
      }
      this.$store.dispatch(
        'loadEngagementReachRelatedByProductIdWithGraphQlParams',
        data
      )
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
                return Chart.helpers.isArray(data.datasets)
                  ? data.datasets.map(function (dataset, i) {
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
                      // Below is extra data used for toggling the datasets
                      datasetIndex: i
                    }
                  }, this)
                  : []
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
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                }
              }
            ],
            yAxes: [
              {
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
                  callback: function (value) {
                    if (value % 1 === 0) {
                      return value
                    }
                  }
                }
              },
              {
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
                  callback: function (value) {
                    if (value % 1 === 0) {
                      return value
                    }
                  }
                },
                // grid line settings
                gridLines: {
                  drawOnChartArea: false // only want the grid lines for one axis to show up
                }
              }
            ]
          }
        }
      })
      this.chartWebEngInstance = chartWebEngInstance
    },

    async loadChartSocialNetworksStatistic () {
      let self = this
      let allReachMin = Number.MAX_SAFE_INTEGER
      let allClickMin = Number.MAX_SAFE_INTEGER
      self.webChartLoading = true
      self.webStatDateMoved = false
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      if (
        this.$moment(toDate)
          .endOf('day')
          .isAfter(
            this.$moment()
              .endOf('day')
              .subtract(3, 'days')
          )
      ) {
        toDate = this.$moment()
          .endOf('day')
          .subtract(3, 'days')
        self.webStatDateMoved = true
        if (this.$moment(fromDate).isAfter(toDate)) {
          fromDate = this.$moment(toDate)
        }
      }
      if (
        this.$moment(fromDate)
          .startOf('day')
          .isBefore(this.$moment('2020-03-11').startOf('day'))
      ) {
        fromDate = this.$moment('2020-03-11').startOf('day')
        if (this.$moment(toDate).isBefore(fromDate)) {
          toDate = this.$moment(fromDate).endOf('day')
        }
      }
      let deltaDays =
        this.$moment(toDate)
          .add(1, 'minutes')
          .diff(this.$moment(fromDate).startOf('day'), 'days') + 1
      let data = null
      if (this.isGraphData) {
        data = await this.$store.dispatch(
          'loadEngagementReachRelatedByBrandIdWithGraphQlParams',
          {
            fromDate: this.formatDateString(fromDate),
            toDate: this.formatDateString(toDate),
            socialNetwork: this.webChartType,
            brandId: this.brandId
          }
        )
      } else {
        data = await this.$store.dispatch(
          'loadEngagementReachRelatedByProductIdWithGraphQlParams',
          {
            fromDate: this.formatDateString(fromDate),
            toDate: this.formatDateString(toDate),
            socialNetwork: this.webChartType,
            productGroupId: this.productGroupId
          }
        )
      }
      self.webChartLoading = false
      let dataset = []
      let labels = []
      let series = []

      if (this.isGraphData) {
        series = data.data.getBrandRelatedReachAndEnagement.brandsData
        self.countEngagement =
          data.data.getBrandRelatedReachAndEnagement.clicks
        self.countImpression =
          data.data.getBrandRelatedReachAndEnagement.impressions
      } else {
        series =
          data.data.getProductGroupNetworkEngagementWithProductId.productData
        self.countEngagement =
          data.data.getProductGroupNetworkEngagementWithProductId.clicks
        self.countImpression =
          data.data.getProductGroupNetworkEngagementWithProductId.impressions
      }

      if (series && series.length > 0) {
        let totalImpress = 0
        let avgImpress = 0
        let avgClick = 0
        let totalClick = 0
        let impressionData = []
        let clickData = []
        let checkEndDate = self.$moment(self.dateRangeCalendarFixed[1])
        series.forEach((s) => {
          let date = self.$moment(s.keys[0])
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

        let rounderReach = allReachMin > 1000 ? 1000 : 100
        let rounderClick = allClickMin > 1000 ? 1000 : 100
        allReachMin = Math.round(allReachMin / rounderReach) * rounderReach
        allClickMin = Math.round(allClickMin / rounderClick) * rounderClick
        avgImpress = parseInt(deltaDays > 0 ? totalImpress / deltaDays : 0)
        avgClick =
          Math.round(
            ((totalClick === 0 ? 0 : (totalClick / totalImpress) * 100) +
              Number.EPSILON) *
              100
          ) / 100 // parseInt(deltaDays > 0 ? totalClick / deltaDays : 0)
        self.engagementReachCountsForBrands = {
          eng: totalClick,
          reach: totalImpress
        }
        self.avgWebImpressionsCount = avgClick
        let imporessionDataset = {
          label: 'Total Online Reach',
          legendText:
            'Total Online Reach: ' +
            totalImpress +
            (avgImpress > 0 ? ' daily AVG: ' + avgImpress : ''),
          data: impressionData,
          borderColor: 'rgb(255,74,0)',
          backgroundColor: 'rgb(237,134,4)',
          borderWidth: 1,
          yAxisID: 'y-axis-2'
        }
        let clickDataset = {
          label: 'Total Online Engagement',
          legendText:
            'Total Online Engagement: ' +
            totalClick +
            (avgClick > 0 ? ' daily AVG: ' + avgClick : ''),
          data: clickData,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgb(51,149,255)',
          borderWidth: 1,
          yAxisID: 'y-axis-1'
        }
        dataset = [imporessionDataset, clickDataset]
        console.log('datasets:::', dataset)
      }
      this.engagementChartInfo = {
        dataset: dataset,
        labels: labels,
        allReachMin: allReachMin,
        allClickMin: allClickMin
      }
    },

    loadGoogleSearchStatistic () {
      let self = this
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      this.$store
        .dispatch('loadGoogleSearchStatistic', {
          fromDate: this.formatDateString(fromDate),
          toDate: this.formatDateString(toDate)
        })
        .then((data) => data.data.getGoogleSearchEngagement.statisticSiteData)
        .then(function (googleData) {
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
    loadInstagramStatistic () {
      let self = this
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      this.$store
        .dispatch('loadInstagramStatistic', {
          fromDate: this.formatDateString(fromDate),
          toDate: this.formatDateString(toDate)
        })
        .then((data) => data.data.getInstagramEngagement.statisticSiteData)
        .then(function (instagramData) {
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
    loadFacebookStatistic () {
      let self = this
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.dateRangeCalendarFixed[1]
      this.$store
        .dispatch('loadFacebookStatistic', {
          fromDate: this.formatDateString(fromDate),
          toDate: this.formatDateString(toDate)
        })
        .then((data) => data.data.getFacebookEngagement.statisticSiteData)
        .then(function (facebookData) {
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
    changePageView () {
      const options = this.buttonGroupOptions
      Object.keys(options).forEach((option) => {
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

    loadChartImpressionStatistic () {
      let self = this
      let fromDate = this.dateRangeCalendarFixed[0]
      let toDate = this.$moment(this.dateRangeCalendarFixed[1]).endOf('day')

      if (
        this.$moment(fromDate)
          .startOf('day')
          .isBefore(this.$moment('2020-03-11').startOf('day'))
      ) {
        fromDate = this.$moment('2020-03-11').startOf('day')
        if (this.$moment(toDate).isBefore(fromDate)) {
          toDate = this.$moment(fromDate).endOf('day')
        }
      }
      self.chartLoading = true
      self.chartOverlayOpacity = 0.1
      let firstDate = null
      let device =
        self.mainChartSrcType === 'total'
          ? ['DESKTOP', 'MOBILE']
          : [self.mainChartSrcType]

      this.$store
        .dispatch('loadChartImpressionStatistic', {
          fromDate: this.formatDateString(fromDate),
          toDate: this.formatDateString(toDate),
          brandId: this.selectedBrand.id,
          contentType: this.getImpressionChartSelectedTypes,
          devices: device
        })
        .then(function (data) {
          self.chartLoading = false
          self.chartOverlayOpacity = 0
          if (
            data.data.impressionChartSeries &&
            data.data.impressionChartSeries.length > 0
          ) {
            let chartSeries = data.data.impressionChartSeries[0].chartSeries
            let dataset = []
            let labels = []
            let deltaDays =
              self
                .$moment(self.dateRangeCalendarFixed[1])
                .add(1, 'minutes')
                .diff(
                  self.$moment(self.dateRangeCalendarFixed[0]).startOf('day'),
                  'days'
                ) + 1
            if (
              chartSeries &&
              chartSeries.length > 0 &&
              chartSeries[0].series
            ) {
              let series = chartSeries[0].series
              let imporessionData = []
              let allSessionData = []
              let pageImpressionData = []
              let userImpressionData = []
              let totalImpress = 0
              let avgImpress = 0
              let avgSess = 0
              let totalSessions = 0
              let totalPageImpress = 0
              let avgPageImpress = 0
              let totalUserImpress = 0
              let avgUserImpress = 0
              series.forEach((s) => {
                let m = s.measurement
                imporessionData.push(m.impressed)
                totalImpress += m.impressed
                allSessionData.push(m.userSessions)
                totalSessions += m.userSessions
                pageImpressionData.push(m.pageImpressed)
                totalPageImpress += m.pageImpressed
                userImpressionData.push(m.userImpressed)
                totalUserImpress += m.userImpressed
                if (firstDate == null) {
                  firstDate = self.$moment(s.start)
                }
                labels.push(
                  firstDate === self.$moment(s.start) ||
                    self.$moment
                      .duration(self.$moment(s.start).diff(firstDate))
                      .asHours() %
                      24 ===
                      0
                    ? self.$moment(s.start).format('MMM-DD')
                    : ''
                )
              })
              avgImpress =
                Math.round(
                  ((totalImpress === 0
                    ? 0
                    : (totalImpress / totalSessions) * 100) +
                    Number.EPSILON) *
                    100
                ) / 100 // parseInt(deltaDays > 0 ? totalImpress / deltaDays : 0)
              avgPageImpress =
                Math.round(
                  ((totalImpress === 0
                    ? 0
                    : (totalImpress / totalPageImpress) * 100) +
                    Number.EPSILON) *
                    100
                ) / 100
              avgUserImpress =
                Math.round(
                  ((totalImpress === 0
                    ? 0
                    : (totalImpress / totalUserImpress) * 100) +
                    Number.EPSILON) *
                    100
                ) / 100
              avgSess = parseInt(deltaDays > 0 ? totalSessions / deltaDays : 0)
              self.totalBrandImpressionsCount = totalImpress
              self.totalBrandSessionsCount = totalSessions
              self.avgBrandImpressionsCount = avgImpress
              self.totalPageImpressionsCount = totalPageImpress
              self.avgPageImpressionsCount = avgPageImpress
              self.totalUserImpressionsCount = totalUserImpress
              self.avgUserImpressionsCount = avgUserImpress
              let imporessionDataset = {
                label: 'Total Brand Impressions',
                legendText:
                  'Total Brand Impressions: ' +
                  totalImpress +
                  (avgImpress > 0 ? ' daily AVG: ' + avgImpress : ''),
                data: imporessionData,
                borderColor: 'rgb(0,76,0)',
                backgroundColor: 'rgb(0,162,0)',
                borderWidth: 1,
                yAxisID: 'y-axis-1'
              }
              let pageImpressionDataset = {
                label: 'Total Page View',
                legendText:
                  'Total Page View: ' +
                  totalPageImpress +
                  (avgPageImpress > 0 ? ' daily AVG: ' + avgPageImpress : ''),
                data: pageImpressionData,
                borderColor: 'rgb(33,87,147)',
                backgroundColor: 'rgb(66,165,245)',
                borderWidth: 1,
                yAxisID: 'y-axis-2'
              }
              let allSessionDataset = {
                label: 'Total User Sessions',
                legendText:
                  'Total User Sessions: ' +
                  totalSessions +
                  (avgSess > 0 ? ' daily AVG: ' + avgSess : ''),
                data: allSessionData,
                borderColor: 'rgb(169,0,0)',
                backgroundColor: 'rgb(238,0,6)',
                borderWidth: 1,
                yAxisID: 'y-axis-2'
              }
              let userImpressionDataset = {
                label: 'Total Unique Users',
                legendText:
                  'Total Unique Users: ' +
                  totalUserImpress +
                  (avgUserImpress > 0 ? ' daily AVG: ' + avgUserImpress : ''),
                data: userImpressionData,
                borderColor: 'rgb(170,89,0)',
                backgroundColor: 'rgb(249,168,37)',
                borderWidth: 1,
                yAxisID: 'y-axis-2'
              }
              dataset = [
                imporessionDataset,
                pageImpressionDataset,
                allSessionDataset,
                userImpressionDataset
              ]
            }
            self.impressionsChartInfo = {
              dataset: dataset,
              labels: labels
            }
          }
        })
    },

    buildChart (dataset, labels) {
      let self = this
      let ctx = this.$refs.chartContainer.getContext('2d')
      let chartInstance = this.chartInstance
      if (chartInstance) {
        chartInstance.destroy()
      }
      chartInstance = new Chart(ctx, {
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
                return Chart.helpers.isArray(data.datasets)
                  ? data.datasets.map(function (dataset, i) {
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
                  }, this)
                  : []
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
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Date'
                }
              }
            ],
            yAxes: [
              {
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: 'left',
                ticks: {
                  beginAtZero: true,
                  fontSize: self.chartFont,
                  callback: function (value) {
                    if (value % 1 === 0) {
                      return value
                    }
                  }
                },
                scaleLabel: {
                  display: true,
                  fontSize: self.chartFont,
                  labelString: 'Total Brand Impressions'
                },
                id: 'y-axis-1'
              },
              {
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: 'right',
                ticks: {
                  fontSize: self.chartFont,
                  callback: function (value) {
                    if (value % 1 === 0) {
                      return value
                    }
                  }
                },
                scaleLabel: {
                  display: true,
                  fontSize: self.chartFont,
                  labelString:
                    'Total Page Views / User sessions / Unique users'
                },
                id: 'y-axis-2',

                // grid line settings
                gridLines: {
                  drawOnChartArea: false // only want the grid lines for one axis to show up
                }
              }
            ]
          }
        }
      })
      this.chartInstance = chartInstance
      this.chartInstance.getDatasetMeta(0).hidden = !this
        .totalBrandImpressionsChecked
      this.chartInstance.getDatasetMeta(1).hidden = !this
        .totalPageImpressionsChecked
      this.chartInstance.getDatasetMeta(2).hidden = !this
        .totalBrandSessionsChecked
      this.chartInstance.getDatasetMeta(3).hidden = !this
        .totalUserImpressionsChecked
      this.chartInstance.update()
    },
    reloadProductGroups () {
      this.$store.dispatch('loadStatisticProductGroups').then(() => {
        let productGroups = this.$store.getters.getStatisticProductGroups.map(
          (item) => {
            return {
              id: item.id,
              name: item.name,
              visible: true
            }
          }
        )

        this.availableProductGroups = productGroups.sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        )
      })
    }
  },
  mounted () {
    this.$store.dispatch('loadBrandContentItems').then(() => {
      this.availableBrands = this.$store.getters.getBrandContentItems
      // this.$store.dispatch('loadStatisticBrandIds').then(
      //         (statisticBrandIds) => {
      //   statisticBrandIds.forEach(brandId => {
      //     this.availableBrands.push(allBrands.find(brand => {
      //       return +brandId === +brand.id
      //     }))
      //   })
      this.availableBrands = this.availableBrands.sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      )
      if (this.$store.getters.userHasRoles(Role.Root)) {
        this.availableBrands.unshift({ name: 'All brands', id: 0, logo: '' })
      }
      this.selectedBrand = this.availableBrands[0]

      // })
    })

    this.reloadProductGroups()
    this.changePageView()
  },
  updated () {
    this.$refs.statisticProductGroups.setWidths()
    this.brandId = this.selectedBrand.id
    // if (this.brandId) {
    //   this.loadChartSocialNetworksStatistic()
    // }
  },
  beforeDestroy () {
    if (this.chartInstance) {
      this.chartInstance.destroy()
      this.chartInstance = null
    }
    if (this.chartWebEngInstance) {
      this.chartWebEngInstance.destroy()
      this.chartWebEngInstance = null
    }
  },

  components: {
    JSCharting,
    ProductGroupStatistic,
    ProductGroupList,
    BrandStatisticImpressionsTable
  }
}
</script>

<style>
.btn-group-custom {
  display: flex;
  justify-content: center;
}

@media screen and (max-width: 493px) {
  .btn-group-custom {
    display: flex;
    justify-content: start;
    overflow-x: scroll;
  }
}
</style>
