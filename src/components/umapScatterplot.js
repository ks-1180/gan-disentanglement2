import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { csv } from "d3-fetch"
import Paper from "@mui/material/Paper";




const generateScatterplot = (ref, data, walk, handleClick) => {
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
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(+d.x))
        .attr("cy", (d) => yScale(+d.y))
        .attr("r", 4)
        .attr("fill", (d) => (d.walk === walk ? "#f44336" : "#009688")) // Change fill color based on condition
        .on("click", handleClick)
        .attr("class", "scatterplot-circle");

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

    svg.append("g").call(yAxis);
};

const Scatterplot = ({direction, walk, setWalk}) => {
    const chartRef = useRef();

    const [data, setData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const handleClick = (event, d) => {
      // your code to handle click event
      console.log("Click:", d);
      setWalk(d.walk);
    };

    useEffect(() => {
        generateScatterplot(chartRef, data, walk, handleClick);
    }, [data, walk]);

    useEffect(() => {
        console.log('umap: ', direction.value)
        const localData = localStorage.getItem(direction.value);
        setIsDataLoaded(false);
        if (localData == null) {
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