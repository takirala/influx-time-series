function convertToEST(clientDate){
    //EST
    offset = -5.0
    utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
    serverDate = new Date(utc + (3600000*offset));
    //alert (serverDate.toLocaleString());
    return serverDate
}

function transformData(influxData) {
    var palette = new Rickshaw.Color.Palette();
    console.log(influxData.results[0])
    return influxData.results[0].series.map(function(s) {
        return {
            name: JSON.stringify(s.tags),
            data: s.values.map(function(v) {
                console.log(v[0]);
                return { x: convertToEST(new Date(v[0])).getTime() / 1000, y: v[1] };
            }),
            color: palette.color()
        };
    });
}

function drawGraph($element, series, renderer) {
    //$element.find('.y_axis').css('background-color: red;')

    var graph = new Rickshaw.Graph({
        element: $element.find('.chart').get(0),
        width: 1000,
        height: 300,
        renderer: renderer,
        series: series
    });

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
    var interval = time.unit('15 minute');
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

    var slider = new Rickshaw.Graph.RangeSlider( {
       graph: graph,
       element: $element.find('.slider').get(0)
    });

} //drawGraph
