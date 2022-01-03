<?php
/**
 * Template Name: Domain Overview
 * Template Post Type: Page
 */

get_header();
?>

<main id="main" class="site">

  <?php

  while ( have_posts() ) : the_post();
  ?>

  <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

    <div class="container type--navy">

      <?php
	the_title( '<h1 class="type--page-title">', '</h1>' );
	the_content();
      ?>

      <div class="domain-grid">

	<?php
	  if (get_field('domains')) {
	    foreach (get_field('domains') as $domain) {
	    ?>

	<div class="domain-grid__domain">

	  <p class="domain-grid__domain-title">
	    <?php echo $domain['title']; ?>
	  </p>

	  <div class="domain-grid__domain-description">
	    <?php echo $domain['description']; ?>
	  </div>

	  <p class="domain-grid__domain-link">
	    <a href="<?php print_r($domain['link']); ?>"><?php _e('Learn more', 'mocj'); ?> <?php get_template_part('template-parts/svg/triangle-right'); ?></a>
	  </p>

	</div>

	    <?php
	    }
	  }
	?>

      </div>

    </div>

  </article>

  <?php endwhile; ?>

</main><!-- #main -->

<?php
// get_sidebar();
get_footer();
