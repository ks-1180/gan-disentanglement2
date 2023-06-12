import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const generateLineChart = (ref, data, slopes, attribute) => {
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

    const margin = { top: 40, right: 10, bottom: 0, left: 10 };
    const width = container.node().clientWidth;
    const height = container.node().clientHeight;

    // line chart settings
    const lineChartWidth = width * 0.6 - margin.left - margin.right;
    const innerWidth = lineChartWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // bar chart settings
    const barChartWidth = width * 0.4 - margin.left - margin.right;
    const barChartHeight = innerHeight;

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
        .range([margin.left, lineChartWidth]);

    const yValues = flattenWalks.map((d) => d.value);
    const yScale = d3
        .scaleLinear()
        .domain([-1, 1])
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

    // generate Bar Chart

    const transposedData = d3.transpose(walks.map((walk) => walk.map((d) => d.value)));
    const meanValues = transposedData.map((column) => d3.mean(column));
    console.log('means: ',meanValues);

    const xBarScale = d3
        .scaleBand()
        .domain(d3.range(meanValues.length))
        .range([0, barChartWidth])
        .padding(0.2);

    const yBarScale = d3
        .scaleLinear()
        .domain([-1, 1])
        .range([barChartHeight, 0]);

    const barChartContainer = svg
        .append('g')
        .attr('class', 'bar-chart-container')
        .attr('transform', `translate(${lineChartWidth}, 0)`);
    
    barChartContainer
        .selectAll('rect')
        .data(meanValues)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xBarScale(i))
        .attr("y", d => d > 0 ? yBarScale(d) : yBarScale(0)) 
        .attr("height", d => Math.abs(yBarScale(d) - yBarScale(0)))
        .attr("width", xBarScale.bandwidth())
        .attr('fill', (d) => (d > 0 ? '#009688' : '#d4d4d4'));


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
    const [slopes, setSlopes] = useState([]);
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

        const path2 = `/regression/${direction.value}.csv`
        d3.csv(path2).then((slopes) => {
            setSlopes(slopes);
            setIsDataLoaded(true);
        });
        
    }, [direction]);

    return (
        <svg viewBox={'0 0' + 1200 + " " + 400} ref={chartRef}/>
    );
};
