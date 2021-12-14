<?php
/**
 * Template Name: Data Explorer
 * Template Post Type: Page
 */

get_header();
?>

<main id="main" class="site">

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

  <div id="data-container"
    data-community="<?php echo get_field('community_data'); ?>"
    data-demography="<?php echo get_field('demographic_data'); ?>"
    class="container-fluid"
  >
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

  <?php while (have_posts()) : the_post(); ?>

  <div id="chart-container"
    data-config="<?php echo get_field('config_data'); ?>"
    data-311-complaints="<?php echo get_field('311_complaints'); ?>"
    data-citywide="<?php echo get_field('citywide'); ?>"
    data-doi-evictions="<?php echo get_field('doi_evictions'); ?>"
    data-nypd-sqf="<?php echo get_field('nypd_sqf'); ?>"
    data-nypd-calls="<?php echo get_field('nypd_calls'); ?>"
    data-nypd-arrests="<?php echo get_field('nypd_arrests'); ?>"
    data-nypd-complaints="<?php echo get_field('nypd_complaints'); ?>"
    data-nypd-shootings="<?php echo get_field('nypd_shootings'); ?>"
    data-census-indicators="<?php echo get_field('census_indicators'); ?>"
    data-panel-survey="<?php echo get_field('panel_survey'); ?>"
  >
    <div class="graph-section p-3 mx-5 px-5">
      <h1 class="h1" id="domain-header"></h1>

      <!-- CSV Graph Data -->        
      <!-- Admin data visualization -->
      <div id="admin-container" class="container chart-container my-5 py-5">
      </div>

      <!-- Census data visualization -->
      <div id="census-container" class="container chart-container my-5 py-5">
	<div class="row">
	  <div class="col-4">
	    <h1 class="h1">Census</h1>
	    <p class="text-bold text-right">
	      Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, ipsam sunt eos vitae vel tenetur cumque et totam quasi, nemo quibusdam architecto doloribus dolorum alias aperiam nostrum beatae! Aspernatur, adipisci!
	    </h4>
	  </div>
	  <div class="col">
	    <div id="census-chart"></div>
	  </div>
	</div>
	<hr>
      </div>
      
      <!-- Survey data visualization -->
      <div id="survey-container" class="container chart-container my-5 py-5">
	<div class="row">
	  <div class="col-4">
	    <h1 class="h1">Survey</h1>
	    <p class="text-bold text-right">
	      Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, ipsam sunt eos vitae vel tenetur cumque et totam quasi, nemo quibusdam architecto doloribus dolorum alias aperiam nostrum beatae! Aspernatur, adipisci!
	    </h4>
	  </div>
	  <div class="col">
	    <div class="d-flex justify-content-end mx-5 col-8">
	      <select class="custom-select" id="survey-dropdown">
	      </select>
	    </div>
	    <div id="survey-chart"></div>
	  </div>
	</div>
      </div>

    </div>
  </div>

  <?php endwhile; ?>

</main><!-- #main -->

<?php
get_footer();
