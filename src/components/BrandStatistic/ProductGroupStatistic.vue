<template>
  <v-slide-item v-if="visible">
        <v-card
                  color="#7777AA"
                  class="ma-4"

          >
          <v-row
                    class="fill-height"
                    align="center"
                    justify="center"
            >
            <v-card-text>
              <div class="title text-center white--text">
                {{productGroup.name}}
              </div>
              <v-container>
              <v-row>
                <v-col cols="auto" class="mr-auto pt-0 pb-0">
                  <h2 class="subtitle-1" style="color: white;">Brand Impressions</h2>
                </v-col>
                <v-col cols="auto" class="pt-0 pb-0">
                  <h2 style="color: white;">{{new Intl.NumberFormat('de-DE').format(impressed)}}</h2>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="auto" class="mr-auto pt-0 pb-0">
                  <h2 class="subtitle-1" style="color: white;">Page views</h2>
                </v-col>
                <v-col cols="auto" class="pt-0 pb-0">
                  <h2 style="color: white;">{{new Intl.NumberFormat('de-DE').format(pageImpressed)}}</h2>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="auto" class="mr-auto pt-0 pb-0">
                  <h2 class="subtitle-1" style="color: white;">User sessions</h2>
                </v-col>
                <v-col cols="auto" class="pt-0 pb-0">
                  <h2 style="color: white;">{{new Intl.NumberFormat('de-DE').format(userSessions)}}</h2>
                </v-col>
              </v-row>
              </v-container>
            </v-card-text>

          </v-row>
        </v-card>
      </v-slide-item>
</template>

<script>
export default {
  name: 'ProductGroupStatistic',
  props: {
    productGroup: {
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      }
    },
    statisticInfo: {
      from: {
        type: Date,
        required: true
      },
      to: {
        type: Date,
        required: true
      },
      contentTypes: {
        type: Array,
        required: true
      },
      devices: {
        type: Array,
        required: true
      }
    }
  },
  data: function () {
    return {
      impressed: 0,
      pageImpressed: 0,
      userSessions: 0,
      visible: true
    }
  },
  watch: {
    statisticInfo: {
      handler () {
        this.loadImpressions()
      },
      deep: true
    }
  },
  mounted () {
    this.loadImpressions()
  },
  methods: {
    formatDateString (dateStr) {
      let momentObj = this.$moment(dateStr)
      let momentString = momentObj.format('YYYY-MM-DDTHH:mm:ssZ')
      return momentString
    },
    loadImpressions () {
      this.$store.dispatch('loadImpressionsForProductGroup', {
        productGroupId: this.productGroup.id,
        fromDate: this.formatDateString(this.statisticInfo.from),
        toDate: this.formatDateString(this.statisticInfo.to),
        contentTypes: this.statisticInfo.contentTypes,
        devices: this.statisticInfo.devices
      }).then((impressions) => {
        if (!impressions.length) {
          this.visible = false
          return
        }
        let impressed = 0
        let pageImpressed = 0
        let userSessions = 0
        impressions.forEach((impression) => {
          impressed += impression.impressed
          pageImpressed += impression.pageImpressed
          userSessions += impression.userSessions
        })
        this.impressed = impressed
        this.pageImpressed = pageImpressed
        this.userSessions = userSessions

        if (!this.impressed && !this.pageImpressed && !this.userSessions) {
          this.visible = false
          return
        }
        this.visible = true
      }).catch((err) => {
        this.visible = false
        console.log('Error loading for pg with id = ' + this.productGroup.id)
        console.log(err)
      })
    }
  }
}
</script>
