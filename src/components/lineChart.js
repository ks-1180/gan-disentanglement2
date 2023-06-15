import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import useWalks from '@component/stores/walks';

const generateLineChart = (ref, data, attribute, selectedWalks) => {
    

    let slopesValues = [];
    const walks = data.map((obj) => {
        let attrObj = obj.attributes.find(attr => attr.name === attribute);
        if (attrObj) {
            slopesValues.push(+attrObj.slope);
            return attrObj.steps;
        } else {
            return [];
        }
    });

    let selectedWalksData = walks;

    if (selectedWalks.length > 0) {
        selectedWalksData = selectedWalks.map((index) => walks[index]);
        slopesValues = selectedWalks.map((index)=>slopesValues[index]);
    }
        

    const flattenWalks = selectedWalksData.flat();

    const container = d3.select(ref.current)

    container.select('svg').remove();

    const margin = { top: 40, right: 40, bottom: 0, left: 10 };
    const width = container.node().clientWidth - margin.right;
    const height = container.node().clientHeight;

    // line chart settings
    const lineChartWidth = width * 0.7 - margin.left;
    const innerWidth = lineChartWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // bar chart settings
    const barChartWidth = width * 0.3 - margin.left;
    const barChartHeight = height;

    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // add border
    svg
        .append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('stroke', 'grey')
        .attr('stroke-width', 1);

    // add title
    svg
        .append('text')
        .attr('x', margin.left)
        .attr('y', margin.top / 2)
        .text(attribute.replaceAll('_', ' '))
        .attr('font-size', '12px');


    const xScale = d3
        .scaleLinear()
        .domain([0, 99])
        .range([margin.left, lineChartWidth]);

    const yValues = flattenWalks.map((d) => d);
    const yScale = d3
        .scaleLinear()
        .domain([-1, 1])
        .range([180, margin.top]);

    /* svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale)); */

    const line = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d, i) => yScale(d));


    selectedWalksData.slice(0, 100).forEach((walk) => {
        svg
            .append('path')
            .datum(walk)
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('stroke-width', 0.5)
            .attr('d', line);
    });

    // generate Bar Chart

    const extent = d3.extent(slopesValues);
    const maxAbsVal = Math.max(Math.abs(extent[0]), Math.abs(extent[1]));

    const thresholds = d3.range(-4, 5, 1).map(d => d * maxAbsVal / 4);

    const bins = d3.bin()
        .domain([-maxAbsVal, maxAbsVal])
        .thresholds(thresholds)(slopesValues);

    const xBarScale = d3
        .scaleLinear()
        .domain([-maxAbsVal, maxAbsVal])
        .range([0, barChartWidth]);

    const yBarScale = d3
        .scaleLinear()
        //.domain([-1, 1])
        .domain([0, d3.max(bins, d => d.length)])
        .range([barChartHeight, margin.top]);

    const barChartContainer = svg
        .append('g')
        .attr('class', 'bar-chart-container')
        .attr('transform', `translate(${lineChartWidth + margin.left}, 0)`);
    
    barChartContainer
        .selectAll('rect')
        .data(bins)
        .enter()
        .append("rect")
        .attr("x", d => xBarScale(d.x0))
        .attr("y", d => yBarScale(d.length)) 
        .attr("height", d => barChartHeight - yBarScale(d.length))
        .attr("width", d => xBarScale(d.x1) - xBarScale(d.x0) - 1)
        .attr('fill', d => (d.x0 >= 0 ? '#009688' : '#d4d4d4'));

    svg.append("line")
        .attr("x1", lineChartWidth)  // x position of the first end of the line
        .attr("y1", 0)  // y position of the first end of the line
        .attr("x2", lineChartWidth)  // x position of the second end of the line
        .attr("y2", height)    // y position of the second end of the line
        .attr("stroke-width", 1)
        .attr("stroke", "#d4d4d4");

    /*const walk = [
        { time: 0, value: 3.182290674885735e-05 },
        { time: 1, value: 1.7956683362463366e-10 },
        { time: 2, value: 0.014266058802604675 },
        { time: 3, value: 0.09211558848619461 },
        { time: 4, value: 6.395691161742434e-05 }
    ];
    svg
        .append('path')
        .datum(walk)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line)*/

    // show x-axis
    /*svg.append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale))*/
}

export function LineChart({attribute}) {
    const chartRef = useRef();
    const walks = useWalks(state=>state.walks);
    const selectedWalks = useWalks(state=>state.selectedWalks);

    console.log('walks: ', walks);
    console.log('selected walks: ', selectedWalks);

    // generate line chart after data is loaded
    useEffect(() => {
        generateLineChart(chartRef, walks, attribute, selectedWalks);
    }, [walks, attribute, selectedWalks]);

    // useEffect(() => {
    //     const path = `/radar/${direction.value}.csv`;
    //     d3.csv(path).then((data) => {
    //         setData(data);
    //         setIsDataLoaded(true);
    //     });

    //     const path2 = `/regression/${attribute}.csv`
    //     d3.csv(path2).then((slopes) => {
    //         setSlopes(slopes);
    //         setIsDataLoaded(true);
    //     });
    //     
    // }, [direction]);


    return (
        <svg viewBox={'0 0' + 800 + " " + 400} style={{width: '300px', height: '110px'}} ref={chartRef}/>
    );
};
