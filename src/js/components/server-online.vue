<script>
import { mapActions, mapGetters, mapState } from 'vuex'

const endTime = new Date();
const startTime = new Date(endTime - 60 * 10 * 1000);

const echartsOptions = {
  tooltip: {
    formatter: '{a0}<br>{c0}'
  },
  xAxis: {
    type: 'time',
    name: 'Время',
  },
  yAxis: {
    type: 'value',
    name: 'Игроки',
    min: -1,
  },
  series: [{
    type: 'line',
    smooth: true,
    data: [],
  }],
  dataZoom: [{
    id: 'dataZoomX',
    type: 'slider',
    xAxisIndex: [0],
    filterMode: 'filter',
    minValueSpan: 60 * 10 * 1000,
    maxValueSpan: 60 * 30 * 1000,
    startValue: startTime,
    endValue: endTime,
  }],
};

export default {
  props: ['server'],
  computed: {
    ...mapGetters([
      'isServerLoaded',
      'getServerOnline',
    ]),
    serverName () {
      if (this.server.name) {
        return this.server.name + ' [' + this.server.ipport + ']';
      }

      return this.server.ipport;
    },
    serverOnline () {
      return this.getServerOnline(this.server);
    },
  },
  watch: {
    serverOnline (newData, oldData) {
      this.chartOptions.series[0].data = newData;
      this.chart.setOption(this.chartOptions);
    },
  },
  methods: {
    ...mapActions([
      'loadServerOnline',
      'untrackServer',
    ]),
  },
  created () {
    if (!this.isServerLoaded(this.server)) {
      this.loadServerOnline(this.server)
    }
  },
  mounted () {
    this.chart = echarts.init(this.$refs['chart']);
    this.chartOptions = JSON.parse(JSON.stringify(echartsOptions));
    this.chartOptions.series[0].name = this.serverName;
    this.chart.setOption(this.chartOptions);
  }
}
</script>

<template>
  <div>
    <div class="server-title">
      <button
        class="btn btn-sm btn-danger"
        @click="untrackServer(server)"
      >
        <span
          class="glyphicon glyphicon-trash"
          aria-hidden="true"
        />
      </button>
      <h2 class="server-name">
        {{ serverName }}
      </h2>
    </div>
    <div
      ref="chart"
      class="chart"
    />
  </div>
</template>

<style lang="scss">
.server-title {
  display: grid;
  grid-template-columns: min-content auto;
  grid-column-gap: 1rem;
}
.server-name {
  margin: 0;
}
.chart {
  width: auto;
  height: 15rem;
}
</style>
