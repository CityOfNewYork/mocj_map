<section class="archive-grid">
	<?php
		/* Start the Loop */
		$communities_query = new WP_Query( array( 'post_type' => 'program') );
		if ( $communities_query->have_posts() ) :
			while ( $communities_query->have_posts() ) :
				$communities_query->the_post();
		    ?>
		    
			<?php get_template_part('template-parts/program', 'tile') ?>
		    <?php
		   endwhile;
		endif;
	?>
</section>