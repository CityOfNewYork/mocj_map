<?php while(has_sub_field($level . '_pillars')): ?>
<li class="accordion js-accordion">
	<h3 class="type--blue accordion__trigger js-trigger">
		<?php $term = get_sub_field('pillar_title');
	if( $term ): ?>
		<?php echo $term->name; ?>
	<?php endif; ?>
	</h3>

	<div class="accordion__content">
		<?php if(get_sub_field('sub_pillars')): ?>       
		<ul class="list--reset">
			<?php while(has_sub_field('sub_pillars')): ?>
				<?php get_template_part( 'template-parts/pillar', 'child' ); ?>
			<?php endwhile; ?>
			</ul>
	 </div>
</li>
<?php endif; ?>
<?php endwhile; ?>