<section class="bg-white block">
    <article class="container article-layout type--navy">
      <div class="grid">
        <div class="grid--70 type--body">
          <h2><?php the_title() ?></h2>
          
          <?php the_content() ?>

        </div>
        <div class="grid--30 sticky">
          <?php $related_comm = wp_get_post_terms(get_the_ID(), 'communities_tax') ?>
          <?php if(count($related_comm)): ?>
          <?php $post = get_page_by_title( $related_comm[0]->name, OBJECT, 'mocj_communities' ); ?>
              <?php setup_postdata( $post )?>
              <?php get_template_part('template-parts/people','tile') ?>
          <?php endif; ?>
          <?php wp_reset_postdata(); ?>
         
        </div>
      </div>
    </article>
</section>