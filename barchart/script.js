/*
KEY ACTIONS TO EXECUTE.
User Story #1: My chart should have a title with a corresponding id="title".

User Story #2: My chart should have a g element x-axis with a corresponding id="x-axis".

User Story #3: My chart should have a g element y-axis with a corresponding id="y-axis".

User Story #4: Both axes should contain multiple tick labels, each with a corresponding class="tick".

User Story #5: My chart should have a rect element for each data point with a corresponding class="bar" displaying the data.

User Story #6: Each .bar should have the properties data-date and data-gdp containing date and GDP values.

User Story #7: The .bar elements' data-date properties should match the order of the provided data.

User Story #8: The .bar elements' data-gdp properties should match the order of the provided data.

User Story #9: Each .bar element's height should accurately represent the data's corresponding GDP.

User Story #10: The data-date attribute and its corresponding .bar element should align with the corresponding value on the x-axis.

User Story #11: The data-gdp attribute and its corresponding .bar element should align with the corresponding value on the y-axis.

User Story #12: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

User Story #13: My tooltip should have a data-date property that corresponds to the data-date of the active area.
*/

/**
 * Things to learn
 * title
 * g element of svg to make axis
 * tick labels
 * creating bar with rect element of svg
 */

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//fetching data 
async function datafetching(){
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



// preapere the scales for X and y axis.
const xmax = Number(d3.max(dataset,(d)=>d[0].slice(0,4)));
const ymax = d3.max(dataset,(d)=>d[1]);
const xmin = Number(d3.min(dataset,(d)=>d[0].slice(0,4)));
const ymin = d3.min(dataset,(d)=>d[1]);

const xScale = d3.scaleLinear().domain([0,xmax]).range([margin, width - margin]);
const yScale = d3.scaleLinear().domain([0,ymax]).range([height - margin, margin]);

// Make the axis
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

console.log(xScale(0))

const svg = d3.select("div.container")
.append("svg")
  .attr("width", width)
  .attr("height", height);

svg.append('g').attr("transform",`translate(0,${height - margin})`).call(xAxis);
svg.append('g').attr("transform",`translate(${margin},0)`).call(yAxis);
