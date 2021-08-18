import React, { useEffect, useRef } from "react";
import { select, extent, scaleTime, scaleLinear, max, line } from "d3";
interface ITrendLineProp {
  width?: number;
  height?: number;
  data?: any[];
}

function TrendLine({ width, height, data }: ITrendLineProp) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!width || !height || !data || !data.length) return;
    select(svgRef.current).selectAll("*").remove();
    const svg = select(svgRef.current).append("g");
    const visData: any[] = data
      .sort((a, b) => Number(a.time) - Number(b.time))
      .map((e) => ({ ...e, time: new Date(e.time).getTime() }));

    // Add X axis --> it is a date format
    const x = scaleTime()
      .domain(extent(visData, (d) => d.time))
      .range([0, width]);
    // Add Y axis
    const maxY = max(visData, (d) => +d.volume) || 0;
    const y = scaleLinear()
      .domain([0, maxY + maxY * 0.2])
      .range([height, 0]);

    const path = line()
      .x((d: any) => x(d.time))
      .y((d: any) => y(d.volume));

    svg
      .append("path")
      .datum(visData)
      .style(
        "stroke",
        visData[0].volume > visData[visData.length - 1].volume
          ? "#FA4D56"
          : "#42BE65"
      )
      .style("stroke-width", 1.5)
      .attr("fill", "none")
      .attr("d", path);
  }, [width, height, data]);

  return <svg width={width} height={height} ref={svgRef}></svg>;
}

export default TrendLine;
