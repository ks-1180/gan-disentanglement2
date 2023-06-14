import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const generateScatterplot = (ref, data, selectedWalks, setSelectedWalks) => {
    const margin = { top: 20, right: 60, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll("svg").remove();

    // create scales for the x and y axes
    const xScale = d3
        .scaleLinear()
        .domain([d3.min(data, d => +d.x), d3.max(data, d => +d.x)])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
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

    g.append("g").attr("transform", `translate(0,${height})`).call(xAxis);
    g.append("g").call(yAxis);

    // click event listener
    const handleClick = (event, d) => {
        const newSelectedWalks = [d.walk];
        setSelectedWalks(newSelectedWalks);
        
        svg
            .selectAll('.scatterplot-circle')
            .attr('fill', d => (newSelectedWalks.includes(d.walk) ? "#f44336" : "#009688"));
        
        d3.select(event.currentTarget)
            .attr('fill', "#f44336")
    }    

    const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("end", function handleBrush(event) {
            if (!event.selection) {
                setSelectedWalks([1]);
            } else {
                const [[x1, y1], [x2, y2]] = event.selection;
                const selected = data.filter(d => {
                    const dx = xScale(d.x), dy = yScale(d.y);
                    return x1 <= dx && dx <= x2 && y1 <= dy && dy <= y2;
                }).map(d => d.walk);
                
                setSelectedWalks(selected);
            }
            // update the fill of circles
            g.selectAll('.scatterplot-circle')
                .attr('fill', d => selectedWalks.includes(d.walk) ? "#f44336" : "#009688");
        });

    g.append("g")
        .attr("class", "brush")
        .call(brush);

    // add circles after brush to still enable clicking event
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

        const path = `/umap/${direction.value}.csv`;
        d3.csv(path).then((data) => {
            setData(data);
            setIsDataLoaded(true);
            localStorage.setItem(direction.value, JSON.stringify(data));
        });
       
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