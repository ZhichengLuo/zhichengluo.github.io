
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
    
    // console.log(data.map(d => d.Attitude))
    // let radialScale = d3.scaleLinear()
    //   .domain([0,3])
    //   .range([0, 250]);
    // let ticks = [1, 2, 3];
  
    // svg.selectAll("circle")
    // .data(ticks)
    // .join(
    //     enter => enter.append("circle")
    //         .attr("cx", width / 2)
    //         .attr("cy", height / 2)
    //         .attr("fill", "none")
    //         .attr("stroke", "gray")
    //         .attr("r", d => radialScale(d))
    //         .attr("opacity", 0.3)
    // );

    // svg.selectAll(".ticklabel")
    // .data(ticks)
    // .join(
    //     enter => enter.append("text")
    //         .attr("class", "ticklabel")
    //         .attr("x", width / 2 + 5)
    //         .attr("y", d => height / 2 - radialScale(d))
    //         .text(d => d.toString())
    //         .attr("opacity", 0.5)
    // );

    // function angleToCoordinate(angle, value){
    //   let x = Math.cos(angle) * radialScale(value);
    //   let y = Math.sin(angle) * radialScale(value);
    //   return {"x": width / 2 + x, "y": height / 2 - y};
    // }
    
    // let featureData = features.map((f, i) => {
    //   let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    //   return {
    //       "name": f,
    //       "angle": angle,
    //       "line_coord": angleToCoordinate(angle, 3),
    //       "label_coord": angleToCoordinate(angle, 3.5)
    //   };
    // });
  
    // console.log("featureData", featureData)

    // // draw axis line
    // svg.selectAll("line")
    //   .data(featureData)
    //   .join(
    //       enter => enter.append("line")
    //           .attr("x1", width / 2)
    //           .attr("y1", height / 2)
    //           .attr("x2", d => d.line_coord.x)
    //           .attr("y2", d => d.line_coord.y)
    //           .attr("stroke","black")
    //           .attr("opacity", 0.5)
    //   );
    
    // // draw axis label
    // svg.selectAll(".axislabel")
    //   .data(featureData)
    //   .join(
    //       enter => enter.append("text")
    //           .attr("x", d => d.label_coord.x)
    //           .attr("y", d => d.label_coord.y)
    //           .text(d => d.name)
    //   );

    //   let line = d3.line()
    //     .x(d => d.x)
    //     .y(d => d.y);
    //   let colors = ["red", "yellow", "green"];

    // function getPathCoordinates(data_point){
    //   let coordinates = [];
    //   for (var i = 0; i < features.length; i++){
    //       let ft_name = features[i];
    //       let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    //       coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    //   }
    //   return coordinates;
    // }

    // // draw the path element
    // svg.selectAll("path")
    // .data(data_for_spader)
    // .join(
    //     enter => enter.append("path")
    //         .datum(d => getPathCoordinates(d))
    //         .attr("d", line)
    //         .attr("stroke-width", 3)
    //         .attr("stroke", (_, i) => colors[i])
    //         .attr("fill", (_, i) => colors[i])
    //         .attr("stroke-opacity", 1)
    //         .attr("opacity", 0.3)
    // );


    var margin = {top: 100, right: 100, bottom: 100, left: 100};
    // width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    // height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

    var color = d3.scaleOrdinal().range(["#EDC951","#CC333F","#00A0B0"]);
    
    var radarChartOptions = {
      w: width,
      h: height,
      margin: margin,
      maxValue: 0.5,
      levels: 5,
      roundStrokes: true,
      color: color
    };
    //Call function to draw the Radar chart
    RadarChart(".radarChart", data_for_spader, radarChartOptions);

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







////////////////////////// EXPORT FILE
/////////////////////////////////////////////////////////
/////////////// The Radar Chart Function ////////////////
/////////////// Written by Nadieh Bremer ////////////////
////////////////// VisualCinnamon.com ///////////////////
/////////// Inspired by the code of alangrafu ///////////
/////////////////////////////////////////////////////////
	
function RadarChart(id, data, options) {
	var cfg = {
	 w: 600,				//Width of the circle
	 h: 600,				//Height of the circle
	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.35, 	//The opacity of the area of the blob
	 dotRadius: 4, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 2, 		//The width of the stroke around each blob
	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
	};
	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])
		.domain([0, maxValue]);
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	//Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", function(d,i,j) { return cfg.color(j); })
		.style("fill-opacity", 0.8);

	/////////////////////////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarInvisibleCircle")
		.data(function(d,i) { return d; })
		.enter().append("circle")
		.attr("class", "radarInvisibleCircle")
		.attr("r", cfg.dotRadius*1.5)
		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "none")
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(d.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart