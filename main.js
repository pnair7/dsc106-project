function loadIncidenceMap() {
    Highcharts.mapChart('map', {
        chart: {
            map: Highcharts.maps["countries/us/us-all-all"],
        },
        title: {
            text: 'Vote splitting incidence, 2016'
        },

        subtitle: {
            text: 'Average percentage difference between presidential and House vote for both major parties'
        },

        legend: {
            enabled: true
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [{
            data: county_data,
            type: 'mapbubble',
            name: 'Vote splitting incidence, 2016',
            minSize: 4,
            maxSize: '12%',
        }]
    });
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
