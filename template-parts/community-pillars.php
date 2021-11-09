<div class="grid">
	<div class="grid--70">
	<div class="intro_text">
		<?php the_field('pillar_indicators_intro') ?>
	</div>

	<?php 
	// moving to ajax
	//$comm_metrics = mocj_get_metrics('metrics', 0, true);?>
	<?php
	/** The taxonomy we want to parse */
	$taxonomy = "pillar";
	/** Get all taxonomy terms */
	$terms = get_terms($taxonomy, array(
	       "orderby"    => "count",
	       "hide_empty" => true
	   )
	);
  /** Get terms that have children */
  $hierarchy = _get_term_hierarchy($taxonomy);
	foreach($terms as $term):
       //Skip term if it has children
       if($term->parent) {
         continue;
       } ?>
		<!-- pillar heading -->
		<h2 class="type--subheader type--navy">
			<i class="circle">
				<img src="<?php echo get_template_directory_uri() ?>/images/icon--<?php echo $term->slug ?>.svg" alt="">
			</i>
			<?php echo $term->name . '<br>' ;  ?>
		</h2>
		<p class="desc"><?php echo $term->description ?></p>


		<!-- /pillar heading -->
		<ul class="accordion-wrapper list--reset">
	       <?php
	       /** If the term has children... */
	       if($hierarchy[$term->term_id]):
	       /** display them */
	       foreach($hierarchy[$term->term_id] as $child):
	       /** Get the term object by its ID */
	       $child = get_term($child, $taxonomy);
	       ?>
				<!-- pillar parent -->
				<li class="accordion js-accordion">
					<h3 class="type--blue accordion__trigger js-trigger">
						<?php echo $child->name ?>
					</h3>
					<p class="desc"><?php echo $child->description ?></p>
					<div class="accordion__content">
						<ul class="list--reset">
	        <?php
	            $children = get_terms(
						    $taxonomy,
						    array(
						        'parent' => $child->term_id,
						        "hide_empty" => true
						    )
						);
	          
	          foreach($children as $grandchild):
		        	$gchild = get_term($grandchild, $taxonomy);
		        	$args = array(
								'post_type' => 'metrics',
								'post_status' => 'publish',
								'posts_per_page' => 100000, // you may edit this number
								'orderby' => 'post_date',
								'order' => 'DESC',
								'tax_query' => array(
									'relation' => 'AND',
									array(
									  'taxonomy' => 'communities_tax',
									  'field' => 'name',
									  'terms' => get_the_title(),
									),
									array(
									  'taxonomy' => $taxonomy,
									  'field' => 'term_id',
									  'terms' => $gchild->term_id,
									)
								)
							);
		        	$metrics = new WP_Query( $args );
		        	//if(has_term( $gchild->name, $taxonomy, $post)):?>
			        	<!-- pillar parent -->
			        	<?php if($metrics->post_count > 0): ?>
			        	<li class="sub-accordion js-accordion">
									<div class="sub-accordion__trigger js-trigger">
									<h4><?php echo $gchild->name ?></h4>
									<p class="desc"><?php echo $gchild->description ?></p>
									</div>
									<?php include( locate_template( 'template-parts/community-pillars-metric.php', false, false ) ); ?>
								</li><!-- end pillar parent -->
								<?php endif ?>
							<?php //endif ?>
						<?php endforeach; ?>
						<?php wp_reset_postdata(); ?>
			         </ul>
			      </div>
	      	</li>
          <?php endforeach ?>
       <?php endif; ?>
    	</ul>
	    <?php endforeach; ?>
	</div><!-- grid-70 -->
</div>