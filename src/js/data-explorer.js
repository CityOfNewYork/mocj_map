/**
 * domainDataBuilder
 *   drawChartAdmin
 *     labelData
 *     filterData
 *   drawChartCensus
 *     labelData
 *     filterData
 *   drawChartSurvey
 *     labelData
 *     filterData
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
    "quarter": "eviction_quarter",
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
let communityData = {};

let selectedDomain = "";
let selectedCommunity = "";

google.charts.load("current", { packages: ["corechart", "line", "bar"] });

window.addEventListener("DOMContentLoaded", async () => {
  // Load config data
  configData = await fetchJsonFile(chartContainer.dataset.config);
  communityData = await fetchJsonFile(communityDataFile);

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

  // Community dropdown builder
  for (const community in communityData) {
    if (Object.hasOwnProperty.call(communityData, community)) {
      const element = communityData[community];
      const communityOption = document.createElement("option");
      const communityText = document.createTextNode(`${element["Suggested name"]} — ${element.borough}`);
      communityOption.appendChild(communityText);
      communityOption.setAttribute("value", element.smart_site);
      communityDropdown.appendChild(communityOption);
    }
  }
});

// Update community data and charts when Community dropdown selected
communityDropdown.addEventListener("change", () => {
  selectedCommunity = communityDropdown.options[communityDropdown.selectedIndex].value;
  removeDemographyData();
  renderDemographyData(communityDropdown.value);
  dataRenderDiv.style.display = "flex";
  dataContainer.style.display = "flex";

  communityTitle.innerText = communityDropdown.options[communityDropdown.selectedIndex].text;

  // Add current community class to the borough SVG
  boroughMap.setAttribute("class", "");
  boroughMap.classList.add("community-" + selectedCommunity);

  removeGraphs();
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
  totalPopulation.innerText = Number(filteredDemographyData[0][6]).toLocaleString("en-US");

  // Sex/Gender population
  const femalePercentage = document.getElementById("female-percentage");
  const malePercentage = document.getElementById("male-percentage");

  const femaleValue = Number(filteredDemographyData[1][6]);
  const maleValue = Number(filteredDemographyData[2][6]);

  const maleValueRounded = Math.round(maleValue) === maleValue ? maleValue : maleValue.toFixed(1);
  const femaleValueRounded = Math.round(femaleValue) === femaleValue ? femaleValue : femaleValue.toFixed(1);

  femalePercentage.innerText = femaleValueRounded + "%";
  malePercentage.innerText = maleValueRounded + "%";

  // Race/Ethnicity population
  const raceDataDiv = document.createElement("div");
  raceDataDiv.setAttribute("id", "race-population");
  raceDataDiv.classList.add("data-table");

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
  ageDataDiv.classList.add("data-table");

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
  const dataValue = Number(dataArray[6]);
  const dataRoundedValue = Math.round(dataValue) === dataValue ? dataValue : dataValue.toFixed(1);
  dataPercentageElem.innerText = dataRoundedValue + "%";
  dataPercentageElem.classList.add("data-explorer__demo-data-cell-label");
  dataTitleElem.innerText = dataArray[4];
  dataChildContainer.appendChild(dataPercentageElem);
  dataChildContainer.appendChild(dataTitleElem);
  dataChildContainer.setAttribute("class", "data-explorer__demo-data-cell");
  dataTitleElem.setAttribute("class", "");
  return dataChildContainer;
};

function removeGraphs() {
  // console.log("REMOVING GRAPHS");
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
  // console.log("FETCHING FILE: ", file);
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

/**
 * Create divs to house data charts
 * We fill these in later with drawChart[xxx]
 */
function chartElementDivBuilder(data, container) {
  // console.log("CHARTELEMENTDIVBUILDER param: ", data);
  const chartWrapper = document.createElement("div");
  chartWrapper.classList.add("data-explorer__row");
  container.appendChild(chartWrapper);

  const chartElement = document.createElement("div");
  chartElement.setAttribute("id", `chart-container-${data.indicator_id}`);
  chartElement.setAttribute("class", "container data-explorer__row-content");
  chartWrapper.appendChild(chartElement);

  // Place to hold text content (title, description) for the chart
  const chartContent = document.createElement("div");
  chartContent.setAttribute("id", `chart-content-${data.indicator_id}`);
  chartContent.classList.add("data-explorer__content");

  // Place to hold any options or dropdowns for the chart
  const chartOptions = document.createElement("div");
  chartOptions.setAttribute("id", `chart-options-${data.indicator_id}`);
  chartOptions.classList.add("data-explorer__options");

  // Place to hold the graph itself
  const chartGraph = document.createElement("div");
  chartGraph.setAttribute("id", `chart-${data.indicator_id}`);
  chartGraph.classList.add("data-explorer__chart");

  chartElement.appendChild(chartContent);
  chartElement.appendChild(chartOptions);
  chartElement.appendChild(chartGraph);

  const eyebrow = document.createElement("div");
  eyebrow.setAttribute("id", `chart-content-eyebrow-${data.indicator_id}`);
  eyebrow.classList.add("data-explorer__chart-eyebrow");

  const header = document.createElement("div");
  header.setAttribute("id", `chart-content-h1-${data.indicator_id}`);
  header.classList.add("data-explorer__chart-title");
  header.innerText = `${data.indicator}`;

  const paragraph = document.createElement("p");
  paragraph.setAttribute("id", `chart-content-p-${data.indicator_id}`);

  // Use authored indicator title and text (from Advanced Custom Fields options)
  // if they exist
  if (chartContainer.dataset[data.indicator_id]) {
    const indicatorData = JSON.parse(chartContainer.dataset[data.indicator_id]);
    header.innerText = indicatorData.title;
    paragraph.innerText = indicatorData.description;
  }

  chartContent.appendChild(eyebrow);
  chartContent.appendChild(header);
  chartContent.appendChild(paragraph);
}

const lookupSiteNameByCode = (smartSite) => {
  const siteObject = communityData.filter(dataItem => {
    return dataItem.smart_site === smartSite;
  });
  return siteObject[0]["Suggested name"];
};

/**
 * Build the charts
 *
 * Take the current value of selectedDomain (e.g. "Housing Security") and draw
 * all related charts
 */
function domainDataBuilder() {
  const subDomainData = configData[selectedDomain];

  if (subDomainData && subDomainData.admin) {
    subDomainData.admin.forEach(dataItem => {
      const chartData = { data: subDomainData.survey, indicatorId: dataItem.indicatorID, source: dataItem.fileRef };
      google.charts.setOnLoadCallback(() => drawChartAdmin(chartData));
    });
  }

  if (subDomainData && subDomainData.census) {
    subDomainData.census.forEach(dataItem => {
      const chartData = { data: subDomainData.survey, indicatorId: dataItem.indicatorID, source: dataItem.fileRef };
      google.charts.setOnLoadCallback(() => drawChartCensus(chartData));
    });
  }

  if (subDomainData && subDomainData.survey) {
    subDomainData.survey.forEach(dataItem => {
      const chartData = { data: subDomainData.survey, indicatorId: dataItem.indicatorID, source: dataItem.fileRef };
      google.charts.setOnLoadCallback(() => drawChartSurvey(chartData));
    });
  }
}

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

// Take a CSV string and create an object with headers as keys
const labelData = (labelsData) => {
  const labels = removeUnnecessaryChar(labelsData.split("\n")[0]).split(",");
  const data = csvDataIntoArray(labelsData);

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
    // Only filter by rate data if we *have* rate data
    if (filteredData.findIndex(dataItem => { return dataItem.data_type === "Rate"; }) === -1) {
      newFilteredData = filteredData.filter((dataItem) => {
        return (Number(dataItem.indicator_id) === indicatorId);
      });
    } else {
      newFilteredData = filteredData.filter((dataItem) => {
        return (Number(dataItem.indicator_id) === indicatorId && dataItem.data_type === "Rate" );
      });
    }
  } else {
    newFilteredData = filteredData.filter((dataItem) => {
      return (Number(dataItem.indicator_id) === indicatorId);
    });
  }

  return newFilteredData;
}

/**
 * Draw the admin data chart in the existing div we created with
 * chartElementDivBuilder
 *
 * Only needs id and source in object param
 */
const drawChartAdmin = async (domainObj) => {
  // console.log("DRAWCHARTADMIN param: ", domainObj);
  const { indicatorId, source } = domainObj;

  const filePath = chartContainer.dataset[source];
  const dataRequest = await fetchTextFile(filePath);
  const labeledData = labelData(dataRequest);
  const filteredData = filterData({ data: labeledData, indicatorId: indicatorId, type: "admin" });

  let cityWideData = [];
  let communityValues = [];
  let cityWideValues = [];
  let dataArrayMapped = [];
  let quarters = [];

  chartElementDivBuilder(filteredData[0], adminChartContainer);

  adminChartContainer.style.display = "block";

  const dataTable = new google.visualization.DataTable();
  const eyebrow = document.getElementById(`chart-content-eyebrow-${indicatorId}`);
  const paragraph = document.getElementById(`chart-content-p-${indicatorId}`);

  eyebrow.innerText = "Administrative";

  // Add description paragraph to chart area if we have one
  if (filteredData[0] && filteredData[0].description && paragraph.innerText === "") {
    paragraph.innerText = filteredData[0].description;
  }

  // Populate citywide data
  if (filteredData[0]) {
    if (filteredData[0].data_type === "Rate") {
      cityWideData = labeledData.filter((item) => {
        return (Number(item.indicator_id) === indicatorId && item.smart_site === "Citywide" && item.data_type === "Rate" );
      });
    } else {
      cityWideData = labeledData.filter((item) => {
        return (Number(item.indicator_id) === indicatorId && item.smart_site === "Citywide");
      });
    }
  }

  filteredData.forEach(item => {
    if (filteredData[0].indicator_id === item.indicator_id ) {
      communityValues.push(item.value);

      const labels = yearQuarterLabels[source];
      const year = item[labels.year];
      const quarter = item[labels.quarter];

      const yearQuarter = year + " Q" + quarter;

      // quarters.push(yearQuarter);
      quarters.push(year);
    }
  });

  if (cityWideData.length > 0) {
    const siteName = lookupSiteNameByCode(filteredData[0].smart_site);
    dataTable.addColumn("string", filteredData[0].indicator_id);
    dataTable.addColumn("number", "Citywide");
    dataTable.addColumn("number", siteName);

    cityWideData.forEach(item => {
      cityWideValues.push(item.value);
    });

    for (let i = 0; i < communityValues.length; i++) {
      dataArrayMapped.push([quarters[i], +cityWideValues[i], +communityValues[i]]);
    }
    dataTable.addRows([ ...dataArrayMapped ]);

  } else {
    dataTable.addColumn("string", filteredData.indicator);
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
};

const drawChartCensus = async (domainObj) => {
  // console.log("DRAWCHARTCENSUS param: ", domainObj);
  const { indicatorId, source } = domainObj;

  const filePath = chartContainer.dataset[source];
  const dataRequest = await fetchTextFile(filePath);
  const labeledData = labelData(dataRequest);
  const filteredData = filterData({ data: labeledData, indicatorId: indicatorId, type: "census" });

  chartElementDivBuilder(filteredData[0], censusChartContainer);

  censusChartContainer.style.display = "block";

  const eyebrow = document.getElementById(`chart-content-eyebrow-${indicatorId}`);
  const paragraph = document.getElementById(`chart-content-p-${indicatorId}`);

  eyebrow.innerText = "Census";

  filteredData.forEach(item => {
    if (item && item.description && paragraph.innerText === "") {
      paragraph.innerText = item.description;
    }
  });

  const dataTable = new google.visualization.arrayToDataTable([
    ["string", filteredData[0].indicator],
    [filteredData[0].indicator, +filteredData[0].value]
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
    title: filteredData.domain,
    backgroundColor: "transparent",
    isStacked: true,
    hAxis: {
      minValue: 0,
      maxValue: 100,
    },
  };

  let chart = new google.visualization.BarChart(document.getElementById(`chart-${indicatorId}`));
  chart.draw(dataTable, options);
};

const drawChartSurvey = async (domainObj) => {
  // console.log("DRAWCHARTSURVEY param: ", domainObj);
  const { indicatorId } = domainObj;

  // Get the demographic-separated data
  const surveyDemoDataPath = chartContainer.dataset.panelSurveyDemo;
  const surveyDemoData = await fetchTextFile(surveyDemoDataPath);
  const surveyDemoLabeledData = labelData(surveyDemoData);
  const surveyDemoFilteredData = filterData({ data: surveyDemoLabeledData, indicatorId: indicatorId, type: "survey" });

  // Get the "all" (non demograhic-separated) data
  const surveyAllDataPath = chartContainer.dataset.panelSurveyAll;
  const surveyAllData = await fetchTextFile(surveyAllDataPath);
  const surveyAllLabeledData = labelData(surveyAllData);
  const surveyAllFilteredData = filterData({ data: surveyAllLabeledData, indicatorId: indicatorId, type: "survey" });

  chartElementDivBuilder(surveyAllFilteredData[0], surveyChartContainer);

  surveyChartContainer.style.display = "block";

  const chartOptions = document.getElementById(`chart-options-${indicatorId}`);
  const chartArea = document.getElementById(`chart-${indicatorId}`);
  const eyebrow = document.getElementById(`chart-content-eyebrow-${indicatorId}`);
  const paragraph = document.getElementById(`chart-content-p-${indicatorId}`);

  eyebrow.innerText = "Survey";

  let demographics = ["All"]; // Major groups ("Age", "Race", etc.()
  let demoLevels = []; // Subgroups ("18-34", etc.)
  let selectedDemo = "";

  // Only do this stuff if we have demographic data
  if (surveyDemoFilteredData[0].demographic) {
    // console.log("we have data for ", indicatorId);

    // Get an array of unique demographic groups
    surveyDemoFilteredData.forEach(item => {
      if (demoLevels.findIndex(group => group.demographic_level === item.demographic_level) === -1) {
        demoLevels.push({demographic: item.demographic, demographic_level: item.demographic_level});
      }
      if (demographics.indexOf(item.demographic) === -1) {
        demographics.push(item.demographic);
      }
    });

    // Start by choosing the All
    selectedDemo = "Age";

    let demoDropdown = document.createElement("select");
    demoDropdown.setAttribute("id", `demo-dropdown-${indicatorId}`);

    demographics.forEach(demo => {
      let demoOption = document.createElement("option");
      demoOption.innerText = demo;
      demoOption.setAttribute("value", demo);
      if (demo === "Age") {
        demoOption.setAttribute("selected", true);
      }
      demoDropdown.appendChild(demoOption);
    });

    demoDropdown.addEventListener("change", e => {
      selectedDemo = demoDropdown.value;

      if (selectedDemo === "All") {
        redrawSurveyAllChart();
      } else {
        redrawSurveyDemoChart();
      }
    });

    chartOptions.appendChild(demoDropdown);
  } else {
    console.warn("No demographic data for survey " + indicatorId);
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

  // Draw the chart for "All" data (not broken down by demo)
  const redrawSurveyAllChart = () => {
    const dataTable = new google.visualization.DataTable();

    // Get only the data that matches our chart ID and selected demographic
    const filteredData = surveyAllFilteredData.filter(item => { return (indicatorId === Number(item.indicator_id));});

    // Add string column for "wave 1," "wave 2", etc.
    dataTable.addColumn("string", "Wave");
    dataTable.addColumn("number", "Score");

    filteredData.forEach(item => {
      if (item && item.description && paragraph.innerText === "") {
        paragraph.innerText = item.description;
      }
    });

    const dataArrayMapped = filteredData.map(dataItem => {
      return [dataItem.wave, Number(dataItem.value)];
    });

    dataTable.addRows([...dataArrayMapped]);

    chart.draw(dataTable, options);
  };

  // Draw the chart for demographic-specific data
  const redrawSurveyDemoChart = () => {
    const dataTable = new google.visualization.DataTable();
    let dataArrayMapped = [];
    let waves = [];

    // Get only the data that matches our chart ID and selected demographic
    const filteredData = surveyDemoFilteredData.filter(item => { return (indicatorId === Number(item.indicator_id) && selectedDemo === item.demographic );});

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
        ).forEach(dataItem => {
          waveValues.push(Number(dataItem.value));
        });
      });

      dataArrayMapped.push([wave, ...waveValues]);
    });

    filteredData.forEach(item => {
      if (indicatorId === Number(item.indicator_id) && selectedDemo === item.demographic) {
        if (item && item.description && paragraph.innerText === "") {
          paragraph.innerText = item.description;
        }
      }
    });

    dataTable.addRows([...dataArrayMapped]);

    chart.draw(dataTable, options);
  };

  redrawSurveyDemoChart();
};
