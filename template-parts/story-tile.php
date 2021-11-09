<a href="<?php the_permalink() ?>" class="module">
	<span class="module__wrap">
		<div class="tile__thumbnail module__top" style="background-image: url('<?php the_post_thumbnail_url('spotlight-tile') ?>)'"></div>
	   <!-- <img src="<?php echo has_post_thumbnail(get_the_ID()) ? get_the_post_thumbnail_url(null,'spotlight-tile') : 'https://placehold.it/420x260' ?>" alt="" class="module__top"> -->
	   <div class="module__bottom">
	   	<h4><?php the_title() ?></h4>
      <p class="subheading">
	   		<?php get_template_part('template-parts/communities', 'related') ?>&nbsp;
      </p>
	   </div>
	</span>
</a>