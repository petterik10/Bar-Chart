// Creating Bar Chart from United States GDP over the years.
// Using D3.js to visualize data with AJAX request and  JSON API.
// Creating the project for freeCodeCamp Data Visualization Certification as a first project. 

const width = 800;
const height = 450;
const padding = 50;

let heightScale;
let xAxisScale;
let yAxisScale;

const svg = d3.select("svg");
svg.attr("viewBox", `0 0 800 450`);

svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -290)
  .attr("y", 70)
  .text("Gross Domestic Product");

svg.append("text").attr("x", 370).attr("y", 435).text("Year");

const tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("visibility", "hidden");

const createScales = (data) => {
  heightScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => {
        return d[1];
      }),
    ])
    .range([0, height - 2 * padding]);

  const datesArray = data.map((item) => {
    return new Date(item[0]);
  });

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data, (d) => {
        return d[1];
      }),
    ])
    .range([height - padding, padding]);
};

const showTooltip = (data) => {
  let showTooltip = document.querySelector("#tooltip");
  let quarterText;
  let quarter = data[0];
  let year = quarter.split("-")[0];
  let splittedQuarter = quarter.split("-")[1];
  let gdp = data[1];
  let gdpString = gdp.toString();

  if (gdpString.length > 5 && gdpString.length < 7) {
    let splittedGdp = gdpString.split("");
    let theFirstNumber = splittedGdp[0];
    let restNumbers = splittedGdp.slice(1).join("");
    gdpString = theFirstNumber + "," + restNumbers;
  } else if (gdpString.length == 7) {
    let splittedGdp = gdpString.split("");
    splittedGdp =
      splittedGdp.slice(0, 2).join("") + "," + splittedGdp.slice(2).join("");
    gdpString = splittedGdp;
  }

  switch (splittedQuarter) {
    case "01":
      quarterText = "Q1";
      break;
    case "04":
      quarterText = "Q2";
      break;
    case "07":
      quarterText = "Q3";
      break;
    case "10":
      quarterText = "Q4";
  }

  showTooltip.innerHTML = `${year} ${quarterText} <br>
                           $${gdpString} Billion`;
};

const drawBars = (data) => {
  const barWidth = (width - 2 * padding) / data.length;

  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("data-date", (date) => {
      return date[0];
    })
    .attr("data-gdp", (gdp) => {
      return gdp[1];
    })
    .attr("height", (d, i) => {
      return heightScale(d[1]);
    })
    .attr("x", (d, i) => {
      return barWidth * i + padding + 1;
    })
    .attr("y", (d, i) => {
      return yAxisScale(d[1]);
    })

    .on("mouseover", (item) => {
      tooltip.transition().style("visibility", "visible");
      showTooltip(item);
      document.querySelector("#tooltip").setAttribute("data-date", item[0]);
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
      tooltip.text("");
    });
};

const createAxes = () => {
  const xAxis = d3.axisBottom(xAxisScale);
  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(0, " + (height - padding) + ")");

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
  

};

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((response) => response.json())
  .then((res) => {
    createScales(res.data);
    drawBars(res.data);
    createAxes();
  });
