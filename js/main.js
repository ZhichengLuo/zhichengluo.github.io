
  var data_for_pie;

  const titles = {
    'Education': {
      1:'Uneducated',
      2:'Primary education',
      3:'Middle education',
      4:'High education',
    },
    'Age': {
      1:'Youth',
      2:'Middle age',
      3:'Elder',
    },
    'Income': {
      1:'Low income',
      2:'Middle income',
      3:'High income',
    },
    'Attitude': {
      1:'Negative',
      2:'Neutral',
      3:'Positive',
    }
  }


  d3.csv("../data/CLDS2018_for_visualization.csv", d => {
    return {
      'Attitude': d.Attitude,
      'Income': d.Income,
      'Age': d.Age,
      'Education': d.Education,
    }
  }).then(data => {
    const bar_color = d3.scaleOrdinal()
      .domain(data.map(d => d.Attitude))
      .range(d3.schemeTableau10);
  
    // Plot the bar chart
    createBarChart("#bar_chart", data, bar_color, 'Attitude', "People Holding Different Attitudes");   // [NEW] Parse the color to the chart function
    data_for_pie = data
 


    var feature = 'Education'

    var pie_color = d3.scaleOrdinal()
      .domain(data_for_pie.map(d => d[feature]))
      .range(d3.schemeTableau10)

    createPieChart('#pie_chart', data_for_pie, '1', feature, pie_color);  
    createPieChart('#pie_chart', data_for_pie, '2', feature, pie_color);  
    createPieChart('#pie_chart', data_for_pie, '3', feature, pie_color); 

  })
  
  d3.select("#select-feature").on("change", function(e) {
    console.log(e)
    console.log(this.value)

    clearBox('pie_chart')
    if (this.value != '') {
      var feature = this.value

      var pie_color = d3.scaleOrdinal()
        .domain(data_for_pie.map(d => d[feature]))
        .range(d3.schemeTableau10)

      createPieChart('#pie_chart', data_for_pie, '1', feature, pie_color);  
      createPieChart('#pie_chart', data_for_pie, '2', feature, pie_color);  
      createPieChart('#pie_chart', data_for_pie, '3', feature, pie_color); 

    }
  });

  function clearBox(elementID) {
    const node = document.getElementById(elementID);
    node.innerHTML = '';
}

  const createBarChart = (element_id, data, color, col, chart_title) => {
    /* Set the dimensions and margins of the graph
      Ref: https://observablehq.com/@d3/margin-convention */
    const width = 400, height = 200;
    const margins = {top: 60, right: 40, bottom: 40, left: 40};
  
    /* Create the SVG container */
    const svg = d3.select(element_id)
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);
  
    /* Define x-axis, y-axis, and color scales
      Ref: https://observablehq.com/@d3/introduction-to-d3s-scales */
    console.log('data.map(d => d.Attitude)', data.map(d => d.Attitude))
    const xScale = d3.scaleBand()
      .domain(data.map(d => d[col]))
      .range([margins.left, width-margins.right])
      .paddingInner(0.5);
  
    console.log(xScale.bandwidth());
    console.log(xScale.step());
  
    const yScale = d3.scaleLinear()
      .domain([0, 11000])
      .range([height-margins.bottom, margins.top])
  
    var bar_data = d3.rollups(data, v => v.length, d => d[col])
    console.log('bar_data', bar_data)
    
    const bar = svg.append("g")
      .attr("class", "bars")
      .selectAll("rect")
      .data(bar_data)
      .join("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(0) - yScale(d[1]))
        .attr("fill", d => color(d[0]));

    /* Add the tooltip when hover on the bar */
    // bar.append("title").text(d => d.Education);
    
    /* Create the x and y axes and append them to the chart
      Ref: https://www.d3indepth.com/axes/ and https://github.com/d3/d3-axis */
    const xAxis = d3.axisBottom(xScale);
  
    const xGroup = svg.append("g")
        .attr("transform", `translate(0, ${height-margins.bottom})`)
      .call(xAxis);
  
    xGroup.selectAll("text")
      .style("text-anchor", "middle")
      .text(d=>titles[col][d]);
  
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g")
        .attr("transform", `translate(${margins.left}, 0)`)
      .call(yAxis);

    // add title
    svg.append("text")
      .attr("text-anchor", "right")
      .style("font-size", "15") 
      .attr("y", margins.left)
      .attr("x", margins.top)
      .text(chart_title)
  }
  
  const createPieChart = (html_id, data, attitude, feature, color) => {
    
    const width = 800/3, height = width;
    const margins = {top: 60, right: 40, bottom: 60, left: 40};
    var radius = 0.8 * Math.min(width, height) / 2 

    /* Create the SVG container */
    const svg = d3.select(html_id)
      .append("svg")
        .attr("width", width)
        .attr("height", height)
      .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const filtered_data = data.filter(d => d.Attitude === attitude);
    var featureValuesCount = d3.rollups(filtered_data, v => v.length, d => d[feature])
    var pie_data = Object.assign({}, ...featureValuesCount.map((x) => ({[x[0]]: x[1]})))
    console.log('pie_data', pie_data)

    // Compute the position of each group on the pie:
    var pie = d3.pie()
      .value(function(d) {return d[1]; })
    var data_ready = pie(Object.entries(pie_data))

    const arcGenerator = d3.arc()
      .innerRadius(0)
      .outerRadius(radius)
  
    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .join('path')
        .attr('d', arcGenerator)
        .attr('fill', function(d){ return(color(d.data[0])) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
    
    // Now add the annotation. Use the centroid method to get the best coordinates
    svg
      .selectAll('mySlices')
      .data(data_ready)
      .join('text')
      .text(function(d){ return titles[feature][d.data[0]]})
      .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
      .style("text-anchor", "middle")
      .style("font-size", 13)

      svg.append("text")
        .attr("x", 0)
        .attr("y", height/2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(titles['Attitude'][attitude]);
  }