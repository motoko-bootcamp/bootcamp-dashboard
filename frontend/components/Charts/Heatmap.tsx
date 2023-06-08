import React, { useEffect } from "react"
import colors from "../../constants/colors"
import * as d3 from "d3"
import "./_heatmap.scss"
import { useAdminDataStore } from "../../store/adminDataStore"

const Heatmap: React.FC = () => {
  useEffect(() => {
    createHeatmap()
  }, [])

  const createHeatmap = () => {
    const data = generateDummyData()
    const cellSize = 1000
    const width = 1000
    const height = 500

    const svg = d3
      .select("#heatmap")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const xScale = d3
      .scaleBand()
      .domain(d3.range(data[0].length))
      .range([0, width])

    const yScale = d3
      .scaleBand()
      .domain(d3.range(data.length))
      .range([0, height])

    const colorScale = d3
      .scaleSequential((t) =>
        d3.interpolateRgbBasis([colors.secondaryColor, colors.primaryColor])(t),
      )
      .domain([0, 30])

    svg
      .selectAll("rect")
      .data(data.flat())
      .enter()
      .append("rect")
      .attr("x", (d, i) => xScale(i % data[0].length))
      .attr("y", (d, i) => yScale(Math.floor(i / data[0].length)))
      .attr("width", cellSize)
      .attr("height", cellSize)
      .attr("fill", (d) => colorScale(d.days))

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .select(".domain")
      .remove()

    svg
      .append("g")
      .call(d3.axisLeft(yScale).tickSize(0))
      .select(".domain")
      .remove()
  }

  const generateDummyData = () => {
    const numRows = 25
    const numCols = 40
    const data = []

    for (let i = 0; i < numRows; i++) {
      const row = []
      for (let j = 0; j < numCols; j++) {
        row.push({
          days: Math.floor(Math.random() * 31),
        })
      }
      data.push(row)
    }

    return data
  }

  return (
    <div>
      <h2>Student Heatmap</h2>
      <div className="heatmap" id="heatmap" />
    </div>
  )
}

export default Heatmap
