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
  
  
  /* Load the dataset and formatting variables
    Ref: https://www.d3indepth.com/requests/ */
  const createCircular = (file_name, color,) => {
  d3.csv(file_name, d => {
    return {
      'column': d.column,
      'index': d.index,
      'diff': d.diff,
    }
  }).then(data => {
    // Print out the data on the console
    dataset = data;
  
    const margin = {top: 100, right: 0, bottom: 0, left: 0},
    width = 460 - margin.left - margin.right,
    height = 460 - margin.top - margin.bottom,
    innerRadius = 90,
    outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// append the svg object
const svg = d3.select("#circular_bar")
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
      .domain([-1, 1]); // Domain of Y is from 0 to the max seen in the data

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
createCircular("../data/positive_circular.csv", "#69b3a2")
createCircular("../data/negative_circular.csv", "#b3697a")