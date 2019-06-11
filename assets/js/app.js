var xLabelIndex = 0, yLabelIndex = 0;

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const xValues = [{
    label: 'In Poverty (%)',
    key: 'poverty',
    format: "%"
},
{
    label: 'Age (Median)',
    key: 'age',
    format: ""
},
{
    label: 'Income (Median)',
    key: 'income',
    format: ""
}];

const yValues = [{
    label: 'Lacks Healthcare (%)',
    key: 'healthcare',
    format: "%"
}, 
{
    label: 'Smokes (%)',
    key: 'smokes',
    format: "%"
}, 
{
    label: 'Obesity (%)',
    key: 'obesity',
    format: "%"

}];
// create margins
var margin = {top: 20, right: 20, bottom: 100, left: 100},
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;

// create x and y scales, attaching the range
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

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
    
    // Set axis scales
    x.domain([.95 * d3.min(stateData, d => d.poverty), 1.05 * d3.max(stateData, d => d.poverty)]);
    y.domain([.85 * d3.min(stateData, d => d.healthcare), 1.05 * d3.max(stateData, d => d.healthcare)]);
    
    var circles = svg.selectAll("dot")
        .data(stateData).enter().append("circle")
            .attr("r", 8)
            .attr("cx", d => x(d.poverty)) // Scale the values
            .attr("cy", d => y(d.healthcare))
            .classed("circles", true);

    // Add text to bubbles
    var circle_labels = svg.selectAll("text")
        .data(stateData).enter()
        .append("text")
        .attr("x", d => x(d.poverty))
        .attr("y", d => y(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font-size", "10")
        .classed("circle-labels", true)
        .text(d => d.abbr)

    // Add tooltip
    circle_labels.on("mouseover", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", 0.9);

        let xValue = xValues[xLabelIndex]
        let yValue = yValues[yLabelIndex]
        
        div.html(`<h6>${d.state}</h6>` +
                `${capitalizeFirstLetter(xValue.key)}: ${d[xValue.key]}${xValue.format}</br>` + 
                `${capitalizeFirstLetter(yValue.key)}: ${d[yValue.key]}${yValue.format}`)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
    });

    // hide tooltip
    circle_labels.on("mouseout", function(d) {
        div.transition()
            .duration(200)
            .style("opacity", 0);
    });

    // add xAxis
    svg.append('g')
        .attr("transform", `translate(0, ${height})`)
        .classed("xAxis", true)
        .call(d3.axisBottom(x));
    
    // add yAxis
    svg.append('g')
        .classed("yAxis", true)
        .call(d3.axisLeft(y));

    // add xLabels
    var xTexts = svg.selectAll("text.xLabels")
            .data(xValues).enter()
        .append("text")
            .attr("x", d => width/2)
            .attr("y", (d, i) => height + margin.top + 20 * (i + 1))
            .style("text-anchor", "middle")
            .attr("class", (d,i) =>  i == 0 ? "label-selected xLabels": "label-unselected xLabels")
            .text(d => d.label);
    
    // Click a label to change x display data
    xTexts.on("click", (d, i) => {
        xLabelIndex = i;
        d3.selectAll(".xLabels").attr("class", (label, index) =>  index == i ? "label-selected xLabels": "label-unselected xLabels");
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
            .attr("class", (d,i) =>  i == 0 ? "label-selected yLabels": "label-unselected yLabels")
            .text(d => d.label);
    
    // Click a label to change y display data
    yTexts.on("click", (d, i) => {
        yLabelIndex = i;
        d3.selectAll(".yLabels").attr("class", (label, index) =>  index == i ? "label-selected yLabels": "label-unselected yLabels");
        update("y", i);
    });
});

function update(axis, index) {
    d3.csv("assets/data/data.csv").then(function(stateData) {
        // turn selected data into numbers - TODO this isn't updating correctly
        var xKey = xValues[xLabelIndex].key
        var yKey = yValues[yLabelIndex].key
        stateData.forEach(d => {
            
            d[xKey] = +d[xKey];
            d[yKey] = +d[yKey];
        });
        
        // re-scale axes
        x.domain([.95 * d3.min(stateData, d => d[xKey]),1.05 * d3.max(stateData, d => d[xKey])]);
        y.domain([.85 * d3.min(stateData, d => d[yKey]), 1.05 * d3.max(stateData, d => d[yKey])]);

        // transitions
        svg.selectAll(".circles")
            .data(stateData)
            .transition()
            .duration(750)
            .attr("cx", d => x(d[xKey])) // Scale the values
            .attr("cy", d => y(d[yKey]));

        svg.selectAll(".circle-labels")
            .data(stateData)
            .transition()
            .duration(750)
            .attr("x", d => x(d[xKey]))
            .attr("y", d => y(d[yKey]))

        svg.select(".xAxis").transition()
            .duration(750)
            .call(d3.axisBottom(x));

        svg.select(".yAxis").transition()
            .duration(750)
            .call(d3.axisLeft(y));

    });

    
}