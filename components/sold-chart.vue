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
      :update="watchers"
      :modules="['exporting']"
    />
  </div>
</template>

<script>
import Highcharts from 'highcharts';
import highchartsHistogramBellcurve from 'highcharts/modules/histogram-bellcurve';

const labels = ['4σ', '3σ', '2σ', 'σ', 'μ', 'σ', '2σ', '3σ', '4σ'];
const pointsInInterval = 5;
const intervals = 4;
const points = ref([]);
const currency = ref('');

if (typeof Highcharts === 'object') {
  highchartsHistogramBellcurve(Highcharts);
}

export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showChart: true,
      titles: ['Sold price distribution', ''],
      points: points.value,
      currency: currency.value,
      pointsInInterval,
      intervals,
      seriesColor: '',
      animationDuration: 1000,
      chartType: '',
      colorInputIsSupported: null,
      chartTypes: [],
      durations: [0, 500, 1000, 2000],
      seriesNames: ['Price', ''],
      xAxisTitles: ['Price', ''],
      yAxisTitles: ['Probability', ''],
      watchers: [
        'options.title',
        'options.series',
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
        xAxis: [{ visible: false }, {
          title: { text: `${this.xAxisTitles[0]} (${currency.value})` },
          tickAmount: 20,
        }],
        yAxis: [{ visible: false }, { visible: false }],
        credits: {
          enabled: false,
        },
        chart: {
          events: {
            load() {
              this?.series[2].xAxis.setTitle({ text: `Price (${currency.value})` }, false);
              const ys = this?.series[2]?.data.map((point) => point?.y);
              const max = Math.max(...ys);
              const nPoints = this?.series[0]?.data?.length;
              const midIndex = Math.floor(nPoints / 2);
              const midPoint = this?.series[0]?.data?.at(midIndex);
              const midPointY = midPoint?.y;
              const midPointRatio = max / midPointY;
              this?.series[0]?.data?.forEach((point, i) => {
                const currentY = point.y;
                const newY = currentY * midPointRatio;
                const label = labels[Math.floor(i / pointsInInterval)];
                point.update({
                  color: i % pointsInInterval === 0 ? 'black' : point.color,
                  y: newY,
                  dataLabels: i % pointsInInterval === 0 ? {
                    enabled: true,
                    // eslint-disable-next-line max-len
                    format: label,
                    overflow: 'none',
                    crop: false,
                    y: -2,
                    style: {
                      fontSize: '13px',
                    },
                  } : point.dataLabels,
                }, false, false, true);
              });
              this.render();
            },
          },
          className: 'my-chart',
          backgroundColor: this.backgroundColor,
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
          },
        },
        title: {
          text: `${this.titles[0]} ${
            this.lastPointClicked.timestamp !== ''
              ? `(Point clicked: ${this.lastPointClicked.timestamp})`
              : ''}`,
        },
        series: [{
          type: 'bellcurve',
          xAxis: 1,
          yAxis: 1,
          baseSeries: 1,
          pointsInInterval: this.pointsInInterval,
          intervals: this.intervals,
          zIndex: -1,
          name: `${this.seriesNames[0]} (${currency.value})`,
          color: this.seriesColor,
          marker: {
            enabled: true,
          },
        }, {
          type: 'scatter',
          name: this.seriesNames[1],
          data: Array.from(this.points),
          visible: false,
          marker: {
            radius: 1.5,
          },
          xAxis: 1,
          yAxis: 1,
        }, {
          type: 'scatter',
          name: '',
          data: Array.from(this.points).map((point, i) => {
            return [point, i];
          }),
          visible: true,
          marker: {
            radius: 1.5,
          },
          xAxis: 1,
          yAxis: 1,
        }],
      };
    },
  },
  mounted() {
  },
  methods: {
    updateSoldChart(datapoints, symbol) {
      const data = Array.from(datapoints).map((datapoint) => {
        return parseFloat(datapoint.replace(/[^0-9\\.]/g, ''));
      });
      currency.value = symbol;
      this.points = data.filter((number) => !!number);
    },
  },
};
</script>
