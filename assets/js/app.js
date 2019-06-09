var dots;
var xLabelIndex = 0, yLabelIndex = 0;
var x

var xValues = [{
    label: 'poverty',
    key: 'poverty'
}, 
{
    label: 'age',
    key: 'age'
}, 
{
    label: 'income',
    key: 'income'
}];

var yValues = [{
    label: 'healthcare',
    key: 'healthcare'
}, 
{
    label: 'smokes',
    key: 'smokes'
}, 
{
    label: 'obesity',
    key: 'obesity'
}];
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
    
    dots = svg.selectAll("dot")
            .data(stateData)
    
    dots.enter().append("circle")
        .attr("r", 5)
        .attr("cx", d => x(d.poverty)) // Scale the values
        .attr("cy", d => y(d.healthcare))
        .classed("circles", true);

    // add xAxis
    svg.append('g')
        .attr("transform", `translate(0, ${height})`)
        .classed("xAxis", true)
        .call(d3.axisBottom(x));
    
    // add yAxis
    svg.append('g')
        .classed("yAxis", true)
        .call(d3.axisLeft(y));

    // add xLabel
    var xTexts = svg.selectAll("text.xLabels")
            .data(xValues).enter()
        .append("text")
    
    xTexts.attr("x", d => width/2)
            .attr("y", (d, i) => height + margin.top + 20 * (i + 1))
            .style("text-anchor", "middle")
            .attr("class", (d,i) =>  i == 0 ? "label-selected xLabels": "label-unselected xLabels")
            .text(d => d.label);
    
    xTexts.on("click", (d, i) => {
        yLabelIndex = i;
        console.log(i);
        d3.selectAll(".xLabels").attr("class", (label, index) =>  index == i ? "label-selected yLabels": "label-unselected yLabels");
        update("x", i);
    });
    
    //add yLabel
    var yTexts= svg.selectAll("text.yLabels")
            .data(yValues).enter()
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", (d, i) => 0 - 30 - 20 * (i + 1))
            .attr("x", -height/2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .attr("class", (d,i) =>  i == 0 ? "label-selected": "label-unselected")
            .text(d => d.label);
    
    yTexts.on("click", (d, i) => {
        yLabelIndex = i;
        d3.selectAll(".yLabels").attr("class", (label, index) =>  index == i ? "label-selected yLabels": "label-unselected yLabels");
        update("y", i);
    });
});

function update(axis, index) {
    d3.csv("assets/data/data.csv").then(function(stateData) {
        // turn selected data into numbers
        stateData.forEach(d => {
            xKey = xValues[xLabelIndex].key
            d[xKey] = +d[xKey];
            yKey = yValues[yLabelIndex].key
            d[yKey] = +d[yKey];
        });
        
        // re-scale axes
        x.domain(d3.extent(stateData, d => d[xKey]));
        y.domain([0, d3.max(stateData, d => d[yKey])]);

        // var svg = d3.select("body").transition();

        // transition 
        svg.selectAll(".circles")
            .data(stateData)
            .transition()
            .duration(750)
            .attr("cx", d => x(d[xKey])) // Scale the values
            .attr("cy", d => y(d[yKey]));

        svg.select(".xAxis").transition()
            .duration(750)
            .call(d3.axisBottom(x));

        svg.select(".yAxis").transition()
            .duration(750)
            .call(d3.axisLeft(y));

    });

    console.log(xLabelIndex);
}