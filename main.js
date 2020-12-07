const demColor = '#0015BC'
const repColor = '#FF0000'
let diff = trump_diff;
let partyColor = repColor;
let otherColor = demColor;
let candidate_name = 'Trump'
let spider_data = spider_dict;
let county_spider_dict = {};
let bubble_data = bubble_dict;
let bubble_prepped = {};

// takes full data and formats it for Highcharts series data
function formatMapData(x) {
    let prepped = [];

    // x = variable, y = trump margin, z = population
    for (i = 0; i < bubble_data.length; i++) {
        county = bubble_data[i];
        try {
            prepped.push({
                "hc-key": county['code'],
                "value": county[x],
                "name":county['name']
            })
        } catch (e) {
        }
    }
    return prepped;
}

function loadIncidenceMap(feature, first=false) {
    let data = formatMapData(feature);
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

    let minColor = '#b0f2bc';
    let maxColor = '#257d98'
    let feature_name = feature;
    let scaleType = 'linear';
    let scaleMin = null;
    let scaleMax = null;
    
    switch(feature) {
        case 'margin':
            minColor = demColor;
            maxColor = repColor;
            feature_name = 'Margin for Trump'
            scaleMin = -52;
            scaleMax = 52;
            break;
        case '2012 Romney Vote Share':
            minColor = demColor;
            maxColor = repColor;
            scaleMin = 0.225;
            scaleMax = 0.775;
            break;
        case '2016 Republican House Vote Share':
            minColor = demColor;
            maxColor = repColor;
            scaleMin = 0.1;
            scaleMax = 0.9;
            break;
        case 'Percent White':
            scaleMin = 47.08;
            scaleMax = 95.8;
            break;
        case 'Percent 65+':
            scaleMin = 12.31;
            scaleMax = 23.44;
            break;
        case 'Percent Rural':
            scaleMin = 13.27;
            scaleMax = 100;
            break;
        case 'Median Household Income':
            scaleMin = 34458;
            scaleMax = 62554;
            break;
        case 'Turnout':
            scaleMin = 47.8;
            scaleMax = 70.8;
            break;
        case 'Percent Foreign-Born':
            scaleMin = 0.75;
            scaleMax = 10.6;
            break;
        case 'Percent with Some College':
            scaleMin = 11.76;
            scaleMax = 33.0; 
            break;
        default:
            break;
    }

    setTimeout(function () {
        Highcharts.mapChart('map', {
            chart: {
                borderWidth: 1,
                marginRight: 20,
                height: 650
            },

            title: {
                text: '<b>' + feature_name + '</b> by county, 2016',
                style: {
                    "fontSize": '28px'
                }
            },

            subtitle: {
                text: 'Click a county to find out more!',
                style: {
                    "fontSize": '20px'
                }
            },

            legend: {
                title: {
                    text: "Legend",
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
                minColor: minColor,
                maxColor: maxColor,
                min: scaleMin,
                max: scaleMax,
                type: scaleType
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
                            document.getElementById("spider").scrollIntoView();
                        }
                    }
                }
            },

            tooltip: {
                formatter: function() {
                    return '<b>' + this.point.name + '</b>\'s ' + feature_name + ' is <b>' + this.point.value.toFixed(2) + '</b>';
                },
                style: {
                    "fontSize" : '15px'
                }
            },

            series: [{
                mapData: countiesMap,
                data: data,
                name: 'Value',
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

    if (!first) {
        document.getElementById("marginbutton").scrollIntoView();
    }
}

function loadSpider() {
    let titleText = '';
    let data = [];
    let lineColor = demColor;

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
        titleText = '<b>Click a county on the map or scatterplot to learn more!<b>'
    }
    
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
                "font-family" : "Abel",
                "text-align" : 'center'
            },
            align: "center",
            x: 0
        },

        subtitle: {
            text: 'Values are percentiles among all U.S. counties',
            style: {
                "fontSize" : "18px",
                "font-family" : "Abel"
            },
            align: "center",
            x: 0
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
    
        legend: {
            enabled: false
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
            },
            headerFormat : '<span style="font-size: 15px"><b>{point.key}</b></span><br/>'
        },
    
        legend: {
            align: 'center',
            verticalAlign: 'bottom',
            layout: 'vertical',
            text: 'County Percentiles'
        },
    
        series: [{
            name: county_spider_dict['name'],
            data: data,
            pointPlacement: 'on',
            showInLegend: false
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

// this is from stackoverflow, https://stackoverflow.com/questions/30143082/how-to-get-color-value-from-gradient-by-percentage-with-javascript/30144587
function pickHex(weight) {
    if (typeof weight != 'number') {
        return null
    }
    let color1 = [255, 0, 0];
    let color2 = [0, 21, 188];
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);;
}

// takes full data and formats it for Highcharts series data
function formatBubbleData(x) {
    bubble_prepped = [];

    // x = variable, y = trump margin, z = population
    for (i = 0; i < bubble_data.length; i++) {
        county = bubble_data[i];
        try {
            bubble_prepped.push({
                x : Number(county[x].toPrecision(3)),
                y: Number(county.margin.toPrecision(3)),
                z: county['Population'],
                name: county['name'],
                color: pickHex((county.margin + 100) / 200),
                code: county['code']
            })
        } catch (e) {
        }
    }
    return bubble_prepped;
}

function loadBubbles(x, first=false) {
    let data = formatBubbleData(x);

    Highcharts.chart('bubble', {
        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy',
            height: 550
        },
    
        legend: {
            enabled: false
        },
    
        title: {
            text: 'How did <b>' + x + '</b> correlate with Trump\'s margin of victory?',
            style: {
                "fontSize" : '24px',
                "fontFamily" : 'Abel'
            },
            useHTML: true
        },

        subtitle: {
            text: 'bubble size represents population, drag over area to zoom, click bubble to see county info on spider chart',
            style: {
                "fontSize" : '18px'
            }
        },
    
        xAxis: {
            gridLineWidth: 1,
            title: {
                text: x,
                style: {
                    "fontSize" : "20px",
                    "font-family" : "Abel",
                    "font-weight" : "bold"
                }
            },
            labels: {
                format: '{value}',
                style: {
                    "fontSize" : "15px",
                    "font-family" : "Abel",
                    "font-weight" : "bold"
                }
            }
        },
    
        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: 'Trump victory margin (%)',
                style: {
                    "fontSize" : "20px",
                    "font-family" : "Abel",
                    "font-weight" : "bold"
                }
            },
            labels: {
                format: '{value}',
                style: {
                    "fontSize" : "15px",
                    "font-family" : "Abel",
                    "font-weight" : "bold"
                }
            },
            plotLines: [{
                color: '#FF0000',
                width: 2,
                value: 0 // Need to set this probably as a var.
            }]
        },
    
        tooltip: {
            useHTML: true,
            headerFormat: '',
            pointFormat: 
                '<b>{point.name}</b><br/>' +
                x + ': {point.x}<br/>' +
                'Trump margin: {point.y}%<br/>' +
                'Population: {point.z}',
            followPointer: true,
            style: {
                "fontSize" : "15px",
                "font-family" : "Abel"
            }
        },
    
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false
                },
                events: {
                    click: function(e) {
                        county_spider_dict = spider_data[e.point.code];
                        loadSpider();
                        document.getElementById("spider").scrollIntoView();
                    }
                }
            },
            bubble: {
                minSize: 1
            }
        },
    
        series: [{
            data: data,
            name: x
        }]
    
    });
    if (!first) {
        document.getElementById("population").scrollIntoView();
    }
}


function init() {
    loadIncidenceMap('margin', true);
    loadSpider();
    loadBubbles('Percent White', true);
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', init, false);

// TODO: color palette, end info, check everything (esp. text), conclusion
// https://carto.com/carto-colors/