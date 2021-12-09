<?php
/**
 * Template Name: data explorer
 * Template Post Type: Page
 */

get_header();
?>

<main id="main" class="site">

  <header>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">MAP</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
      <div class="collapse navbar-collapse" id="navbarNav">
	<ul class="navbar-nav">
	  <li class="nav-item active">
	    <a class="nav-link" href="#">What is map?<span class="sr-only">(current)</span></a>
	  </li>
	  <li class="nav-item"><a class="nav-link" href="#">Communities</a></li>
	  <li class="nav-item"><a class="nav-link" href="#">Stories</a></li>
	  <li class="nav-item"><a class="nav-link" href="#">Data explorer</a></li>
	  <li class="nav-item"><a class="nav-link" href="#">Resources</a></li>
	  <li class="nav-item"><a class="nav-link" href="#">Our team</a></li>
	</ul>      
      </div>
    </nav>
  </header>
  <div class="container-fluid main-header-container">
    <div class="row">
      <div class="col-5 m-5 p-5">
	<div class="main-header">
	  <h1>SMART TOOL</h1>
	  <p>Our Data Explorer allows people to view information across seven domains, related to each of the MAP site neighborhoods. Each domain shows an aspect of residents’ life within the community.</p>
	  <p>Created by the Mayor’s Office for Criminal Justice, in partnership with SAFELab, JJREC, NIS,  and NORC [other credits]</p>
	</div>
	<div class="data-management">
	  <h4>Choose a Community</h4>
	  <select class="custom-select col-8" id="community-dropdown">
	    <option selected>Select a Community</option>
	  </select>
	</div>
      </div>
      <div class="col-1"></div>
      <div class="col">
	<div id="data-render" class="row p-5">
	  <button class="print-bttn">
	    <p>Print PDF</p>
	    <!-- <img src="" alt="click to print pdf"> -->
	  </button>
	  <div class="section col-6">
	    <div class="section-header">
	      <img src="" alt="" srcset="">
	      <h4 class="h2 font-weight-bolder">Total Population</h4>
	      <div class="section-data p-4">
		<div class="col">
		  <h2 id="total-population"></h2>
		  <!-- <p>Inhabitants</p> -->
		</div>
	      </div>
	    </div>
	  </div>
	  <div class="section col-6">
	    <div class="section-header">
	      <img src="" alt="" srcset="">
	      <h4 class="h2 font-weight-bolder">Sex/Gender</h4>
	      <div class="section-data p-4 row">
		<div class="col-6">
		  <p id="female-percentage"></p>
		  <p>Female</p>
		</div>
		<div class="col-6">
		  <p id="male-percentage"></p>
		  <p>Male</p>
		</div>
	      </div>
	    </div>
	  </div>
	  <div class="section col-6">
	    <div class="section-header">
	      <img src="" alt="" srcset="">
	      <h4 class="h2 font-weight-bolder">Race/Ethnicity</h4>
	      <div id="race-data" class="section-data p-4">
	      </div>
	    </div>
	  </div>
	  <div class="section col-6">
	    <div class="section-header">
	      <img src="" alt="" srcset="">
	      <h4 class="h2 font-weight-bolder">Age Group</h4>
	      <div id="age-data" class="section-data">
	      </div>
	    </div>
	  </div>
	</div>
      </div>
    </div>
  </div>

  <div id="data-container" class="container-fluid">
    <header class="row p-3 mx-5 px-5">
      <div class="col-7 title p-0">
	<p class="font-weight-bold" id="community-title"></p>
	<h4>Community Administrative Data</h4>
      </div>
      <div class="col-5 category">
	<div class="row">
	  <div class="col-4">
	    <p class="m-0 py-2">Select a data category:</p>
	  </div>
	  <div class="col-8">
	    <div id="accordion">
	      <div class="card">
		<div class="card-body" id="headingOne">
		  <h5 class="mb-0">
		    <button id="dropdown-placeholder" class="btn btn-light btn-domain-header text-left py-3 px-4" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
		      Housing Security
		    </button>
		  </h5>
		</div>
	    
		<div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
		  <div class="card-body">
		    <h4 class="dropdown-header">Build Environment</h4>
		    <button class="sub-domain-option dropdown-item" type="button" value="Environmental Infrastructure">Environmental Infrastructure</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Environmental Quality">Environmental Quality</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Indoor Environmental Quality">Indoor Environmental Quality</button>
		    <h4 class="dropdown-header">Economic Readiness</h4>
		    <button class="sub-domain-option dropdown-item" type="button" value="Educational Attainment">Educational Attainment</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Youth">Youth</button>
		    <h4 class="dropdown-header">Economic Security</h4>
		    <button class="sub-domain-option dropdown-item" type="button" value="Food Insecurity">Food Insecurity</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Health Security">Health Security</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Housing Security">Housing Security</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Job Security &amp; Quality">Job Security &amp; Quality</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Poverty">Poverty</button>
		    <h4 class="dropdown-header">Physical Security</h4>
		    <button class="sub-domain-option dropdown-item" type="button" value="Other Crimes">Other Crimes</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Overall Safety">Overall Safety</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Police Misconduct and Force">Police Misconduct and Force</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Police Presence&#47;Interactions">Police Presence&#47;Interactions</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Violent Crime">Violent Crime</button>
		    <h4 class="dropdown-header">Public Security</h4>
		    <button class="sub-domain-option dropdown-item" type="button" value="Connectivity">Connectivity</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Health">Health</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Public Assistance">Public Assistance</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Transit">Transit</button>
		    <h4 class="dropdown-header">Social Structure</h4>
		    <button class="sub-domain-option dropdown-item" type="button" value="Culture">Culture</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Organized Social Connections">Organized Social Connections</button>
		    <button class="sub-domain-option dropdown-item" type="button" value="Political Power">Political Power</button>
		  </div>
		</div>
	      </div>
  
	    </div>
	  </div>
	</div>
      </div>
    </header>
  </div>

  <div id="chart-container" class="container-fluid">
    <div class="graph-section p-3 mx-5 px-5">
      <h1 class="h1" id="domain-header"></h1>

      <!-- CSV Graph Data -->
      <div id="csv-admin"></div>
      <div id="census-chart"></div>
      <div id="census-chart-two"></div>
      <div id="csv-survey"></div>
    </div>
  </div>

  <div class="card text-white map-footer mb-3">
    <div class="card-footer">
      <div class="row">
	<div class="col">
	  <div class="row">
	    <div class="col-2">
	      <h2 class="h2 text-bolder">NYC</h2>
	    </div>
	    <div class="col-2">
	      <div class="row flex-column">
		<h4 class="col">Crimminal</h4>
		<h4 class="col">Justice</h4>
	      </div>
	    </div>
	  </div>
	</div>
	<div class="col text-right">
	  <div class="row flex-column">
	    <p class="col">Neighborhood</p>
	    <h2 class="col">Stat</h2>
	  </div>
	</div>
      </div>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
  <script src="https://www.gstatic.com/charts/loader.js"></script>

</main><!-- #main -->

<?php
get_footer();
