<?php
/**
 * Template part for displaying posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MOCJ
 */

?>
  <section class="community-page">

    <?php get_template_part('template-parts/hero','main') ?>
		<div class="content bg-white" id="main-content">
			<ul class="tabs list--reset">
        <li class="tabs__tab checked" data-tab="success">
          <input type="radio" class="js-tab" id="success" name="tab" checked="checked">
          <label for="success" class="tabs__tab-link close"><?php the_field('community_tabs_tab_1_title', 'option'); ?> <?= the_title() ?></label>
        </li>
        <li class="tabs__tab" data-tab="priorities">
          <input type="radio" class="js-tab" id="priorities" name="tab" >
          <label for="priorities" class="tabs__tab-link close"><?php the_field('community_tabs_tab_2_title', 'option'); ?> </label>
        </li>
        <li class="tabs__tab" data-tab="map-programs">
          <input type="radio" class="js-tab" id="map-programs" name="tab" >
          <label for="map-programs" class="tabs__tab-link close"><?php the_field('community_tabs_tab_3_title', 'option'); ?> </label>
        </li>
				<!-- <li class="tabs__tab" data-tab="pillar-indicators">
					<input type="radio" class="js-tab" id="pillar-indicators" name="tab">
					<label for="pillar-indicators" class="tabs__tab-link">Pillar <span>Indicators</span></label>
				</li> -->
				<!-- <li class="tabs__tab" data-tab="community-overview">
					<input type="radio" class="js-tab" id="community-overview" name="tab">
					<label for="community-overview" class="tabs__tab-link">Community <span>Overview</span></label>
				</li> -->
			</ul>
		  <div class="tabs__content in-view" id="tab-success">
        <div class="grid">
          <?php $related_spotlights = mocj_get_metrics('stories', 2) ?>
          <div class="grid--<?= $related_spotlights->have_posts() > 0 ? '70' : 'full'?> type--body">
            <?php the_field('map_@') ?>
          </div>
          <div class="grid--30 sticky">
            <?php get_template_part( 'template-parts/related', 'stories' ); ?>
          </div>
        </div>
      </div>
      <div class="tabs__content" id="tab-priorities">
		    <?php get_template_part( 'template-parts/community', 'priority-areas' ); ?>
		  </div>
      <div class="tabs__content" id="tab-map-programs">
        <?php get_template_part( 'template-parts/community', 'map-programs' ); ?>
      </div>
      </div>
		  <!-- <div class="tabs__content" id="tab-pillar-indicators">
		    <?php //get_template_part( 'template-parts/community', 'pillars' ); ?>
		  </div> -->
		  <!-- begin demographics loop -->
		  <!-- <div class="tabs__content" id="tab-community-overview">
		    <?php //get_template_part( 'template-parts/community', 'demographics' ); ?>
		  </div> -->
		</div>

	</section>
  <section>
    <!-- Hiding Stats Popout Feature-->
  <!-- <label  class="slideout-open" for="slideout-opener">See Stats</div>
  <input type="checkbox" id="slideout-opener">
  <div class="slideout">
    <label class="slideout-close" for="slideout-opener"></label>
      <?php //get_template_part( 'template-parts/community', 'pillars' ); ?>
  </div>
  </label> -->
<!-- 
  <footer class="entry-footer">
    <?php //mocj_entry_footer(); ?>
  </footer><!-- .entry-footer -->
<!-- #post-<?php the_ID(); ?> -->
 