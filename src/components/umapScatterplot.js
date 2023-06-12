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
    console.log(data);
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
        console.log("Click:", d)
        setSelectedWalks([d.walk]);

        svg
            .selectAll('.scatterplot-circle')
            .attr('fill', "#009688");

        d3.select(event.currentTarget)
            .attr('fill', "#f44336");

        
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
        .attr("class", "scatterplot-circle")
        //.on("click", handleClick);

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
            d3.select(this).attr('pointer-events', 'none');
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
            if (rectWidth < 10 && rectHeight < 10) {
                // This was a click, not a drag. Handle it here
                const [mouseX, mouseY] = d3.pointer(event);
                const elements = document.elementsFromPoint(mouseX, mouseY);
                for(let i = 0; i < elements.length; i++){
                    let clickedData = d3.select(elements[i]).data()[0];
                    if(clickedData){
                        handleClick(event, clickedData);
                        break;
                    }
                }
            } else {
                // This was a drag. Handle the selection here
                const selected = data.filter(d => {
                    const [x, y] = [xScale(+d.x), yScale(+d.y)];
                    return rectStartX <= x && x <= rectStartX + rectWidth && rectStartY <= y && y <= rectStartY + rectHeight;
                });
        
                setSelectedWalks(selected.map(d => d.walk));
        
                svg.selectAll('.scatterplot-circle')
                    .attr('fill', d => (selected.includes(d) ? "#f44336" : "#009688"));
        
                console.log("Selected", selected); // TODO: do something with the selection
            }
            d3.select(this).attr('pointer-events', null);
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
        console.log('umap: ', direction.value)
        setIsDataLoaded(false);
        const localData = localStorage.getItem(direction.value);
        console.log('localData', localData);
        if (false) {
            setData(JSON.parse(localData));
            setIsDataLoaded(true);
        } else {
            const path = `/umap/${direction.value}.csv`;
            console.log(path);
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