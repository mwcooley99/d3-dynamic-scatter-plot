// create margins
var margin = {top: 20, right: 20, bottom: 30, left: 50},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// parse datatime (if needed)

// create x and y scales, attaching the range
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// create the line function

// create the svg and store the chart space in the group svg
var svg = d3.select("#scatter").append("svg")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", height + margin.left + margin.right)
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

    // add xaxis
    svg.append('g')
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));
    



    

    
    
});