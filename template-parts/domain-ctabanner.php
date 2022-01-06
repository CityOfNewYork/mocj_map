<?php

$ctabanner = $args['ctabanner'];
$cta = $ctabanner['cta'];

?>

<div class="cta-banner bg-dark-blue">

	<div class="container">

	<h2 class="cta-banner__title">
		<?php echo $ctabanner['title']; ?>
	</h2>

	<p class="cta-banner__description">
		<?php echo $ctabanner['description']; ?>
	</p>

<?php
if ($cta) {
?>

	<a href="<?php echo $cta['url']; ?>" class="domain-cta domain-cta--white" target="<?php echo $cta['target']; ?>">
		<?php echo $cta['title']; ?>
	</a>

<?php
}
?>

	</div>

</div>
