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

      <div class="data-explorer__header-section">
	<div class="data-explorer__header-content">
	  <div class="data-explorer__header-title">
	    <?php _e('<strong>NEIGHBORHOOD</strong> NAVIGATOR', 'mocj'); ?>
	  </div>
	  
	  <?php the_content(); ?>

	  <div class="data-management">
	    <div class="community-chooser">
	      <div>
		<?php _e('View Community Administrative Data', 'mocj'); ?>
	      </div>
	      <select id="community-dropdown">
		<option disabled selected hidden><?php _e('Select a Community', 'mocj'); ?></option>
	      </select>
	    </div>
	    <div class="community-map">
	      <?php get_template_part( 'template-parts/svg/boroughs' ); ?>
	    </div>
	  </div>
	</div>
      </div>

      <div class="data-explorer__header-section data-explorer__header-section--backdrop" id="data-render">
	<div class="data-explorer__header-data">
	  <button class="print-bttn">
	    <p><?php _e('Print PDF', 'mocj'); ?></p>
	  </button>
	  <div class="data-explorer__demo-table">
	    <div class="data-explorer__demo-section">
	      <div class="data-explorer__demo-title">
		<?php get_template_part( 'template-parts/svg/icon-united-states' ); ?>
		<span><?php _e('Total Population', 'mocj'); ?></span>
	      </div>
		<div class="data-explorer__population">
		  <div id="total-population" class="data-explorer__population-count"></div>
		  <p class="data-explorer__population-label"><?php _e('Inhabitants', 'mocj'); ?></p>
		</div>
	    </div>
	    <div class="data-explorer__demo-section">
	      <div class="data-explorer__demo-title">
		<?php get_template_part( 'template-parts/svg/icon-sex' ); ?>
		<span><?php _e('Sex/Gender', 'mocj'); ?></span>
	      </div>
	      <div class="data-table">
		<div class="data-explorer__demo-data-cell">
		  <p id="female-percentage" class="data-explorer__demo-data-cell-label"></p>
		  <p><?php _e('Female', 'mocj'); ?></p>
		</div>
		<div class="data-explorer__demo-data-cell">
		  <p id="male-percentage" class="data-explorer__demo-data-cell-label"></p>
		  <p><?php _e('Male', 'mocj'); ?></p>
		</div>
	      </div>
	    </div>
	    <div class="data-explorer__demo-section">
	      <div class="data-explorer__demo-title">
		<?php get_template_part( 'template-parts/svg/icon-ethnicity' ); ?>
		<span><?php _e('Race/Ethnicity*', 'mocj'); ?></span>
	      </div>
	      <div id="race-data" class="section-data"></div>
	    </div>
	    <div class="data-explorer__demo-section">
	      <div class="data-explorer__demo-title">
		<?php get_template_part( 'template-parts/svg/icon-age-group' ); ?>
		<span><?php _e('Age Group', 'mocj'); ?></span>
	      </div>
	      <div id="age-data" class="section-data"></div>
	    </div>
	  </div>
	</div>
	<p class="data-explorer__header-data-footnote"><?php _e('* percentage of race alone, non-Hispanic', 'mocj'); ?></p>
      </div>
    </div>
  </div>

  <div id="data-container"
    data-community="<?php echo get_field('community_data'); ?>"
    data-demography="<?php echo get_field('demographic_data'); ?>"
    class="container-fluid data-explorer__category-selector-wrapper"
  >
    <div class="container">
      <div class="data-explorer__category-title">
	<p id="community-title" class="data-explorer__community-title"></p>
	<div class="data-explorer__community-label"><?php _e('Community Administrative Data', 'mocj'); ?></div>
      </div>

      <div class="data-explorer__category-selector">
	<p class="data-explorer__category-selector-label"><?php _e('Select a data category:', 'mocj'); ?></p>
	<select id="domain-select">
	  <option disabled selected hidden><?php _e('Select a Domain', 'mocj'); ?></option>
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
    data-panel-survey-all="<?php echo get_field('panel_survey'); ?>"
    data-panel-survey-demo="<?php echo get_field('panel_survey_demo'); ?>"
    <?php
    if (get_field('data_indicators', 'option')) {
      foreach (get_field('data_indicators', 'option') as $data_indicator) {
	echo ' data-', $data_indicator['indicator_id'], '="', esc_attr(json_encode(['title' => $data_indicator['title'], 'description' => $data_indicator['description']])), '"';
      };
    };
    ?>
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
