/* Filename: PD3B.js
   Purpose : javascript
   Target html: PD3B.html
   Author: Peter Micevski
   Date written: 4 May 2019
   Revisions:
*/
 "use strict";

 // LINE CHART FUNCTION
 function d3load_LineCharts(){
    // SIZE PARAMETERS FOR CHART OBJECT
    var height = 600;
    var width = 1200;
    var padding = 50;
    var legendRectSize = 20;
    var legendSpacing = 1;
    var dataset;

     // APPENDING SVG OBJECT TO BODY OF PAGE
    var svg = d3.select("#chart")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    var rowConverter = function(d){
                  return{
                  date: new Date(d.year),
                  region: d.region,
                  value: parseFloat(d.value)};}


    d3.csv("WORLD_REGION_TOTAL_FUEL_COMB_LONG.csv", rowConverter, function(data){
                    dataset = data;
                    LineChart(dataset);});

    // ON CLICK BUTTON SELECRING OIL CSV FILE


    d3.select(".OIL").on("click", function(d){
                   d3.select("svg").remove();
                   svg = d3.select("#chart")
                   .append("svg")
                   .attr("width", width)
                   .attr("height", height);
                   d3.csv("WORLD_REGION_TOTAL_OIL_COMB_LONG.csv", rowConverter, function(data){
                   dataset = data;
                   LineChart(dataset);});
    });

    // ON CLICK BUTTON SELECRING NATURAL GAS CSV FILE
    d3.select(".NAT").on("click", function(d){
                   d3.select("svg").remove();
                   svg = d3.select("#chart")
                   .append("svg")
                   .attr("width", width)
                   .attr("height", height);
                   d3.csv("WORLD_REGION_NATURAL_GAS_COMB_LONG.csv", rowConverter, function(data){
                   dataset = data;
                   LineChart(dataset); });
    });

    // ON CLICK BUTTON SELECRING TOTAL FUEL CSV FILE
    d3.select(".FUEL").on("click", function(d){
                   d3.select("svg").remove();
                   svg = d3.select("#chart")
                   .append("svg")
                   .attr("width", width)
                   .attr("height", height);
                   d3.csv("WORLD_REGION_TOTAL_FUEL_COMB_LONG.csv", rowConverter, function(data){
                   dataset = data;
                   LineChart(dataset);});
    });

    // ON CLICK BUTTON SELECRING COAL CSV FILE
    d3.select(".COAL").on("click", function(d){
                   d3.select("svg").remove();
                   svg = d3.select("#chart")
                   .append("svg")
                   .attr("width", width)
                   .attr("height", height);
                   d3.csv("WORLD_REGION_TOTAL_COAL_COMB_LONG.csv", rowConverter, function(data){
                   dataset = data;
                   LineChart(dataset);});
    });

    // LINE CHART GOUPED BY REGION, LINE FOR EACH REGION
    function LineChart() {

      d3.select(".OIL").on("click", function(d){
                     d3.select("svg").remove();
                     svg = d3.select("#chart")
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height);
                     d3.csv("WORLD_REGION_TOTAL_OIL_COMB_LONG.csv", rowConverter, function(data){
                     dataset = data;
                     LineChart(dataset);});
      });

    // NEST FUNCTION PROVIDES GROUPING OF DATA PER REGION
    var sumstat = d3.nest()
                  .key(function(d) { return d.region;}).entries(dataset);

    // XSCALE FREQUENCY RANGE BASED ON DATE
    var xScale = d3.scaleTime()
                  .domain([
                  d3.min(dataset, function(d) {return d.date;}),
                  d3.max(dataset, function(d) {return d.date;})])
                  .range([padding + 30, width - padding - 250]);

    // YSCALE FREQUENCY RANGE BASED ON VALUE
    var yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, function(d) { return +d.value; })])
                  .range([height - padding , padding]);
    // LIST OF GRUOP NAMES
    var groupName = sumstat.map(function(dataset){ return dataset.key })

    // COLOUR SCHEME
    var color = d3.scaleOrdinal(d3.schemeCategory20).domain(groupName);
             //.range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999']);
    var xAxis = d3.axisBottom().ticks().scale(xScale);

    var yAxis = d3.axisLeft().ticks(10).scale(yScale);

    // LEGEND FOR FOR IDENTIFYING GROUPINGS BY COLOUR
    var legend = svg.append("g")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", 10)
                 .attr("text-anchor", "begin")
                 .selectAll("g")
                 .data(color.domain())
                 .enter().append("g")
                 .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

                 legend.append("rect") // COLOUR RECTANGLE FOR GROUPING
                 .attr("x", width - 250)
                 .attr("width", 19)
                 .attr("height", 19)
                 .attr("fill", color);

                 legend.append("text") // LABLE OF GROUPING POSITIONED NEXT TO RESPECTIVE COLOUR
                 .attr("x", width - 225)
                 .attr("y", 15)
                 .attr("font-size", 15)
                 .text(function(d) { return d; });

    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + (height - padding ) + ")").call(xAxis);

    svg.append("text") // AXIS LABLES IDENTIFYERS
          .attr("x", - 150)
          .attr("y", height - 10)
          .attr("font-family", "sans-serif")
          .attr("transform", "translate(" + ( height - padding) + ")")
          .text("Emissions by Year");

    svg.append("g").attr("class", "axis").attr("transform", "translate(" + (padding + 30) + ",0)").call(yAxis);

    svg.append("text") // AXIS LABLES IDENTIFYERS
          .attr("transform", "rotate(-90)")
          .attr("x", - 400 )
          .attr("y", 15)
          .attr("font-family", "sans-serif")
          .text("Million tonnes of CO2");

    // DRAWING OF LINES FOR EACH GROUP
    svg.selectAll(".line")
                .data(sumstat)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", function(d){ return color(d.key) })
                .attr("stroke-width", 2.0)
                .attr("d", function(d){
                return d3.line()
                .x(function(d) { return xScale(d.date); })
                .y(function(d) { return yScale(+d.value); })
                (d.values)})
                .on("mouseover", function(d) {d3.select(this).attr("stroke-width", 5.0);})
                .on("mouseout", function(d) {d3.select(this).attr("stroke-width",2.0)
                d3.select("#tooltip").remove()
                });
    }; // END OF FUNCTION lineChart

}; // END OF FUNCTON d3loadLineCharts


  // GUOPED BAR CHART FUNCTION
 function d3load_Grouped_BarChart(){
    // SIZE PARAMETERS FOR SVG OBJECT
    var height = 550;
    var width = 1400;
    var padding = 30;
    var legendRectSize = 20;
    var legendSpacing = 1;

    // SCALE, AXIS AND COLOUR SETUP
    var xRegion = d3.scaleBand()
                  .range([padding + 30, width - padding]);

    var xSector = d3.scaleBand();

    var yScale = d3.scaleLinear()
                  .range([height - padding , padding ]);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var xAxis = d3.axisBottom()
                  .scale(xRegion);

    var yAxis = d3.axisLeft()
                  .scale(yScale)
                  .ticks(10);

    // APPENDING SVG OBJECT TO BODY OF PAGE
    var svg = d3.select("#chart1")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);
    // READING CSV AND FUNCTION GROUPING COLOUMNS
    d3.csv("WORLD_FUEL_COMBUSTION_SECTOR_2016_fix.csv",
                  function(d, i, columns){
                    for (var i = 1, n = columns.length; i < n; ++i)
                    {d[columns[i]] = +d[columns[i]];}
                    return d;
                  },function(error, data) {
                    if (error) throw error;

    // CREATING A KEY FOR COLOUMNS
    var keys = data.columns.slice(1);

    console.log(data);

    // MAPPING DATA BY REGION
    xRegion.domain(data.map(function(d){ return d.region; }));

    xSector.domain(keys).rangeRound([0, xRegion.bandwidth()]);

    // YSCALE VALUE FOR EACH COLUMN OF GRUOP
    yScale.domain([0, d3.max(data,
                  function(d){
                    return d3.max(keys,
                      function(key){
                        return d[key];
                      });
                    })])
                    .nice();

    // APPENDING DATA TO SVG
    svg.selectAll("svg").data(data)
                  .enter().append("svg")
                  .attr("transform", function(d) {
                    return "translate(" + xRegion(d.region) + ",0)";
                  })
                  .selectAll("rect")
                  .data(function(d) {
                    return keys.map(function(key) {
                      return {
                      key: key,
                      value: d[key]};
                    });
                  })
                  .enter().append("rect")
                  .attr("x", function(d) { return xSector(d.key); })
                  .attr("y", function(d) { return yScale(d.value); })
                  .attr("width", xSector.bandwidth())
                  .attr("height", function(d) { return height - padding - yScale(d.value) ; })
                  .attr("fill", function(d) { return color(d.key); });


    svg.append("g").attr("class", "axis")
                  .attr("transform", "translate(0," + (height - padding + 0.01 ) + ")")
                  .call(xAxis);

    svg.append("text") // AXIS LABLES IDENTIFYERS
          .attr("x", - 520)
          .attr("y", 15)
          .attr("font-family", "sans-serif")
          .attr("transform", "translate(" + ( height - padding) + ")")
          .text("Million tonnes of CO2");

    svg.append("g").attr("class", "axis")
                  .attr("transform", "translate(" + (padding + 30.1) + ",0)")
                  .call(yAxis);

    // LEGEND FOR GROUPS
    var legend = svg.append("g")
                  .attr("font-family", "sans-serif")
                  .attr("font-size", 10)
                  .attr("text-anchor", "end")
                  .selectAll("g")
                  .data(keys.slice())
                  .enter().append("g")
                  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect") // RECTANGLE FOR GROUP LEGEND
                  .attr("x", width - 50)
                  .attr("width", 19)
                  .attr("height", 19)
                  .attr("fill", color);

    legend.append("text") // TEXT FOR THE RESPECTIVE LEGEND/GROUP COLOUR
                  .attr("x", width - 60)
                  .attr("y", 14.5)
                  .attr("font-size", 15)
                  .text(function(d) { return d; });
  });// END OF d3 CSV
}// END OF d3load_Grouped_BarChart

function init(){
  //d3load_LineCharts().LineChart();
  d3load_LineCharts();
  d3load_Grouped_BarChart();
}

window.onload = init;
