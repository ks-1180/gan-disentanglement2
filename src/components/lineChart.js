import React, { useRef, useEffect, useState } from 'react';

const generateLineChart = (ref, data, attribute) => {
    
}

const LineChart = ({direction, attribute}) => {
    const chartRef = useRef();

    const [data, setData] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState([false]);
    const [isDataStored, setIsDataStored] = useState([false]);

    // generate line chart after data is loaded
    useEffect(() => {
        if(isDataLoaded == true) {
            console.log(data);
            generateLineChart(chartRef, data, attribute);
        }
    }, [data, attribute]);

    useEffect(() => {
        console.log("line: ", attribute)
        const localData = localStorage.getItem(direction.value);
    
        if (isDataStored) {
            setData(JSON.parse(localData));
            setIsDataLoaded(true);
        } else {
            const path = `/radar/${direction.value}.csv`;
            d3.csv(path).then((data) => {
                setData(data);
                setIsDataLoaded(true);
                setIsDataStored(true);
                localStorage.setItem(direction.value, JSON.stringify(data))
            }, [attribute]);
        }
    });

    return (
        <svg viewBox={'0 0' + 600 + " " + 400} ref={chartRef}/>
    );
};

export default LineChart;