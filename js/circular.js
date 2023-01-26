/* Set the time format
  Ref: https://github.com/d3/d3-time-format */
  const circular_titles = {
    'Education': {
      1:'Uneducated',
      2:'Primary education',
      3:'Middle education',
      4:'High education',
    },
    'Age': {
      1:'Youth',
      2:'Middle age',
      3:'Elders',
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
    'SocialMedia': {
      1: 'Frequent Social Media',
      2: 'Sometimes Social Media',
      3: 'Not much use Social Media',
      4: 'Never use Social Media'
    },
    'MaritalStatus': {
        1: 'Single', 
        2: 'First Marriage',
        3: 'Remarriage'
    },
    'OnlineShopping': {
        1: 'Frequent Online Shop',
        4: 'Never Online Shop'
    },
    'StudiedAbroad': {
        1: 'Studied Abroard',
        2: 'Never Studied Abroad'
    },
    'ReligiousBelief': {
        1: "Catholic",
        5: "Taoist",
    }
  }
  const parseTime = d3.timeParse("%Y");
  dataset = NaN
  feature = NaN
  
  function buildGaugeCharts(wfreq) {
    // Get all the sample data
    // var samples = data.samples;

    // // Filter the sample data to only include the selected sample
    // var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    // // Filter the metadata data to only include the selected sample
    // var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    // var selectedSample = sampleArray[0];

    // // Get the data for the selected sample
    // var otu_ids = selectedSample.otu_ids;
    // var otu_labels = selectedSample.otu_labels;
    // var sample_values = selectedSample.sample_values;

    // Code for Gauge Chart
 // Trig to calc meter point
 var degrees = 90 * (1 - wfreq);
 radius = .5;
var radians = degrees * Math.PI / 180;  // Calculate the angle in radians for the needle on the gauge chart
var x = radius * Math.cos(radians); // Calculate the x-coordinate for the needle
var y = radius * Math.sin(radians); // Calculate the y-coordinate for the needle

// Create the path for the needle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
  pathX = String(x),
  space = ' ',
  pathY = String(y),
  pathEnd = ' Z';
var path = mainPath.concat(pathX, space, pathY, pathEnd);

// Create the path for the needle
var mainPath = 'M ',
pathX1 = -1 * Math.sin(radians) * .025,
pathY1 = Math.cos(radians) * .025,
pathX2 = -1 * pathX1,
pathY2 = -1 * pathY1; 

var path = mainPath.concat(pathX1, ' ', pathY1, ' L ', pathX2, ' ', pathY2, ' L ', String(x), ' ', String(y), ' Z'); 

// Create the data for the scatter plot and the pie chart 
var scatterData = { 
type: 'scatter',
x: [0], y: [0],
marker: {
    size: 24, 
    color:'850000',
    },
showlegend: false,
text: wfreq,
hoverinfo: 'text'
};

var pieData = { 
values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
rotation: 90,
text: ['1',  '0.75', '0.5', '0.25', '0', '-0.25', '-0.5', '-0.75', '-1'],
textinfo: 'text',
textposition:'inside',	  
marker: { 
    colors: ["#69b3a2",
    "#72aa9d",
    "#7ca198",
    "#859793",
    "#8e8e8e",
    "#978589",
    "#a17c84",
    "#aa727f",
    "#b3697a",
            'rgba(255, 255, 255, 0)']
            
    },
hole: .5,
type: 'pie',
hoverinfo: 'text',
showlegend: false
};

var gaugeData = [scatterData, pieData];

var gaugeLayout = {
    // Needle
    shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: { color: '850000' }
    }],
    margin: {
      l: 50,
      r: 50,
      b: 0,
      t: 150,
      pad: 0
    },
    // title: 'Accepting Level',
    height: 300, width: 300,
    xaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]},
    yaxis: { zeroline:false, showticklabels:false, showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge', gaugeData, gaugeLayout, {showLink: false, 'displaylogo': false,  displayModeBar: false,});  // Create the gauge chart
}

  /* Load the dataset and formatting variables
    Ref: https://www.d3indepth.com/requests/ */
  const createCircular = (id, file_name, color, margin, multiply_scalar) => {
  d3.csv(file_name, d => {
    return {
      'column': d.column,
      'index': d.index,
      'diff': d.diff,
    }
  }).then(data => {
    // Print out the data on the console
    dataset = data;
  
    // const margin = {top: 50, right: 50, bottom: 0, left: 50},
    width = 400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    innerRadius = 60,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
const svg = d3.select("#"+id)
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);



  // Scales
  const x = d3.scaleBand()
      .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
      .align(0)                  // This does nothing
      .domain(data.map(d => circular_titles[d.column][d.index])); // The domain of the X axis is the list of states.
  const y = d3.scaleRadial()
      .range([innerRadius, outerRadius])   // Domain will be define later.
      .domain([-0.05, 1]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg.append("g")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("fill", color)
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(d => y(d.diff))
          .startAngle(d => x(circular_titles[d.column][d.index]))
          .endAngle(d => x(circular_titles[d.column][d.index]) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(innerRadius))
          .attr("id",function(d,i){
            return d.column;
          })
        .on('mouseover', function (d, i) {
            console.log(this);
            console.log(d)
            console.log(i)
            d3.selectAll("#"+i["column"]).transition()
                 .duration('50')
                 .attr('opacity', '.65');
            gauge_chart = buildGaugeCharts(i["diff"]* multiply_scalar);
       })
        .on('mouseout', function (d, i) {
            d3.selectAll("#"+i["column"]).transition()
                 .duration('50')
                 .attr('opacity', '1');
        
       })

  // Add the labels
  svg.append("g")
      .selectAll("g")
      .data(data)
      .join("g")
        .attr("text-anchor", function(d) { return (x(circular_titles[d.column][d.index]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(circular_titles[d.column][d.index]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.diff)+10) + ",0)"; })
      .append("text")
        .text(function(d){return(circular_titles[d.column][d.index])})
        .attr("transform", function(d) { return (x(circular_titles[d.column][d.index]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

  
        
  })
                        
}
const circular_negative = createCircular('circular_bar1', "../data/negative_circular.csv", "#b3697a", {top: 0, right: 50, bottom: 0, left: 50}, -1)
const circular_positive = createCircular('circular_bar2', "../data/positive_circular.csv", "#69b3a2", {top: 0, right: 50, bottom: 0, left: 50}, 1)
var gauge_chart = buildGaugeCharts(0)
