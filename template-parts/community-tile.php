<?php $borough = get_field('borough'); ?> 
<a href="<?php the_permalink() ?>" class="module">
	<span class="module__wrap">
		<?php if(has_post_thumbnail()): ?>
			<div class="tile__thumbnail module__top" style="background-image: url('<?php the_post_thumbnail_url('community-tile') ?>'"></div>
		<?php endif ?>
	   <div class="module__bottom">
	     <h4><?php the_title() ?></h4>
	     <?php 
	     		$custom_taxterms = get_term_by('name', get_the_title(), 'communities_tax');
	     		$objectives = get_posts(array(
				'post_type' => 'objective',
				'tax_query' => array(
			    array(
			        'taxonomy' => 'communities_tax',
			        'field' => 'term_id',
			        'terms' => $custom_taxterms
			    )
				)
			));

			?>
		  <p class="subheading"><?php echo $borough ? $borough->name : '' ?></p>
	   </div>
	</span>
</a>