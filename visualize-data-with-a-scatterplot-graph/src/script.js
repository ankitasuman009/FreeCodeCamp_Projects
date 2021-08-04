document.addEventListener('DOMContentLoaded',function(){
//document.getElementById('getMessage').onclick=function(){
req=new XMLHttpRequest();
req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json',true);
    req.send();
    req.onload=function(){
    json=JSON.parse(req.responseText);
        
    var dataset = json;
    
var margin = {
  top: 100,
  right: 20,
  bottom: 30,
  left: 60 },

width = 920 - margin.left - margin.right,
height = 630 - margin.top - margin.bottom;
    const padding = 60;
    
    const xScale = d3.scaleTime()
                     .domain(
                       [
                        d3.min(dataset, (d) => new Date(d.Year,0,0,0,0,0,0)), 
                        d3.max(dataset, (d) => new Date(d.Year,0,0,0,0,0,0))
                       ])
                     .range([padding, width - padding]);
    
    const yScale = d3.scaleTime()
                     .domain(
                     [d3.min(dataset, (d) => new Date(0,0,0,0,d.Time.substring(0,2),d.Time.substring(3,5),0)),                                  d3.max(dataset, (d) => new Date(0,0,0,0,d.Time.substring(0,2),d.Time.substring(3,5),0))])
                     .range([height - padding, padding])
                     ;
    
    var timeFormat = d3.timeFormat("%M:%S");
    
    const xAxis = d3.axisBottom(xScale);
    
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
        
    const svg = d3.select("body")
                  .append("svg")
                  .attr('width', width + margin.left + margin.right)
                  .attr('height', height + margin.top + margin.bottom);
      
    const title = d3.select("svg")
                  .append("text")
                  .attr("x",width/2)
                  .attr("y",margin.top / 2)
                  .attr("class","title")
                  .attr("id","title")
                  .text("Doping in Professional Bicycle Racing");
    
    const legend = d3.select("svg")
                  .append("rect")
                  .attr("x",width-4*padding)
                  .attr("y",height/2-padding/2)
                  .attr("width",4*padding)
                  .attr("height",padding/3)
                  .attr("class","legend")
                  .attr("id","legend")
    
    const legendtext = d3.select("svg")
                  .append("text")
                  .attr("x",width-4*padding-15)
                  .attr("y",height/2-padding/4)
                  .text("35 fastest ascends of the Alpe d'Huez");
                  
                      
    let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);
        
    svg.selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle")
       .attr("cx", (d) => xScale(new Date(d.Year,0,0,0,0,0,0)))
       .attr("cy",(d) => yScale(new Date(0,0,0,0,d.Time.substring(0,2),d.Time.substring(3,5),0)))
       .attr("data-xvalue", (d) => (d.Year))
       .attr("data-yvalue", (d) => new Date(1970,0,1,0,d.Time.substring(0,2),d.Time.substring(3,5),0))
             //new Date(Date.UTC(1970, 0, 1, 0, d.Time.substring(0,2), d.Time.substring(3,5),0)).toUTCString())
             //new Date(0,0,0,0,d.Time.substring(0,2),d.Time.substring(3,5),0))
      //d.Time.toISOString()
       .attr("r", (d) => 5)
       .attr("class","dot")
              
       .on("mouseover", d => { 
        tooltip.style("opacity", .9);
        tooltip.attr("data-date", d.Year)
        tooltip
          .html( 
            d.Place + ": "+ d.Year+" "+d.Name + " " + d.Time + "<br>" + d.Doping
          )
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 29 + "px")
          .attr("data-year", d.Year)
      ;
      })
      .on("mouseout", d => {
        tooltip.style("opacity", 0);
      });
 
   svg.append("g")
       .attr("transform", "translate(0," + (height - padding) + ")")
       .attr("id","x-axis")
       .call(xAxis);
    
    svg.append("g")
       .attr("transform", "translate(" + padding + ",0)")
       .attr("id","y-axis")
       .call(yAxis);
        
     d3.selectAll(".dot").each(function(d,i) {
  console.log("data-yvalue of dot " + i + " is " + d3.select(this).attr("data-yvalue"))
}) 
      
        };
  });
  