/**
User Story #1: I can see a title element that has a corresponding id="title".

User Story #2: I can see an x-axis that has a corresponding id="x-axis".

User Story #3: I can see a y-axis that has a corresponding id="y-axis".

User Story #4: I can see dots, that each have a class of dot, which represent the data being plotted.

User Story #5: Each dot should have the properties data-xvalue and data-yvalue containing their corresponding x and y values.

User Story #6: The data-xvalue and data-yvalue of each dot should be within the range of the actual data and in the correct data format.
For data-xvalue, integers (full years) or Date objects are acceptable for test evaluation. For data-yvalue (minutes), use Date objects.

User Story #7: The data-xvalue and its corresponding dot should align with the corresponding point/value on the x-axis.

User Story #8: The data-yvalue and its corresponding dot should align with the corresponding point/value on the y-axis.

User Story #9: I can see multiple tick labels on the y-axis with %M:%S time format.

User Story #10: I can see multiple tick labels on the x-axis that show the year.

User Story #11: I can see that the range of the x-axis labels are within the range of the actual x-axis data.

User Story #12: I can see that the range of the y-axis labels are within the range of the actual y-axis data.

User Story #13: I can see a legend containing descriptive text that has id="legend".

User Story #14: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.

User Story #15: My tooltip should have a data-year property that corresponds to the data-xvalue of the active area.
 */

var url =
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

  import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
  
var margin = {
    top: 100,
    right: 20,
    bottom: 30,
    left: 60
  },
  width = 920 - margin.left - margin.right,
  height = 630 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);

var y = d3.scaleTime().range([0, height]);

var color = d3.scaleOrdinal(d3.schemeCategory10);

var timeFormat = d3.timeFormat('%M:%S');
var xAxis = d3.axisBottom(x).tickFormat(d3.format('d'));

var yAxis = d3.axisLeft(y).tickFormat(timeFormat);

// Define the div for the tooltip
var div = d3
  .select('body')
  .append('div')
  .attr('class', 'tooltip')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var svg = d3
  .select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'graph')
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json(url)
  .then(data => {
    data.forEach(function (d) {
      d.Place = +d.Place;
      var parsedTime = d.Time.split(':');
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });

    x.domain([
      d3.min(data, function (d) {
        return d.Year - 1;
      }),
      d3.max(data, function (d) {
        return d.Year + 1;
      })
    ]);
    y.domain(
      d3.extent(data, function (d) {
        return d.Time;
      })
    );

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('id', 'x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width)
      .attr('y', -6)
      .style('text-anchor', 'end')
      .text('Year');

    svg
      .append('g')
      .attr('class', 'y axis')
      .attr('id', 'y-axis')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Best Time (minutes)');

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -160)
      .attr('y', -44)
      .style('font-size', 18)
      .text('Time in Minutes');

    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .attr('cx', function (d) {
        return x(d.Year);
      })
      .attr('cy', function (d) {
        return y(d.Time);
      })
      .attr('data-xvalue', function (d) {
        return d.Year;
      })
      .attr('data-yvalue', function (d) {
        return d.Time.toISOString();
      })
      .style('fill', function (d) {
        return color(d.Doping !== '');
      })
      .on('mouseover', function (event, d) {
        div.style('opacity', 0.9);
        div.attr('data-year', d.Year);
        div
          .html(
            d.Name +
              ': ' +
              d.Nationality +
              '<br/>' +
              'Year: ' +
              d.Year +
              ', Time: ' +
              timeFormat(d.Time) +
              (d.Doping ? '<br/><br/>' + d.Doping : '')
          )
          .style('left', event.pageX + 'px')
          .style('top', event.pageY - 28 + 'px');
      })
      .on('mouseout', function () {
        div.style('opacity', 0);
      });

    // title
    svg
      .append('text')
      .attr('id', 'title')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '30px')
      .text('Doping in Professional Bicycle Racing');

    // subtitle
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', 0 - margin.top / 2 + 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '20px')
      .text("35 Fastest times up Alpe d'Huez");

    var legendContainer = svg.append('g').attr('id', 'legend');

    var legend = legendContainer
      .selectAll('#legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend-label')
      .attr('transform', function (d, i) {
        return 'translate(0,' + (height / 2 - i * 20) + ')';
      });

    legend
      .append('rect')
      .attr('x', width - 18)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color);

    legend
      .append('text')
      .attr('x', width - 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'end')
      .text(function (d) {
        if (d) {
          return 'Riders with doping allegations';
        } else {
          return 'No doping allegations';
        }
      });
  })
  .catch(err => console.log(err));
