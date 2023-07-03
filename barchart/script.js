import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//fetching data 
async function datafetching() {
  const res = await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json');
  const data = await res.json();
  return data;
}
const json = await datafetching();
const dataset = json.data;
// Declare the chart dimensions and margins.
const width = 900;
const height = 460;
const margin = 60;
// append the svg element for the chart

// extract year
function extyrs(str) {
  return Number(str.slice(0, 4))
}

// preapere the scales for X and y axis.
const xmax = Number(d3.max(dataset, (d) => d[0].slice(0, 4)));
const ymax = d3.max(dataset, (d) => d[1]);
const xmin = Number(d3.min(dataset, (d) => d[0].slice(0, 4)));
const ymin = d3.min(dataset, (d) => d[1]);

const xScale = d3.scaleLinear().domain([xmin, xmax]).range([margin, width - margin]);
const yScale = d3.scaleLinear().domain([0, ymax]).range([height - margin, margin]);
const anotherScale = d3.scaleLinear().domain([0, dataset.length]).range([margin, width - margin]);

// Make the axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);
const tooltip = d3.select("div.container")
  .append("div")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .attr("id", "tooltip");



const svg = d3.select("div.container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


svg.append('g').attr("id", "x-axis").attr("transform", `translate(0,${height - margin})`).call(xAxis);
svg.append('g').attr("id", "y-axis").attr("transform", `translate(${margin},0)`).call(yAxis);

const gap = (width - margin) / dataset.length;
// axis name
const head = svg.append("text").attr('class', 'heading').text('Gross Domestic Product');

svg.selectAll('rect').data(dataset).enter().append("rect").attr("class", "bar").attr('x', (d, i) => anotherScale(i)).attr('y', (d, i) => yScale(d[1]))
  .attr('width', gap).attr('height', (d) => height - margin - yScale(d[1]))
  .attr("data-date", (d) => `${d[0]}`).attr("data-gdp", (d) => `${d[1]}`).attr("index", (d,i) => `${i}`)
  .on("mouseover", function (d) {
    tooltip.style("visibility", "visible").text(`(${extyrs(d.toElement.__data__[0])}, ${d.toElement.__data__[1]})`);
    d.target.style.fill = "none";
  }).on("mouseout", function (d) {
    tooltip.style("visibility", "hidden");
    d.target.style.fill = "rgb(51, 173, 255)";
  });