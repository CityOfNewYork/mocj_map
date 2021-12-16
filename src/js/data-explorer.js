/**
 * domainDataBuilder
 *   drawChartsFromSubdomainData
 *     filterData
 *       drawChartAdmin
 *       drawChartCensus
 *       drawChartSurvey
 *
 * https://developers.google.com/chart/interactive/docs/reference
 * https://developers.google.com/chart/interactive/docs/gallery/linechart
 */

// TODO function to fetch the CSV file when user selects the Domain dropdown
// const domainDropdown = document.getElementById("domain-dropdown");

const communityDropdown = document.getElementById("community-dropdown");
const domainClicked = document.querySelectorAll(".sub-domain-option");
const communityTitle = document.getElementById("community-title");
const raceData = document.getElementById("race-data");
const ageData = document.getElementById("age-data");
const dataRenderDiv = document.getElementById("data-render");
const dataContainer = document.getElementById("data-container");
const chartContainer = document.getElementById("chart-container");
const dropdownPlaceholder = document.getElementById("dropdown-placeholder");
const collapseSubDomainDropdown = document.getElementById("collapseOne");
const adminChartContainer = document.getElementById("admin-container");
const censusChartContainer = document.getElementById("census-container");
const surveyChartContainer = document.getElementById("survey-container");
const adminChartGraphContainer = document.getElementById("admin-chart");
const censusChartGraphContainer = document.getElementById("census-chart");
const surveyChartGraphContainer = document.getElementById("survey-chart");
const boroughMap = document.getElementById("borough-map");

const demographyDataFile = dataContainer.dataset.demography;
const communityDataFile = dataContainer.dataset.community;

let citywideData = [];

let selectedDomain = "";
let selectedCommunity = "";

// google.charts.load("current", { packages: ["corechart", "line", "bar"] });

// The SubdomainObject class
// This contains the data, the id, and the type of data (admin, census, or
// survey)
class SubdomainObject {
  constructor(data, id, type, source) {
    this.data = data; // An array of indexed data objects
    this.id = id; // An indicator ID
    this.type = type; // The type of data: admin, survey, census
    this.source = source; // The source reference, e.g. "311Complaints"
  }
}

// Update community data on Community dropdown selected
communityDropdown.addEventListener("change", (e) => {
  selectedDomain = communityDropdown.options[communityDropdown.selectedIndex].text;
  selectedCommunity = communityDropdown.options[communityDropdown.selectedIndex].value;
  removeDemographyData();
  renderDemographyData(communityDropdown.value);
  communityTitle.innerText = selectedDomain;
  dataRenderDiv.style.display = "flex";
  dataContainer.style.display = "flex";
  boroughMap.setAttribute("class", "");
  boroughMap.classList.add("community-" + selectedCommunity);
});

// Render Community population data
const renderDemographyData = async (smart_site) => {
  const data = await fetchTextFile(demographyDataFile);
  const demographyData = data.split("\n").splice(1);
  let filteredDemographyData = [];
  demographyData.forEach(value => {
    const row = value.split(",");
    const value_smart_site = `"${smart_site}"`;
    const cleanedValue = row.map(str => str.replace(/["]+/g, ""));
    if (row[0] === value_smart_site && value !== "") {
      filteredDemographyData.push(cleanedValue);
    }
  });

  // Total population
  const totalPopulation = document.getElementById("total-population");
  totalPopulation.innerText = filteredDemographyData[0][6];

  // Sex/Gender population
  const femalePercentage = document.getElementById("female-percentage");
  const malePercentage = document.getElementById("male-percentage");
  femalePercentage.innerText = filteredDemographyData[1][6] + "%";
  malePercentage.innerText = filteredDemographyData[2][6] + "%";

  // Race/Ethnicity population
  const raceDataDiv = document.createElement("div");
  raceDataDiv.setAttribute("id", "race-population");

  if (raceDataDiv.hasChildNodes()) {
    raceDataDiv.remove();
  }
  filteredDemographyData.forEach(item => {
    if (item[3] === "Race/ethnicity") {
      raceDataDiv.appendChild(createChildElementData(item));
    }
  });
  raceData.append(raceDataDiv);

  // Age Group population
  let ageDataDiv = document.createElement("div");
  ageDataDiv.setAttribute("id", "age-population");
  if (ageData.childNodes.length > 1) {
    ageDataDiv.remove();
    ageDataDiv = document.createElement("div");
  }
  filteredDemographyData.forEach(item => {
    if (item[3] === "Age Group") {
      ageDataDiv.appendChild(createChildElementData(item));
    }
  });
  ageData.append(ageDataDiv);
};

function removeDemographyData() {
  if (document.getElementById("race-population")) {
    const totalPopulation = document.getElementById("total-population");
    const femalePercentage = document.getElementById("female-percentage");
    const malePercentage = document.getElementById("male-percentage");
    const racePopulation = document.getElementById("race-population");
    const agePopulation = document.getElementById("age-population");
    totalPopulation.innerText = "";
    femalePercentage.innerText = "";
    malePercentage.innerText = "";
    communityTitle.innerText = "";
    racePopulation.remove();
    agePopulation.remove();
  }
}

const createChildElementData = dataArray => {
  const dataChildContainer = document.createElement("div");
  const dataPercentageElem = document.createElement("p");
  const dataTitleElem = document.createElement("p");
  dataPercentageElem.innerText = dataArray[6] + "%";
  dataPercentageElem.classList.add("data-explorer__demo-data-cell-label");
  dataTitleElem.innerText = dataArray[4];
  dataChildContainer.appendChild(dataPercentageElem);
  dataChildContainer.appendChild(dataTitleElem);
  dataChildContainer.setAttribute("class", "data-explorer__demo-data-cell");
  dataTitleElem.setAttribute("class", "");
  return dataChildContainer;
};

// Update Domain data on Sub-Domain Dropdown selected
domainClicked.forEach(button => {
  button.addEventListener("click", e => {
    // console.log("domain clicked");
    adminChartContainer.style.display = "none";
    censusChartContainer.style.display = "none";
    surveyChartContainer.style.display = "none";
    removeGraphs();

    selectedDomain = e.target.value;
    collapseSubDomainDropdown.classList.remove("show");
    dropdownPlaceholder.innerText = e.target.value;
    domainDataBuilder(e.target.value); // This is where the charts themselves get built
  });
});

function removeGraphs() {
  adminChartContainer.innerHTML = "";
  censusChartContainer.innerHTML = "";
  surveyChartContainer.innerHTML = "";
}

// Fetch text file (like a CSV) and return data
// @param {string} file - File path for CSV config file
// @returns {string} file - Escaped string of CSV file contents
async function fetchTextFile(file)  {
  const response = await fetch(file);
  const data = await response.text();
  return data;
}

// Fetch JSON config file and return data
// @param {string} file - File path for json config file
// @returns {json}
async function fetchJsonFile(file)  {
  const response = await fetch(file);
  const data = await response.json();
  return data;
}

// Community dropdown builder
(async function communityDropdownBuilder() {
  const communityData = await fetchJsonFile(communityDataFile);
  for (const community in communityData) {
    if (Object.hasOwnProperty.call(communityData, community)) {
      const element = communityData[community];
      const communityOption = document.createElement("option");
      const communityText = document.createTextNode(`${element["Suggested name"]} -- ${element.borough}`);
      communityOption.appendChild(communityText);
      communityOption.setAttribute("value", element.smart_site);
      communityDropdown.appendChild(communityOption);
    }
  }
})();

// Build the charts
// @param {string} subDomain - The subdomain name, e.g. "Food Insecurity"
async function domainDataBuilder(subDomain) {
  // console.log("DOMAINDATABUILDER param: ", subDomain);
  const configData = await fetchJsonFile(chartContainer.dataset.config);
  google.charts.load("current", { packages: ["corechart", "line", "bar"] });

  // An object with domain (string), subdomain (string), admin (array), census
  // (array), and survey (array)
  const subDomainData = configData[subDomain];

  if (subDomainData.admin) {
    subDomainData.admin.forEach(dataItem => {
      chartElementDivBuilder(dataItem, adminChartContainer);
      drawChartsFromSubdomainData({data: subDomainData.admin, id: dataItem.indicatorID, type: "admin"});
    });
  }

  if (subDomainData.census) {
    subDomainData.census.forEach(dataItem => {
      chartElementDivBuilder(dataItem, censusChartContainer);
      drawChartsFromSubdomainData({data: subDomainData.census, id: dataItem.indicatorID, type: "census"});
    });
  }

  if (subDomainData.survey) {
    subDomainData.survey.forEach(dataItem => {
      chartElementDivBuilder(dataItem, surveyChartContainer);
      drawChartsFromSubdomainData({data: subDomainData.survey, id: dataItem.indicatorID, type: "survey"});
    });
  }
}

// Create divs to house data charts
// We fill these in later with drawChart[xxx]
// @param {object} data - arrayOf({
//     indicatorID: {number},
//     indicatorName: {string},
//     source: {number},
//     fileRef: {string},
//   })}
function chartElementDivBuilder(data, container) {
  // console.log("CHARTELEMENTDIVBUILDER param: ", data);
  const chartElement = document.createElement("div");
  chartElement.setAttribute("id", `chart-container-${data.indicatorID}`);
  chartElement.setAttribute("class", "container data-explorer__row");
  container.appendChild(chartElement);

  // Place to hold text content (title, description) for the chart
  const chartContent = document.createElement("div");
  chartContent.setAttribute("id", `chart-content-${data.indicatorID}`);
  chartContent.classList.add("data-explorer__content");

  // Place to hold any options or dropdowns for the chart
  const chartOptions = document.createElement("div");
  chartOptions.setAttribute("id", `chart-options-${data.indicatorID}`);
  chartOptions.classList.add("data-explorer__options");

  // Place to hold the graph itself
  const chartGraph = document.createElement("div");
  chartGraph.setAttribute("id", `chart-${data.indicatorID}`);
  chartGraph.classList.add("data-explorer__chart");

  chartElement.appendChild(chartContent);
  chartElement.appendChild(chartOptions);
  chartElement.appendChild(chartGraph);

  const header = document.createElement("div");
  header.setAttribute("id", `chart-content-h1-${data.indicatorID}`);
  header.classList.add("data-explorer__chart-title");
  header.innerText = `${data.indicatorName}`;

  const paragraph = document.createElement("p");
  paragraph.setAttribute("id", `chart-content-p-${data.indicatorID}`);

  chartContent.appendChild(header);
  chartContent.appendChild(paragraph);
}

// @requiredby chartElementDivBuilder, domainDataBuilder
// @param {object}
const drawChartsFromSubdomainData = async (obj) => {
  // console.log("PROCESSSUBDOMAINDATAFILE param: ", obj);
  const data = obj.data;
  let filePath = "";
  let fileRef = "";
  if (data.length > 0) {
    data.forEach(item => {
      filePath = chartContainer.dataset[item.fileRef];
      fileRef = item.fileRef;
    });

    const dataRequest = await fetchTextFile(filePath);
    const labels = removeUnnecessaryChar(dataRequest.split("\n")[0]).split(",");

    const fooData = csvDataIntoArray(dataRequest);
    const dataObj = createSubdomainObject({ labels: labels, data: fooData, id: obj.id, type: obj.type, source: fileRef });
    const newData = filterData(dataObj);

    // If we have data, draw a chart with it
    if (newData.data.length > 0) {

      switch (newData.type) {
        case "admin":
          google.charts.setOnLoadCallback(() => drawChartAdmin(newData));
          break;
        case "census":
          google.charts.setOnLoadCallback(() => drawChartCensus(newData));
          break;
        case "survey":
          google.charts.setOnLoadCallback(() => drawChartSurvey(newData));
          break;
        default:
          break;
      }
    } else {
      console.error("No data available");
    }

    // Also draw the citywide data if we're looking at Admin data
    if (obj.type === "admin") {
      const cityWideRequest = await fetchTextFile(filePath);
      const citywideLabels = removeUnnecessaryChar(cityWideRequest.split("\n")[0]).split(",");
      const city = csvDataIntoArray(cityWideRequest);
      const dataObj = createSubdomainObject({labels: citywideLabels, data: city, id: obj.id , type: "city", source: fileRef });
      const newData = filterData(dataObj);
      google.charts.setOnLoadCallback(() => drawChartAdmin(newData));
    }
  }
};

function csvDataIntoArray(str) {
  const strPcss = removeUnnecessaryChar(str);
  const data = strPcss.slice(strPcss.indexOf("\n") + 1)
    .split("\n")
    .map(v => v.split(","));
  // console.log("CSVDATAINTOARRAY return: ", data);
  return data;
}

function removeUnnecessaryChar(string) {
  let removeExtraSpaces = string.replace(/  +/g, " ");
  let removeDoubleQuotes = removeExtraSpaces.replace(/['"]+/g, "");
  let trim = removeDoubleQuotes.trim();
  return trim;
}

/**
 * Create a subdomain object with an array of objects for its data object,
 * from an array of labels and of data objects
 *
 * @param {object} obj - {
 *   data:
 *   labels:
 *   id:
 *   type:
 * }
 * @returns {SubdomainObject} A subdomain object
 */
function createSubdomainObject(obj) {
  const labeledData = obj.data.map((dataItem, i) => {
    const labeledDataRow = {};

    for (let i = 0; i < obj.labels.length; i++) {
      labeledDataRow[obj.labels[i]] = removeUnnecessaryChar(dataItem[i]);
    }

    return labeledDataRow;
  });

  const subdomainObj = new SubdomainObject(labeledData, obj.id, obj.type, obj.source);

  // console.log("createSubdomainObject return: ", subdomainObj);
  return subdomainObj;
}

// Filter the data in a Subdomain object so that it only contains data matching
// the currently chosen community and domain
//
// @param {SubdomainObject} subdomainObj
// @returns {SubdomainObject}
function filterData(subdomainObj) {
  // console.log("PROCESSDATA param: ", subdomainObj);
  const dataResponse = subdomainObj.data;
  const filteredSubdomainObj = new SubdomainObject({}, subdomainObj.id, subdomainObj.type, subdomainObj.source);

  // Filter data by matching the desired smart site and selected domain; exclude
  // city type data
  const filteredData = dataResponse.filter((data) => {
    return (data.smart_site === selectedCommunity && data.sub_domain === selectedDomain && subdomainObj.type !== "city");
  });

  if (subdomainObj.type === "city") {
    citywideData = [ ...subdomainObj.data ];
  } else if (subdomainObj.type === "admin") {
    const dataFiltered = filteredData.filter((data) => {
      return (Number(data.indicator_id) === subdomainObj.id && data.data_type === "Rate" );
    });
    filteredSubdomainObj.data=dataFiltered;
  } else if (subdomainObj.type === "census") {
    const dataFiltered = filteredData.filter((data) => {
      return (Number(data.indicator_id) === subdomainObj.id);
    });
    filteredSubdomainObj.data=dataFiltered;
  } else {
    filteredSubdomainObj.data=filteredData;
  }

  // console.log("PROCESSDATA return: ", filteredSubdomainObj);
  return filteredSubdomainObj;
}

// Draw the admin data chart in the existing div we created with
// chartElementDivBuilder
//
// @parm {SubdomainObject} subdomainObj
function drawChartAdmin(subdomainObj) {
  // console.log("DRAWCHARTADMIN param: ", subdomainObj);
  adminChartContainer.style.display = "block";
  const dataTable = new google.visualization.DataTable();
  const data = subdomainObj.data;
  const chartId = subdomainObj.id;
  const paragraph = document.getElementById(`chart-content-p-${chartId}`);
  let cityArrayMatch = [];
  let communityValues = [];
  let citywideValues = [];
  let dataArrayMapped = [];
  let quarters = [];

  if (data[0].description) {
    paragraph.innerText = data[0].description;
  }

  if (data[0]) {
    cityArrayMatch = citywideData.filter((item) => {
      return (Number(item.indicator_id) === chartId && item.smart_site === "Citywide" && item.data_type === "Rate" );
    });
  }

  const yearQuarterLabels = {
    "nypdCalls": {
      "year": "call911_year",
      "quarter": "call911_quarters",
    },
    "311Complaints": {
      "year": "complaint_year",
      "quarter": "complaint_quarter",
    },
    "citywide": {
      "year": "complaint_year",
      "quarter": "complaint_quarter",
    },
    "doiEvictions": {
      "year": "eviction_year",
      "quarter": "eviction_quarters",
    },
    "nypdSqf": {
      "year": "sqf_year",
      "quarter": "sqf_quarters",
    },
    "nypdArrests": {
      "year": "arrest_year",
      "quarter": "arrest_quarter",
    },
    "nypdComplaints": {
      "year": "complaints_year",
      "quarter": "complaint_quarter",
    },
    "nypdShootings": {
      "year": "shoot_year",
      "quarter": "shoot_quarters",
    },
  };

  data.forEach(item => {
    if (data[0].indicator_id === item.indicator_id ) {
      communityValues.push(item.value);
      // quarterIndex++;
      // if (quarterIndex % 5 === 0) {
      //   quarterIndex = 1;
      // }

      const labels = yearQuarterLabels[subdomainObj.source];
      const year = item[labels.year];
      const quarter = item[labels.quarter];

      const yearQuarter = year + " Q" + quarter;

      quarters.push(yearQuarter);
    }
  });

  if (cityArrayMatch.length > 0) {
    dataTable.addColumn("string", data[0].indicator_id);
    dataTable.addColumn("number", `Site ${data[0].smart_site}`);
    dataTable.addColumn("number", "Citywide");

    cityArrayMatch.forEach(item => {
      citywideValues.push(item.value);
    });

    for (let i = 0; i < communityValues.length; i++) {
      dataArrayMapped.push([quarters[i], +communityValues[i], +citywideValues[i]]);
    }
    dataTable.addRows([ ...dataArrayMapped ]);

  } else {
    dataTable.addColumn("string", data.indicator);
    dataTable.addColumn("number", "Values");

    for (let i = 0; i < communityValues.length; i++) {
      dataArrayMapped.push([quarters[i], +communityValues[i]]);
    }
    dataTable.addRows([ ...dataArrayMapped ]);
  }

  const options = {
    colors: [
      "#016789",
      "#DEAA00",
      "#7ACFE5",
    ],
    chartArea: {
      width: "80%",
    },
    legend: {
      position: "bottom",
    },
    hAxis: {
      baselineColor: "#aaaaaa",
      title: "Quarter",
      titleTextStyle: {
        bold: true,
        italic: false,
      },
      showTextEvery: 4,
      slantedText: true,
    },
    vAxis: {
      titleTextStyle: {
        bold: true,
        italic: false,
      },
    },
    backgroundColor: "transparent",
  };

  let chart = new google.visualization.LineChart(document.getElementById(`chart-${chartId}`));
  chart.draw(dataTable, options);
}

function drawChartCensus(subdomainObj) {
  console.log("DRAWCHARTCENSUS param: ", subdomainObj);
  const chartId = subdomainObj.id;
  const response = subdomainObj.data;

  censusChartContainer.style.display = "block";

  const dataTable = new google.visualization.arrayToDataTable([
    ["string", response[0].indicator],
    [response[0].indicator, +response[0].value]
  ]);

  const options = {
    colors: [
      "#016789",
      "#DEAA00",
      "#7ACFE5",
    ],
    chartArea: {
      width: "80%",
    },
    legend: {
      position: "bottom",
    },
    title: response.domain,
    backgroundColor: "transparent",
    isStacked: true,
    hAxis: {
      title: response.domain + " - " + response.sud_domain,
      minValue: 0,
      maxValue: 100,
    },
    vAxis: {
      title: "Indicator"
    }
  };

  let chart = new google.visualization.BarChart(document.getElementById(`chart-${chartId}`));
  chart.draw(dataTable, options);
}

function drawChartSurvey(subdomainObj) {
  console.log("DRAWCHARTSURVEY param: ", subdomainObj);
  surveyChartContainer.style.display = "block";
  const data = subdomainObj.data;
  const chartId = subdomainObj.id;
  let demoLevels = [];
  let demographics = [];
  let chartOptions = document.getElementById(`chart-options-${chartId}`);
  let chartArea = document.getElementById(`chart-${chartId}`);
  const paragraph = document.getElementById(`chart-content-p-${chartId}`);
  let selectedDemo = "";

  // Only do this stuff if we have demographic data
  if (data[0].demographic) {
    // Get an array of unique demographic groups
    data.forEach(item => {
      if (demoLevels.findIndex(group => group.demographic_level === item.demographic_level) === -1) {
        demoLevels.push({demographic: item.demographic, demographic_level: item.demographic_level});
      }
      if (demographics.indexOf(item.demographic) === -1) {
        demographics.push(item.demographic);
      }
    });

    // console.log("DEMO LEVELS: ", demoLevels);
    // console.log("DEMOGRAPHICS: ", demographics);

    // Start by choosing the first demographic group
    selectedDemo = demographics[0];

    let demoDropdown = document.createElement("select");
    demoDropdown.setAttribute("id", `demo-dropdown-${chartId}`);

    demographics.forEach(demo => {
      let demoOption = document.createElement("option");
      demoOption.innerText = demo;
      demoOption.setAttribute("value", demo);
      demoDropdown.appendChild(demoOption);
    });

    demoDropdown.addEventListener("change", e => {
      selectedDemo = demoDropdown.value;
      redrawSurveyChart();
    });

    chartOptions.appendChild(demoDropdown);
  } else {
    console.log("No demographic data for survey " + chartId);
  }

  const options = {
    colors: [
      "#016789",
      "#DEAA00",
      "#7ACFE5",
    ],
    legend: {
      position: "bottom",
    },
    chartArea: {
      width: "80%",
    },
    backgroundColor: "transparent",
    vAxis: {
      format: "percent",
      viewWindow: {
        max: 1,
        min: 0,
      }
    },
  };

  const chart = new google.visualization.ColumnChart(chartArea);

  const redrawSurveyChart = () => {
    const dataTable = new google.visualization.DataTable();
    let combinedValues = [];
    let dataArrayMapped = [];
    let waves = [];

    // Get only the data that matches our chart ID and selected demographic
    const filteredData = data.filter(item => { return (chartId === Number(item.indicator_id) && selectedDemo === item.demographic );});

    // Create an array of unique waves within our filtered data
    filteredData.forEach(data => {
      if (waves.indexOf(data.wave) === -1) {
        waves.push(data.wave);
      }
    });

    // Add string column for "wave 1," "wave 2", etc.
    dataTable.addColumn("string", "Wave");

    // Add DataTable columns for each demographic level that's within our
    // chosen demographic
    demoLevels.forEach(level => {
      if (level.demographic === selectedDemo) {
        dataTable.addColumn("number", level.demographic_level);
      }
    });

    // Create an array of values for each demo level, within each wave,
    // then add it to the array to be added to the DataTable
    // e.g.: ["Wave 1", 0.5, 0.2, 0.9]
    waves.forEach(wave => {
      let waveValues = [];

      demoLevels.forEach(level => {
        filteredData.filter(
          dataItem => { return (dataItem.wave === wave && dataItem.demographic_level === level.demographic_level); }
        ).map(dataItem => {
          waveValues.push(Number(dataItem.value));
        });
      });

      dataArrayMapped.push([wave, ...waveValues]);
    });

    filteredData.forEach(item => {
      if (chartId === Number(item.indicator_id) && selectedDemo === item.demographic) {
        if (item.description) {
          paragraph.innerText = item.description;
        }
      }
    });

    dataTable.addRows([...dataArrayMapped]);

    chart.draw(dataTable, options);
  };

  redrawSurveyChart();
}
