import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { csv } from "d3-fetch"
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import useWalk from "@component/stores/walk";
import useWalks from "@component/stores/walks";

const generateScatterplot = (ref, walks, selectedWalks) => {
    const margin = { top: 20, right: 60, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll("svg").remove();

    let data = [];
    // Iterate over each object in the array
    walks.forEach(item => {
        let walk = item.walk;
        // Further iterate over the 'attributes' array inside each object
        item.attributes.forEach(attr => {
            let newObject = {
                'walk': walk,
                'slope': attr.slope,
                'intercept': attr.intercept,
                'r2': attr.r2
            };
            data.push(newObject);
        });
    });
    console.log(data);


    // create scales for the x and.slope axes
    const minX = d3.min(data, d => +d.r2);
    const maxX = d3.max(data, d => +d.r2);

    const minY = d3.min(data, d => +d.slope);
    const maxY = d3.max(data, d => +d.slope);

    const xScale = d3
        .scaleLinear()
        .domain([minX-(maxX-minX)*0.1, maxX+(maxX-minX)*0.1])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([minY-(maxY-minY)*0.1, maxY+(maxY-minY)*0.1])
        .range([height, 0]);

    // create the x and.slope axes
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
        .attr("cx", (d) => xScale(+d.r2))
        .attr("cy", (d) => yScale(+d.slope))
        .attr("r", 3)
        .attr("fill", (d) => (selectedWalks.includes(d.walk) ? "#f44336" : "#009688")) // Change fill color based on condition
        .attr("opacity", 0.5)
        .attr("class", "scatterplot-circle");

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

    svg.append("g").call(yAxis);
};

const RegressionScatterplot = () => {
    const chartRef = useRef();

    const walks = useWalks(state => state.walks);
    const selectedWalks = useWalks(state => state.selectedWalks);

    // const [data, setData] = useState([]);
    // const [isDataLoaded, setIsDataLoaded] = useState(false);

    const handleClick = (event, d) => {
        // your code to handle click event
        // setWalk(d.walk);
    };

    useEffect(() => {
        generateScatterplot(chartRef, walks, selectedWalks);
    }, [walks, selectedWalks]);

    return (
        <>
            <Card
                sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <CardContent sx={{ flexGrow: 1 }}>
                    <svg
                        viewBox={"0 0 " + 600 + " " + 400}
                        ref={chartRef} />
                </CardContent>
            </Card>
        </>
    );
};
export default RegressionScatterplot;