const parse = text => {
  const languages = {};
  text
    .trim()
    .split(" ")
    .forEach(string => {
      const [key, value] = string.split(":");
      languages[key] = parseInt(value);
    });
  return languages;
};

const sum = array => {
  if (array.length === 0) {
    return 0;
  }
  return array.reduce((acum, val) => {
    return !isNaN(val) ? acum + val : 0;
  }, 0);
};

const chart = limit => {
  const color = "white";
  const colorsArray = new Array(limit).fill(color);
  const languages = parse(
    document.getElementById("canvas-container").dataset.languages
  );
  const keys = Object.keys(languages);
  const values = Object.values(languages);
  if (typeof limit !== "number") {
    limit = keys.length;
  }
  const labels = keys.slice(0, limit);
  const data = values.slice(0, limit);
  if (keys.length > 20) {
    const valueOthers = sum(values.slice(limit, keys.length));
    colorsArray.push("gray");
    labels.push("Others");
    data.push(valueOthers);
  }
  new Chart(document.getElementById("myChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Language Stats",
          backgroundColor: colorsArray,
          borderColor: colorsArray,
          data
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        labels: {
          fontColor: color
        },
        position: "top"
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontColor: color
            }
          }
        ],
        xAxes: [
          {
            ticks: {
              fontColor: color,
              maxRotation: 90,
              minRotation: 90
            }
          }
        ]
      }
    }
  });
};

const saveChart = () => {
  const ctx = document.getElementById("myChart").getContext("2d");
  const tcanvas = document.createElement("canvas");
  const tctx = tcanvas.getContext("2d");
  tcanvas.width = ctx.canvas.width;
  tcanvas.height = ctx.canvas.height;
  tctx.fillStyle = "#0f229e";
  tctx.fillRect(0, 0, tcanvas.width, tcanvas.height);
  tctx.drawImage(document.getElementById("myChart"), 0, 0);

  var image = tcanvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  window.location.href = image;
};
