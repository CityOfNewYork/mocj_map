<section class="mocj-slider js-slider">
	<?php
		/* Start the Loop */
		$communities_query = new WP_Query( array( 'post_type' => 'stories') );
		if ( $communities_query->have_posts() ) :
			while ( $communities_query->have_posts() ) :
				$communities_query->the_post();
		    ?>
		    
			<?php get_template_part('template-parts/story', 'tile') ?>
		    <?php
		   endwhile;
		endif;
	?>
</section>