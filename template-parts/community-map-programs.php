<div class="grid">
  <div class="grid--70">
    <h2>MAP Programs</h2>

     <section class="">
      <?php $program_info = get_field('program_info') ?>
      <?= $program_info ?>
      <?php $playbook = get_field('playbook') ?>
      <?php if($playbook):?>
        <a href="<?php echo $playbook ?>" target="_blank">Download the Playbook &rarr;</a>
      <?php endif ?>
      
    </section>

  </div>
  <div class="grid--30 sticky">
    <h4>Contacts</h4>
    <?php get_template_part('template-parts/people','tile') ?>
  </div>
</div>