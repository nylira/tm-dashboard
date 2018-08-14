<template>
  <div id="releases">
    <h1>Voyager Downloads</h1>
    <h2>{{ overallHeading }}</h2>
    <div class="pie-chart-container">
      <canvas id="overall-chart" width="400" height="400"></canvas>
    </div>
    <h2>Linux</h2>
    <div class="chart-container">
      <canvas id="linux-chart" width="400" height="400"></canvas>
    </div>
    <h2>Mac</h2>
    <div class="chart-container">
      <canvas id="mac-chart" width="400" height="400"></canvas>
    </div>
    <h2>Windows</h2>
    <div class="chart-container">
      <canvas id="win-chart" width="400" height="400"></canvas>
    </div>
  </div>
</template>

<script>
import { max, maxBy, orderBy, sumBy } from "lodash";
import getJson from "../scripts/getJson";
import moment from "moment";
import Chart from "chart.js";
export default {
  name: "home",
  computed: {
    downloads() {
      if (this.releases.length === 0) {
        return [];
      } else {
        return this.releases;
      }
    },
    yAxisMax() {
      if (this.releases.length === 0) {
        return [];
      } else {
        let linuxMax = maxBy(this.linuxReleases, "downloads").downloads;
        let macMax = maxBy(this.macReleases, "downloads").downloads;
        let winMax = maxBy(this.winReleases, "downloads").downloads;
        let maxDownloads = max([linuxMax, macMax, winMax]);
        return maxDownloads;
      }
    },
    linuxReleases() {
      return this.getReleases(this.isLinux);
    },
    macReleases() {
      return this.getReleases(this.isMacOS);
    },
    winReleases() {
      return this.getReleases(this.isWindows);
    },
    overallHeading() {
      if (this.releases.length === 0) {
        return "Latest Version Breakdown";
      } else {
        return `${
          this.linuxReleases[this.linuxReleases.length - 1].version
        } - Download Breakdown`;
      }
    }
  },
  data: () => ({
    releases: []
  }),
  methods: {
    fromNow(datetime) {
      return moment(datetime).fromNow();
    },
    isMacOS(asset) {
      return asset.name.includes("darwin") || asset.name.includes("mac");
    },
    isWindows(asset) {
      return asset.name.includes("win") || asset.name.includes("indows");
    },
    isLinux(asset) {
      return (
        asset.name.includes("linux") ||
        asset.name.includes("Linux") ||
        asset.name.includes("deb")
      );
    },
    fixVersion(tagName) {
      if (tagName.startsWith("0")) {
        return "v" + tagName;
      } else {
        return tagName;
      }
    },
    getReleases(osFilter) {
      let releases = this.downloads.filter(r =>
        r.assets.find(a => osFilter(a))
      );
      releases = releases.map(r => {
        let assets = r.assets.filter(a => osFilter(a));
        let downloads = sumBy(assets, "download_count");
        return {
          version: this.fixVersion(r.tag_name),
          date: r.published_at,
          downloads: downloads
        };
      });
      return orderBy(releases, "version");
    },
    getOS(asset) {
      if (this.isMacOS(asset)) {
        return "macOS";
      }
      if (this.isWindows(asset)) {
        return "Windows";
      }
      if (this.isLinux(asset)) {
        return "Linux";
      }
    },
    drawOverallChart() {
      let ctx = this.$el.querySelector("#overall-chart").getContext("2d");
      let data = {
        datasets: [
          {
            data: [
              this.linuxReleases[this.linuxReleases.length - 1].downloads,
              this.macReleases[this.macReleases.length - 1].downloads,
              this.winReleases[this.winReleases.length - 1].downloads
            ],
            backgroundColor: ["yellow", "#dddddd", "#2d89ef"]
          }
        ],
        labels: ["Linux", "MacOS", "Windows"]
      };
      let options = {};

      // eslint-disable-next-line
      let myDoughnutChart = new Chart(ctx, {
        type: "doughnut",
        data: data,
        options: options
      });
    },
    drawChart(chartId, data) {
      let ctx = this.$el.querySelector(chartId).getContext("2d");

      // eslint-disable-next-line
      let myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map(d => d.version),
          datasets: [
            {
              label: "Downloads",
              data: data.map(d => d.downloads),
              backgroundColor: "hsl( 233,  88%,  57%)"
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          layout: {
            padding: {
              left: 16,
              right: 16,
              top: 16,
              bottom: 8
            }
          },
          scales: {
            xAxes: [
              {
                fontColor: "#ffffff",
                gridLines: {
                  color: "hsla(233,  24%,  75%, 0.0875)"
                }
              }
            ],
            yAxes: [
              {
                gridLines: {
                  color: "hsla(233,  24%,  75%, 0.0875)"
                },
                ticks: {
                  max: this.yAxisMax,
                  beginAtZero: true
                }
              }
            ]
          }
        }
      });
    }
  },
  async mounted() {
    Chart.defaults.global.defaultFontColor = "hsla(  0, 100%, 100%, 0.667)";
    let url = "https://api.github.com/repos/cosmos/voyager/releases";
    this.releases = await getJson(url);

    this.drawChart("#linux-chart", this.linuxReleases);
    this.drawChart("#mac-chart", this.macReleases);
    this.drawChart("#win-chart", this.winReleases);

    this.drawOverallChart();
  }
};
</script>
