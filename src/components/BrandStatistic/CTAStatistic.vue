<template>
  <v-container>
    <h2>{{ $t('message.ctaStats') }}</h2>
      <v-row>
        <v-col class="d-flex align-center" cols="11">
          <vue2-datepicker :dateTime.sync="dateTime" :showTimePanelToggle="true"></vue2-datepicker>
        </v-col>
        <v-col class="d-flex align-center" lg="1" md="1" sm="1" xs="1" >
          <v-icon v-text="'mdi-reload'" style="cursor: pointer" @click="loadCTAStatistic()"></v-icon>
        </v-col>
        <v-col cols="12">
          <v-data-table
              :headers="headers"
              :items="filteredItems"
              :sort-by="['ctaId']"
              :loading="loading">
            <template v-slot:header>
              <tr class="search-inputs-wrapper">
                <th v-for="header in headers" :key="'header' + header.value">
                  <div>
                    <v-text-field
                        :label="header.text"
                        v-if="header.freeText === undefined || header.freeText"
                        append-icon="mdi-magnify"
                        @click:append="() => loadCTAStatistic()"
                        class="md-4"
                        v-model="search[header.value]"
                        @keyup.enter.native="loadCTAStatistic"></v-text-field>
                    <v-select v-else-if="header.type === 'selectMultiple'"
                        v-model="search.measurements"
                        :items="measurements"
                        small-chips
                        label="Measurements"
                        multiple
                    />
                    <item-filter v-else-if="header.value === 'productGroup'"
                                 v-model="search.productGroupId" @input="loadCTAStatistic" :type-id="header.typeId" :type-name="null" label="Product group"
                    />
                    <item-filter v-else-if="header.value === 'articleCategory'"
                                 v-model="search.articleCategoryId" @input="loadCTAStatistic" type-name="prefilledList" :pre-filled-items="articleCategories" label="Article category"
                    />
                    <item-filter v-else-if="header.value === 'branch'"
                                 v-model="search.branchId" @input="loadCTAStatistic" :type-id="header.typeId" :type-name="null" label="Branch"
                    />
                    <item-filter v-else-if="header.value === 'ctaType'"
                                 v-model="search.ctaTypeCf" @input="loadCTAStatistic" type-name="prefilledList" :pre-filled-items="ctaTypes" label="Cta Type"
                    />
                    <item-filter v-else-if="header.value === 'pageType'"
                                 v-model="search.pageType" @input="loadCTAStatistic" type-name="prefilledList" :pre-filled-items="pageTypes" label="Page Type"
                    />
                  </div>
                </th>
              </tr>
            </template>

            <template v-slot:item.ctaId="{ item }">
              <div style="max-width: 100px; max-height: 50px">
                {{item.ctaId}}
              </div>
            </template>
            <template v-slot:item.ctaName="{ item }">
              <div style="max-width: 100px; max-height: 90px">
                {{item.ctaName}}
              </div>
            </template>
            <template v-slot:item.productGroup="{ item }">
              <div style="max-width: 100px; max-height: 90px">
                {{item.productGroup}}
              </div>
            </template>
            <template v-slot:item.articleCategory="{ item }">
              <div style="max-width: 100px; max-height: 90px">
                {{item.articleCategory}}
              </div>
            </template>
            <template v-slot:item.branch="{ item }">
              <div style="max-width: 130px; max-height: 90px">
                {{item.branch}}
              </div>
            </template>
            <template v-slot:item.ctaType="{ item }">
              <div style="max-width: 100px; max-height: 90px">
                {{item.ctaType}}
              </div>
            </template>
            <template v-slot:item.pageType="{ item }">
              <div style="max-width: 100px; max-height: 90px">
                {{item.pageType}}
              </div>
            </template>
            <template v-slot:item.measurements="{ item }">
              <div style="max-width: 100px; max-height: 90px">
                {{item.measurements}}
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
  </v-container>
</template>

<script>
import Vue2Datepicker from '@/components/BrandStatistic/Vue2Datepicker'
import ItemType from '@/store/itemType'
import ItemFilter from '@/components/ContentItems/ItemFilter'

export default {
  data: function () {
    return {
      dateTime: [
        this.$moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DD HH:mm'),
        this.$moment().format('YYYY-MM-DD HH:mm')
      ],
      loading: false,
      ctaList: [],
      headers: [
        { text: 'CTA Id', value: 'ctaId' },
        { text: 'CTA Name', value: 'ctaName' },
        { text: 'Product group', value: 'productGroup', freeText: false, typeId: ItemType.Product_Group },
        { text: 'Article category', value: 'articleCategory', freeText: false },
        { text: 'Branch', value: 'branch', freeText: false, typeId: ItemType.Branch },
        { text: 'CTA Type', value: 'ctaType', freeText: false },
        { text: 'Page Type', value: 'pageType', freeText: false },
        { text: 'Measurements', value: 'measurements', freeText: false, sortable: false, type: 'selectMultiple' }
      ],
      measurements: [
        {
          text: 'Delivered',
          value: 'impressed'
        },
        {
          text: 'Impressed',
          value: 'ctaClicked'
        },
        {
          text: 'Unique impressed',
          value: 'ctaSubmitted'
        }
      ],
      search: {
        ctaId: undefined,
        ctaName: undefined,
        productGroupId: undefined,
        articleCategoryId: undefined,
        branchId: undefined,
        ctaTypeCf: undefined,
        pageType: undefined,
        measurements: ['impressed', 'ctaClicked', 'ctaSubmitted']
      },
      articleCategories: [],
      pageTypes: ['REGULAR', 'AMP']
    }
  },

  watch: {
    search: {
      handler () {
        this.loadCTAStatistic()
      },
      deep: true
    },
    'search.productGroupId' (productGroupId) {
      if (!productGroupId) {
        this.$store.dispatch('getArticleCategories').then(ac => {
          this.articleCategories = ac
        })
        return
      }
      this.$store.dispatch('getArticleCategoriesByProductGroup', productGroupId).then(ac => {
        this.articleCategories = ac
      })
    }
  },

  methods: {
    formatDateString (dateStr) {
      let momentObj = this.$moment(dateStr)
      return momentObj.format('YYYY-MM-DDTHH:mm:ssZ')
    },

    loadCTAStatistic () {
      this.loading = true

      const fromDate = this.dateTime[0] ? this.formatDateString(this.dateTime[0]) : this.$moment().startOf('day').subtract(1, 'days').format('YYYY-MM-DDTHH:mm:ssZ')
      const toDate = this.dateTime[1] ? this.formatDateString(this.dateTime[1]) : this.$moment().format('YYYY-MM-DDTHH:mm:ssZ')
      const search = JSON.parse(JSON.stringify(this.search))
      if (!search.ctaId) {
        search.ctaId = null
      } else if (!(/^[0-9]+$/.test(search.ctaId))) {
        search.ctaId = -1
      }
      this.$store.dispatch('loadCTAStatistic', { fromDate: fromDate, toDate: toDate, ctaId: search.ctaId, ctaName: search.ctaName, ctaTypeCf: search.ctaTypeCf, productGroupId: search.productGroupId, articleCategoryId: search.articleCategoryId, userBranchId: search.branchId }).then(() => {
        const statistic = this.$store.getters.getCTAStatistic
        this.ctaList = []
        this.ctaList = this.parseCTAStatistic(statistic)
        this.loading = false
      })
    },

    parseCTAStatistic (statistic) {
      const res = []
      statistic.forEach(stat => {
        let ctaStatistic = stat.statistic[0]

        res.push({
          ctaId: ctaStatistic.ctaId,
          ctaName: ctaStatistic.ctaName,
          ctaType: ctaStatistic.ctaType,
          ctaTypeCf: ctaStatistic.ctaTypeCf,
          productGroup: ctaStatistic.productGroup,
          productGroupId: ctaStatistic.productGroupId,
          articleCategory: ctaStatistic.articleCategory,
          articleCategoryId: ctaStatistic.articleCategoryId,
          branch: ctaStatistic.branch,
          branchId: ctaStatistic.branchId,
          pageType: ctaStatistic.pageType,
          measurements: ctaStatistic.measurement
        })
      })

      return res
    },

    toCTAItem (item, measurements) {
      let measurementResult = ''
      for (let measurement in measurements) {
        if (measurementResult !== '') {
          measurementResult += ', '
        }
        measurementResult += item.measurements[measurements[measurement]]
      }

      return {
        ctaId: item.ctaId,
        ctaName: item.ctaName,
        ctaType: item.ctaType,
        productGroup: item.productGroup,
        articleCategory: item.articleCategory,
        branch: item.branch,
        pageType: item.pageType,
        measurements: measurementResult
      }
    }
  },

  mounted () {
    this.loadCTAStatistic()
    this.$store.dispatch('getArticleCategories').then(ac => {
      this.articleCategories = ac
    })
    this.$store.dispatch('getCtaTypes')
  },

  computed: {
    filteredItems () {
      let search = this.search
      return this.ctaList.map(item => this.toCTAItem(item, search.measurements))
        .filter(item => !search.pageType || item.pageType === search.pageType)
    },
    ctaTypes () {
      return this.$store.getters.getCtaTypes
    }
  },

  components: {
    ItemFilter,
    Vue2Datepicker
  }
}
</script>
