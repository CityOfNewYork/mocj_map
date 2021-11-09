<div class="sub-accordion__content accordion__content">
<?php
	$pillarId = $gchild->term_id;

	$metrics = get_terms(
		array(
			'taxonomy' => $taxonomy,
			'id' => $pillarId,
			//"hide_empty" => true
		)
	);
?>
	<div class="pillar-metrics" data-pillar-id="<?php echo $pillarId ?>" data-post-id="<?php echo get_the_ID() ?>">
		<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
		<div class="metrics"></div>
	</div>
	
<!-- metric.php -->
</div>
	
