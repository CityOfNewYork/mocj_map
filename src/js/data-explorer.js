/**
 * domainDataBuilder
 *   drawChartFromSubdomainData
 *     labelData
 *     filterData
 *     drawChartAdmin
 *     drawChartCensus
 *     drawChartSurvey
 *
 * https://developers.google.com/chart/interactive/docs/reference
 * https://developers.google.com/chart/interactive/docs/gallery/linechart
 */

const communityDropdown = document.getElementById("community-dropdown");
const communityTitle = document.getElementById("community-title");
const raceData = document.getElementById("race-data");
const ageData = document.getElementById("age-data");
const dataRenderDiv = document.getElementById("data-render");
const dataContainer = document.getElementById("data-container");
const chartContainer = document.getElementById("chart-container");
const adminChartContainer = document.getElementById("admin-container");
const censusChartContainer = document.getElementById("census-container");
const surveyChartContainer = document.getElementById("survey-container");
const domainSelect = document.getElementById("domain-select");
const boroughMap = document.getElementById("borough-map");

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

const demographyDataFile = dataContainer.dataset.demography;
const communityDataFile = dataContainer.dataset.community;

let domains = {};
let configData = {};

let citywideData = [];

let selectedDomain = "";
let selectedCommunity = "";

google.charts.load("current", { packages: ["corechart", "line", "bar"] });

window.addEventListener("DOMContentLoaded", async () => {
  // Load config data
  configData = await fetchJsonFile(chartContainer.dataset.config);

  // Build the domains/subdomains object for reference
  Object.keys(configData).forEach(key => {
    const domain = configData[key].domain;
    const subDomain = configData[key].subDomain;

    if (subDomain && domain && !(domain in domains)) {
      domains[domain] = [subDomain];
    } else if (domain && subDomain && domains[domain].indexOf(subDomain) === -1) {
      domains[domain].push(subDomain);
    }
  });

  // Build the domain dropdown
  Object.keys(domains).forEach(key => {
    let domainOptGroup = document.createElement("optgroup");
    domainOptGroup.setAttribute("label", key);

    domains[key].forEach(subdomain => {
      let subdomainOption = document.createElement("option");
      subdomainOption.innerText = subdomain;
      subdomainOption.setAttribute("value", subdomain);
      domainOptGroup.appendChild(subdomainOption);
    });

    domainSelect.appendChild(domainOptGroup);
  });
});

// Update community data and charts when Community dropdown selected
communityDropdown.addEventListener("change", () => {
  selectedCommunity = communityDropdown.options[communityDropdown.selectedIndex].value;
  removeDemographyData();
  renderDemographyData(communityDropdown.value);
  dataRenderDiv.style.display = "flex";
  dataContainer.style.display = "flex";

  // Add current community class to the borough SVG
  boroughMap.setAttribute("class", "");
  boroughMap.classList.add("community-" + selectedCommunity);

  domainDataBuilder(); // This is where the charts themselves get built
});

// Update charts when domain dropdown selected
domainSelect.addEventListener("change", () => {
  selectedDomain = domainSelect.value;
  removeGraphs();
  domainDataBuilder(); // This is where the charts themselves get built
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

function removeGraphs() {
  adminChartContainer.style.display = "none";
  adminChartContainer.innerHTML = "";

  censusChartContainer.style.display = "none";
  censusChartContainer.innerHTML = "";

  surveyChartContainer.style.display = "none";
  surveyChartContainer.innerHTML = "";
}

/**
 * Fetch text file (like a CSV) and return data
 */
async function fetchTextFile(file)  {
  const response = await fetch(file);
  const data = await response.text();
  return data;
}

/**
 * Fetch JSON file and return data
 */
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

/**
 * Create divs to house data charts
 * We fill these in later with drawChart[xxx]
 */
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

/**
 * Build the charts
 *
 * Take the current value of selectedDomain (e.g. "Housing Security") and draw
 * all related charts
 */
function domainDataBuilder() {
  // An object with domain (string), subdomain (string), admin (array), census
  // (array), and survey (array)
  const subDomainData = configData[selectedDomain];

  if (subDomainData.admin) {
    subDomainData.admin.forEach(dataItem => {
      chartElementDivBuilder(dataItem, adminChartContainer);
      drawChartFromSubdomainData({data: subDomainData.admin, indicatorId: dataItem.indicatorID, type: "admin"});
    });
  }

  if (subDomainData.census) {
    subDomainData.census.forEach(dataItem => {
      chartElementDivBuilder(dataItem, censusChartContainer);
      drawChartFromSubdomainData({data: subDomainData.census, indicatorId: dataItem.indicatorID, type: "census"});
    });
  }

  if (subDomainData.survey) {
    subDomainData.survey.forEach(dataItem => {
      chartElementDivBuilder(dataItem, surveyChartContainer);
      drawChartFromSubdomainData({data: subDomainData.survey, indicatorId: dataItem.indicatorID, type: "survey"});
    });
  }
}

/**
 * Take an object of this format:
 * {data: {}, indicatorId: "8815", type: "admin"}
 * and draw a chart from it in the chart container with the corresponding ID
 */
const drawChartFromSubdomainData = async (obj) => {
  // console.log("PROCESSSUBDOMAINDATAFILE param: ", obj);
  const { data, indicatorId, type } = obj;

  if (data.length > 0) {
    const fileRef = data[0].fileRef;
    const filePath = chartContainer.dataset[fileRef];

    const dataRequest = await fetchTextFile(filePath);
    const labels = removeUnnecessaryChar(dataRequest.split("\n")[0]).split(",");
    const dataArray = csvDataIntoArray(dataRequest);

    const labeledData = labelData({ labels: labels, data: dataArray });
    citywideData = labeledData;

    // Filter the data by indicator ID, based on type
    const filteredData = filterData({ data: labeledData, indicatorId: indicatorId, type: type });

    const domainObj = { data: filteredData, indicatorId: indicatorId, source: fileRef };

    // If we have data, draw a chart with it
    if (filteredData && filteredData.length > 0) {
      switch (type) {
        case "admin":
          google.charts.setOnLoadCallback(() => drawChartAdmin(domainObj));
          break;
        case "census":
          google.charts.setOnLoadCallback(() => drawChartCensus(domainObj));
          break;
        case "survey":
          google.charts.setOnLoadCallback(() => drawChartSurvey(domainObj));
          break;
        default:
          break;
      }
    } else {
      console.error("No matching data");
    }
  } else {
    console.error("No data available");
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

// Add labels to raw data and return as an indexed object
const labelData = (labelsData) => {
  const { data, labels } = labelsData;

  const labeledData = data.map((dataItem, i) => {
    const labeledDataRow = {};

    for (let i = 0; i < labels.length; i++) {
      labeledDataRow[labels[i]] = removeUnnecessaryChar(dataItem[i]);
    }

    return labeledDataRow;
  });

  return labeledData;
};

/**
 * Filter the data in an object according to selected community, domain, and
 * relevant chart type
 */
function filterData(object) {
  const { data, indicatorId, type } = object;
  let newFilteredData = {};

  // Filter data by matching the desired smart site and selected domain; exclude
  // city type data
  const filteredData = data.filter((dataItem) => {
    return (dataItem.smart_site === selectedCommunity && dataItem.sub_domain === selectedDomain);
  });

  // If this is admin data, need to filter by "Rate"-type data, and by indicator
  // ID, since we're drawing multiple charts
  if (type === "admin") {
    newFilteredData = filteredData.filter((dataItem) => {
      return (Number(dataItem.indicator_id) === indicatorId && dataItem.data_type === "Rate" );
    });
  // If this is census data, need to filter by indicator ID, since we draw
  // multiple charts
  } else if (type === "census") {
    newFilteredData = filteredData.filter((dataItem) => {
      return (Number(dataItem.indicator_id) === indicatorId);
    });
  } else {
    newFilteredData = filteredData;
  }

  return newFilteredData;
}

/**
 * Draw the admin data chart in the existing div we created with
 * chartElementDivBuilder
 *
 * Only needs data, id, and source in object param
 */
function drawChartAdmin(domainObj) {
  // console.log("DRAWCHARTADMIN param: ", domainObj);
  const { data, indicatorId, source } = domainObj;

  adminChartContainer.style.display = "block";

  const dataTable = new google.visualization.DataTable();
  const paragraph = document.getElementById(`chart-content-p-${indicatorId}`);

  let cityArrayMatch = [];
  let communityValues = [];
  let citywideValues = [];
  let dataArrayMapped = [];
  let quarters = [];

  if (data[0] && data[0].description) {
    paragraph.innerText = data[0].description;
  }

  if (data[0]) {
    cityArrayMatch = citywideData.filter((item) => {
      return (Number(item.indicator_id) === indicatorId && item.smart_site === "Citywide" && item.data_type === "Rate" );
    });
  }

  data.forEach(item => {
    if (data[0].indicator_id === item.indicator_id ) {
      communityValues.push(item.value);

      const labels = yearQuarterLabels[source];
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

  let chart = new google.visualization.LineChart(document.getElementById(`chart-${indicatorId}`));
  chart.draw(dataTable, options);
}

function drawChartCensus(domainObj) {
  // console.log("DRAWCHARTCENSUS param: ", domainObj);
  const { data, indicatorId } = domainObj;

  censusChartContainer.style.display = "block";

  const dataTable = new google.visualization.arrayToDataTable([
    ["string", data[0].indicator],
    [data[0].indicator, +data[0].value]
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
    title: data.domain,
    backgroundColor: "transparent",
    isStacked: true,
    hAxis: {
      title: `${data[0].domain} - ${data[0].sub_domain}`,
      minValue: 0,
      maxValue: 100,
    },
    vAxis: {
      title: "Indicator"
    }
  };

  let chart = new google.visualization.BarChart(document.getElementById(`chart-${indicatorId}`));
  chart.draw(dataTable, options);
}

function drawChartSurvey(domainObj) {
  // console.log("DRAWCHARTSURVEY param: ", domainObj);
  surveyChartContainer.style.display = "block";

  const { data, indicatorId } = domainObj;

  const chartOptions = document.getElementById(`chart-options-${indicatorId}`);
  const chartArea = document.getElementById(`chart-${indicatorId}`);
  const paragraph = document.getElementById(`chart-content-p-${indicatorId}`);

  let demographics = []; // Major groups ("Age", "Race", etc.()
  let demoLevels = []; // Subgroups ("18-34", etc.)
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

    // Start by choosing the first demographic group
    selectedDemo = demographics[0];

    let demoDropdown = document.createElement("select");
    demoDropdown.setAttribute("id", `demo-dropdown-${indicatorId}`);

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
    console.log("No demographic data for survey " + indicatorId);
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
    let dataArrayMapped = [];
    let waves = [];

    // Get only the data that matches our chart ID and selected demographic
    const filteredData = data.filter(item => { return (indicatorId === Number(item.indicator_id) && selectedDemo === item.demographic );});

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
      if (indicatorId === Number(item.indicator_id) && selectedDemo === item.demographic) {
        if (item && item.description) {
          paragraph.innerText = item.description;
        }
      }
    });

    dataTable.addRows([...dataArrayMapped]);

    chart.draw(dataTable, options);
  };

  redrawSurveyChart();
}
