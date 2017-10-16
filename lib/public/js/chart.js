const parse = (text) => {
    const languages = {};
    text
        .trim()
        .split(' ')
        .forEach((string) => {
            const [key, value] = string.split(':');
            languages[key] = parseInt(value);
        });
    return languages;
};

const sum = (array) => {
    if (array.length === 0) {
        return 0;
    }
    return array.reduce((acum, val) => !isNaN(val) ? acum + val : 0, 0);
};

const saveChart = () => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const tcanvas = document.createElement('canvas');
    const tctx = tcanvas.getContext('2d');
    tcanvas.width = ctx.canvas.width;
    tcanvas.height = ctx.canvas.height;
    tctx.fillStyle = '#0f229e';
    tctx.fillRect(0, 0, tcanvas.width, tcanvas.height);
    tctx.drawImage(document.getElementById('myChart'), 0, 0);

    const image = tcanvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

    const link = document.createElement('a');
    link.download = 'chart.jpg';
    link.href = image;
    link.click();
};

const chart = ({ limit, singleColor }) => {
    const canvasContainer = document.getElementById('canvas-container');
    const color = 'white';
    const username = canvasContainer.dataset.username;
    const languages = JSON.parse(canvasContainer.dataset.languages);
    const colors = singleColor ? 'white' : JSON.parse(canvasContainer.dataset.colors);
    const keys = Object.keys(languages);
    const values = Object.values(languages);
    if (typeof limit !== 'number') {
        limit = keys.length;
    }
    const labels = keys.slice(0, limit);
    const data = values.slice(0, limit);
    if (keys.length > 20) {
        const valueOthers = sum(values.slice(limit, keys.length));
        labels.push('Others');
        data.push(valueOthers);
    }
    const canvas = document.getElementById('myChart');
    const chart = window.chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Language Stats',
                backgroundColor: colors,
                borderColor: 'black',
                borderWidth: 1,
                data
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: singleColor ? true : false,
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
                        fontColor: color,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    afterBody: () => `Click to browse repos with the current language by ${username}`
                }
            }
        }
    });
    const onCanvasClick = (e) => {
        const activeElement = chart.getElementAtEvent(e)[0];
        if (activeElement) {
            const language = chart.data.labels[activeElement._index];
            const value = chart.data.datasets[activeElement._datasetIndex].data[activeElement._index];
            const url = `https://github.com/${username}?tab=repositories&type=&language=${language}`;
            window.open(url, '_blank');
        }
    };
    canvas.addEventListener('click', onCanvasClick);
    return singleColor;
};


const toggleColor = () => {
    window.chart.destroy();
    singleColor = chart({ limit: 20, singleColor: !singleColor });
    const btn = document.getElementById('btn-toggle');

    btn.classList.toggle('active');
    btn.classList.toggle('inactive');

};
