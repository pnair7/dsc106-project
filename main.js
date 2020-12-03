const demColor = '#0015BC'
const repColor = '#FF0000'
let diff = trump_diff;
let partyColor = repColor;
let otherColor = demColor;
let candidate_name = 'Trump'
let pronoun = 'his';
let spider_data = spider_dict;
let county_spider_dict = {};

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
                },
                series: {
                    events: {
                        click: function(e) {
                            county_spider_dict = spider_data[e.point['hc-key']];
                            loadSpider();
                        }
                    }
                }
            },

            tooltip: {
                formatter: function() {
                    return candidate_name + ' outperformed ' + pronoun + ' party\'s House candidates by <b>' 
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

function loadSpider() {
    let titleText = '';
    let data = [];
    let lineColor = demColor;
    console.log(county_spider_dict)

    if ('data' in county_spider_dict) {
        data = county_spider_dict['data'];
        titleText = '';
        let margin = Number(county_spider_dict['margin'])

        // format title
        if (margin >= 0) {
            titleText = '<span class=\"repColor\">Trump</span> won <b>' + county_spider_dict['name'] + '</b> by <b>' + margin.toFixed(2) + '%</b>'
            lineColor = repColor;
        } else {
            titleText = '<span class=\"demColor\">Clinton</span> won <b>' + county_spider_dict['name'] + '</b> by <b>' + (margin * -1).toFixed(2) + '%</b>'
        }

    } else {
        data = [];
        titleText = '<b>Click a county on the above map to learn more!<b>'
    }
    
    console.log(data)

    Highcharts.chart('spider', {
        chart: {
            polar: true,
            type: 'line',
            height: 500
        },
    
        title: {
            text: titleText,
            x: -80,
            useHTML: true,
            style: {
                "fontSize" : "24px",
                "font-family" : "Abel"
            }
        },

        plotOptions: {
            line: {
                color: lineColor
            },
            series: {
                animation: {
                    duration: 1000
                }
            }
        },
    
        pane: {
            size: '90%'
        },
    
        xAxis: {
            categories: ['Population', 'White', 'Over 65', 'Rural', 'Household Income', 'Turnout',
                'Foreign-Born', 'College Educated'],
            tickmarkPlacement: 'on',
            lineWidth: 0,
            labels: {
                style: {
                    fontSize: '15px'
                }
            }
        },
    
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0,
            max: 100
        },
    
        tooltip: {
            shared: true,
            pointFormat: '{series.name}: <b>{point.y:,.0f}th</b> percentile<br/>',
            style: {
                fontSize: '15px'
            }
        },
    
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'vertical'
        },
    
        series: [{
            name: county_spider_dict['name'],
            data: data,
            pointPlacement: 'on'
        }],
    
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'center',
                        layout: 'horizontal'
                    },
                    pane: {
                        size: '70%'
                    }
                }
            }]
        }
    
    });
};

function loadScatters() {

}

function loadBar() {

}

function populateTable() {

}

function init() {
    loadIncidenceMap();
    loadSpider();
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