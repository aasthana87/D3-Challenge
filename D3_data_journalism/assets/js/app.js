console.log("app.js loaded!");

// Function that automatically resizes chart
function makeResponsive() {

    // Remove SVG area if not empty when browser loads and replace with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");

    // Clear SVG if not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

    // Determine SVG wrapper dimensions by the current width and height of the browser window
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // Append SVG element
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV
    d3.csv("assets/data/data.csv").then(function(povertyData) {
        console.log(povertyData);

        // Parse data
        povertyData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        // Create axes scales
        var xScale = d3.scaleLinear()
            .domain(d3.extent(povertyData, d => d.poverty))
            .range([0, width]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(povertyData, d => d.healthcare)])
            .range([height, 0]);

        // Create axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale); 

        // Append axes
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        chartGroup.append("g")
            .call(yAxis);

        // Append circles to include state abbreviations and format axes text
        chartGroup.selectAll("circle")
        .data(povertyData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "blue")
        .attr("stroke-width", "1")
        .attr("stroke", "black")
        .attr("opacity", ".5");

        chartGroup.append("g").selectAll("text")
        .data(povertyData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "central")
        .attr("font_family", "sans-serif")
        .attr("font-size", "12px")
        .attr("fill", "white")
        .style("font-weight", "bold");

        chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .text("% in Poverty");

        chartGroup.append("text")
        .attr("y", 0 - (margin.left / 2))
        .attr("x", 0 - (height / 2))
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .attr("transform", "rotate(-90)")
        .text("% w/o Healthcare")

    })

};

// Call function
makeResponsive();

// makeResponsive() called when browser window resized
d3.select(window).on("resize", makeResponsive);