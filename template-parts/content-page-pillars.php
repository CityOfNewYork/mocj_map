<?php
/**
 * Template part for displaying page content in page.php
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MOCJ
 */

?>

<main class="site">
<?php 
  global $post;
  $post_slug=$post->post_name;
?>

<?php get_template_part('template-parts/hero','main') ?>

  <section class="bg-white block">

      <article class="container article-layout type--navy">
        <div class="grid">
          <div class="grid--full">
            <?php $video =  get_field('video') ?>
              <?php $text =  get_field('text') ?>
              <?php $alignment =  get_field('vertical_alignment') ?>
              <div class="intro-text" style="align-items: <?= $alignment=='top' ? 'flex-start' : ($alignment == 'middle' ? 'middle' : 'flex-end') ?>">

                
                <?php echo $video ?>
                <div class="text-wrap">
                <?php echo $text ?>
                </div>
              </div>
              
              <?php the_content() ?>

              <?php if(have_rows('pillars')): ?>
              <div class="pillar-tiles">
              <?php while(have_rows('pillars')): ?>
                  <?php the_row() ?>
                  <?php $pillar_name = get_sub_field('pillar_name') ?>
                  <?php $description = get_sub_field('short_description') ?>
                  <?php $bullet_points = get_sub_field('bullet_points') ?>
                  <article class="pillar-tile">
                    <h1><?=$pillar_name?></h1>
                    <p><?=$description?></p>
                    <div class="bullet-points">
                      <?=$bullet_points?>
                    </div>
                  </article>
              <?php endwhile ?>
              </div>
            <?php endif ?>
            <div style="display: block; text-align:center;">
              <?php $button = get_field('button_link') ?>
              <a href="<?= $button['url'] ?>" target="<?= $button['target'] ?>" class="btn"><?= $button['title'] ?></a>
            
            </div>
            
            <?php get_template_part('template-parts/content-page','publications') ?>

           </div>
        </div>
      </article>
  </section>
</main>
<?php 
get_footer();