// fetch(')
// 	.then(response => response.json())
// 	.then(data => {
// 		document.getElementById('message').innerHTML = JSON.stringify(data);
// 	})

const req = new XMLHttpRequest();
req.open('GET', 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true);
req.send();
req.onload = function(){
  const json = JSON.parse(req.responseText);
  var data = JSON.stringify(json.data);
  var ds = [];
  // console.log(json.data.length);
  json.data.forEach(function(arr){
    ds.push([
      arr[0]
      .replace("-01-01",".0")
      .replace("-04-01",".25")
      .replace("-07-01",".50")
      .replace("-10-01",".75"),
      arr[1],
      arr[0],
      arr[0]
      .replace("-01-01"," Q1")
      .replace("-04-01"," Q2")
      .replace("-07-01"," Q3")
      .replace("-10-01"," Q4")
    ]);
  });
  // for(let i=0;i<ds.length;i++){
    // console.log(ds[1][0]);
  // }
  
  const dataset = ds;
  // const marginLeft = 200;
  const w = 1000;
  const h = 500;
  const padding = 100;
  const barWidth = 3;
  
  const xScale = d3.scaleTime()
  .domain([
    d3.min(dataset, (d) => new Date(d[2])),
    d3.max(dataset, (d) => new Date(d[2]))
  ])
  .range([padding, w - padding]);

  
  const yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, (d) => d[1])])
  .range([h - padding, padding]);
  
  
  const svg = d3.select("body")
                  .append("svg")
                  .attr("width", w)
                  .attr("height", h);
  let tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);
  
  const title = d3.select("svg")
                  .append("text")
                  .attr("x",w/2)
                  .attr("y",padding)
                  .attr("id","title")
                  .text("US GDP (quarterly)");
  
   const ytitle = d3.select("svg")
                  .append("text")
                  .attr("x",0)
                  .attr("y",h/2)
                  .attr("id","ytitle")
                  .text("Billions");
  
   const xtitle = d3.select("svg")
                  .append("text")
                  .attr("x",w/2)
                  .attr("y",h-padding/2)
                  .attr("id","xtitle")
                  .text("Years (Quarters)");
  
  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(new Date(d[2])))
    .attr("y", (d) => yScale(d[1]))
    .attr("data-date", (d) => d[2])
    .attr("data-gdp", (d) => d[1])
    .attr("width", barWidth)
    .attr("height", (d) => h-padding-yScale(d[1]))
    .attr("class", "bar")
  
 
    
    .on("mouseover", d => { 
        tooltip.style("opacity", .9);
        tooltip.attr("data-date", d[2])
        tooltip
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", d => {
        tooltip.style("opacity", 0);
      });
    

    

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
       .attr("transform", "translate(0," + (h - padding) + ")")
      .attr("id", "x-axis")
       .call(xAxis);

svg.append("g")
  .attr("transform", "translate(" + (padding) + ","+ 0 + ")")
  .attr("id", "y-axis")
  .call(yAxis);
}
      // var arr = data.data[i];

//