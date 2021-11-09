<div class="grid">
	<div class="grid--70">
		<div class="type--header-border">

		<?php $related_items = mocj_get_metrics('demographics'); ?>

			<h3>Demographics</h3>
			<table>
				<thead>
					<tr>
						<td>Category</td>
						<td>Community</td>
					</tr>
				</thead>
				<tbody>
		<?php			
				while ( $related_items->have_posts() ) : $related_items->the_post();
					$post = get_post();
					setup_postdata( $post ); ?>
					<tr>
						<td>
							<?php the_field('stat_metric_title') ?>
						</td>
						<?php $p = round(get_field('stat_percent'),1) ?>
						<?php $percent = $p ? '(' . $p . '%)' : '' ?>
						<td><?php the_field('stat_value') ?> <?php echo $percent ?></td>
					</tr>
					<?php endwhile ?>
				<?php wp_reset_postdata(); ?>
				</tbody>
			</table>
		</div>


		<?php  $related_items = mocj_get_metrics('context'); ?>

		<div class="type--header-border">
			<h3>Employment & Income</h3>
			<table>
				<thead>
					<tr>
						<td>Category</td>
						<td>Community</td>
					</tr>
				</thead>
				<tbody>
				<?php			
				while ( $related_items->have_posts() ) : $related_items->the_post();
					$post = get_post();
					setup_postdata( $post ); ?>
					<tr>
						<td>
							<?php the_field('stat_metric_title') ?>
						</td>
						<?php $p = round(get_field('stat_percent'),1) ?>
						<?php $percent = $p ? '(' . $p . '%)' : '' ?>
						<td><?php the_field('stat_value') ?> <?php echo $percent ?></td>
					</tr>
					<?php endwhile ?>
				<?php wp_reset_postdata(); ?>
				</tbody>
			</table>
		</div>
	</div>
	<div class="grid--30 sticky">
		<?php get_template_part( 'template-parts/related', 'spotlights' ); ?>
		<?php get_template_part( 'template-parts/nstat', 'logo' ); ?>
	</div>
</div>