dataset = NaN
const heatmap_titles = {
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
    'MaritalStatus': {
        1: 'Single', 
        2: 'First Marriage',
        3: 'Remarriage',
        4: 'Divorced',
        5: 'Widowed',
        6: 'Cohabit'

    },
  }
function createHeatMap (column_name1, column_name2) {
    d3.csv("./data/heatmap_data/"+column_name1+"_"+column_name2+".csv", d => {
        return {
          'column1': d[column_name1],
          'column2': d[column_name2],
          'diff': d.Attitude_diff,
        }
      }).then( data => {

        const margin = {top: 105, right: 80, bottom: 125, left: 150},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
      
      // append the svg object to the body of the page
      const svg = d3.select("#heatmap")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      
        dataset = data;
        var column1_group =    dataset.map(x => {
                return (heatmap_titles[dataset.columns[0]][x["column1"]]);
            });
        var column2_group =    dataset.map(x => {
                return (heatmap_titles[dataset.columns[1]][x["column2"]]);
            });
        console.log(column1_group);
        console.log(column2_group);
      
      console.log(data)

      // Build X scales and axis:
      const x = d3.scaleBand()
        .range([ 0, width ])
        .domain(column1_group)
        .padding(0.01)

      svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")  
    .style("text-anchor", "end")
    .style("font-size", "18px")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");
      
      // Build X scales and axis:
      const y = d3.scaleBand()
        .range([ height, 0 ])
        .domain(column2_group)
        .padding(0.01);
      svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")  
        .style("font-size", "18px");
      
      // Build color scale
      const myColor = d3.scaleLinear()
        .range(['#ff007f', '#00ff80'])
        .domain([-0.35, 0.35])
    
      console.log(myColor(0.15));
      console.log(myColor(-0.15));
      console.log(myColor(0))
    
  
        const tooltip = d3.select("#heatmap")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")

        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function(event,d) {
            tooltip.style("opacity", 1)
        }
        const mousemove = function(event,d) {
            if (parseFloat(d.diff) > 0){
            tooltip
            .html("The accepting rate of this group is <b>" + parseFloat(d.diff).toFixed(2)+ " higher</b> than global average")
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2 + "px")
        } else {
            tooltip
            .html("The accepting rate of this group is <b>" + (-parseFloat(d.diff)).toFixed(2)+ " lower</b> than global average")
            .style("left", (event.x)/2 + "px")
            .style("top", (event.y)/2 + "px")
        }
        }
        const mouseleave = function(d) {
            tooltip.style("opacity", 0)
        }

      svg.selectAll()
      .data(data, function(d) {return d.diff;})
      .join("rect")
      .attr("x", function(d) { return x(heatmap_titles[dataset.columns[0]][d.column1]) })
      .attr("y", function(d) { return y(heatmap_titles[dataset.columns[1]][d.column2]) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.diff)} )
      .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
  })

  var svg = d3.select("#my_heatviz")

// Handmade legend
svg.append("circle").attr("cx",30).attr("cy",130).attr("r", 6).style("fill", '#00ff80')
svg.append("circle").attr("cx",30).attr("cy",160).attr("r", 6).style("fill", 'rgb(73, 182, 128)')
svg.append("circle").attr("cx",30).attr("cy",190).attr("r", 6).style("fill", 'rgb(128, 128, 128)')
svg.append("circle").attr("cx",30).attr("cy",220).attr("r", 6).style("fill", 'rgb(182, 73, 127)')
svg.append("circle").attr("cx",30).attr("cy",250).attr("r", 6).style("fill", '#ff007f')

svg.append("text").attr("x", 50).attr("y", 130).text("Most Positive").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 50).attr("y", 160).text("Positive").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 50).attr("y", 190).text("Neutral").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 50).attr("y", 220).text("Negative").style("font-size", "15px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 50).attr("y", 250).text("Most Negative").style("font-size", "15px").attr("alignment-baseline","middle")


}
function button_click(column_name1, column_name2) {
    clearHeatmap("heatmap")
    heatmap = createHeatMap(column_name1, column_name2)
  }
function clearHeatmap(elementID) {
    var div = document.getElementById(elementID);
      
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    }
}
column_name1 = "Age"
column_name2 = "Income"
var heatmap = createHeatMap(column_name1, column_name2)