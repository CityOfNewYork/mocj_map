<section class="hero" >    
    <div class="hero__image" style="background-image: url('<?php has_post_thumbnail(get_the_ID()) ? the_post_thumbnail_url('community-banner') : 'https://placehold.it/420x260' ?>');"></div>
    <div class="hero__overlay"></div> 
    
    <?php
    if ( is_singular() ) :
      the_title( '<h1 class="entry-title">', '</h1>' );
    else :
      the_title( '<h2 class="entry-title">', '</h2>' );
    endif;
  ?>
  <?php $borough = get_field('borough'); ?> 
    <h2><?php echo $borough ? $borough->name : '' ?></h2>
</section>