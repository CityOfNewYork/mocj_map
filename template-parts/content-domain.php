<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

  <section class="hero">
    <div class="hero-content">
    <?php
      if(is_front_page()):
	the_content();
      elseif ( is_singular() ) :
	the_title( '<h1 class="entry-title">', '</h1>' );
      else :
	the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
      endif;

      if (get_field('hero_description')) {
    ?>
      <div class="hero__description">
	<?php echo get_field('hero_description'); ?>
      </div>
    
    <?php
      }
    ?>

    </div>
    <div class="hero__image" style="background-image: url('<?php has_post_thumbnail(get_the_ID()) ? the_post_thumbnail_url('community-banner') : 'https://placehold.it/420x260' ?>');"></div>
    <div class="hero__overlay"></div> 
  </section>

  <nav class="secondary-nav">
    <ul class="container">
      <?php
	  wp_list_pages(array(
	    'post_type' => 'domain',
	    'depth' => 1,
	    'title_li' => ''
	  ));
      ?>
    </ul>
  </nav>

  <section class="bg-light-gray">

    <div class="container type--navy">

      <?php the_content(); ?>

      <div class="domain__tabs js-tabs">

      <?php
	if (get_field('subdomains')) {
	?>
	  <ul class="domain__subdomain-list" role="tablist">
	  <?php
	    $subdomains = get_field('subdomains');
	    foreach ($subdomains as $i => $subdomain) { ?>
	      <li role="presentation">
		<a
		  href="tabpanel-<?php echo $i; ?>"
		  id="subdomain-<?php echo $i; ?>-tab"
		  class="domain__subdomain-list-item js-tabs-tab"
		  role="tab"
		  aria-controls="subdomain-<?php echo $i; ?>"
		  <?php if ($i === 0) : ?>
		  aria-selected="true"
		  <?php endif; ?>
		>
		  <?php echo $subdomain['title']; ?>
		</a>
	      </li>
	    <?php
	    }
	  ?>
	  </ul>

	  <?php
	  foreach ($subdomains as $i => $subdomain) { ?>
	    <div
	      id="subdomain-<?php echo $i; ?>"
	      class="domain__subdomain js-tabs-tabpanel"
	      role="tabpanel"
	      aria-labelledby="subdomain-<?php echo $i; ?>-tab"
	      <?php if ($i !== 0) : ?>
	      aria-hidden="true"
	      <?php endif; ?>
	    >
	      <p class="domain__subdomain-title">
		<?php echo $subdomain['title']; ?>
	      </p>

	      <div class="domain__subdomain-description">
		<?php echo $subdomain['description']; ?>
	      </div>

	      <div class="domain__subdomain-data">
		<?php if ($subdomain['subdomain_data']) { ?>
		  <?php foreach ($subdomain['subdomain_data'] as $data) { ?>
		    <div class="domain__accordion js-accordion">
		      <p class="domain__accordion-title js-trigger">
			<?php echo $data['title']; ?>
		      </p>

		      <div class="domain__accordion-content js-accordion-content">
			<?php echo $data['description']; ?>
		      </div>
		    </div>
		  <?php } ?>
		<?php } ?>
	      </div>
	    </div>
	  <?php
	  }
	}
	?>

	<?php
	  if (get_field('cta')) {
	    $cta = get_field('cta');
	?>
	  <a href="<?php echo $cta['url']; ?>" class="domain-cta" target="<?php echo $cta['target']; ?>">
	    <?php echo $cta['title']; ?>
	  </a>
	<?php
	  }
	?>

      </div>

  </section>

  <div class="container type--navy">

    <?php
      if (get_field('components')) {
	$components = get_field('components');

	foreach ($components as $i => $component) {
	  get_template_part( 'template-parts/domain', $component['component'], $component );
	}
      }
    ?>

  </div>

  </div>

</article>
