import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import useWalk from '@component/stores/walk';
import { CHART_COLORS } from './colors';

function radarX(radius, index, angle) {
  return radius * Math.cos(radarAngle(angle, index));
}

function radarY(radius, index, angle) {
  return radius * Math.sin(radarAngle(angle, index));
}

function radarAngle(angle, index) {
  return angle * index - Math.PI / 2;
}

function scale(index, point) {
  let s = d3.scaleLinear()
    .domain([0, 5])
    .range([0, 0.75 * 5]);
  return s(point);
}

function topAttributes(data, start, end, numAxis) {
  if(start < 0 || start > end || end >= data.attributes[0].steps.length) {
    return "Invalid start or end index";
  }

  let changes = data.attributes.map((attr) => {
    return {
      name: attr.name,
      absChange: Math.abs(attr.steps[end] - attr.steps[start]),
      change: attr.steps[end] - attr.steps[start],
      startValue: attr.steps[start],
      endValue: attr.steps[end]
    }
  });

  changes.sort((a, b) => b.absChange - a.absChange);
  changes = changes.slice(0, numAxis);
  changes.sort((a, b) => b.change - a.change);

  let startOutput = {};
  let endOutput = {};
  let dimensions = [];
  changes.forEach((attr) => {
    startOutput[attr.name] = attr.startValue;
    endOutput[attr.name] = attr.endValue;
    dimensions.push(attr.name);
  })

  return {
    data: [startOutput, endOutput],
    dimensions
  };
}

const generateRadarChart = (ref, walkData, start, end) => {
  const primary = CHART_COLORS.primary;
  const secondary = CHART_COLORS.secondary;

  const width = 600;
  const height = 400;
  const scaleR = 200;
  const radius = (width - scaleR) / 2;

  // Firt filter data
  const { data, dimensions} = topAttributes(walkData, start, end, 8);
  //console.log('start: ', start);
  //console.log('end: ', end);

  /*const dimensions = [
    `${walkData.direction}`, 
    'Male', 
    'Young', 
    'Brown_Hair', 
    'Smiling', 
    'No_Beard',
  ]; //data.columns;*/

  d3.select(ref.current).selectAll("svg").remove();

  // const walk = data.
  // transform csv to json, with walk id as key
  /*data = data.filter(function(d) {
    return d.walk == walk;
  })*/
  //const d = data[0];

  // TODO: later select columns with most impakt
  
  
  // var output = []
  // data[0];
  //data.forEach(function(d) {
  /*data = [0, 9].map(
    (walkNum)=>{
      var obj = {'walk': `${d.walk}_${walkNum}`}
      dimensions.forEach(
        (dimension)=>{
          obj[dimension] = d[`${walkNum}_${dimension}`]
      });
      return obj;
    }
  );*/
  
  /* var obj = { 'walk': '0_' + d.walk, 
              'Smiling': d['0_Smiling'], 
              'Bangs': d['0_Bangs'] 
            };
  output.push(obj);
  obj = { 'walk': '9_' + d.walk, 'Smiling': d['9_Smiling'], 'Bangs': d['9_Bangs'] };
  output.push(obj);
  // });
  */
  
  //const names = dimensions.splice(0, 1)

  const svg = d3
    .select(ref.current)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

  const axisRadius = d3
    .scaleLinear()
    .range([0, radius]);

  const maxAxisRadius = 0.75;
  const textRadius = 0.9;

  // render grid lines
  const numLevels = 5;
  const levelSpace = maxAxisRadius / numLevels;
  let levels = [];

  for (let i = 0; i < numLevels; i++) {
    levels[i] = levelSpace * (i + 1);
  }
    const grid = svg
      .selectAll('.grid')
      .data(dimensions)
      .enter()
      .append("g");

    const radarAxisAngle = Math.PI * 2 / dimensions.length;

    levels.forEach(l =>
      grid.append("line")
        .attr("x1", function (d, i) { return radarX(axisRadius(l), i, radarAxisAngle); })
        .attr("y1", function (d, i) { return radarY(axisRadius(l), i, radarAxisAngle); })
        .attr("x2", function (d, i) { return radarX(axisRadius(l), i + 1, radarAxisAngle); })
        .attr("y2", function (d, i) { return radarY(axisRadius(l), i + 1, radarAxisAngle); })
        .attr("class", "line")
        .attr("stroke", CHART_COLORS.light_grey)
        .attr("stroke-width", 1.5)
    );

    // render labels
    const radarAxes = svg
      .selectAll('.axis')
      .data(dimensions)
      .enter()
      .append('g')
      .attr('class', 'axis')

    radarAxes
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr("x2", function (d, i) { return radarX(axisRadius(maxAxisRadius), i, radarAxisAngle); })
      .attr("y2", function (d, i) { return radarY(axisRadius(maxAxisRadius), i, radarAxisAngle); })
      .attr("class", "line")
      .style("stroke", CHART_COLORS.light_grey)
      .attr("stroke-width", 1.5);

    svg.selectAll('.axisLabel')
      .data(dimensions)
      .enter()
      .append('text')
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", function (d, i) { return radarX(axisRadius(textRadius), i, radarAxisAngle); })
      .attr("y", function (d, i) { return radarY(axisRadius(textRadius), i, radarAxisAngle); })
      .style("font-size", "12px")
      .style("fill", CHART_COLORS.axis)
      .text(function (d, i) { return dimensions[i].replaceAll('_', ' '); });

    // render polylines
    const color = [CHART_COLORS.radar_secondary, CHART_COLORS.radar_primary];
    const data1 = [data[0]];


    svg.selectAll('path')
      .data(data, function (d) { return d[dimensions[0]]; })
      .join(
        enter => enter
          .append('path')
          .attr('d', function (d, i) {
            let path = 'M ';
            dimensions.forEach(function (dim, j) {

              let x1 = radarX(axisRadius(scale(j, d[dim])), j, radarAxisAngle);
              let y1 = radarY(axisRadius(scale(j, d[dim])), j, radarAxisAngle);
              //let x1 = j;
              //let y1 = j;

              path += x1 + ' ' + y1 + ' ';
            })
            path += "Z";
            return path;
          })
          .attr("stroke", function (d, i) { return color[i] })
          .attr("fill", function (d, i) { return color[i] })
          //.attr("fill", "none")
          .attr('fill-opacity', 0.1)
          .attr("stroke-width", 3)
      );

  }



const RadarChart = () => {
  const chartRef = useRef();
  const legendRef = useRef();

  const walkData = useWalk(state=>state.walkData);
  const start = useWalk(state=>state.start);
  const end = useWalk(state=>state.end);

  useEffect(() => {
    if (walkData) {
      generateRadarChart(chartRef, walkData, start, end)
    }
  }); 

  return (
    <svg viewBox={"0 0 " + 600 + " " + 400} ref={chartRef} />
  );
};

export default RadarChart;

