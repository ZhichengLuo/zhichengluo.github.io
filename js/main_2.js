/* Set the time format
  Ref: https://github.com/d3/d3-time-format */

  const parseTime = d3.timeParse("%Y");
  dataset = NaN
  feature = NaN
  
  /* Load the dataset and formatting variables
    Ref: https://www.d3indepth.com/requests/ */
  d3.csv("../data/CLDS2018_for_visualization.csv", d => {
    return {
      'Attitude': d.Attitude,
      'Income': d.Income,
      'Education': d.Education,
      'Age':d.Age,
    }
  }).then(data => {
    // Print out the data on the console
    dataset = data;
    /* Data Manipulation in D3 
      Ref: https://observablehq.com/@d3/d3-extent?collection=@d3/d3-array */

  
    // const newData = data.filter(d => d.Attitude === '3');
    const newData = data;
  
    // Sort the country by the percentage in the descending order
    /*console.log(newData.sort((a, b) => d3.ascending(a.value, b.value)));
    console.log(newData.sort((a, b) => d3.descending(a.value, b.value)));
    console.log(newData);*/
  
    // Get the mean and median of gender gap percentage
  
    // [NEW] Move the color scale here to share with both charts
    const education = data.map(d => d.Education);
    feature = education
    const color = d3.scaleOrdinal()
      .domain(feature)
      .range(d3.schemeTableau10);
  
    // Plot the bar chart
    createBarChart("#bar", newData, color, 'Education', 'People of Different '+'Education');   // [NEW] Parse the color to the chart function
    
    // Plot the line chart
    // createLineChart(data, color);     // [NEW] Parse the color to the chart function
    cols = titles['Education']
    for (let col in cols) {
      createPieChart2(newData, color, col, 'Education');
  }

  })

  d3.select("#feature").on("change", function(e) {
    // Get the year selected
    // console.log(e)
    // console.log(this.value)

    // Update the chart
    update2(this.value);
  });

  function update2(value) {
    clearBox2('bar')
    clearBox2('pie')
    const newData = dataset;
    const color = d3.scaleOrdinal()
      .domain(feature)
      .range(d3.schemeTableau10);
    createBarChart("#bar", newData, color, value, 'People of Different '+value);   // [NEW] Parse the color to the chart function
    
    // Plot the line chart
    // createLineChart(data, color);     // [NEW] Parse the color to the chart function
 
    cols = titles[value]
    for (let col in cols) {
      createPieChart2(newData, color, col, value);
  }

  }
  function clearBox2(elementID) {
    var div = document.getElementById(elementID);
      
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
  
  


  const createPieChart2 = (data, colors, col, title) => {
    // Set the dimensions and margins of the graph
    var width = 200
    height = 200
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin
    const margins = {top: 60, right: 40, bottom: 60, left: 40};
    const svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);
   
    // var pie_data = d3.rollups(data, v => d3.count(v, d => d.Education), d => d.Attitude);
    const filtered_data = data.filter(d => d[title] === col);
    console.log(col)
    console.log(filtered_data)
    var featureValuesCount = d3.rollups(filtered_data, v => v.length, d => d.Attitude)
    pie_data = Object.assign({}, ...featureValuesCount.map((x) => ({[x[0]]: x[1]})));
    const pie = d3.pie()
        .value(function(d) {return d[1]})
    var data_ready = pie(Object.entries(pie_data))

    const arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius)
    var color = d3.scaleOrdinal()
    .range(d3.schemeSet2)
    
    const pie_chart = svg.
                      selectAll('whatever')
                        .data(data_ready)
                        .enter()
                        .append('path')
                        .attr('d', d3.arc()
                          .innerRadius(0)
                          .outerRadius(radius))
                          .attr('fill', function(d){ return(color(d.data[1])) })
                        .attr("stroke", "black")
                        .style("stroke-width", "1px")
                        .style("opacity", 0.7)
  
      svg
      .selectAll('whatever')
      .data(data_ready)
      .join('text')
      .text(function(d){ return titles['Attitude'][d.data[0]]})
      .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
      .style("text-anchor", "middle")
      .style("font-size", 12)

      svg.append("text")
      .attr("x", 0)
      .attr("y", height/2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(titles[title][col]);
      
                        
  }