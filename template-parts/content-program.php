<section class="bg-white block">
    <article class="container article-layout type--navy">
      <div class="grid">
        <div class="grid--full type--body">
          <h2><?php the_title() ?></h2>
          <p class="subheading">
            <?php get_template_part('template-parts/communities', 'related-links') ?>&nbsp;
          </p>
          
          <?php the_content() ?>
			 
			 <?php if(get_field('related_communities')): ?>
				<?php while(has_sub_field('related_communities')): ?>
					<?php $community = get_sub_field('related_communities') ?>
					
					<?php echo get_the_title($community->ID) ?>
				<?php endwhile ?>
			<?php endif ?>
          <!-- <?php $reslink = get_field('resource_link') ?>
          <?php if ($reslink) :?>
            <div class="resource-link">
            <span>To learn about the resources in your development, </span>
            <a href="<?php echo $reslink ?>" target="_blank" rel="noopener noreferrer">click here &rarr;</a>
            </div>
          <?php endif?> -->
        </div>
        <!-- <div class="grid--30 sticky">
          <?php $related_comm = wp_get_post_terms(get_the_ID(), 'communities_tax') ?>
          <?php
          	$args = array(
				    'post_type' => 'stories',
				    'post_status' => 'publish',
				    'post__not_in' => array( $post->ID ),
				    'tax_query' => array(
				        array(
				            'taxonomy' => 'communities_tax',
				            'field' => 'slug',
				            'terms' => $related_comm[0]->slug,
				        ),
				    ),
				);


				$spotlights = get_posts( $args );
          ?>
          
          <?php if(count($spotlights)): ?>
				<?php for ($i=0; $i < count($spotlights); $i++):  ?>
		         <?php $post = get_post( $spotlights[$i] ); ?>
					<?php setup_postdata( $post )?>
					<?php get_template_part('template-parts/spotlight','tile') ?>
	       <?php endfor?>
	       <?php endif; ?>
          <?php wp_reset_postdata(); ?>
        </div> -->

        

     </div>
  </article>
</section>