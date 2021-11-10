<main class="site">

  <article id="post-<?php the_ID(); ?>" class="">



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
    ?>
    </div>
    <div class="hero__image" style="background-image: url('<?php has_post_thumbnail(get_the_ID()) ? the_post_thumbnail_url('community-banner') : 'https://placehold.it/420x260' ?>');"></div>
    <div class="hero__overlay"></div> 
  </section>

  <div class="container article-layout type--navy">

  <?php the_content(); ?>

  <div class="js-tabs">

    <ul class="domain__subdomain-list" role="tablist">
      <?php
	$subdomains = get_field('subdomain');
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
	<?php } ?>
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

	<div class="js-accordion">
	  <?php foreach ($subdomain['subdomain_data'] as $data) { ?>
	    <p>
	      <?php echo $data['title']; ?>
	    </p>

	    <div>
	      <?php echo $data['description']; ?>
	    </div>
	  <?php } ?>
	</div>
      </div>
    <?php } ?>

  </div>

  </article>
</main>
