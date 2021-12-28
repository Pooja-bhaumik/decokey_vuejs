<template>
  <date-picker
    style="width: 100%"
    v-model="date"
    range
    type="datetime"
    placeholder="Select date"
    value-type="format"
    format="YYYY-MM-DD HH:mm"
    :show-time-panel="showTimePanel"
    :shortcuts="timePresets"
    @close="handleOpenChange"
  >
    <template v-slot:footer v-if="showTimePanelToggle">
      <button class="mx-btn mx-btn-text" @click="toggleTimePanel">
        {{ showTimePanel ? 'select date' : 'select time' }}
      </button>
    </template>
  </date-picker>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import 'vue2-datepicker/index.css'

export default {
  props: {
    dateTime: Array,
    showTimePanelToggle: Boolean
  },

  data: function () {
    return {
      showTimePanel: false,
      timePresets: [
        {
          text: 'Yesterday',
          onClick: () => {
            const date = [
              this.$moment()
                .startOf('day')
                .subtract(1, 'days')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'This week (Monday-yesterday)',
          onClick: () => {
            const date = [
              this.$moment().startOf('isoWeek')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'Last 7 days',
          onClick: () => {
            const date = [
              this.$moment()
                .startOf('day')
                .subtract(7, 'days')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'Last week (Monday-Sunday)',
          onClick: () => {
            const date = [
              this.$moment().subtract(1, 'week').startOf('isoWeek')._d,
              this.$moment().subtract(1, 'week').endOf('isoWeek')._d
            ]
            return date
          }
        },
        {
          text: 'Last 14 days',
          onClick: () => {
            const date = [
              this.$moment()
                .startOf('day')
                .subtract(14, 'days')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'This month (until Yesterday)',
          onClick: () => {
            const date = [
              this.$moment().startOf('month')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'Last 28 days',
          onClick: () => {
            const date = [
              this.$moment()
                .startOf('day')
                .subtract(28, 'days')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'Last 30 days',
          onClick: () => {
            const date = [
              this.$moment()
                .startOf('day')
                .subtract(30, 'days')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'Last month',
          onClick: () => {
            const date = [
              this.$moment()
                .subtract(1, 'months')
                .startOf('month')._d,
              this.$moment()
                .subtract(1, 'months')
                .endOf('month')
                .subtract(1, 'days')._d
            ]
            return date
          }
        },
        {
          text: 'Lifetime',
          onClick: () => {
            const date = [
              this.$moment('2020-03-11 00:00')._d,
              this.$moment()
                .endOf('day')
                .subtract(1, 'days')._d
            ]
            return date
          }
        }
      ]
    }
  },

  computed: {
    date: {
      get () {
        return this.dateTime
      },
      set (newDate) {
        this.$emit('update:dateTime', newDate)
      }
    }
  },

  methods: {
    toggleTimePanel () {
      this.showTimePanel = !this.showTimePanel
    },
    handleOpenChange () {
      this.showTimePanel = false
    }
  },

  components: {
    DatePicker
  }
}
</script>
