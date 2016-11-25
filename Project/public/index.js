var _influxdb = 'http://localhost:8086/query';

function convertToEST(clientDate){
    //EST
    offset = -5.0
    utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
    serverDate = new Date(utc + (3600000*offset));
    //alert (serverDate.toLocaleString());
    return serverDate
}

function transformData(influxData, tagName) {
    var palette = new Rickshaw.Color.Palette();
    console.debug(influxData)
    var res = influxData.results[0].series.map(function(s) {
        return {
            name: JSON.stringify(s.tags || tagName),
            data: s.values.map(function(v) {
                //console.debug(v[0]);
                return { x: convertToEST(new Date(v[0])).getTime() / 1000, y: v[1] };
            }),
            color: palette.color()
        };
    });
    return res;
}


var prevData = null;
var graphObject = null;
var prevIntervalId = null;

function drawGraph($element, seriesData, renderer, testQuery, updateQuery, showSlider) {
    //$element.find('.y_axis').css('background-color: red;')

    var graph = new Rickshaw.Graph({
        element: $element.find('.chart').get(0),
        width: 1000,
        height: 300,
        renderer: renderer,
        series: seriesData
    });

    if(showSlider === true) {
    var slider = new Rickshaw.Graph.RangeSlider.Preview( {
        graph: graph,
        element: $element.find('.slider').get(0)
    });
    }

    graph.render();

    var legend = new Rickshaw.Graph.Legend({
        element: $element.find('.legend').get(0),
        graph: graph
    });
    var shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
        graph: graph,
        legend: legend
    });
    var highlighter = new Rickshaw.Graph.Behavior.Series.Highlight({
        graph: graph,
        legend: legend
    });

    // x axis
    var time = new Rickshaw.Fixtures.Time();
    var interval = time.unit('hour');
    var xAxis = new Rickshaw.Graph.Axis.Time({
        graph: graph,
        timeUnit: interval
    });
    xAxis.render();

    // yaxis
    var yAxis = new Rickshaw.Graph.Axis.Y({
        graph: graph,
        orientation: 'left',
        element: $element.find('.y_axis').get(0)
    });
    yAxis.render();

    var hoverDetail = new Rickshaw.Graph.HoverDetail( {
        graph: graph
    });

    

    // For update the graph in real time.
    prevData = seriesData
    graphObject = graph
    if(prevIntervalId != null) clearInterval(prevIntervalId);
    prevIntervalId = setInterval( function() { updateData(updateQuery); }, 10000 );

    return graph;

} //drawGraph


function updateData(testQuery) {
    if(testQuery == null) return;
   
    console.debug("Query : " + testQuery);

    $.getJSON(_influxdb, {
            db: 'telegraf',
            q: testQuery
        },
        function(influxData) {
            var newData = transformData(influxData);
            var commonLen = newData.length;

            if(prevData.length != commonLen) {
                console.log("Failed to correlate")
                return
            }

            for(var j = 0; j < commonLen; j++) {

                var newValues = newData[j]['data']

                for(var i = 0; i < newValues.length; i++) {
                    var elem = newValues[i];
                    if(elem != null && elem.x != null && elem.y != null) {
                    prevData[j]['data'].push(elem);
                    console.debug(prevData[j]['data'].length);
                }   
            }   
        }
        graphObject.update();
  }
  );
}
