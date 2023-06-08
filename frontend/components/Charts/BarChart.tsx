import React, { useRef, useEffect } from "react"
import * as d3 from "d3"
import "./_barChart.scss"

interface BarChartProps {
  totalUsers: number
  totalTeams: number
  totalProjectsCompleted: number
}

const BarChart: React.FC<BarChartProps> = ({
  totalUsers,
  totalTeams,
  totalProjectsCompleted,
}) => {
  const data = [
    { label: "Total Users", value: totalUsers },
    // { label: "Total Teams", value: totalTeams },
    { label: "Total Days Completed", value: totalProjectsCompleted },
  ]

  const width = 500
  const height = 300
  const margin = { top: 20, right: 20, bottom: 50, left: 50 }

  const xScale = d3
    .scaleBand()
    .domain(data.map((d) => d.label))
    .range([margin.left, width - margin.right])
    .padding(0.1)

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .nice()
    .range([height - margin.bottom, margin.top])

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0))

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale))
      .call((g) => g.select(".domain").remove())

  const xAxisRef = useRef<SVGGElement | null>(null)
  const yAxisRef = useRef<SVGGElement | null>(null)

  useEffect(() => {
    if (xAxisRef.current) {
      d3.select(xAxisRef.current).call(xAxis)
    }
    if (yAxisRef.current) {
      d3.select(yAxisRef.current).call(yAxis)
    }
  }, [xAxisRef, yAxisRef, xAxis, yAxis])

  return (
    <div className="bar-chart">
      <svg width={width} height={height}>
        {data.map((d) => (
          <rect
            key={d.label}
            x={xScale(d.label)}
            y={yScale(d.value)}
            width={xScale.bandwidth()}
            height={yScale(0) - yScale(d.value)}
            fill="steelblue"
          />
        ))}
        <g
          ref={xAxisRef}
          transform={`translate(0,${height - margin.bottom})`}
        />
        <g ref={yAxisRef} transform={`translate(${margin.left},0)`} />
      </svg>
    </div>
  )
}

export default BarChart
