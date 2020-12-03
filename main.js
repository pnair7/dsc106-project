const demColor = '#0015BC'
const repColor = '#FF0000'
let diff = trump_diff;
let partyColor = repColor;
let otherColor = demColor;
let candidate_name = 'Trump'
let pronoun = 'his';

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

    // set minColor to be other party's color, set pronouns for candidates (used in tooltips), and set title
    if (partyColor == repColor) {
        otherColor = demColor;
        pronoun = 'his';
    } else {
        otherColor = repColor;
        pronoun = 'her';
    }

    setTimeout(function () {
        Highcharts.mapChart('map', {
            chart: {
                borderWidth: 1,
                marginRight: 20,
                height: 650
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
                title: {
                    text: "Legend (click bubbles to de-select ranges)",
                    style: {
                        "fontSize": '16px'
                    }
                },
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
                minColor: '#F1EEF6',
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
                    return candidate_name + ' outperformed ' + pronoun + ' party\'s House candidate by <b>' 
                        + this.point.value.toFixed(2) + '</b>% in <b>' + this.point.name + ' County </b>'
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

document.getElementById('switcher').onclick = switchCandidate;

document.addEventListener('DOMContentLoaded', init, false);