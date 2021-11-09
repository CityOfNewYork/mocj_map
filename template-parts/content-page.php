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
<?php if(has_post_thumbnail(get_the_ID())):?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
  <section class="hero">
    <div class="hero-content">
    <?php
      if(is_front_page()):
        the_content();
      elseif ( is_singular() ) :
        the_title( '<h1 class="entry-title">', '</h1>' );
      else :
        the_title( '<h2 class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
      endif;
    ?>
    </div>
    <div class="hero__image" style="background-image: url('<?php has_post_thumbnail(get_the_ID()) ? the_post_thumbnail_url('community-banner') : 'https://placehold.it/420x260' ?>');"></div>
      <div class="hero__overlay"></div> 
  </section>
<?php endif ?>


<?php if(is_front_page()): ?>  
 <section class="site-sections">
    <a href="/#communities">
      <h2>Communities</h2>
    </a>
    <a href="/#stories">
      <h2>Stories</h2>
    </a>
    <a href="/#events">
      <h2>Events</h2>
    </a>
  </section>
  <!-- Communities -->
  <div class="bg-gray"  id="communities">
    <div class="block">
      <section class="section-header type--center type--navy">
          <div class="container">
            <h2>Communities</h2>
            <?php $page = get_page_by_path('communities', OBJECT, 'page'); ?>
            <h3><?php echo $page->post_content ?></h3>
          </div>
      </section>
        <?php get_template_part( 'template-parts/communities', 'loop-slides' ); ?>
      </div> 
    </div>
  <!-- Spotlights -->
  <div class="bg-white" id="stories">
    <div class="block">
    <section class="section-header type--center type--navy">
      <div class="container">
        <h2>Stories</h2>
         <?php $page = get_page_by_path('stories', OBJECT, 'page'); ?>
        <h3><?php echo $page->post_content ?></h3>
      </div>
    </section>
  <!-- start spotlight slides -->
    <?php get_template_part( 'template-parts/stories', 'loop-slides' ); ?>
  <!-- end spotlight slides -->
    </div>
  </div>
  <!-- Spotlights -->
  <div class="bg-gray" id="events">
    <div class="block">
    <section class="section-header type--center type--navy">
      <div class="container">
        <h2>Events</h2>
         <?php $page = get_page_by_path('events', OBJECT, 'page'); ?>
        <h3><?php echo $page->post_content ?></h3>
      </div>
    </section>
  <!-- start spotlight slides -->
    <?php get_template_part( 'template-parts/events', 'loop-slides' ); ?>
  <!-- end spotlight slides -->
    </div>
  </div>
  <!-- Spotlights -->
  <div class="bg-white">
    <div class="block">
    <section class="section-header type--center type--navy" >
      <div class="container">
        <h2>Social</h2>
        <h3>Follow <a href="https://www.instagram.com/nstatnyc/" target="_blank" rel="noopener noreferrer">@nstatnyc</a> on Instagram!</h3>
        <?php echo wdi_feed(array('id'=>'1')); ?>
      </div>
    </section>
      <!-- need to register intstgram plugin -->
    </div>
  </div>
</article>

<?php
else:?>

<section class="bg-white block <?php echo ($post_slug == 'publications') ? 'publications' : '' ?>">
    <article class="container article-layout type--navy">
      <div class="grid">
        <div class="<?php echo ($post_slug == 'contact-us') ? 'grid--full' : 'grid--full' ?> type--body">
          <?php if(!has_post_thumbnail(get_the_ID())):?>
           <h1><?php the_title() ?></h1>
          <?php endif ?>
            
          <?php if(have_rows('teams')): ?>
            <?php while( have_rows('teams') ): the_row(); ?>
              <?php $name = get_sub_field('team_name'); ?>
              <?php $subheading = get_sub_field('team_subheading'); ?>
              <?php $description = get_sub_field('team_description'); ?>
              <h2 class="team-name"><?= $name ?></h2>
              <h4 class="team-subheading"><?= $subheading ?></h4>
             <div class="team-description"><?= $description ? $description : '' ?></div>
              <div class="people-grid">
              <?php if(have_rows('people')): ?>
                <?php while( have_rows('people') ): the_row(); ?>
                  <?php $dev = get_sub_field('development') ?>
                  <?php $email = get_sub_field('email') ?>
                  <?php $agency = get_sub_field('affiliate_agency') ?>
                  <?php $profile_pic = get_sub_field('headshot') ?>
                  <?php $phone = get_sub_field('phone_number') ?>
                  <div class="person-wrap">
                    <div class="person">
                      <?php if ($profile_pic):?>
                      <div class="contact__image" style="background-image: url(<?php echo $profile_pic['url'] ?>)"></div>
                      <?php endif ?>
                      <div class="name"><?= get_sub_field('first_name') ?> <?= get_sub_field('last_name') ?></div>
                      <div class="title"><?= get_sub_field('title') ?></div>
                      
                      <?php if($dev[0]): ?>
                        <div class="development"><a href="/communities/<?= $dev[0]->post_name ?>">
                          <?= $dev[0]->post_title ?></a>
                        </div>
                      <?php endif ?>


                      <?php if($agency): ?>
                      <div class="agency"><span>Affiliation: </span><?= $agency ?></div>
                      <?php endif ?> 
                      <div class="phone"><a href="tel:<?= $phone ?>"><?= $phone ?></a></div>
                      <div class="email"><a href="mailto:<?= $email ?>"><?= $email ?></a></div>
                    </div>
                  </div>
                <?php endwhile ?>
                </div>
              <?php endif ?>
           <?php endwhile ?>
        <?php endif ?>
          <?php the_content() ?>
          
           <?php if($post_slug == 'publications'): ?>
            <?php get_template_part('template-parts/content-page','publications') ?>    
          <?php endif ?>

          
          
        </div>          
          
    </article>
</section>

<?php endif ?>
</main>
<?php 
get_footer();