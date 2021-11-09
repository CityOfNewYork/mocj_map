<li class="sub-accordion js-accordion">
	<div class="sub-accordion__trigger js-trigger">
		<h4><?php $term = get_sub_field('sub_pillar_title');
				if( $term ): ?>
				<?php echo $term->name; ?>
				<?php endif; ?>
		</h4>
		<p>
			<?php echo $term->description; ?>
		</p>
	</div>
	<div class="sub-accordion__content accordion__content">
	<?php if(get_sub_field('stats')): ?>
	<?php while(has_sub_field('stats')): ?>
		<?php get_template_part( 'template-parts/pillar', 'indicator' ); ?>
	<?php endwhile ?>
	<?php endif ?>
	</div>
</li>