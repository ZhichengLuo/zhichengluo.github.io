
  var data_for_pie;
  var data_for_spader;

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
      3:'Olders',
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
    },
    'HowMuchYouAgreeThatHavingBoysBetterThanGirls': {
      1:'Strongly agree',
      2:'Agree',
      3:'Neutral',
      3:'Disagree',
      3:'Strongly disagree',
    }
  }

  // load data for spader chart
  d3.csv("../data/data_for_rader.csv", d => {
    return {
      'Attitude': d.Attitude,
      'Income': d.Income,
      'Age': d.Age,
      'Education': d.Education,
      'Do you agree it\'s better to have boys than girls': d.HowMuchYouAgreeThatHavingBoysBetterThanGirls1,
      'How many homosexual people do you know': d.HomosexualPeopleYouKnow,
    }
  }).then(data => {
    
    let features = ['Income', 'Age', 'Education', 'Do you agree it\'s better to have boys than girls',  'How many homosexual people do you know']

    data_for_spader = data
    console.log("data_for_spader", data_for_spader)
 
    let width = 800
    let height = 800;
    
    /* Create the SVG container */
    const svg = d3.select("#rader")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    
    console.log(data.map(d => d.Attitude))
    let radialScale = d3.scaleLinear()
      .domain([0,3])
      .range([0, 250]);
    let ticks = [1, 2, 3];
  
    svg.selectAll("circle")
    .data(ticks)
    .join(
        enter => enter.append("circle")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("fill", "none")
            .attr("stroke", "gray")
            .attr("r", d => radialScale(d))
            .attr("opacity", 0.3)
    );

    svg.selectAll(".ticklabel")
    .data(ticks)
    .join(
        enter => enter.append("text")
            .attr("class", "ticklabel")
            .attr("x", width / 2 + 5)
            .attr("y", d => height / 2 - radialScale(d))
            .text(d => d.toString())
            .attr("opacity", 0.5)
    );

    function angleToCoordinate(angle, value){
      let x = Math.cos(angle) * radialScale(value);
      let y = Math.sin(angle) * radialScale(value);
      return {"x": width / 2 + x, "y": height / 2 - y};
    }
    
    let featureData = features.map((f, i) => {
      let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
      return {
          "name": f,
          "angle": angle,
          "line_coord": angleToCoordinate(angle, 3),
          "label_coord": angleToCoordinate(angle, 3.5)
      };
    });
  
    console.log("featureData", featureData)

    // draw axis line
    svg.selectAll("line")
      .data(featureData)
      .join(
          enter => enter.append("line")
              .attr("x1", width / 2)
              .attr("y1", height / 2)
              .attr("x2", d => d.line_coord.x)
              .attr("y2", d => d.line_coord.y)
              .attr("stroke","black")
              .attr("opacity", 0.5)
      );
    
    // draw axis label
    svg.selectAll(".axislabel")
      .data(featureData)
      .join(
          enter => enter.append("text")
              .attr("x", d => d.label_coord.x)
              .attr("y", d => d.label_coord.y)
              .text(d => d.name)
      );

      let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);
      let colors = ["red", "yellow", "green"];

    function getPathCoordinates(data_point){
      let coordinates = [];
      for (var i = 0; i < features.length; i++){
          let ft_name = features[i];
          let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
          coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
      }
      return coordinates;
    }

    // draw the path element
    svg.selectAll("path")
    .data(data_for_spader)
    .join(
        enter => enter.append("path")
            .datum(d => getPathCoordinates(d))
            .attr("d", line)
            .attr("stroke-width", 3)
            .attr("stroke", (_, i) => colors[i])
            .attr("fill", (_, i) => colors[i])
            .attr("stroke-opacity", 1)
            .attr("opacity", 0.3)
    );

  })


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
        .attr("x", width/3)
        .attr("y", height/2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(titles['Attitude'][attitude]);
  }