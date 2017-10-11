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

const chart = () => {
    const color = 'white';
    const languages = parse(document.getElementById('canvas-container').dataset.languages);
    new Chart(document.getElementById('myChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(languages).slice(0, 20),
            datasets: [{
                label: 'Language Stats',
                backgroundColor: color,
                borderColor: color,
                data: Object.values(languages).slice(0, 20)
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
