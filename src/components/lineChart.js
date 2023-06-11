import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const generateLineChart = (ref, data, attribute) => {
    const walks = data.map((row) => {
        const walk = [];
        Object.keys(row).forEach((key) => {
            if (key.includes(attribute)) {
                walk.push({time: key.split('_')[0], value: row[key]});
            }
        });
        return walk;
    });

    const flattenWalks = walks.flat();

    console.log('here comes the line data:', walks)
    console.log('one walk: ', walks[0])

    const container = d3.select(ref.current)

    container.select('svg').remove();

    const width = container.node().clientWidth;
    const height = container.node().clientHeight;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = container
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // add title
    svg
        .append('text')
        .attr('x', margin.left)
        .attr('y', margin.top / 2)
        .text(attribute.replaceAll('_', ' '))
        .attr('font-size', '12px');


    const xScale = d3
        .scaleLinear()
        .domain([0, 9])
        .range([margin.left, innerWidth]);

    const yValues = flattenWalks.map((d) => d.value);
    const yScale = d3
        .scaleLinear()
        .domain([0, 1])
        .range([innerHeight, margin.top]);

    /* svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale)); */

    const line = d3
        .line()
        .x((d, i) => xScale(i))
        .y((d, i) => yScale(d.value));


    walks.slice(0, 50).forEach((walk) => {
        svg
            .append('path')
            .datum(walk)
            .attr('fill', 'none')
            .attr('stroke', 'grey')
            .attr('stroke-width', 0.5)
            .attr('d', line);
    });

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

export function LineChart({direction, attribute}) {
    const chartRef = useRef();

    const [data, setData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState([false]);

    // generate line chart after data is loaded
    useEffect(() => {
        if(isDataLoaded == true) {
            console.log("data: ",data);
            generateLineChart(chartRef, data, attribute);
        }
    }, [data, attribute]);

    useEffect(() => {
        console.log("direction", direction.value);
        const path = `/radar/${direction.value}.csv`;
        d3.csv(path).then((data) => {
            setData(data);
            console.log("my data;", data)
            setIsDataLoaded(true);

        });
        
    }, [direction]);

    return (
        <svg viewBox={'0 0' + 600 + " " + 400} ref={chartRef}/>
    );
};
