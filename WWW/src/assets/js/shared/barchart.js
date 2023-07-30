$(function () {
  if ($('#barChart').length) {

    const labels = []
    for (let i = 7; i >= 1; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      labels.push(d.toISOString().slice(0, 10))
    }

    var barChartCanvas = $('#barChart').get(0).getContext('2d')
    var barChart = new Chart(barChartCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'data',
            data: [15, 28, 14, 22, 38, 30, 40],
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
                fontSize: 12,
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
                fontSize: 12,
                lineHeight: 2
              },
              ticks: {
                display: true,
                autoSkip: false,
                maxRotation: 0,
                fontColor: '#bfccda',
                stepSize: 50,
                min: 0,
                max: 150
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
      barChart.generateLegend()
  }
})
