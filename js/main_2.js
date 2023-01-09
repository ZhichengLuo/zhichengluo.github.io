/* Set the time format
  Ref: https://github.com/d3/d3-time-format */
  const parseTime = d3.timeParse("%Y");
  console.log(parseTime("2020"));
  
  /* Load the dataset and formatting variables
    Ref: https://www.d3indepth.com/requests/ */
  d3.csv("../data/CLDS2018_cleaned_data.csv", d => {
    return {
      'AttitudeToHomosexuality': d.AttitudeToHomosexuality,
      'AnnualIncome': d.AnnualIncome,
      'MaritalStatus': d.MaritalStatus,
      'EducationLevel': d.EducationLevel,
    }
  }).then(data => {
    // Print out the data on the console
    console.log(data);
  
    /* Data Manipulation in D3 
      Ref: https://observablehq.com/@d3/d3-extent?collection=@d3/d3-array */

    console.log('AttitudeToHomosexuality min:', d3.min(data, d => d.AttitudeToHomosexuality));
    console.log('AttitudeToHomosexuality max:', d3.max(data, d => d.AttitudeToHomosexuality));
    console.log('AttitudeToHomosexuality extent:', d3.extent(data, d => d.AttitudeToHomosexuality));
  
    // const newData = data.filter(d => d.AttitudeToHomosexuality === '3');
    const newData = data;
    console.log(newData);
  
    // Sort the country by the percentage in the descending order
    /*console.log(newData.sort((a, b) => d3.ascending(a.value, b.value)));
    console.log(newData.sort((a, b) => d3.descending(a.value, b.value)));
    console.log(newData);*/
  
    // Get the mean and median of gender gap percentage
    console.log(d3.mean(newData, d => d.AttitudeToHomosexuality));
    console.log(d3.median(newData, d => d.AttitudeToHomosexuality));
  
    // [NEW] Move the color scale here to share with both charts
    const education = data.map(d => d.EducationLevel);
  
    const color = d3.scaleOrdinal()
      .domain(education)
      .range(d3.schemeTableau10);
  
    // Plot the bar chart
    createBarChart(newData, color);   // [NEW] Parse the color to the chart function
  
    // Plot the line chart
    // createLineChart(data, color);     // [NEW] Parse the color to the chart function
  })
  
  const createBarChart = (data, color) => {
    /* Set the dimensions and margins of the graph
      Ref: https://observablehq.com/@d3/margin-convention */
    const width = 900, height = 400;
    const margins = {top: 20, right: 40, bottom: 80, left: 40};
  
    /* Create the SVG container */
    const svg = d3.select("#bar")
      .append("svg")
        //.attr("width", width)
        //.attr("height", height)
        .attr("viewBox", [0, 0, width, height]);
  
    /* Define x-axis, y-axis, and color scales
      Ref: https://observablehq.com/@d3/introduction-to-d3s-scales */
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.EducationLevel))
      .range([margins.left, width-margins.right])
      .paddingInner(0.2);
  
    // console.log(xScale("France"));
    // console.log(xScale("Austria"));
    console.log(xScale.bandwidth());
    console.log(xScale.step());
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.AttitudeToHomosexuality)])
      .range([height-margins.bottom, margins.top])
  
    console.log("Here!")
    console.log(yScale(0));
    console.log(yScale(3));
  
    /* Working with Color: https://observablehq.com/@d3/working-with-color
      Color schemes: https://observablehq.com/@d3/color-schemes 
      d3-scale-chromatic: https://github.com/d3/d3-scale-chromatic */
    /*const countries = data.map(d => d.EducationLevel);
  
    const color = d3.scaleOrdinal()
      .domain(countries)
      .range(d3.schemeTableau10);
  
    console.log(color("France"));*/
  
    /* Create the bar elements and append to the SVG group
      Ref: https://observablehq.com/@d3/bar-chart */

    var meanAttitudeByEducation = d3.rollups(data, v => d3.mean(v, d => d.AttitudeToHomosexuality), d => d.EducationLevel)

    meanAttitudeByEducation.sort((a, b) => a[0].localeCompare(b[0]));
    console.log('meanAttitudeByEducation', meanAttitudeByEducation)
    console.log('data', data)
    
    const bar = svg.append("g")
      .attr("class", "bars")
      .selectAll("rect")
      .data(meanAttitudeByEducation)
      .join("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(0) - yScale(d[1]))
        .attr("fill", d => color(d[0]));

    /* Add the tooltip when hover on the bar */
    bar.append("title").text(d => d.EducationLevel);
    
    /* Create the x and y axes and append them to the chart
      Ref: https://www.d3indepth.com/axes/ and https://github.com/d3/d3-axis */
    const xAxis = d3.axisBottom(xScale);
  
    const xGroup = svg.append("g")
        .attr("transform", `translate(0, ${height-margins.bottom})`)
      .call(xAxis);
  
    xGroup.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");
  
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g")
        .attr("transform", `translate(${margins.left}, 0)`)
      .call(yAxis);

    // add title
    svg.append("text")
      .attr("text-anchor", "middle")
      .style("font-size", "20px") 
      .attr("y", margins.left)
      .attr("x", margins.top+400)
      .text("Attitude To Homosexuality w.r.t. Education Level")

  }
  
  const createLineChart = (data, color) => {
    /* Set the dimensions and margins of the graph */
    const width = 900, height = 400;
    // [NEW] Change the right margin to show the country names
    //const margins = {top: 20, right: 40, bottom: 80, left: 40};
    const margins = {top: 20, right: 100, bottom: 80, left: 40};
  
    /* Create the SVG container */
    const svg = d3.select("#line")
      .append("svg")
        .attr("viewBox", [0, 0, width, height]);
  
    console.log(data);
  
    /* Define x-axis, y-axis, and color scales */
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d=>d.EducationLevel)])
      .range([height - margins.bottom, margins.top]);
  
    console.log(yScale(22));
  
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margins.left, width - margins.right]); 
  
    /* Construct a line generator
      Ref: https://observablehq.com/@d3/line-chart and https://github.com/d3/d3-shape */
    const line = d3.line()
      .curve(d3.curveLinear)
      .x(d => xScale(d.date))
      .y(d => yScale(d.EducationLevel));
  
    /* Group the data for each country
      Ref: https://observablehq.com/@d3/d3-group */
    const group = d3.group(data, d => d.AttitudeToHomosexuality);
    console.log(group);
  
    /* Create line paths for each country */
    const path = svg.selectAll('path')
      .data(group)
      .join('path')
        .attr('d', ([i, d]) => line(d))
        .style('stroke', ([i, d]) => color(i)) // [NEW] Change the stroke color to align with bar chart
        .style('stroke-width', 2)
        .style('fill', 'transparent')
        .style('opacity', 0.8); // [NEW] Add opacity to the line
  
    /* [NEW] Add the tooltip when hover on the line */
    path.append('title').text(([i, d]) => i);
  
    /* [NEW] Create the x and y axes and append them to the chart */
    const xAxis = d3.axisBottom(xScale);
  
    svg.append("g")
      .attr("transform", `translate(0,${height - margins.bottom})`)
      .call(xAxis);
  
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g")
      .attr("transform", `translate(${margins.left},0)`)
      .call(yAxis)
  
    /* [NEW] Add text labels on the right of the chart */
    const data2020 = data.filter(data => data.year === 2020);
    svg.selectAll('text.label')
      .data(data2020)
      .join('text')
        .attr('x', width - margins.right + 5)
        .attr('y', d => yScale(d.EducationLevel))
        .attr('dy', '0.35em')
        .style('font-family', 'sans-serif')
        .style('font-size', 12)
        .style('fill', d => color(d.AttitudeToHomosexuality))
      .text(d => d.AttitudeToHomosexuality);
  }