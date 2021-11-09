<?php $curr_stat = 0 ?>
<?php $curr_stat_date = '' ?>
<?php $past_stat = 0 ?>
<?php $past_stat_date = '' ?>
<?php $source = 'none' ?>
<?php $update_date = get_sub_field('update_date') ?>
<?php if (get_sub_field('current_stat')):?>
	<?php while (has_sub_field('current_stat')): ?>
		<?php $curr_stat = get_sub_field('stat_value') ?>
		<?php $curr_stat_date = get_sub_field('stat_date') ?>
	<?php endwhile ?>
<?php endif ?>

<?php $bar_max = $curr_stat ?>
<?php if (get_sub_field('past_stat')):?>
	<?php while (has_sub_field('past_stat')): ?>
		<?php  $past_stat = get_sub_field('stat_value') ?>
		<?php $past_stat_date = get_sub_field('stat_date') ?>
		<?php if ( $past_stat > $bar_max) {
			$bar_max = $past_stat;
		}?>
	<?php endwhile ?>
<?php endif ?>
<article class="indicator">
	<div class="title">
		<h4><?php $term = get_sub_field('metric');
			if( $term ): ?>
				<?php $source = get_field('source', $term)->name; ?>
				<?php echo $term->name; ?>
			<?php endif; ?>
		</h4>

		<?php if ($update_date): ?>
		<span class="update-date">Updated <?php echo date("F Y", strtotime($update_date)) ?></span>
		<?php endif; ?>
	</div>
	<div class="bars">
		<div class="bar">
			<div class="stat">
				<span class="num"><?php echo $curr_stat ?></span>
				<span class="descriptor"><?php echo $curr_stat_date ? date("Y", strtotime($curr_stat_date)) : '' ?> <?php echo $source ?></span>
			</div>
			<div class="bar-wrap">
				<div class="bar-fill" data-width="<?php echo ($curr_stat/$bar_max * 100) ?>%"></div>
			</div>
		</div>
		<div class="bar">
			<div class="stat">
				<span class="num"><?php echo $past_stat ?></span>
				<span class="descriptor"><?php echo $past_stat_date ? date("Y", strtotime($past_stat_date)) : '' ?> <?php echo $source ?></span>
			</div>
			<div class="bar-wrap">
				<div class="bar-fill" data-width="<?php echo ($past_stat/$bar_max * 100) ?>%"></div>
			</div>
		</div>
	</div>
</article>