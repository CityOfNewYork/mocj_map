      
<?php if(have_rows('publication_groups')): ?>
  <?php while( have_rows('publication_groups') ): the_row(); ?>
      <?php $group_name = get_sub_field('group_name') ?>
      <h3><?= $group_name ?></h3>
      <div class="block">
      <div class="archive-grid">
        <?php if(have_rows('publications')): ?>
        <?php while( have_rows('publications') ): the_row(); ?>
          <?php $thumbnail = get_sub_field('thumbnail'); ?>
        <?php $pubtitle = get_sub_field('title'); ?>
        <?php $pubfile = get_sub_field('upload'); ?>
        
          <a href="<?= $pubfile['url'] ?>">
            <span class="module__wrap">
              <div class="publication__image">
              <?php if ($thumbnail): ?>
                  <img src="<?= $thumbnail['url'] ?>" alt="<?= $thumbnail['alt'] ?>" title="<?= $thumbnail['caption'] ?>">
              <?php else: ?>
                <?php echo  wp_get_attachment_image($pubfile['ID'],'large')?>
              <?php endif ?>
              </div>
              <div class="module__bottom">
                <?php echo $pubtitle ? $pubtitle : ucwords(preg_replace("/_/", " ", $pubfile['name'])) ?>
              </div>
            </span>
          </a>
        <?php endwhile ?>
        <?php endif ?>
      </div>
      </div>
  <?php endwhile ?>
<?php endif ?>