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
    return array.reduce((acum, val) => {
        return !isNaN(val) ? acum + val : 0;
    }, 0);
};

const chart = ({ limit, singleColor }) => {
    const color = 'white';
    const languages = JSON.parse(document.getElementById('canvas-container').dataset.languages);
    const colors = singleColor ? 'white' : JSON.parse(document.getElementById('canvas-container').dataset.colors);
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
    new Chart(document.getElementById('myChart'), {
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
            }
        }
    });
    return singleColor;
};

const toggleColor = () => {
    singleColor = chart({ limit: 20, singleColor: !singleColor });
};
