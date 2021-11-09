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

  <ul class="domain__subdomain-list">
    <?php
      $subdomains = get_field('subdomain');
      foreach ($subdomains as $subdomain) { ?>
    <li class="domain__subdomain-list-item" role="tab">
      <?php echo $subdomain['title']; ?>
    </li>
      <?php } ?>
  </ul>

  <?php
  foreach ($subdomains as $subdomain) { ?>
    <div class="domain__subdomain" role="tabpanel">
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

  </article>
</main>
