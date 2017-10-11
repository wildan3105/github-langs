const parse = text => {
  let languages = {};
  text.trim().split(" ").forEach(string => {
    let [key, value] = string.split(":")
    languages[key] = value
  })
  return languages;
}

const chart = () => {
  const color = 'white';
  let languages = parse(document.getElementById('canvas-container').dataset.languages)
  new Chart(document.getElementById('myChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(languages),
      datasets: [{
        label: "Language Stats",
        backgroundColor: color,
        borderColor: color,
        data: Object.values(languages),
      }]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontColor: color
        },
        position: 'top'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: color
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: color
          }
        }]
      }
    }
  })
};
