<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MOCJ
 */

?>

	</div><!-- #content -->

	<footer class="main-footer">
	<div class="main-footer__left">
		<a href="https://criminaljustice.cityofnewyork.us/" target="_blank">
			<img class="mocj-logo" src="<?php echo get_template_directory_uri() ?>/images/mocj-logo.svg" width="216" height="32">
		</a>
	</div>
	<div class="main-footer__right">
		<div class="footer-logos">	
		<?php if(have_rows('footer_logos','option')): ?>
      <?php while( have_rows('footer_logos','option') ): the_row(); ?>
      	<?php $profile_pic = get_sub_field('headshot') ?>
      	<?php $logo = get_sub_field('logo') ?>
      	<?php $link = get_sub_field('link') ?>
      	<div class="logo">
      		<?php if ($link ): ?>
						<a href="<?= $link ?>" rel="noopener noreferrer" target="_blank"><img src="<?= $logo['url'] ?>"/></a>
    			<?php else: ?>
						<img src="<?= $logo['url'] ?>"/>
    			<?php endif ?>
					<?php //print_r($link) ?>
      	</div>
    	<?php endwhile ?>
		<?php endif ?>
   </div>

	<!-- <ul class="list--reset main-footer__nav">
	<li></li>
	<li></li>
	<li></li>
	<li></li>
	</ul> -->
	</div>
	</footer>
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
