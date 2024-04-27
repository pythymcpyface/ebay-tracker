<template>
  <highchart
    class="flex-1 justify-between p-1"
    :options="chartOptions"
    :update="watchers"
  />
</template>

<script>
import Highcharts from 'highcharts';
import highchartsHistogramBellcurve from 'highcharts/modules/histogram-bellcurve';

const labels = ['4σ', '3σ', '2σ', 'σ', 'μ', 'σ', '2σ', '3σ', '4σ'];
const pointsInInterval = 5;
const points = ref([]);

if (typeof Highcharts === 'object') {
  highchartsHistogramBellcurve(Highcharts);
}

export default {
  data() {
    return {
      showChart: true,
      backgroundColor: '#fff',
      titles: ['Sold price distribution', ''],
      points: points.value,
      pointsInInterval,
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
          title: { text: this.xAxisTitles[0] },
          tickAmount: 20,
        }],
        yAxis: [{ visible: false }, { visible: false }],
        credits: {
          enabled: false,
        },
        chart: {
          events: {
            redraw() {
              this?.series[0]?.data?.forEach((point, i) => {
                if (i % pointsInInterval === 0) {
                  const label = labels[Math.floor(i / pointsInInterval)];
                  point.update({
                    color: 'black',
                    dataLabels: {
                      enabled: true,
                      // eslint-disable-next-line max-len
                      format: label,
                      overflow: 'none',
                      crop: false,
                      y: -2,
                      style: {
                        fontSize: '13px',
                      },
                    },
                  }, false, false, true);
                }
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
          intervals: 4,
          zIndex: -1,
          name: this.seriesNames[0],
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
        }],
      };
    },
  },
  mounted() {
  },
  methods: {
    updateSoldChart(datapoints) {
      const data = Array.from(datapoints).map((datapoint) => {
        return parseFloat(datapoint.replace(/[^0-9\\.]/g, ''));
      });
      this.points = data.filter((number) => !!number);
    },
  },
};
</script>
