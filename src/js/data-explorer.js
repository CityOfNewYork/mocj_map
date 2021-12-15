/**
 * domainDataBuilder
 *   processSubDomainDataFile
 *     processDataFromCsv
 *       processData
 *         delegateChartType
 *           drawChartAdmin
 *           drawChartCensus
 *           drawChartSurvey
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

let cityWideDataFilled = false;
let citywideData = [];
let domainSelected = "";
let communityCode = "";
let countCensusCharts = 0;
// let countSurveyCharts = 0;

// The SubdomainObject class
// This contains the data, the id, and the type of data (admin, census, or
// survey)
class SubdomainObject {
  constructor(data, id, type, source) {
    this.data = data;
    this.id = id;
    this.type = type;
    this.source = source;
  }

  filter() {
  }
}

// Update community data on Community dropdown selected
communityDropdown.addEventListener("change", (e) => {
  domainSelected = communityDropdown.options[communityDropdown.selectedIndex].text;
  communityCode = communityDropdown.options[communityDropdown.selectedIndex].value;
  removeDemographyData();
  getDemographyData(communityDropdown.value);
  communityTitle.innerText = domainSelected;
  dataRenderDiv.style.display = "flex";
  dataContainer.style.display = "flex";
  boroughMap.setAttribute("class", "");
  boroughMap.classList.add("community-" + communityCode);
});

// Render Community population data
const getDemographyData = async (smart_site) => {
  const data = await fetchCSVFile(demographyDataFile);
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
    // console.log('deleted!');
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

    domainSelected = e.target.value;
    collapseSubDomainDropdown.classList.remove("show");
    dropdownPlaceholder.innerText = e.target.value;
    domainDataBuilder(e.target.value); // This is where the charts themselves get built
    chartContainer.style.display = "block";
  });
});

function removeGraphs() {
  adminChartContainer.innerHTML = "";
  censusChartContainer.innerHTML = "";
  surveyChartContainer.innerHTML = "";
}

// Fetch CSV file and return data
// @param {string} file - File path for CSV config file
// @returns {string} file - Escaped string of CSV file
async function fetchCSVFile(file)  {
  const response = await fetch(file);
  const data = await response.text();
  return data;
}

// Fetch JSON config file and return data
// Returns an array of objects containing Site codes and names
// @param {string} file - File path for json config file
// @returns {array} - An array of smart site objects, e.g.:
//   {"smart_site": "1A", "Suggested name": "East New York"...}
async function fetchConfigFile(file)  {
  // console.log("FETCHFONGIFILE param: ", file);
  const response = await fetch(file);
  const data = await response.json();
  // console.log("FETCHCONFIGFILE return: ", data);
  return data;
}

// Community dropdown builder
(async function communityDropdownBuilder() {
  const communityData = await fetchConfigFile(communityDataFile);
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
  const configData = await fetchConfigFile(chartContainer.dataset.config);

  // An object with domain (string), subdomain (string), admin (array), census
  // (array), and survey (array)
  const subDomainData = configData[subDomain];

  // Get the total of the types of charts
  countCensusCharts = subDomainData.census.length ? subDomainData.census.length : 0;
  // countSurveyCharts = subDomainData.survey.length ? subDomainData.survey.length : 0;

  if (subDomainData.admin) {
    for (let i = 0; i < subDomainData.admin.length; i++) {
      chartElementDivBuilder(subDomainData.admin[i], adminChartContainer);
      processSubDomainDataFile({data: subDomainData.admin, id: subDomainData.admin[i].indicatorID, type: "admin"});
    }
  }

  if (subDomainData.census) {
    processSubDomainDataFile({data: subDomainData.census, id: `${countCensusCharts}`, type: "census"});
  }

  if (subDomainData.survey) {
    // surveyDropdownBuilder(subDomainData.survey);
    // processSubDomainDataFile({data: subDomainData.survey, id: `${countSurveyCharts}`, type: "survey"});
    for (let i = 0; i < subDomainData.survey.length; i++) {
      chartElementDivBuilder(subDomainData.survey[i], surveyChartContainer);
      processSubDomainDataFile({data: subDomainData.survey, id: subDomainData.survey[i].indicatorID, type: "survey"});
    }
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
const processSubDomainDataFile = (obj) => {
  // console.log("PROCESSSUBDOMAINDATAFILE param: ", obj);
  const data = obj.data;
  let filePath = "";
  if (data.length > 0) {
    data.forEach(item => {
      filePath = chartContainer.dataset[item.fileRef];
      fileRef = item.fileRef;
    });
    processDataFromCsv({file: filePath, id: obj.id, type: obj.type, fileRef: fileRef});
  }
};

// @requiredby processSubDomainDataFile
// @params {object} { file: string, id: string, type: string }
const processDataFromCsv = async (obj) => {
  // console.log("PROCESSING DATA FROM CSV: ", obj.file);
  const dataRequest = await fetchCSVFile(obj.file);
  const label = removeUnnecessaryChar(dataRequest.split("\n")[0]).split(",");

  const data = csvDataIntoArray(dataRequest);
  const newData = processData(createObjFromData({ label, data, id: obj.id, type: obj.type, source: obj.fileRef }));
  // console.log("PROCESSDATAFROMCSV newData: ", newData);
  delegateChartType(newData);

  if (obj.type === "admin") {
    cityWideDataFilled = true;
    const cityWideRequest = await fetchCSVFile(obj.file);
    const citywideLabel = removeUnnecessaryChar(cityWideRequest.split("\n")[0]).split(",");
    const city = csvDataIntoArray(cityWideRequest);
    // console.log("CITYWIDEREQUEST: ", city);
    const newData = processData(createObjFromData({label: citywideLabel, data: city, id: obj.id , type: "city", source: obj.fileRef }));
    // console.log("CITY NEWDATA: ", newData);
    delegateChartType(newData);
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
 *   label:
 *   id:
 *   type:
 * }
 * @returns {SubdomainObject} A subdomain object
 */
function createObjFromData(obj) {
  // console.log("CREATEOBJFROMDATA param: ", obj);

  const labeledData = obj.data.map((dataItem, i) => {
    const labeledDataRow = {};

    for (let i = 0; i < obj.label.length; i++) {
      labeledDataRow[obj.label[i]] = removeUnnecessaryChar(dataItem[i]);
    }

    return labeledDataRow;
  });

  // let dataArray = [];
  //
  // for (let i = 0; i < obj.data.length; i++) {
  //   let dataObj = {};
  //   let dataResponse = obj.data[i];
  //   for (let j = 0; j < dataResponse.length; j++) {
  //     let item = dataResponse[j];
  //     let label = obj.label[j];
  //     dataObj[label] = removeUnnecessaryChar(item);
  //   }
  //   dataArray.push(dataObj);
  // }

  const subdomainObj = new SubdomainObject(labeledData, obj.id, obj.type, obj.source);

  // console.log("createObjFromData return: ", subdomainObj);
  return subdomainObj;
}

// Takes a Subdomain Object, processes it, and passses it to the chart drawing
// function delegateChartType
//
// @requiredby processDataFromCsv
// @param {SubdomainObject} subdomainObject
function processData(subdomainObject) {
  // console.log("PROCESSDATA param: ", subdomainObject);
  const dataResponse = subdomainObject.data;
  const subdomainObj = new SubdomainObject({}, subdomainObject.id, subdomainObject.type, subdomainObject.source);

  const dataArray = dataResponse.filter((data) => {
    return (data.smart_site === communityCode && data.sub_domain === domainSelected && subdomainObject.type !== "city");
  });

  if (subdomainObject.type === "city") {
    citywideData = [ ...subdomainObject.data ];
  } else if (subdomainObject.type === "census") {
    subdomainObj.data=dataArray;
  } else if (subdomainObject.type === "survey") {
    subdomainObj.data=dataArray;
  } else { // Is Admin data
    const dataFiltered = dataArray.filter((data) => {
      // Admin data does this multiple times, so we have to filter by indicator
      // Admin data should also only use "Rate" data type
      return (Number(data.indicator_id) === subdomainObject.id && data.data_type === "Rate" );
    });
    subdomainObj.data=dataFiltered;
  }

  // console.log("PROCESSDATA return: ", subdomainObj);
  return subdomainObj;
}


// Called by: processData
// @param {SubdomainObject} subdomainObject
// {
//   "data": array of objects
//     {
//       "smart_site", "site_group", "wave", "domain", "sub_domain"
//     }
//   "id": e.g. "survey-chart-2"
//   "type": e.g. "survey"
// }
//
function delegateChartType(subdomainObject) {
  // console.log("DELEGATECHARTTYPE param: ", subdomainObject);
  if (subdomainObject.data.length > 0) {
    switch (subdomainObject.type) {
      case "admin":
        google.charts.load("current", { packages: ["corechart", "line"] });
        google.charts.setOnLoadCallback(() => drawChartAdmin(subdomainObject));
        adminChartContainer.style.display = "block";
        break;
      case "census":
        google.charts.load("current", { packages: ["corechart", "bar"] });
        google.charts.setOnLoadCallback(() => drawChartCensus(subdomainObject));
        censusChartContainer.style.display = "block";
        break;
      case "survey":
        google.charts.load("current", { packages: ["bar"] });
        google.charts.setOnLoadCallback(() => drawChartSurvey(subdomainObject));
        surveyChartContainer.style.display = "block";
        break;
      default:
        break;
    }
  } else {
    console.error("No data available");
  }
}

// Draw the admin data chart in the existing div we created with
// chartElementDivBuilder
//
// @parm {SubdomainObject} subdomainObject
function drawChartAdmin(subdomainObj) {
  // console.log("DRAWCHARTADMIN param: ", subdomainObj);
  const dataTable = new google.visualization.DataTable();
  const data = subdomainObj.data;
  const chartId = subdomainObj.id;
  const paragraph = document.getElementById(`chart-content-p-${chartId}`);
  let cityArrayMatch = [];
  let communityValues = [];
  let citywideValues = [];
  let dataArrayMapped = [];
  let quarters = [];
  // let quarterIndex = 0;

  if (data[0].description) {
    paragraph.innerText = data[0].description;
  }

  if (data[0]) {
    // console.log("CITY WIDE DATA: ", citywideData);
    // console.log("CHART ID", chartId);
    // console.log("RESPONSE: ", data);
    cityArrayMatch = citywideData.filter((item) => {
      return (Number(item.indicator_id) === chartId && item.smart_site === "Citywide" && item.data_type === "Rate" );
    });
  }

  // console.log("CITY ARRAY MATCH: ", cityArrayMatch);

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

  let options = {
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

function drawChartCensus(obj) {
  // console.log('DRAWCHARTCENSUS param: ', obj);
  const response = obj.data;
  // console.log('census: ', response);
  let dataArrayMapped = [];

  const data = new google.visualization.arrayToDataTable([
    ["string", response[0].indicator],
    [response[0].indicator, +response[0].value]
  ]);

  let options = {
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
    chartArea: {width: "50%"},
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

  let chart = new google.visualization.BarChart(document.getElementById("census-container"));
  chart.draw(data, options);
}

function drawChartSurvey(subdomainObj) {
  console.log("DRAWCHARTSURVEY param: ", subdomainObj);
  const data = subdomainObj.data;
  const chartId = subdomainObj.id;
  let demoGroups = [];
  let chartOptions = document.getElementById(`chart-options-${chartId}`);
  let chartArea = document.getElementById(`chart-${chartId}`);
  let selectedDemo = "";

  // Only do this stuff if we have demographic data
  if (data[0].demographic) {
    // Get an array of unique demographic groups
    data.forEach(item => {
      if (demoGroups.findIndex(group => group.demographic_level === item.demographic_level) === -1) {
        demoGroups.push({demographic: item.demographic, demographic_level: item.demographic_level});
      }
    });

    // Start by choosing the first demographic group
    selectedDemo = demoGroups[0].demographic_level;

    let demoDropdown = document.createElement("select");
    demoDropdown.setAttribute("id", `demo-dropdown-${chartId}`);

    demoGroups.forEach(demoGroup => {
      let demoOption = document.createElement("option");
      demoOption.innerText = `${demoGroup.demographic}: ${demoGroup.demographic_level}`;
      demoOption.setAttribute("value", demoGroup.demographic_level);
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

  let options = {
    colors: [
      "#016789",
      "#DEAA00",
      "#7ACFE5",
    ],
    legend: {
      position: "none",
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

    dataTable.addColumn("string", "Wave");
    dataTable.addColumn("number", "Score");

    let dataArrayMapped = [];

    data.forEach(item => {
      if (chartId === Number(item.indicator_id) && selectedDemo === item.demographic_level) {
        dataArrayMapped.push([item.wave, +item.value]);
      }
    });

    dataTable.addRows([ ...dataArrayMapped ]);

    chart.draw(dataTable, options);
  };

  redrawSurveyChart();
}
