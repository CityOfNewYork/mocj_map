<?php  $communities_query = mocj_get_metrics('event',2); ?>
<div class="grid">
	<div class="type--body grid--<?= ($communities_query->have_posts()) ? '70' : 'full' ?> ">	
		<?php the_field('priorities') ?>
	</div>
	<?php if ( $communities_query->have_posts() ): ?>
	<div class="grid--30 sticky">
		<h4><?php the_field('community_tabs_related_events_title', 'option'); ?></h4>
		<?php
        /* Start the Loop */
          while ( $communities_query->have_posts() ) :
            $communities_query->the_post();
            ?>
            
          <?php get_template_part('template-parts/event', 'tile') ?>
            <?php
           endwhile;
        wp_reset_postdata();
      ?>
		<?php //get_template_part('template-parts/people','tile') ?>
		<?php //get_template_part( 'template-parts/nstat', 'logo' ); ?>
	</div>
	<?php endif; ?>
</div>