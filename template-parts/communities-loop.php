
	<section class="grid grid--3">       
	<?php
		/* Start the Loop */
		$communities_query = new WP_Query( array( 'post_type' => 'mocj_communities', 'orderby' => 'title') );
		if ( $communities_query->have_posts() ) :
		while ( $communities_query->have_posts() ) :
			$communities_query->the_post();
	    ?>
	    
		<?php get_template_part('template-parts/community', 'tile') ?>
	    <?php
	    
			/*
			 * Include the Post-Type-specific template for the content.
			 * If you want to override this in a child theme, then include a file
			 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
			 */
			//get_template_part( 'template-parts/content', get_post_type() );

		endwhile;
	endif;
	?>

	</section>
