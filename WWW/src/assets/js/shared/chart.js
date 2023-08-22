$(function () {
  /* ChartJS */
  'use strict'
  // dashboard
  if ($('#dashboardChart1').length) {

    // labels : 최근 7일 날짜
    const labels = []
    for (let i = 7; i >= 1; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      labels.push(d.toISOString().slice(0, 10))
    }

    // data fetch
    async function fetchData () {
      const response = await fetch(serverUrl+'/data')  
      const data = await response.json()
      return data
    }

    async function drawChart () {
      const data = await fetchData()

      // countData : labels의 각 날짜에 해당하는 데이터의 개수
      let countData = labels.map(
        label => data.filter(d => d.date.slice(0, 10) === label).length
      )

      countData = labels.map(
        label => data.filter(d => d.date.slice(0, 10) === label).length
      )
      // 합계 구하고 출력
      const sum = countData.reduce((a, b) => a + b, 0)
      document.getElementById(
        'dashboardChart-p'
      ).innerHTML = `최근 7일간 수집한 총 ${sum} 개의 데이터를 수집하였습니다`
      
      // 데이터 개수에 따른 y축 최대값 설정
      const max = Math.max(...countData)
      const maxRound = Math.ceil(max / 1000) * 1000

      // 차트
      var dashboardChart1Canvas = $('#dashboardChart1').get(0).getContext('2d')
      var dashboardChart1 = new Chart(dashboardChart1Canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'data',
              data: countData,
              backgroundColor: ChartColor[0],
              borderColor: ChartColor[0],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Last 7 days',
                  fontSize: 15,
                  lineHeight: 2
                },
                ticks: {
                  fontColor: ChartColor[7],
                  stepSize: 50,
                  min: 0,
                  max: 150,
                  autoSkip: true,
                  autoSkipPadding: 15,
                  maxRotation: 0,
                  maxTicksLimit: 10
                },
                gridLines: {
                  display: false,
                  drawBorder: false,
                  color: 'transparent',
                  zeroLineColor: '#eeeeee'
                }
              }
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Amount of Collected Data',
                  fontSize: 15,
                  lineHeight: 2
                },
                ticks: {
                  display: true,
                  autoSkip: false,
                  maxRotation: 0,
                  fontColor: '#bfccda',
                  stepSize: 1000,
                  min: 0,
                  max: maxRound,
                },
                gridLines: {
                  drawBorder: false
                }
              }
            ]
          },
          legend: {
            display: false
          },
          legendCallback: function (chart) {
            var text = []
            text.push('<div class="chartjs-legend"><ul>')
            for (var i = 0; i < chart.data.datasets.length; i++) {
              console.log(chart.data.datasets[i]) // see what's inside the obj.
              text.push('<li>')
              text.push(
                '<span style="background-color:' +
                  chart.data.datasets[i].backgroundColor +
                  '">' +
                  '</span>'
              )
              text.push(chart.data.datasets[i].label)
              text.push('</li>')
            }
            text.push('</ul></div>')
            return text.join('')
          },
          elements: {
            point: {
              radius: 0
            }
          }
        }
      })
      document.getElementById('bar-traffic-legend').innerHTML =
        dashboardChart1.generateLegend()
    }

    drawChart();
  }
})