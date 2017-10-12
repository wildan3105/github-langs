const parse = (text) => {
    const languages = {};
    text
        .trim()
        .split(' ')
        .forEach((string) => {
            const [key, value] = string.split(':');
            languages[key] = value;
        })
    return languages;
};

const chart = (limit) => {
    const color = 'white';
    const languages = parse(document.getElementById('canvas-container').dataset.languages);
    if (typeof limit !== 'number') {
        limit = Object.keys(languages).length;
    }
    new Chart(document.getElementById('myChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(languages).slice(0, limit),
            datasets: [{
                label: 'Language Stats',
                backgroundColor: color,
                borderColor: color,
                data: Object.values(languages).slice(0, limit)
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
                        fontColor: color,
                        maxRotation: 90,
                        minRotation: 90
                    }
                }]
            }
        }
    })
};
