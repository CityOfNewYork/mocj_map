<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package MOCJ
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
  <link rel="stylesheet" type="text/css" href="https://cloud.typography.com/7488416/7731792/css/fonts.css" />
	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous">
	<?php wp_head(); ?>
  
</head>

<body <?php body_class(); ?>>
<div id="page">
  <?php if(is_front_page()): ?>
  <?php $show = get_field('show_banner', 'option'); ?> 
  <?php $banner_text = get_field('banner_text', 'option'); ?> 
  <?php if($show && $banner_text ):?>
  <div class="alert-bar">
    <?= $banner_text ?>
  </div>
  <?php endif ?>
<?php endif ?>
<header class="main-header">
  <div class="main-header__left">
    <a href="/" class="main-header__logo">
      <?php $logo = get_field('logo', 'option'); ?>
      <?php  if($logo): ?>
        <img src="<?= esc_url( $logo['url'] ) ?>" alt="<?= get_bloginfo( 'name' ) ?>" width="<?= $logo['width'] ?>" height="<?= $logo['height'] ?>">
      <?php else: ?>
        <h1><?= get_bloginfo('name') ?></h1>
      <?php endif ?>
      
    </a>
    <div class="hidden-desktop">
      <button class="toggle-nav"></button>
    </div>
  </div>

<?php wp_nav_menu( array(
    'menu'   => 'Main',
    'walker' => new GenerateCommunitiesNav(),
    'container_class' => 'main-nav main-header__right',
    'menu_class' => 'main-nav__list list--reset'
    ) );
?>

</header>


