<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-select
    v-model="timePreset"
    :items="timePresets"
    item-text="name"
    item-value="date"
    label="Time presets"
    ref="timePresetsSelect"
  ></v-select>
</template>

<script>
export default {
  data: function () {
    return {
      timePreset: {},
      timePresets: [
        {
          name: 'Yesterday',
          date: [
            this.$moment()
              .startOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'This week (Monday-yesterday)',
          date: [
            this.$moment().startOf('isoWeek').format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'Last 7 days',
          date: [
            this.$moment()
              .startOf('day')
              .subtract(7, 'days')
              .format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'Last week (Monday-Sunday)',
          date: [
            this.$moment().subtract(1, 'week').startOf('isoWeek').format('YYYY-MM-DD HH:mm'),
            this.$moment().subtract(1, 'week').endOf('isoWeek').format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'Last 14 days',
          date: [
            this.$moment()
              .startOf('day')
              .subtract(14, 'days')
              .format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'This month (until Yesterday)',
          date: [
            this.$moment().startOf('month').format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'Last 28 days',
          date: [
            this.$moment()
              .startOf('day')
              .subtract(28, 'days')
              .format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'Last 30 days',
          date: [
            this.$moment()
              .startOf('day')
              .subtract(30, 'days')
              .format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'Last month',
          date: [
            this.$moment()
              .subtract(1, 'months')
              .startOf('month')
              .format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .subtract(1, 'months')
              .endOf('month')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        },
        {
          name: 'Lifetime',
          date: [
            this.$moment('2020-03-11 00:00').format('YYYY-MM-DD HH:mm'),
            this.$moment()
              .endOf('day')
              .subtract(1, 'days')
              .format('YYYY-MM-DD HH:mm')
          ]
        }
      ]
    }
  },

  watch: {
    timePreset (val) {
      this.$emit('timePreset', val)
    }
  }
}
</script>
