<?php if(get_field('contacts')): ?>
<ul class="list--reset">
	<?php while(has_sub_field('contacts')): ?>
	<?php $profile_pic = get_sub_field('profile_picture') ?>
	<li class="contact">
		<div class="contact__image" style="background-image: url(<?php echo $profile_pic['url'] ?>)"></div>
		<div class="contact__info">
			<p class="contact__name"><?php the_sub_field('full_name') ?></p>
			<p class="contact__title"><?php the_sub_field('role') ?></p>
			<p class="contact__title"><?php the_sub_field('organization') ?></p>
			<span class="contact__phone"><a href="tel:<?php the_sub_field('phone_number') ?>"><?php the_sub_field('phone_number') ?></a></span>
			<span class="contact__link"><a href="mailto:<?php the_sub_field('e-mail') ?>"><?php the_sub_field('e-mail') ?></a></span>
		</div>
	</li>
	<?php endwhile ?>
	</ul>
<?php endif; ?>