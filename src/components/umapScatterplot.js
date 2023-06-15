import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import useWalks from "@component/stores/walks";
import { CHART_COLORS } from "./colors";

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

const generateScatterplot = (ref, walks, selectedWalks, setSelectedWalks) => {

    const primary = CHART_COLORS.primary;
    const secondary = CHART_COLORS.secondary;

    const margin = { top: 15, right: 60, bottom: 30, left: 40 };
    const width = 600 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(ref.current).selectAll("svg").remove();

    const minX = d3.min(walks, d => +d['umap'][0]);
    const maxX = d3.max(walks, d => +d['umap'][0]);

    const minY = d3.min(walks, d => +d['umap'][1]);
    const maxY = d3.max(walks, d => +d['umap'][1]);

    // create scales for the x and y axes
    const xScale = d3
        .scaleLinear()
        .domain([minX-(maxX-minX)*0.1, maxX+(maxX-minX)*0.1])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([minY-(maxY-minY)*0.1, maxY+(maxY-minY)*0.1])
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
            .attr('fill', d => (newSelectedWalks.includes(d.walk) ? primary : secondary));

        d3.select(event.currentTarget)
            .attr('fill', primary)
    }

    const brush = d3.brush()
        .extent([[0, 0], [width, height]])
        .on("end", function handleBrush(event) {
            if (!event.selection) {
                setSelectedWalks([]);
            } else {
                const [[x1, y1], [x2, y2]] = event.selection;
                const selected = walks.filter(d => {
                    const dx = xScale(d['umap'][0]), dy = yScale(d['umap'][1]);
                    return x1 <= dx && dx <= x2 && y1 <= dy && dy <= y2;
                }).map(d => d.walk);
                setSelectedWalks(selected);
            }
            // update the fill of circles
            g.selectAll('.scatterplot-circle')
                .attr('fill', d => selectedWalks.includes(d.walk) ? primary : secondary);
        });

    g.append("g")
        .attr("class", "brush")
        .call(brush);

    // add circles after brush to still enable clicking event
    g
        .selectAll("circle")
        .data(walks)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(+d['umap'][0]))
        .attr("cy", (d) => yScale(+d['umap'][1]))
        .attr("r", 4)
        .attr("fill", (d) => (selectedWalks.includes(d.walk) ? primary : secondary)) // Change fill color based on condition
        .on("click", handleClick)
        .attr("class", "scatterplot-circle");
};

const Scatterplot = () => {
    const chartRef = useRef();

    const walks = useWalks(state => state.walks);
    const selectedWalks = useWalks(state => state.selectedWalks);
    const setSelectedWalks = useWalks(state => state.setSelectedWalks);

    useEffect(() => {
        if (walks) {
            generateScatterplot(chartRef, walks, selectedWalks, setSelectedWalks);
        }
    }, [walks, selectedWalks]);

    return (
        <>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Typography variant="h6" component="div" style={{flexGrow: 1, textAlign: 'center'}}>Umap</Typography>
                <HtmlTooltip
                    title={
                    <>
                        <Typography color="primary">UMAP Explanation</Typography>
                        {/* your explanation goes here */}
                        UMAP is a dimension reduction technique often used in data visualization.
                    </>
                    }
                >
                    <IconButton>
                        <HelpOutlineIcon/>
                    </IconButton>
                </HtmlTooltip>
            </div>
            <svg
                viewBox={"0 0 " + 600 + " " + 400}
                ref={chartRef}
            />
        </>
    );
};
export default Scatterplot;