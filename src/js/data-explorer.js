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
// const domainDropdown = document.getElementById('domain-dropdown');

const communityDropdown = document.getElementById('community-dropdown');
const domainClicked = document.querySelectorAll('.sub-domain-option');
const communityTitle = document.getElementById('community-title');
const raceData = document.getElementById('race-data');
const ageData = document.getElementById('age-data');
const dataRenderDiv = document.getElementById('data-render');
const dataContainer = document.getElementById('data-container');
const chartContainer = document.getElementById('chart-container');
const dropdownPlaceholder = document.getElementById('dropdown-placeholder');
const collapseSubDomainDropdown = document.getElementById('collapseOne');
const adminChartContainer = document.getElementById('admin-container');
const censusChartContainer = document.getElementById('census-container');
const surveyChartContainer = document.getElementById('survey-container');
const adminChartGraphContainer = document.getElementById('admin-chart');
const censusChartGraphContainer = document.getElementById('census-chart');
const surveyChartGraphContainer = document.getElementById('survey-chart');
const surveyDropdown = document.getElementById('survey-dropdown');
const boroughMap = document.getElementById('borough-map');

const demographyDataFile = dataContainer.dataset.demography;
const communityDataFile = dataContainer.dataset.community;

let cityWideDataFilled = false;
let citywideData = [];
let domainSelected = '';
let communityCode = '';
let countCensusCharts = 0;
let countSurveyCharts = 0;

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
communityDropdown.addEventListener('change', (e) => {
  domainSelected = communityDropdown.options[communityDropdown.selectedIndex].text;
  communityCode = communityDropdown.options[communityDropdown.selectedIndex].value;
  removeDemographyData();
  getDemographyData(communityDropdown.value);
  communityTitle.innerText = domainSelected;
  dataRenderDiv.style.display = 'flex';
  dataContainer.style.display = 'flex';
  boroughMap.setAttribute('class', '');
  boroughMap.classList.add('community-' + communityCode);
});

// Render Community population data
const getDemographyData = async (smart_site) => {
  const data = await fetchCSVFile(demographyDataFile);
  const demographyData = data.split('\n').splice(1);
  let filteredDemographyData = [];
  demographyData.forEach(value => {
    const row = value.split(',');
    const value_smart_site = `"${smart_site}"`;
    const cleanedValue = row.map(str => str.replace(/["]+/g, ''));
    if (row[0] === value_smart_site && value !== "") {
      filteredDemographyData.push(cleanedValue);
    }
  });

  // Total population
  const totalPopulation = document.getElementById('total-population');
  totalPopulation.innerText = filteredDemographyData[0][6];

  // Sex/Gender population
  const femalePercentage = document.getElementById('female-percentage');
  const malePercentage = document.getElementById('male-percentage');
  femalePercentage.innerText = filteredDemographyData[1][6] + '%';
  malePercentage.innerText = filteredDemographyData[2][6] + '%';

  // Race/Ethnicity population
  const raceDataDiv = document.createElement('div');
  raceDataDiv.setAttribute('id', 'race-population');

  if (raceDataDiv.hasChildNodes()) {
    raceDataDiv.remove();
  }
  filteredDemographyData.forEach(item => {
    if (item[3] === 'Race/ethnicity') {
      raceDataDiv.appendChild(createChildElementData(item));
    }
  });
  raceData.append(raceDataDiv);

  // Age Group population
  let ageDataDiv = document.createElement('div');
  ageDataDiv.setAttribute('id', 'age-population');
  if (ageData.childNodes.length > 1) {
    ageDataDiv.remove();
    ageDataDiv = document.createElement('div');
  }
  filteredDemographyData.forEach(item => {
    if (item[3] === 'Age Group') {
      ageDataDiv.appendChild(createChildElementData(item));
    }
  });
  ageData.append(ageDataDiv);
};

function removeDemographyData() {
  if (document.getElementById('race-population')) {
    const totalPopulation = document.getElementById('total-population');
    const femalePercentage = document.getElementById('female-percentage');
    const malePercentage = document.getElementById('male-percentage');
    const racePopulation = document.getElementById('race-population');
    const agePopulation = document.getElementById('age-population');
    totalPopulation.innerText = '';
    femalePercentage.innerText = '';
    malePercentage.innerText = '';
    communityTitle.innerText = '';
    racePopulation.remove();
    agePopulation.remove();
    // console.log('deleted!');
  }
}

const createChildElementData = dataArray => {
  const dataChildContainer = document.createElement('div');
  const dataPercentageElem = document.createElement('p');
  const dataTitleElem = document.createElement('p');
  dataPercentageElem.innerText = dataArray[6] + '%';
  dataPercentageElem.classList.add('data-explorer__demo-data-cell-label');
  dataTitleElem.innerText = dataArray[4];
  dataChildContainer.appendChild(dataPercentageElem);
  dataChildContainer.appendChild(dataTitleElem);
  dataChildContainer.setAttribute('class', 'data-explorer__demo-data-cell');
  dataTitleElem.setAttribute('class', '');
  return dataChildContainer;
};

// Update Domain data on Sub-Domain Dropdown selected
domainClicked.forEach(button => {
  button.addEventListener('click', e => {
    // console.log("domain clicked");
    adminChartContainer.style.display = 'none';
    censusChartContainer.style.display = 'none';
    surveyChartContainer.style.display = 'none';
    removeGraphs();

    domainSelected = e.target.value;
    collapseSubDomainDropdown.classList.remove('show');
    dropdownPlaceholder.innerText = e.target.value;
    domainDataBuilder(e.target.value); // This is where the charts themselves get built
    chartContainer.style.display = 'block';
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
      const communityOption = document.createElement('option');
      const communityText = document.createTextNode(`${element['Suggested name']} -- ${element.borough}`);
      communityOption.appendChild(communityText);
      communityOption.setAttribute('value', element.smart_site);
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
  countSurveyCharts = subDomainData.survey.length ? subDomainData.survey.length : 0;

  if (subDomainData.admin) {
    for (let i = 0; i < subDomainData.admin.length; i++) {
      adminElementDivBuilder(subDomainData.admin[i]);
      processSubDomainDataFile({data: subDomainData.admin, id: subDomainData.admin[i].indicatorID, type: 'admin'});
    }
  }

  if (subDomainData.census) {
    processSubDomainDataFile({data: subDomainData.census, id: `${countCensusCharts}`, type: 'census'});
  }

  if (subDomainData.survey) {
    surveyDropdownBuilder(subDomainData.survey);
    processSubDomainDataFile({data: subDomainData.survey, id: `${countSurveyCharts}`, type: 'survey'});
  }
}

// Create divs to house the Admin data charts
// We fill these in later with drawChartAdmin
// @param {object} data - arrayOf({
//     indicatorID: {number},
//     indicatorName: {string},
//     source: {number},
//     fileRef: {string},
//   })}
function adminElementDivBuilder(data) {
  // console.log("ADMINELEMENTDIVBUILDER param: ", data);
  const chartElement = document.createElement('div');
  chartElement.setAttribute('class', 'container data-explorer__row');
  adminChartContainer.appendChild(chartElement);

  const chartContent = document.createElement('div');
  chartContent.setAttribute('id', `admin-chart-content-${data.indicatorID}`);
  chartContent.setAttribute('class', 'data-explorer__content');

  const chartGraph = document.createElement('div');
  chartGraph.setAttribute('id', `admin-chart-${data.indicatorID}`);
  chartGraph.setAttribute('class', 'data-explorer__chart');

  chartElement.appendChild(chartContent);
  chartElement.appendChild(chartGraph);

  const header = document.createElement('div');
  const paragraph = document.createElement('p');
  header.setAttribute('id', `admin-chart-content-h1-${data.indicatorID}`);
  header.classList.add('data-explorer__chart-title');
  header.innerText = `${data.indicatorName}`;
  paragraph.setAttribute('id', `admin-chart-content-p-${data.indicatorID}`);
  chartContent.appendChild(header);
  chartContent.appendChild(paragraph);
}

// @usedby domainDataBuilder
// @param surveyData
function surveyDropdownBuilder(surveyData) {
  // console.log("SURVEYDROPDOWNBUILDER param: ", surveyData);
  surveyData.forEach(item => {
    let indicator = document.createElement('option');
    indicator.innerText = item.indicatorName;
    indicator.setAttribute('value', item.indicatorID);
    surveyDropdown.appendChild(indicator);
  });
}

// @requiredby adminElementDivBuilder, domainDataBuilder
// @param {object}
const processSubDomainDataFile = (obj) => {
  // console.log("PROCESSSUBDOMAINDATAFILE param: ", obj);
  const data = obj.data;
  let filePath = '';
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
  const label = removeUnnecessaryChar(dataRequest.split('\n')[0]).split(',');

  const data = csvDataIntoArray(dataRequest);
  const newData = processData(createObjFromData({ label, data, id: obj.id, type: obj.type, source: obj.fileRef }));
  delegateChartType(newData);

  if (obj.type === 'admin') {
    cityWideDataFilled = true;
    const cityWideRequest = await fetchCSVFile(obj.file);
    const citywideLabel = removeUnnecessaryChar(cityWideRequest.split('\n')[0]).split(',');
    // console.log("CITYWIDEREQUEST: ", cityWideRequest);
    const city = csvDataIntoArray(cityWideRequest);
    const newData = processData(createObjFromData({label: citywideLabel, data: city, id: obj.id , type: 'city', source: obj.fileRef }));
    delegateChartType(newData);
  }
};

function csvDataIntoArray(str) {
  const strPcss = removeUnnecessaryChar(str);
  const data = strPcss.slice(strPcss.indexOf('\n') + 1)
    .split('\n')
    .map(v => v.split(','));
  return data;
}

function removeUnnecessaryChar(string) {
  let removeExtraSpaces = string.replace(/  +/g, ' ');
  let removeDoubleQuotes = removeExtraSpaces.replace(/['"]+/g, '');
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
  // let dataArray = [];

  const labeledData = obj.data.map((dataItem, i) => {
    const labeledDataRow = {};

    for (let i = 0; i < obj.label.length; i++) {
      labeledDataRow[obj.label[i]] = removeUnnecessaryChar(dataItem[i]);
    }

    return labeledDataRow;
  });

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
  const dataResponse = subdomainObject.data;
  const subdomainObj = new SubdomainObject({}, subdomainObject.id, subdomainObject.type, subdomainObject.source);

  const dataArray = dataResponse.filter((data) => {
    return (data.smart_site === communityCode && data.sub_domain === domainSelected && subdomainObject.type !== 'city');
  });

  if (subdomainObject.type === 'city') {
    citywideData = [ ...subdomainObject.data ];
  } else if (subdomainObject.type === 'census') {
    subdomainObj.data=dataArray;
  } else if (subdomainObject.type === 'survey') {
    subdomainObj.data=dataArray;
  } else { // Is Admin data
    const dataFiltered = dataArray.filter((data) => {
      // Admin data does this multiple times, so we have to filter by indicator
      // Admin data should also only use "Rate" data type
      return (Number(data.indicator_id) === subdomainObject.id && data.data_type === "Rate\r" );
    });
    subdomainObj.data=dataFiltered;
  }

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
  switch (subdomainObject.type) {
    case 'admin':
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(() => drawChartAdmin(subdomainObject));
      adminChartContainer.style.display = 'block';
      break;
    case 'census':
      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(() => drawChartCensus(subdomainObject));
      censusChartContainer.style.display = 'block';
      break;
    case 'survey':
      google.charts.load('current', { packages: ['bar'] });
      google.charts.setOnLoadCallback(() => drawChartSurvey(subdomainObject));
      surveyChartContainer.style.display = 'block';
      break;
    default:
      break;
  }
}

// Draw the admin data chart in the existing div we created with
// adminElementDivBuilder
//
// @parm {SubdomainObject} subdomainObject
function drawChartAdmin(subdomainObj) {
  // console.log("DRAWCHARTADMIN param: ", subdomainObj);
  const data = new google.visualization.DataTable();
  const response = subdomainObj.data;
  const chartId = subdomainObj.id;
  const paragraph = document.getElementById(`admin-chart-content-p-${chartId}`);
  let cityArrayMatch = [];
  let communityValues = [];
  let citywideValues = [];
  let dataArrayMapped = [];
  let quarters = [];
  // let quarterIndex = 0;

  if (response[0].description) {
    paragraph.innerText = response[0].description;
  }

  if (response[0]) {
    // console.log("CITY WIDE DATA: ", citywideData);
    // console.log("CHART ID", chartId);
    // console.log("RESPONSE: ", response);
    cityArrayMatch = citywideData.filter((item) => {
      return (Number(item.indicator_id) === chartId && item.smart_site === 'Citywide' && item.data_type === "Rate\r" );
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

  response.forEach(item => {
    if (response[0].indicator_id === item.indicator_id ) {
      communityValues.push(item.value);
      // quarterIndex++;
      // if (quarterIndex % 5 === 0) {
      //   quarterIndex = 1;
      // }

      const labels = yearQuarterLabels[subdomainObj.source];
      const year = item[labels.year];
      const quarter = item[labels.quarter];

      const yearQuarter = year + ' Q' + quarter;

      quarters.push(yearQuarter);
    }
  });

  if (cityArrayMatch.length > 0) {
    data.addColumn('string', response[0].indicator_id);
    data.addColumn('number', `Site ${response[0].smart_site}`);
    data.addColumn('number', 'Citywide');

    cityArrayMatch.forEach(item => {
      citywideValues.push(item.value);
    });

    for (let i = 0; i < communityValues.length; i++) {
      dataArrayMapped.push([quarters[i], +communityValues[i], +citywideValues[i]]);
    }
    data.addRows([ ...dataArrayMapped ]);

  } else {
    data.addColumn('string', response.indicator);
    data.addColumn('number', 'Values');

    for (let i = 0; i < communityValues.length; i++) {
      dataArrayMapped.push([quarters[i], +communityValues[i]]);
    }
    data.addRows([ ...dataArrayMapped ]);
  }

  let options = {
    colors: [
      '#016789',
      '#DEAA00',
      '#7ACFE5',
    ],
    legend: {
      position: 'bottom',
    },
    hAxis: {
      baselineColor: '#aaaaaa',
      title: 'Quarter',
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
  let chart = new google.visualization.LineChart(document.getElementById(`admin-chart-${chartId}`));
  chart.draw(data, options);
}

function drawChartCensus(obj) {
  // console.log('DRAWCHARTCENSUS param: ', obj);
  const response = obj.data;
  // console.log('census: ', response);
  let dataArrayMapped = [];

  const data = new google.visualization.arrayToDataTable([
    ['string', response[0].indicator],
    [response[0].indicator, +response[0].value]
  ]);

  let options = {
    legend: {
      position: 'bottom',
    },
    title: response.domain,
    backgroundColor: "transparent",
    chartArea: {width: '50%'},
    isStacked: true,
    hAxis: {
      title: response.domain + ' - ' + response.sud_domain,
      minValue: 0,
      maxValue: 100,
    },
    vAxis: {
      title: 'Indicator'
    }
  };

  let chart = new google.visualization.BarChart(document.getElementById('census-container'));
  chart.draw(data, options);
}

function drawChartSurvey(obj) {
  // console.log("DRAWCHARTSURVEY param: ", obj);
  const data = new google.visualization.DataTable();
  const response = obj.data;
  let dataArrayMapped = [];

  surveyDropdown.addEventListener('change', e => {
    indicatorSelected = surveyDropdown.options[surveyDropdown.selectedIndex].text;
    indicatorId = surveyDropdown.options[surveyDropdown.selectedIndex].value;
    // console.log(indicatorSelected);
    // console.log(indicatorId);
  });

  data.addColumn('string', response[0].indicator);
  // data.addColumn('number', 'ci_lower');
  // data.addColumn('number', 'ci_upper');
  data.addColumn('number', 'value');

  for (let i = 0; i < response.length; i++) {
    dataArrayMapped.push([response[i].wave, +response[i].value]);
  }
  data.addRows([ ...dataArrayMapped ]);
  let options = {
    legend: {
      position: 'bottom',
    },
    backgroundColor: "transparent",
    chart: { title: response.indicator },
    vAxis: {
      format: "decimal",
      viewWindow: { max: 1 },
    },
  };

  let chart = new google.charts.Bar(document.getElementById('survey-container'));
  chart.draw(data, google.charts.Bar.convertOptions(options));
}
