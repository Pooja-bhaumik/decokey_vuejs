<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <v-container>
    <v-layout>
      <v-flex xs12>
        <v-row>
          <v-col class="col-lg-3">
            <h1>Campaign strategy</h1>
          </v-col>
          <v-col class="col-lg-1">
            <v-text-field v-model="viewPerDay" label="Views per day"></v-text-field>
          </v-col>
          <v-col class="col-lg-1">
            <v-text-field v-model="days" label="Days"></v-text-field>
          </v-col>
          <v-col class="col-lg-2">
            <v-select :items="strategies" v-model="strategy" label="Strategy"/>
          </v-col>
          <v-col class="col-lg-2">
            <v-btn @click="simulateStrategy" color="error">Simulate</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-row v-for="campaign in campaigns" :key="campaign.supplier">
              <v-card
                      class="mx-auto"
                      outlined
                      width="90%"
              >
                <v-row>
                  <v-col class="col-lg-3">
                    <v-text-field class="mt-0 pt-0" v-model="campaign.supplier" label="Campaign name" >
                      <template v-slot:append-outer>
                        <div style="width: 20px; height: 20px; cursor: pointer" v-bind:style="{ backgroundColor: campaign.color}" @click="campaign.showColor = !campaign.showColor"></div>
                      </template>
                    </v-text-field>
                    <v-color-picker v-if="campaign.showColor" class="ma-2" v-model="campaign.color" :swatches="swatches" show-swatches></v-color-picker>
                    <v-btn @click="campaign.showColor = !campaign.showColor" v-if="campaign.showColor">Ok</v-btn>
                  </v-col>

                  <v-col class="col-lg-2">
                    <v-text-field
                            v-model="campaign.from"
                            class="mt-0 pt-0"
                            type="number"
                            label="From day"
                            style="width: 60px"
                    ></v-text-field>
                  </v-col>
                  <v-col class="col-lg-2">
                    <v-text-field
                            v-model="campaign.till"
                            class="mt-0 pt-0"
                            label="Till day"
                            type="number"
                            style="width: 60px"
                    ></v-text-field>
                  </v-col>
                  <v-col class="col-lg-2">
                    <v-btn @click="copyCampaign(campaign)" v-text="'Copy'"></v-btn>
                  </v-col>
                  <v-col class="col-lg-2">
                    <v-btn @click="campaigns.splice(campaigns.indexOf(campaign), 1);" v-text="'Delete'"></v-btn>
                  </v-col>
                </v-row>
                <v-card-text>
                  <v-row v-for="ad in campaign.ads" :key="ad.id">
                    <v-col class="col-lg-2">
                      <v-text-field
                              v-model="ad.id"
                              class="mt-0 pt-0"
                              label="Ad id"
                              type="number"
                              style="width: 60px"
                      ></v-text-field>
                    </v-col>
                    <v-col class="col-lg-2">
                      <v-text-field
                              v-model="ad.initialBudget"
                              class="mt-0 pt-0"
                              label="Budget"
                              type="number"
                              style="width: 60px"
                      ></v-text-field>
                    </v-col>
                    <v-col class="col-lg-2">
                      <v-btn @click="copyAd(campaign, ad)" v-text="'Copy'" ></v-btn>
                    </v-col>
                    <v-col class="col-lg-2">
                      <v-btn @click="campaign.ads.splice(campaign.ads.indexOf(ad), 1);" v-text="'Delete'" ></v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
          </v-row>
        </v-row>
        <canvas id="chartContainer" height="100"></canvas>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Chart from 'chart.js'
import Url from '../../store/url'
import $ from 'jquery'

export default {
  data: () => ({
    viewPerDay: 100,
    days: 8,
    chartInstance: null,
    campaigns: [
      { supplier: 'Campaign A', from: 1, till: 5, showColor: false, color: '#f83023', ads: [{ id: 0, initialBudget: 50 }, { id: 1, initialBudget: 100 }] },
      { supplier: 'Campaign B', from: 2, till: 5, showColor: false, color: '#08dd1f', ads: [{ id: 0, initialBudget: 150 }, { id: 1, initialBudget: 200 }] }
    ],
    strategies: ['Simple', 'Proportional', 'ProportionalSmooth'],
    strategy: 'Simple',
    swatches: [
      ['#FF0000', '#AA0000', '#550000'],
      ['#FFFF00', '#AAAA00', '#555500'],
      ['#00FF00', '#00AA00', '#005500'],
      ['#00FFFF', '#00AAAA', '#005555'],
      ['#0000FF', '#0000AA', '#000055']
    ]
  }),
  mounted () {
    // this.simulateStrategy()
  },
  methods: {
    simulateStrategy () {
      let url = Url.backEndUrl
      let self = this
      $.ajax({
        url: url + '/simulateDeliveryStrategy?viewPerDay=' + self.viewPerDay + '&days=' + self.days + '&strategy=' + self.strategy,
        method: 'POST',
        data: JSON.stringify(self.campaigns),
        contentType: 'application/json',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          self.buildChart(data)
        },
        error: function (e) {
          console.log(e)
        }
      })
    },
    buildChart (dataset) {
      let ctx = document.getElementById('chartContainer')
      let self = this
      dataset.forEach((d, i) => {
        // d.borderColor = self.getRandomColor()
        d.borderWidth = 1
      })
      if (self.chartInstance) {
        self.chartInstance.destroy()
      }
      self.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['0 day', '1 day', '2 day', '3 day', '4 day', '5 day', '6 day', '7 day', '8 day'],
          datasets: dataset
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: 'Delivery per day'
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
                labelString: 'Day'
              }
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Delivaries'
              }
            }]
          }
        }
      })
    },
    copyCampaign (campaign) {
      let c = Object.assign({}, campaign)
      c.supplier = 'New'
      let ads = []
      c.ads.forEach(a => { ads.push(Object.assign({}, a)) })
      c.ads = ads
      this.campaigns.push(c)
    },
    copyAd (campaign, ad) {
      let a = Object.assign({}, ad)
      a.id = campaign.ads.length
      campaign.ads.push(a)
    },
    getRandomColor () {
      let r = function () { return Math.floor(Math.random() * 256) }
      return 'rgb(' + r() + ',' + r() + ',' + r() + ')'
    }
  }
}
</script>
