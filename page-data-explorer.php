<?php
/**
 * Template Name: Data Explorer
 * Template Post Type: Page
 */

get_header();
?>

<main id="main" class="site">

  <div class="container-fluid">
    <div class="data-explorer__header">
      <div class="data-explorer__header-content">
	  <div class="data-explorer__header-title"><strong>SMART</strong> TOOL</div>
	  <p>Our Data Explorer allows people to view information across seven domains, related to each of the MAP site neighborhoods. Each domain shows an aspect of residents’ life within the community.</p>
	  <p>Created by the Mayor’s Office for Criminal Justice, in partnership with SAFELab, JJREC, NIS,  and NORC [other credits]</p>
	<div class="data-management">
	  <div>Choose a Community</div>
	  <select class="custom-select" id="community-dropdown">
	    <option selected>Select a Community</option>
	  </select>
	</div>
      </div>
      <div class="data-explorer__header-data">
	<button class="print-bttn">
	  <p>Print PDF</p>
	</button>
	<div id="data-render" class="data-explorer__demo-table">
	  <div class="data-explorer__demo-section">
	    <div class="data-explorer__demo-title">Total Population</div>
	      <div class="">
		<div id="total-population"></div>
		<!-- <p>Inhabitants</p> -->
	      </div>
	  </div>
	  <div class="data-explorer__demo-section">
	    <div class="data-explorer__demo-title">Sex/Gender</div>
	    <div class="data-explorer__demo-data-cell">
	      <p id="female-percentage" class="data-explorer__demo-data-cell-label"></p>
	      <p>Female</p>
	    </div>
	    <div class="data-explorer__demo-data-cell">
	      <p id="male-percentage" class="data-explorer__demo-data-cell-label"></p>
	      <p>Male</p>
	    </div>
	  </div>
	  <div class="data-explorer__demo-section">
	    <div class="data-explorer__demo-title">Race/Ethnicity</div>
	    <div id="race-data" class="section-data"></div>
	  </div>
	  <div class="data-explorer__demo-section">
	    <div class="data-explorer__demo-title">Age Group</div>
	    <div id="age-data" class="section-data"></div>
	  </div>
	</div>
      </div>
    </div>
  </div>

  <div id="data-container"
    data-community="<?php echo get_field('community_data'); ?>"
    data-demography="<?php echo get_field('demographic_data'); ?>"
    class="container-fluid data-explorer__category-selector"
  >
    <div class="data-explorer__category-title">
      <p id="community-title"></p>
      <div>Community Administrative Data</div>
    </div>

    <div class="data-explorer__category-selector">
      <div>
	<div>
	  <p>Select a data category:</p>
	</div>
	<div>
	  <div id="accordion">
	    <div class="card">
	      <div class="card-body" id="headingOne">
		<button id="dropdown-placeholder" class="btn btn-light btn-domain-header" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
		  Housing Security
		</button>
	      </div>
	  
	      <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordion">
		<div class="card-body">
		  <div class="dropdown-header">Build Environment</div>
		  <button class="sub-domain-option dropdown-item" type="button" value="Environmental Infrastructure">Environmental Infrastructure</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Environmental Quality">Environmental Quality</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Indoor Environmental Quality">Indoor Environmental Quality</button>
		  <div class="dropdown-header">Economic Readiness</div>
		  <button class="sub-domain-option dropdown-item" type="button" value="Educational Attainment">Educational Attainment</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Youth">Youth</button>
		  <div class="dropdown-header">Economic Security</div>
		  <button class="sub-domain-option dropdown-item" type="button" value="Food Insecurity">Food Insecurity</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Health Security">Health Security</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Housing Security">Housing Security</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Job Security &amp; Quality">Job Security &amp; Quality</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Poverty">Poverty</button>
		  <div class="dropdown-header">Physical Security</div>
		  <button class="sub-domain-option dropdown-item" type="button" value="Other Crimes">Other Crimes</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Overall Safety">Overall Safety</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Police Misconduct and Force">Police Misconduct and Force</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Police Presence&#47;Interactions">Police Presence&#47;Interactions</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Violent Crime">Violent Crime</button>
		  <div class="dropdown-header">Public Security</div>
		  <button class="sub-domain-option dropdown-item" type="button" value="Connectivity">Connectivity</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Health">Health</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Public Assistance">Public Assistance</button>
		  <button class="sub-domain-option dropdown-item" type="button" value="Transit">Transit</button>
		  <div class="dropdown-header">Social Structure</div>
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
  </div>

  <?php while (have_posts()) : the_post(); ?>

  <div id="chart-container"
    data-config="<?php echo get_field('config_data'); ?>"
    data-311-complaints="<?php echo get_field('311_complaints'); ?>"
    data-doi-evictions="<?php echo get_field('doi_evictions'); ?>"
    data-nypd-sqf="<?php echo get_field('nypd_sqf'); ?>"
    data-nypd-calls="<?php echo get_field('nypd_calls'); ?>"
    data-nypd-arrests="<?php echo get_field('nypd_arrests'); ?>"
    data-nypd-complaints="<?php echo get_field('nypd_complaints'); ?>"
    data-nypd-shootings="<?php echo get_field('nypd_shootings'); ?>"
    data-census-indicators="<?php echo get_field('census_indicators'); ?>"
    data-panel-survey="<?php echo get_field('panel_survey'); ?>"
  >
    <div class="graph-section">
      <div id="domain-header"></div>

      <!-- CSV Graph Data -->        
      <!-- Admin data visualization -->
      <div id="admin-container" class="chart-container">
      </div>

      <!-- Census data visualization -->
      <div id="census-container" class="chart-container">
      </div>
      
      <!-- Survey data visualization -->
      <div id="survey-container" class="chart-container">
      </div>

    </div>
  </div>

  <?php endwhile; ?>

</main><!-- #main -->

<?php
get_footer();
