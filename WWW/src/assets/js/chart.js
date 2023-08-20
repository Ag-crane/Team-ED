function showSpinner () {
  const spinnerHtml = `
  <div class="d-flex justify-content-center align-items-center" style="margin-top:100px; height:100px">
    <div class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>`
  document.getElementById('spinnerBox').innerHTML = spinnerHtml
}

function hideSpinner () {
  document.getElementById('spinnerBox').innerHTML = ''
}

// data fetch
async function fetchData () {
  const response = await fetch(
    serverUrl + '/tle-data-log/unique-satellite-count'
  )
  const data = await response.json()
  return data
}

async function drawChart () {

  showSpinner()
  const data = await fetchData()
  hideSpinner()
  document.getElementById('dashboardChart1').style.height = '250px'

  const fetchDate = data.map(d => d.fetchDate)
  const fetchCount = data.map(d => d.fetchCount)

  // 합계 구하고 출력
  const sum = fetchCount.reduce((a, b) => a + b, 0)
  document.getElementById(
    'dashboardChart-p'
  ).innerHTML = `최근 7일간 수집한 총 ${sum} 개의 데이터를 수집하였습니다`

  // 데이터 개수에 따른 y축 최대값 설정
  const max = Math.max(...fetchCount)
  const maxRound = Math.ceil(max / 1000) * 1500

  // 차트
  var dashboardChart1Canvas = $('#dashboardChart1').get(0).getContext('2d')
  var dashboardChart1 = new Chart(dashboardChart1Canvas, {
    type: 'bar',
    data: {
      labels: fetchDate,
      datasets: [
        {
          label: 'data',
          data: fetchCount,
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
              stepSize: 2000,
              min: 0,
              max: maxRound
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

drawChart()
