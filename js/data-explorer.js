// jshint esversion: 8

/**
 * https://developers.google.com/chart/interactive/docs/reference
 * https://developers.google.com/chart/interactive/docs/gallery/linechart
 */

// TODO function to fetch the CSV file when user selects the Domain dropdown
// const domainDropdown = document.getElementById('domain-dropdown');
const communityDropdown = document.getElementById('community-dropdown');
const domainClicked = document.querySelectorAll('.sub-domain-option');
const communityTitle = document.getElementById('community-title');
const domainHeader = document.getElementById('domain-header');
const raceData = document.getElementById('race-data');
const ageData = document.getElementById('age-data');
const dataRenderDiv = document.getElementById('data-render');
const dataContainer = document.getElementById('data-container');
const chartContainer = document.getElementById('chart-container');
const dropdownPlaceholder = document.getElementById('dropdown-placeholder');
const collapseSubDomainDropdown = document.getElementById('collapseOne');
let domainSelected = '';
let communityCode = '';
let dataset = '';
let countSubDomain = 0;
const DATA_OBJ = {};
DATA_OBJ.menu = [];

// Update community data on Community dropdown selected
communityDropdown.addEventListener("change", (e) => {
  domainSelected = communityDropdown.options[communityDropdown.selectedIndex].text;
  communityCode = communityDropdown.options[communityDropdown.selectedIndex].value;
  let dataTitle = document.createTextNode('');
  dataTitle.nodeValue = communityDropdown.options[communityDropdown.selectedIndex].text;
  communityTitle.appendChild(dataTitle);
  getDemographyData(communityDropdown.value);
  // dataRenderDiv.style.display = 'flex';
  // dataContainer.style.display = 'block';  
  console.log('%c1. COMMUNITY SELECTED: ', 'color: #ff006e');
  console.log(communityDropdown.options[communityDropdown.selectedIndex].text);
  console.log('%c1. COMMUNITY CODE: ', 'color: #ff006e');
  console.log(communityDropdown.options[communityDropdown.selectedIndex].value);
});

// Render Community population data
const getDemographyData = async (smart_site) => {
  const data = await fetchCSVFile('./data/Census/Census_Demographic_Data.csv');
  const demographyData = data.split('\n').splice(1);
  let filteredDemographyData = [];
  demographyData.forEach(value => {
    const row = value.split(',');
    const value_smart_site = `"${smart_site.split("").reverse().join("")}"`;
    if (row[0] === value_smart_site) {
      const cleanedValue = row.map(str => str.replace(/["]+/g, ''));
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

const createChildElementData = dataArray => {
  const dataContainer = document.createElement('div');
  const dataPercentageElem = document.createElement('p');
  const dataTitleElem = document.createElement('p');
  dataPercentageElem.innerText = dataArray[6] + '%';
  dataTitleElem.innerText = dataArray[4];
  dataContainer.appendChild(dataPercentageElem);
  dataContainer.appendChild(dataTitleElem);
  dataContainer.setAttribute('class', 'row');
  dataContainer.setAttribute('id', 'data-container');
  dataPercentageElem.setAttribute('class', 'col-3');
  dataTitleElem.setAttribute('class', 'col');
  return dataContainer;
};

// Update Domain data on Sub-Domain Dropdown selected
domainClicked.forEach(button => {
  button.addEventListener('click', e => {
    console.log('%c2. SUBDOMAIN SELECTED: ', 'color: #ffbe0b');
    console.log(e.target.value);
    domainSelected = e.target.value;
    collapseSubDomainDropdown.classList.remove('show');
    dropdownPlaceholder.innerText = e.target.value;
    domainDataBuilder(e.target.value);
    // chartContainer.style.display = 'block';
  });
});

// Fetch CSV file and return data
async function fetchCSVFile(file)  {
  const response = await fetch(file);
  const data = await response.text();
  return data;
}

// Fetch JSON config file and return data
async function fetchConfigFile(file)  {
  const response = await fetch(file);
  const data = await response.json();
  return data;
}

// Community dropdown builder
(async function communityDropdownBuilder() {
  const communityData = await fetchConfigFile('./smart_site.json');
  for (const community in communityData) {
    if (Object.hasOwnProperty.call(communityData, community)) {
      const element = communityData[community];
      const communityOption = document.createElement('option');
      const communityText = document.createTextNode(element['Suggested name'] + " -- " + element['borough']);
      communityOption.appendChild(communityText);
      communityOption.setAttribute('value', element['smart_site']);
      communityDropdown.appendChild(communityOption);
    }
  }
})();

// Sub-Domain data
async function domainDataBuilder(subDomain) {
  const domainData = await fetchConfigFile('./csv-config.json');
  const subDomainData = domainData[subDomain];
  console.log('%c3. DOMAIN DATA BUILDER - SubDomainnData object:', 'color: #80ffdb');
  console.log(subDomainData);
  console.log('%c3. admin obj:', 'color: #80ffdb');
  console.log(subDomainData.admin);
  processSubDomainDataFile(subDomainData.admin, 'admin');
  console.log('%c3. census obj:', 'color: #80ffdb');
  console.log(subDomainData.census);
  processSubDomainDataFile(subDomainData.census, 'census');
  console.log('%c3. survey obj:', 'color: #80ffdb');
  console.log(subDomainData.survey);
  // processSubDomainDataFile(subDomainData.survey, 'survey');
  // let dataTitle = document.createTextNode('');
  // dataTitle.innerText = domainData['domain'] + " - " + domainData['subDomain'];
  // for (const data in domainData) {
  //   if (Object.hasOwnProperty.call(domainData, data)) {
  //     const subDomainObj = domainData[data];
  //     console.log(subDomainObj[subDomain]);
  //     if (subDomainObj['subDomain'] === subDomain) {
  //       domainHeader.innerText = domainData[subDomain]['domain'] + " - " + domainData[subDomain]['subDomain'];
  //       processSubDomainDataFile(subDomainObj);
  //     }
  //   }
  // }
}

// function fetchDomainFiles (item, file) {
//   if (file === item.file) {
//   } else {
//     fetchCSVFile(file);
//   }
//   return item.file;
// }

const processSubDomainDataFile = (subDomain, type) => {
  console.log('%c6. ' + type + 'SUB DOMAIN ARRAY:', 'color: #00bbf9');
  console.log(subDomain);
  let file = '';
  if (subDomain.length > 0) {
    subDomain.forEach(item => {
      console.log('%c6. SUB DOMAIN FILE URL:', 'color: #00bbf9');
      console.log(item.file, type);
      console.log('%c6. CSV TO ARRAY:', 'color: #00bbf9');
      csvToArray(item.file, type);
    });
  }
};

// async function processCSVData(file)  {
//   const data = await fetchCSVFile(file);
//   const table = data.split('\n').splice(1);
//   console.log('%c7. PROCESSING FILE:', 'color: #ccff33');
//   console.log(table.length);
//   return table;
// }

const csvToArray = async (file, type) => {
  countSubDomain++;
  const data = await fetchCSVFile(file);
  const header = removeUnnecessaryChars(data.split('\n')[0]).split(',');
  console.log('%c8. HEADER PROCESSED:', 'color: #ccff33');
  console.log(header);
  
  DATA_OBJ[domainSelected + countSubDomain] = header.length;
  DATA_OBJ.menu.push(header);
  
  const strPcss = removeUnnecessaryChars(data);
  const response = strPcss.slice(strPcss.indexOf('\n') + 1)
  .split('\n')
  .map(v => v.split(','));
  
  console.log('%c8. FILE FETCHED:', 'color: #ccff33');
  console.log(response[0]);

  const dataObj = {
    header,
    data: response,
    type
  };

  processData(createObjFromData(dataObj));

  dataset = response;

  // console.log('%c0. DATA_OBJ:', 'color: #fb5607');
  // console.log(DATA_OBJ);
};

function removeUnnecessaryChars(string) {
  const removeDoubleQuotes = string.replace(/['"]+/g, '');
  return removeDoubleQuotes;
}

function createObjFromData(obj) {
  console.log('OBJECT ////', obj.type, obj);
  let dataArray = [];
  for (let i = 0; i < obj.data.length; i++) {
    let dataObj = {};
    let dataResponse = obj.data[i];
    for (let j = 0; j < dataResponse.length; j++) {
      let item = dataResponse[j];
      let label = obj.header[j];
      dataObj[label] = item;
    }
    dataArray.push(dataObj);
  }
  // console.log("%c10. DATA OBJ HEADER: ", "color: #fcca46");
  console.log("data array", dataArray);
  return {data: dataArray, type: obj.type};
}

function processData(obj) {
  console.log('%c11. Object: ', 'color: #ef233c');
  const code = communityCode.split("").reverse().join("");
  const dataResponse = obj.data;
  console.log(dataResponse[0]);
  console.log(code);
  console.log(domainSelected);
  
  dataResponse.forEach(arr => {
    if (arr.smart_site === code && arr.sub_domain === domainSelected) {
      // count++;
      console.log('%c11. PROCESS DATA Function: ', 'color: #ef233c');
      console.log('11.1 code pass: ', arr.smart_site);
      console.log('11.2 domain pass: ', arr.sub_domain);
      console.log(arr);
      console.log('11.3 Indicator Label: ', arr.indicator);
      createChart({data: arr, type: obj.type});
    }
  });
}

function createChart (obj) {
  // Load packages for particular Chart Type
  console.log(obj);
  switch (obj.type) {
    case 'admin':
      google.charts.load('current', { packages: ['corechart', 'line'] });
      google.charts.setOnLoadCallback(drawChartAdmin);      
      break;
    case 'census':
      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(drawChartCensus);  
      google.charts.setOnLoadCallback(drawChartCensusTwo);  
      break;
    case 'survey':
      google.charts.load('current', { packages: ['corechart', 'bar'] });
      google.charts.setOnLoadCallback(drawChartSurvey);      
      break;  
    default:
      break;
  }
}


function drawChartCensus() {
  var data = google.visualization.arrayToDataTable([
    ['Indicator', 'Severe rent burden'],
    ['Severe rent burden', 8.4]
  ]);

  var options = {
    title: 'Economic Security',
    chartArea: {width: '50%'},
    isStacked: true,
    hAxis: {
      title: 'Severe rent burden',
      minValue: 0,
    },
    vAxis: {
      title: 'Indicator'
    }
  };
  var chart = new google.visualization.BarChart(document.getElementById('census-chart'));
  chart.draw(data, options);
}

function drawChartCensusTwo() {
  var data = google.visualization.arrayToDataTable([
    ['Indicator', 'Rent burden'],
    ['Rent burden', 44.8]
  ]);

  var options = {
    title: 'Economic Security',
    chartArea: {width: '50%'},
    isStacked: true,
    hAxis: {
      title: 'Rent burden',
      minValue: 0,
    },
    vAxis: {
      title: 'Indicator'
    }
  };
  var chart = new google.visualization.BarChart(document.getElementById('census-chart-two'));
  chart.draw(data, options);
}

function drawChartSurvey() {
  var data = new google.visualization.DataTable();
  data.addColumn('wave', 'Wave');
  data.addColumn('number', 'Wave 1');
  data.addColumn('number', 'Wave 2');

  data.addRows([
    [{v: [8, 0, 0], f: '8 am'}, 1, .25],
    [{v: [9, 0, 0], f: '9 am'}, 2, .5],
    [{v: [10, 0, 0], f:'10 am'}, 3, 1]
  ]);

  var options = {
    title: 'Economic housing-related instability',
    hAxis: {
      title: 'Wave 1',
      format: 'yyyy',
      viewWindow: {
        min: [7, 30, 0],
        max: [17, 30, 0]
      }
    },
    vAxis: {
      title: 'Rating (scale of 0-1)'
    }
  };

  var chart = new google.visualization.ColumnChart(
    document.getElementById('chart_div'));

  chart.draw(data, options);
}

function drawChartAdmin(obj) {
  const graphID = Math.random().toString().substr(2, 8);
  console.log('%c ///////////////////////////////////////', 'color: #cfbaf0');
  console.log('%c12. PROCESS DATA Function: ', 'color: #cfbaf0');
  console.log('ID: ', graphID);
  console.log('obj: ', obj);

  var dataLine = new google.visualization.arrayToDataTable([

  ]);

  var opts = { 
    title: 'Google charts Title',
    csvColumns: [
      'string',
      'string',
      'string',
      'string',
      'string',
      'string',
      'string',
      'number',
      'string',
      'string',
      'string',
    ],
    csvHasHeader: true,
  };

  // var query = new google.visualization.Query(dataset, opts);
  // query.send(handleQueryResponse);

}

function handleQueryResponse(response) {
  // The criteria by which we will be filtering
  console.log(response);
  const indicator_id = '8801';
  const smart_site = '10C';

  const data = response.getDataTable();
  data.sort([{ column: 9 }, { column: 10 }]); // Sort by Year, then Quarter

  // Add a column for combining the year and quarter into a single string
  const quarterColumn = data.addColumn('string', 'quarter');

  // Add the combined strings for year + quarter
  for (var i = 0; i < data.getNumberOfRows(); i++) {
    let quarterString = data.getValue(i, 9) + ' Q' + data.getValue(i, 10);
    data.setCell(i, quarterColumn, quarterString);
  }

  // Give our value column a nicer name
  data.setColumnLabel(7, 'Count');

  // Filter data by indicator
  let filteredData = data.getFilteredRows([
    { column: 'indicator_id', value: indicator_id },
    { column: 'smart_site', value: smart_site },
  ]);

  // console.log('filtered data: ', filteredData);

  // Only grab the first ten rows
  // filteredData = filteredData.slice(400, 410);
  // console.log('short filtered data: ', filteredData);

  const view = new google.visualization.DataView(data);
  view.setRows(filteredData);

  // Only grab the quarter and value columns
  view.setColumns([quarterColumn, 7]);

  // console.log('view: ', view);

  const chartOpts = {
    title: 'Graph of ' + indicator_id + ' in site ' + smart_site,
    legend: {
      position: 'none',
    },
    pointsVisible: true,
    hAxis: {
      title: 'Quarter',
      titleTextStyle: {
        bold: true,
        italic: false,
      },
    },
    vAxis: {
      title: 'Count',
      titleTextStyle: {
        bold: true,
        italic: false,
      },
    },
  };

  const chart = new google.visualization.LineChart(document.getElementById('csv-admin'));
  chart.draw(view, chartOpts);
}
