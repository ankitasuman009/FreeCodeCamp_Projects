const req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
req.send();
req.onload = function(){
  const data = JSON.parse(req.responseText);
  // var data = JSON.stringify(json);
  
  const baseTemp = data.baseTemperature;
  const monthVar = data.monthlyVariance;
  
  const minVar = d3.min(monthVar, d => d.variance);
  const maxVar = d3.max(monthVar, d => d.variance);
  
  
  const minYear = d3.min(monthVar, d => d.year);
  const maxYear = d3.max(monthVar, d => d.year);
  const diffYear = maxYear - minYear;
  
  
  const margin = {top: 100, right: 50, bottom: 150, left: 100};

var width = 1250 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

const yearParse = d3.timeParse("%Y");
const yearFormat = d3.timeFormat("%Y");

const monthParse = d3.timeParse("%b");
const monthFormat = d3.timeFormat("%b");
  
  const month = ["January","February","March","April","May","June","July", "August","September","October","November","December"];
const revMonth = month.reverse();

  
  const interpolatePlasma = d3.scaleSequential(d3.interpolatePlasma).domain([baseTemp + minVar, baseTemp + maxVar]);
  
  
  const xValue = (d) => yearParse(d.year);
  
  const xScale = d3.scaleTime()
  .domain(d3.extent(monthVar, (d) => yearParse(d.year)))
  .range([0,width]);
  

  const yValue = (d) => d.month - 1;
  
  const yScale = d3.scaleLinear()
  .domain([0,11])
  .range([0,height]);
  


const svg = d3.select("body")
.append("svg")
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)

  
  const tooltip = d3.select('body')
  .append('div')
.attr('class', 'tooltip')
.attr('id', 'tooltip')
.style('opacity', 0);

  
 svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2))
        .attr("class","text")
        .attr("id", "title")
        .attr("text-anchor", "middle")  
        .style("font-size", "24px") 
        .style("text-decoration", "underline")  
        .text("Heat Map - Global Monthly Land-Surface Temp");

    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y",24 - (margin.top / 2))
        .attr("class","text")
        .attr("id", "description")
        .attr("text-anchor", "middle")  
        .style("font-size", "12px") 
        .style("text-decoration", "underline")  
        .text("1753 - 2015: Base Temp 8.66℃");

      const xMap = d => xScale(xValue(d));
  
  const xAxis = d3.axisBottom(xScale).tickSize(16, 0).tickFormat(d3.timeFormat("%Y"));
  
    const yMap = d => yScale(yValue(d));
  const yAxis = d3.axisLeft(yScale).tickFormat((d,i)=> `${month[12 - (d + 1)]}`);

 
  svg.append('g')
  .attr('class','x axis')
  .attr('id', 'x-axis')
  .attr('transform', `translate(0,${(height) + height/12})`)
  .call(xAxis);
    
  
  svg.append('g')
  .attr('class','y axis hidden')
  .attr('transform', `translate(0,${(height / 12) / 2})`)
  .attr('id', 'y-axis')
  .call(yAxis);
    
  svg.append('g')
  .selectAll('rect')
  .data(monthVar)
  .enter().append('rect')
  .attr('class','cell')
  .attr('x', (d) => xMap(d))
  .attr('y', (d)=> yMap(d))
  .attr('rx', 1)
  .attr('ry', 1)
  .attr('width', (width / diffYear) - .25)
  .attr('height', height / 12 + 2.25)
  .attr('data-month', (d) => d.month - 1)
  .attr('data-year', d => d.year)
  .attr('data-temp', d => baseTemp + d.variance)
  .style('fill',(d,i) => interpolatePlasma(d.variance + baseTemp))
  .on("mouseover", d => {
    tooltip
    .transition()
    .duration(50)
    .style('opacity', 0.9)
    
    tooltip.attr('data-year', d.year);
    tooltip.attr('data-temp', d.variance);
    
    tooltip
    .html(`<strong>Month:</strong> ${month[12 - (d.month)]}<br/>
           <strong>Year:</strong> ${d.year}<br/> 
           <strong>Variance:</strong> ${d.variance.toPrecision(1)}°C`)
    .style("left", d3.event.pageX - 75 + "px")
    .style("top", d3.event.pageY - 100 + "px");
    
    
  })
  .on("mouseout", () => {
    tooltip
    .transition()
    .duration(50)
    .style("opacity", 0);
  });
  

  const chartGroup = svg.append('g')
.attr('transform', `translate(${margin.left},${margin.top})`);
  
  const legend = d3.scaleLinear()
  .domain([minVar, maxVar]
         ).range([interpolatePlasma(baseTemp + minVar), interpolatePlasma(baseTemp + maxVar)]);
  
  svg.append('g')
    .attr('class', 'legend')
    .attr('id','legend')
    .attr('transform', `translate(${margin.left},${height + margin.top + (margin.bottom / 2)})`);
  
  const legendLinear = d3.legendColor()
  .shape("rect")
  .shapeWidth(30)
  .cells(8)
  .orient('horizontal')
  .scale(legend);
  
  svg.select(".legend").call(legendLinear);
  };