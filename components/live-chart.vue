<template>
  <highchart
    class="flex-1 justify-between p-1"
    :options="chartOptions"
    :modules="['exporting']"
    :update="watchers"
    style="width:100%;"
  />
</template>

<script>
export default {
  data() {
    return {
      title: 'Live listings chart',
      points: [],
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
          backgroundColor: this.sexy
            ? {
              linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
              stops: [
                [0, this.seriesColor],
                [0.5, '#ffffff'],
                [1, this.seriesColor],
              ],
            }
            : '#ffffff',
          className: 'my-chart',
          type: this.chartType.toLowerCase(),
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
            text: this.yAxis,
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
          style: {
            // @ts-ignore
            color: this.sexy ? this.invertedColor(0) : '#black',
          },
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
    updateLiveChart(values) {
      const data = Array.from(values).map((datapoint) => {
        return [parseFloat(datapoint[0]), parseFloat(datapoint[1])];
      }).filter((datapoint) => !!datapoint[0] && !!datapoint[1]);
      this.points = data;
    },
  },
};
</script>

<style scoped>

</style>
