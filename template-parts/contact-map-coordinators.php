<h3>Contact your MAP Engagement Coordinator</h3>
<ul class="map-coordinators" style="font-size: 0.88rem">
<?php $communities_query = new WP_Query( array( 'post_type' => 'mocj_communities') );
  if ( $communities_query->have_posts() ) :
  while ( $communities_query->have_posts() ) :
    $communities_query->the_post();
    ?>
  <?php if(get_field('contacts')): ?>
    <?php if(has_sub_field('contacts')): ?> 
   <li>
    <?php the_title() ?> &mdash;
      <span class=""><?php the_sub_field('full_name') ?></span> 
      <?php if (get_sub_field('e-mail')): ?>
      <a href="mailto:<?php echo get_sub_field('e-mail') ?>" class="contact__email"><?php echo get_sub_field('e-mail') ?></a>
      <?php else: ?>
        <em>need contact info</em>
      <?php endif ?>
  </li>
  <?php endif;
    endif;
  ?>
  <?php endwhile;
    endif;
  ?>
  <?php wp_reset_postdata() ?>
</ul>