const demColor = '#0015BC'
const repColor = '#FF0000'
let diff = trump_diff;
let partyColor = repColor;
let candidate_name = 'Trump'
let isLoading = false;

function loadIncidenceMap() {
    var countiesMap = Highcharts.geojson(
        Highcharts.maps['countries/us/us-all-all']
    ),
    lines = Highcharts.geojson(
        Highcharts.maps['countries/us/us-all-all'], 'mapline'
    ),
    borderLines = lines.filter(
        l => l.properties['hc-group'] === '__border_lines__'
    ),
    separatorLines = lines.filter(
        l => l.properties['hc-group'] === '__separator_lines__'
    );

    setTimeout(function () {
        console.log(repColor)
        Highcharts.mapChart('map', {
            chart: {
                borderWidth: 1,
                marginRight: 20,
                height: 650
            },

            loading: {
                labelStyle: {
                    color: 'white'
                },
                style: {
                    backgroundColor: 'gray'
                }
            },

            title: {
                text: 'How much did Donald Trump and Hillary Clinton outperform House candidates?',
                style: {
                    "fontSize": '28px'
                }
            },

            subtitle: {
                text: 'Percentage difference between presidential and house votes by county, 2016',
                style: {
                    "fontSize": '20px'
                }
            },

            legend: {
                layout: 'vertical',
                align: 'right',
                floating: true,
                backgroundColor: (
                    Highcharts.defaultOptions &&
                    Highcharts.defaultOptions.legend &&
                    Highcharts.defaultOptions.legend.backgroundColor
                ) || 'rgba(255, 255, 255, 0.85)'
            },

            colorAxis: {
                minColor: '#efefef',
                maxColor: partyColor,
                dataClasses: [{
                    to: -20
                }, {
                    from: -20,
                    to: -15
                }, {
                    from: -15,
                    to: -10
                }, {
                    from: -10,
                    to: -5
                }, {
                    from: -5,
                    to: 0
                }, {
                    from: 0,
                    to: 5
                }, {
                    from: 5,
                    to: 10
                }, {
                    from: 10,
                    to: 15
                }, {
                    from: 15,
                    to: 20
                }, {
                    from: 20
                }]
            },

            plotOptions: {
                mapline: {
                    showInLegend: false,
                    enableMouseTracking: false
                }
            },

            tooltip: {
                formatter: function() {
                    return candidate_name + ' outperformed their party\'s House candidate by <b>' 
                        + this.point.value.toFixed(2) + '</b>% in <b>' + this.point.name + '</b> county'
                }
            },

            series: [{
                mapData: countiesMap,
                data: diff,
                name: 'Outperformance',
                borderWidth: 0.5,
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                shadow: false
            }, {
                type: 'mapline',
                name: 'State borders',
                data: borderLines,
                color: 'white',
                shadow: false
            }, {
                type: 'mapline',
                name: 'Separator',
                data: separatorLines,
                color: 'gray',
                shadow: false
            }]
        });
    }, 0);
    isLoading = false;
}

function loadScatters() {

}

function loadBar() {

}

function populateTable() {

}

function init() {
    loadIncidenceMap();
    loadScatters();
    loadBar();
    populateTable();
}

function switchCandidate() {
    console.log('cheese')
    if (diff == clinton_diff) {
        diff = trump_diff
        partyColor = repColor;
        candidate_name = 'Trump'
    } else {
        diff = clinton_diff
        partyColor = demColor;
        candidate_name = 'Clinton'
    }
    loadIncidenceMap();
}
document.getElementById('switcher').addEventListener('click', e => {
    switchCandidate();
    if (!isLoading) {
        chart.showLoading();
        e.target.innerHTML = 'Hide loading';
    } else {
        chart.hideLoading();
        e.target.innerHTML = 'Show loading';
    }
    isLoading = !isLoading;
});

document.addEventListener('DOMContentLoaded', init, false);