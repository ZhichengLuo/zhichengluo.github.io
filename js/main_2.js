/* Set the time format
  Ref: https://github.com/d3/d3-time-format */

  const parseTime = d3.timeParse("%Y");
  console.log(parseTime("2020"));
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
    console.log(data);
    dataset = data;
    /* Data Manipulation in D3 
      Ref: https://observablehq.com/@d3/d3-extent?collection=@d3/d3-array */

    console.log('Attitude min:', d3.min(data, d => d.Attitude));
    console.log('Attitude max:', d3.max(data, d => d.Attitude));
    console.log('Attitude extent:', d3.extent(data, d => d.Attitude));
  
    // const newData = data.filter(d => d.Attitude === '3');
    const newData = data;
    console.log(newData);
  
    // Sort the country by the percentage in the descending order
    /*console.log(newData.sort((a, b) => d3.ascending(a.value, b.value)));
    console.log(newData.sort((a, b) => d3.descending(a.value, b.value)));
    console.log(newData);*/
  
    // Get the mean and median of gender gap percentage
    console.log(d3.mean(newData, d => d.Attitude));
    console.log(d3.median(newData, d => d.Attitude));
  
    // [NEW] Move the color scale here to share with both charts
    const education = data.map(d => d.Education);
    feature = education
    const color = d3.scaleOrdinal()
      .domain(feature)
      .range(d3.schemeTableau10);
  
    // Plot the bar chart
    createBarChart(newData, color, 'Education', 'Title');   // [NEW] Parse the color to the chart function
    
    // Plot the line chart
    // createLineChart(data, color);     // [NEW] Parse the color to the chart function
    var arr = [1,2,3];
    for (let i in arr) {
      console.log(arr[i]);
      createPieChart(newData, color, 'Education', 'Title');
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
    console.log(value)
    if (value == 'education')
        mapdict = {1:'Uneducated', 2:'Primary', 3:'Middle', 4:'high'}
    else if (value == 'age')
        mapdict = {1:'youth', 2:'middle', 3:'elder'}
    else if (value == 'income')
        mapdict = {1:'low', 2:'middle', 3:'high'}
    createBarChart(newData, color, 'Education', 'Title');   // [NEW] Parse the color to the chart function
    
    // Plot the line chart
    // createLineChart(data, color);     // [NEW] Parse the color to the chart function
    var arr = [1,2,3];
    for (let i in arr) {
      console.log(arr[i]);
      createPieChart2(newData, color);
  }

  }
  function clearBox2(elementID) {
    var div = document.getElementById(elementID);
      
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
  
  // const createBarChart2 = (data, color, col) => {
  //   /* Set the dimensions and margins of the graph
  //     Ref: https://observablehq.com/@d3/margin-convention */
  //   const width = 900, height = 400;
  //   const margins = {top: 20, right: 40, bottom: 80, left: 40};
  
  //   /* Create the SVG container */
  //   const svg = d3.select("#bar")
  //     .append("svg")
  //       //.attr("width", width)
  //       //.attr("height", height)
  //       .attr("viewBox", [0, 0, width, height]);
  
  //   /* Define x-axis, y-axis, and color scales
  //     Ref: https://observablehq.com/@d3/introduction-to-d3s-scales */
  //   const xScale = d3.scaleBand()
  //     .domain(feature)
  //     .range([margins.left, width-margins.right])
  //     .paddingInner(0.2);
    
  //   // console.log(xScale("France"));
  //   // console.log(xScale("Austria"));
  //   console.log(xScale.bandwidth());
  //   console.log(xScale.step());
  
  //   const yScale = d3.scaleLinear()
  //     .domain([0, d3.count(data, d => d.Attitude)])
  //     .range([height-margins.bottom, margins.top])
  
  //   console.log("Here!")
  //   console.log(yScale(0));
  //   console.log(yScale(3));
  

  //   var meanAttitudeByFeature = d3.rollups(data, v => d3.count(v, d => d.Attitude), d => d.Education)

  //   meanAttitudeByFeature.sort((a, b) => a[0].localeCompare(b[0]));
  //   console.log('meanAttitudeByFeature', meanAttitudeByFeature)
  //   console.log('data', data)
    
  //   const bar = svg.append("g")
  //     .attr("class", "bars")
  //     .selectAll("rect")
  //     .data(meanAttitudeByFeature)
  //     .join("rect")
  //       .attr("x", d => xScale(d[0]))
  //       .attr("y", d => yScale(d[1]))
  //       .attr("width", xScale.bandwidth())
  //       .attr("height", d => yScale(0) - yScale(d[1]))
  //       .attr("fill", d => color(d[0]));

  //   /* Add the tooltip when hover on the bar */
  //   bar.append("title").text(d => d.Education);
    
  //   /* Create the x and y axes and append them to the chart
  //     Ref: https://www.d3indepth.com/axes/ and https://github.com/d3/d3-axis */
  //   const xAxis = d3.axisBottom(xScale);
  
  //   const xGroup = svg.append("g")
  //       .attr("transform", `translate(0, ${height-margins.bottom})`)
  //     .call(xAxis);
  
  //   xGroup.selectAll("text")
  //     .style("text-anchor", "end")
  //     .attr("dx", "-.8em")
  //     .attr("dy", ".15em")
  //     .attr("transform", "rotate(-65)").text(d=>titles[col][d]);
  
  //   const yAxis = d3.axisLeft(yScale);
  
  //   svg.append("g")
  //       .attr("transform", `translate(${margins.left}, 0)`)
  //     .call(yAxis);

  //   // add title
  //   svg.append("text")
  //     .attr("text-anchor", "middle")
  //     .style("font-size", "20px") 
  //     .attr("y", margins.left)
  //     .attr("x", margins.top+400)
  //     .text("Attitude To Homosexuality w.r.t. Education Level")

  // }
  


  const createPieChart2 = (data, colors) => {
    // Set the dimensions and margins of the graph
    var width = 200
    height = 200
    margin = 40

    // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    var radius = Math.min(width, height) / 2 - margin
    const margins = {top: 10, right: 100, bottom: 20, left: 20};
    const svg = d3.select("#pie")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width/2}, ${height/2})`);
   
    var pie_data = d3.rollups(data, v => d3.count(v, d => d.Attitude), d => d.Education);
    pie_data = Object.assign({}, ...pie_data.map((x) => ({[x[0]]: x[1]})));
    console.log(pie_data);
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
      .text(function(d){ return d.data[0]})
      .attr("transform", function(d) { return `translate(${arcGenerator.centroid(d)})`})
      .style("text-anchor", "middle")
      .style("font-size", 12)

      svg.append("text")
      .attr("x", width/2)
      .attr("y", margin)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("Awesome Barchart");
      
                        
  }