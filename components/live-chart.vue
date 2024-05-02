<template>
  <USkeleton
    v-if="loading"
    class="h-[402px] w-auto"
  />
  <div
    v-else
    class="flex-1 justify-between p-1"
  >
    <highchart
      :options="chartOptions"
      :modules="['exporting']"
      :update="watchers"
      style="width:100%;"
    />
  </div>
</template>

<script>
const currency = ref('');

export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      title: 'Live listings chart',
      points: [],
      currency: '',
      seriesColor: '',
      animationDuration: 1000,
      chartType: '',
      colorInputIsSupported: null,
      chartTypes: [],
      durations: [0, 500, 1000, 2000],
      seriesName: '',
      yAxis: 'Price',
      xAxis: 'Minutes Remaining',
      watchers: [
        'options.title',
        'options.series',
      ],
      colors: [
        'Red',
        'Green',
        'Blue',
        'Pink',
        'Orange',
        'Brown',
        'Black',
        'Purple',
      ],
      lastPointClicked: {
        timestamp: '',
        x: '',
        y: '',
      },
      sexy: false,
    };
  },
  computed: {
    /** @returns {import('@/lib/types').ChartOptions} */
    chartOptions() {
      const ctx = this;
      return {
        accessibility: { enabled: false },
        chart: {
          events: {
            load() {
              this?.series[0].yAxis.setTitle({ text: `Price (${currency.value})` }, false);
              this.render();
            },
          },
          backgroundColor: this.backgroundColor,
          type: this.chartType.toLowerCase(),
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click() {
                  ctx.$emit('pointClicked', this);
                },
              },
            },
          },
        },
        yAxis: [{
          title: {
            text: `${this.yAxis} (${this.currency})`,
            style: {
              color: '#000000',
            },
          },
          min: 0.0,
        }],
        xAxis: [{
          title: {
            text: this.xAxis,
            style: {
              color: '#000000',
            },
          },
          min: 0.0,
        }],
        title: {
          text: `${this.title} ${
            this.lastPointClicked.timestamp !== ''
              ? `(Point clicked: ${this.lastPointClicked.timestamp})`
              : ''}`,
        },
        series: [{
          type: 'line',
          name: this.seriesName,
          data: Array.from(this.points),
          color: this.seriesColor,
          marker: {
            enabled: true,
          },
        }],
      };
    },
  },
  methods: {
    updateLiveChart(values, symbol) {
      const data = Array.from(values).map((datapoint) => {
        return [parseFloat(datapoint[0]), parseFloat(datapoint[1])];
      }).filter((datapoint) => {
        return !!datapoint[0] && !!datapoint[1];
      });
      this.points = data;
      currency.value = symbol;
    },
  },
};
</script>

<style scoped>

</style>
