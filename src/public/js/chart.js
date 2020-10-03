/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const _ = require('lodash');

const saveChart = () => {
    const ctx = document.getElementById('myChart').getContext('2d');
    const tcanvas = document.createElement('canvas');
    const tctx = tcanvas.getContext('2d');
    const filename = document.getElementById('canvas-container');
    tcanvas.width = ctx.canvas.width;
    tcanvas.height = ctx.canvas.height;
    tctx.fillStyle = '#0f229e';
    tctx.fillRect(0, 0, tcanvas.width, tcanvas.height);
    tctx.drawImage(document.getElementById('myChart'), 0, 0);

    const image = tcanvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');

    const link = document.createElement('a');
    link.download = `chart-${filename.dataset.username}.jpg`;
    link.href = image;
    link.click();
};

const chart = ({ limit, singleColor }) => {
    const canvasContainer = document.getElementById('canvas-container');
    const color = 'white';
    const username = canvasContainer.dataset.username;
    const languages = JSON.parse(canvasContainer.dataset.languages);
    const colors = singleColor
        ? 'white'
        : JSON.parse(canvasContainer.dataset.colors);
    const keys = Object.keys(languages);
    const values = Object.values(languages);
    if (typeof limit !== 'number') {
        limit = keys.length;
    }
    const labels = keys.slice(0, limit);
    const data = values.slice(0, limit);
    if (keys.length > 20) {
        const valueOthers = _.sum(values.slice(limit, keys.length));
        labels.push('Others');
        data.push(valueOthers);
    }
    const canvas = document.getElementById('myChart');
    const chart = (window.chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Language Stats',
                    backgroundColor: colors,
                    borderColor: 'black',
                    borderWidth: 1,
                    data
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Language Stats',
                fontSize: 16,
                fontColor: '#fff',
                position: 'top'
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
            },
            tooltips: {
                callbacks: {
                    afterBody: () =>
                        `Click to browse repos with the current language by ${username}`
                }
            }
        }
    }));

    const slugify = (text) =>
        text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/#/g, '%23') // Change all '#' chars with '%23'
            .replace(/\+/g, '%2B') // Replace all '+' with '%2B'
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    const onCanvasClick = (e) => {
        const activeElement = chart.getElementAtEvent(e)[0];

        if (activeElement) {
            let language = chart.data.labels[activeElement._index];
            language = slugify(language);
            const value =
                chart.data.datasets[activeElement._datasetIndex].data[
                    activeElement._index
                ];
            const url = `https://github.com/${username}?tab=repositories&type=&language=${language}`;
            window.open(url, '_blank');
        }
    };
    canvas.addEventListener('click', onCanvasClick);
    return singleColor;
};

const toggleColor = () => {
    window.chart.destroy();
    // eslint-disable-next-line no-undef
    singleColor = chart({ limit: 20, singleColor: !singleColor });
    const btn = document.getElementById('btn-toggle');

    btn.classList.toggle('active');
    btn.classList.toggle('inactive');
};
