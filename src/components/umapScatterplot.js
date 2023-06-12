import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { csv } from "d3-fetch"
import Paper from "@mui/material/Paper";




const generateScatterplot = (ref, data, selectedWalks, setSelectedWalks) => {
    const margin = { top: 20, right: 60, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll("svg").remove();

    // create scales for the x and y axes
    const xScale = d3
        .scaleLinear()
        //.domain([0, d3.max(data, (d) => d[0])])
        //.range([0, width]);
        .domain([d3.min(data, d => +d.x), d3.max(data, d => +d.x)])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        //.domain([0, d3.max(data, (d) => d[1])])
        //.range([height, 0]);
        .domain([d3.min(data, d => +d.y), d3.max(data, d => +d.y)])
        .range([height, 0]);

    // create the x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // create the scatterplot
    const svg = d3
        .select(ref.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        
    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // click event listener
    const handleClick = (event, d) => {
        // reset selection and add current walk
        setSelectedWalks([d.walk]);

        // color reset
        svg
            .selectAll('.scatterplot-circle')
            .attr('fill', d => (selectedWalks.includes(d.walk) ? "#f44336" : "#009688"));
        
        //TODO: check if needed
        d3.select(event.currentTarget)
            .attr('fill', "#f44336")

        console.log("Click:", d)
    }

    // add circles
    g
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(+d.x))
        .attr("cy", (d) => yScale(+d.y))
        .attr("r", 4)
        .attr("fill", (d) => (selectedWalks.includes(d.walk) ? "#f44336" : "#009688")) // Change fill color based on condition
        .on("click", handleClick)
        .attr("class", "scatterplot-circle");

    g.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

    g.append("g").call(yAxis);

    // create selection 
    const walkSelection = g
        .append('g')
        .attr('class', 'selection')

    g.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent");

        const drag = d3.drag()
        .on('start', function(event) {
            console.log("start")
            const [x, y] = d3.pointer(event, g.node());
            walkSelection.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', 0)
                .attr('height', 0)
                .attr('class', 'selection-rect')
                .style('fill', 'none')
                .style('stroke', '#d4d4d4')
                .style('stroke-width', '2px');
        })
        .on('drag', function(event) {
            const rect = walkSelection.select('.selection-rect');
            const [startX, startY] = [+rect.attr('x'), +rect.attr('y')];
            const [currentX, currentY] = d3.pointer(event, g.node());
            const [newX, newY] = [Math.min(startX, currentX), Math.min(startY, currentY)];
            const [newWidth, newHeight] = [Math.abs(startX - currentX), Math.abs(startY - currentY)];
            rect.attr('x', newX)
                .attr('y', newY)
                .attr('width', newWidth)
                .attr('height', newHeight);
        })
        .on('end', function(event) {
            const rect = walkSelection.select('.selection-rect');
            const [rectStartX, rectStartY, rectWidth, rectHeight] = [+rect.attr('x'), +rect.attr('y'), +rect.attr('width'), +rect.attr('height')];
            rect.remove();
    
            // If there was no movement in 'drag', this was a click
            if (rectWidth === 0 && rectHeight === 0) {
                const [x, y] = [rectStartX, rectStartY];
                const clickedData = data.find(d => {
                    const [px, py] = [xScale(+d.x), yScale(+d.y)];
                    return Math.hypot(px - x, py - y) <= 4;  // 4 is the circle radius
                });
    
                if (clickedData) {
                    handleClick(event, clickedData);
                }
            } else {
                const selected = data.filter(d => {
                    const [x, y] = [xScale(+d.x), yScale(+d.y)];
                    return rectStartX <= x && x <= rectStartX + rectWidth && rectStartY <= y && y <= rectStartY + rectHeight;
                });
    
                if (!selected.length) {
                    setSelectedWalks([1]);
                } else {
                    setSelectedWalks(selected.map(d => d.walk));
                }
    
                svg.selectAll('.scatterplot-circle')
                    .attr('fill', d => (selectedWalks.includes(d.walk) ? "#f44336" : "#009688"));
    
                console.log("Selected", selected); // TODO: do something with the selection
            }
        });
    
    svg.call(drag);
};

const Scatterplot = ({direction, selectedWalks, setSelectedWalks}) => {
    const chartRef = useRef();

    const [data, setData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    useEffect(() => {
        generateScatterplot(chartRef, data, selectedWalks, setSelectedWalks);
    }, [data, selectedWalks]);

    useEffect(() => {
        setIsDataLoaded(false);
        const localData = localStorage.getItem(direction.value);
        if (false) {
            setData(JSON.parse(localData));
            setIsDataLoaded(true);
        } else {
            const path = `/umap/${direction.value}.csv`;
            d3.csv(path).then((data) => {
                setData(data);
                setIsDataLoaded(true);
                localStorage.setItem(direction.value, JSON.stringify(data));
            });
        }
        setIsDataLoaded(true);
    }, [direction]);
// Receding_Hairline.csv
// Receding_Hairline
    return (
        <>
            {isDataLoaded ? (
                <svg
                viewBox={"0 0 " + 600 + " " + 400}
                ref={chartRef} />
            ):(
                <div>Loading data ...</div>
            )}
        </>
    );
};
export default Scatterplot;