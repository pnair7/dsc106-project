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

// Create the map
setTimeout(function () { // Otherwise innerHTML doesn't update
    Highcharts.mapChart('map', {
        chart: {
            borderWidth: 1,
            marginRight: 20, // for the legend,
            height: 500
        },

        title: {
            text: 'Vote split'
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            floating: true,
            backgroundColor: ( // theme
                Highcharts.defaultOptions &&
                Highcharts.defaultOptions.legend &&
                Highcharts.defaultOptions.legend.backgroundColor
            ) || 'rgba(255, 255, 255, 0.85)'
        },

        mapNavigation: {
            enabled: true
        },

        colorAxis: {
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

        series: [{
            mapData: countiesMap,
            data: clinton_diff,
            name: 'Candidate outperformed House by:',
            tooltip: {
                valueSuffix: '%'
            },
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

document.addEventListener('DOMContentLoaded', init, false);