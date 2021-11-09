<?php $communities = wp_get_post_terms( get_the_ID(), 'communities_tax'); ?>
<?php $community_names = [] ?>
<?php foreach($communities as $comm): ?>
  <?php $community_names[] = '<a href="/communities/' . $comm->slug . '">' . $comm->name . '</a>' ?>
  
<?php endforeach ?>
<?php echo implode(', ', $community_names) ?>