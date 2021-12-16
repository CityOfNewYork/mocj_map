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
	<div class="data-explorer__header-title"><strong>NEIGHBORHOOD</strong> NAVIGATOR</div>
	<p>Our Data Explorer allows people to view information across seven domains, related to each of the MAP site neighborhoods. Each domain shows an aspect of residents’ life within the community.</p>
	<p>Created by the Mayor’s Office for Criminal Justice, in partnership with SAFELab, JJREC, NIS,  and NORC [other credits]</p>

	<div class="data-management">
	  <div class="community-chooser">
	    <div>Choose a Community</div>
	    <select class="custom-select" id="community-dropdown">
	      <option selected>Select a Community</option>
	    </select>
	  </div>
	  <div class="community-map">
	    <?php get_template_part( 'template-parts/svg/boroughs' ); ?>
	  </div>
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
	<select id="domain-select">
	</select>
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
