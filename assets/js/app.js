// create margins
var margin = {top: 20, right: 20, bottom: 100, left: 100},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// create x and y scales, attaching the range
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// create the line function

// create the svg and store the chart space in the group svg
var svg = d3.select("#scatter").append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width + margin.left + margin.right)
    .append("g")
        .attr("height", height)
        .attr("width", width)
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(stateData) {
    // Set axis scales
    stateData.forEach(d => {
        d.poverty = +d.poverty;
        d.healthcare = +d.healthcare;
    });
    
    x.domain(d3.extent(stateData, d => d.poverty));
    y.domain([0, d3.max(stateData, d => d.healthcare)]);
    
    svg.selectAll("dot")
            .data(stateData)
        .enter().append("circle")
        .attr("r", 5)
        .attr("cx", d => x(d.poverty)) // Scale the values
        .attr("cy", d => y(d.healthcare));

    // add xAxis
    svg.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    
    // add yAxis
    svg.append('g')
        .call(d3.axisLeft(y));

    // add yLabel
    var xLabels = ['poverty', 'age', 'income'];

    var xTexts = svg.selectAll("text.xLables")
            .data(xLabels).enter()
        .append("text")
            .attr("x", d => width/2)
            .attr("y", (d, i) => height + margin.top + 20 * (i + 1))
            .style("text-anchor", "middle")
            .text(d => d);
    
    var yLabels = ['Healthcare', 'Smokes', 'Obese'];
    
    //add yLabel
    var yTexts= svg.selectAll("text.yLabels")
            .data(yLabels).enter()
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", (d, i) => 0 - 30 - 20 * (i + 1))
            .attr("x", -height/2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(d => d);
});