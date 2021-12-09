<?php
/**
 * Template Name: data explorer
 * Template Post Type: Page
 */

get_header();
?>

<main id="main" class="site">

  <div id="csv" style="height:800px;"></div>

<?php
while ( have_posts() ) :
  the_post();

get_template_part( 'template-parts/content', get_post_type() );

//the_post_navigation();

// If comments are open or we have at least one comment, load up the comment template.
if ( comments_open() || get_comments_number() ) :
  comments_template();
endif;

endwhile; // End of the loop.
?>

</main><!-- #main -->

<?php
get_footer();
