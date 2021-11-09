<?php $related_spotlights = mocj_get_metrics('stories', 2) ?>
<?php if ($related_spotlights->have_posts()):   ?>
  <h4><?php the_field('community_tabs_related_stories_title', 'option'); ?></h4>
  <div class="story-tiles">
  <?php
      while ( $related_spotlights->have_posts() ) : $related_spotlights->the_post();
        $post = get_post();
        ;setup_postdata( $post ) ?>
        
  <?php get_template_part('template-parts/story', 'tile'); ?>
  <?php endwhile ?>
  </div>
<?php endif ?>
<?php wp_reset_postdata(); ?>