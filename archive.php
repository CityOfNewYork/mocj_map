<?php
/**
 * The template for displaying archive pages
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package MOCJ
 */

get_header();
$post_type = get_post_type_object(get_post_type());
$singular = strtolower($post_type->labels->singular_name);
?>
	
<main id="main" class="site">

		<?php $post = get_page_by_title( $post_type->labels->name , OBJECT, 'page' ); ?>
		<?php get_template_part('template-parts/hero','main') ?>
		
		

		<?php if ( have_posts() ) : ?>


				<?php if($post_type->labels->name == 'Stories'):?>
					<?php $featured = get_field('featured_spotlight', $page->ID) ?>
					<?php if ($featured):?>
						<div class="block">
						<?php foreach( $featured as $post): // variable must be called $post (IMPORTANT) ?>
							<?php setup_postdata($post); ?>
							<h3 class="featured__label">Featured Spotlight</h3>
					    <section class="featured">
								<a href="<?php the_permalink() ?>" class="grid grid--half">

									<div class="container">
										<!-- <div class="featured__label">Featured Spotlight</div> -->
										<h4><?php the_title() ?></h4>
										<p class="subheading"><?php get_template_part('template-parts/communities', 'related') ?>&nbsp;</p>
										<p class="excerpt"><?php the_excerpt() ?></p>
									</div>	
									<div class="container">
										<div class="tile__thumbnail module__top" style="background-image: url('<?php the_post_thumbnail_url('spotlight-tile') ?>'"></div>
									</div>

								</a>
							</section>

				    <?php endforeach; ?>
					  </div>
				    <?php wp_reset_postdata(); ?>
						<?php endif ?>

					
						<div class="block">
						<?php get_template_part( "template-parts/stories", 'loop' ); ?>
						</div>

				<?php elseif($post_type->labels->name == 'Events'):?>
					<?php $featured = get_field('featured_event', $page->ID) ?>
					<?php if ($featured):?>
						<div class="block">
						<?php foreach( $featured as $post): // variable must be called $post (IMPORTANT) ?>
							<?php setup_postdata($post); ?>
							<h3 class="featured__label">Featured Spotlight</h3>
					    <section class="featured">
								<a href="<?php the_permalink() ?>" class="grid grid--half">

									<div class="container">
										<!-- <div class="featured__label">Featured Spotlight</div> -->
										<h4><?php the_title() ?></h4>
										<p class="subheading"><?php get_template_part('template-parts/communities', 'related') ?>&nbsp;</p>
										<p class="excerpt"><?php the_excerpt() ?></p>
									</div>	
									<div class="container">
										<div class="tile__thumbnail module__top" style="background-image: url('<?php the_post_thumbnail_url('spotlight-tile') ?>'"></div>
									</div>

								</a>
							</section>

				    <?php endforeach; ?>
					  </div>
				    <?php wp_reset_postdata(); ?>
						<?php endif ?>
					
					
						<div class="block">
						<?php get_template_part( "template-parts/events", 'loop-slides' ); ?>
						</div>
					
				<?php elseif($post_type->labels->name == 'Programs'):?>
					<?php $featured = get_field('featured_resource', $page->ID) ?>
					<?php if ($featured):?>
						<div class="block">
						<?php foreach( $featured as $post): // variable must be called $post (IMPORTANT) ?>
							<?php setup_postdata($post); ?>
							<h3 class="featured__label">Featured Spotlight</h3>
					    <section class="featured">
								<a href="<?php the_permalink() ?>" class="grid grid--half">

									<div class="container">
										<!-- <div class="featured__label">Featured Spotlight</div> -->
										<h4><?php the_title() ?></h4>
										<p class="subheading"><?php get_template_part('template-parts/communities', 'related') ?>&nbsp;</p>
										<p class="excerpt"><?php the_excerpt() ?></p>
									</div>	
									<div class="container">
										<div class="tile__thumbnail module__top" style="background-image: url('<?php the_post_thumbnail_url('spotlight-tile') ?>'"></div>
									</div>

								</a>
							</section>

				    <?php endforeach; ?>
					  </div>
				    <?php wp_reset_postdata(); ?>
						<?php endif ?>
					
					
						<div class="block">
						<?php get_template_part( "template-parts/programs", 'loop-slides' ); ?>
						</div>
					
				<?php elseif($post_type->labels->name == 'Communities'): ?>
				

				<section class="archive-view">
				<div class="list-column">     

				<?php 
					$comms = get_posts(array(
		        'post_type' => 'mocj_communities',
		        'numberposts' => -1,
		        'orderby' => 'title'
		      ));
				?>

				<?php
				$markers = [];
				/* Start the Loop */
				while ( have_posts() ) :
					the_post();

					/*
					 * Include the Post-Type-specific template for the content.
					 * If you want to override this in a child theme, then include a file
					 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
					 */
					$markers[get_post_field( 'post_name' )] = [
		  			'coords' => ['lat' => (float)get_field('lattitude'), 'lng' => (float)get_field('longitude')],
		  			'slug' => get_post_field( 'post_name' ),
		  			'title' => get_the_title(),
		  			'url' => get_permalink()
		  		];
					
					get_template_part( "template-parts/$singular", 'column-tile' );

					wp_reset_postdata();
				endwhile; ?>
					<!-- <a href="/programs">
						<div class="module__wrap">
							<div class="module__bottom">Other Developments</div>
						</div>
					</a> -->
				</div>
				

				<div class="content-column">
					 <div id="map"></div>
						<script>
						  var map;
						  var markers = [];
						  var style = [
    {
        "stylers": [
            {
                "saturation": -100
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#0099dd"
            }
        ]
    },
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#aadd55"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {}
];

						  var houses = <?= json_encode($markers)?>;
						  
							function highlightMarker(marker) {
								
								marker.setIcon('<?=get_template_directory_uri()?>/images/marker-active.svg');		
							  // if (marker.getAnimation() !== null) {
							  //   marker.setAnimation(null);
							  // } else {
							    marker.setAnimation(google.maps.Animation.BOUNCE);
							  //}
							}
							function resetMarker(marker){
								//var marker = markers[e.target.id];
								marker.setAnimation(null);
								marker.setIcon('<?=get_template_directory_uri()?>/images/marker.svg');		
							}
							function setActive(slug, scrollTo=true){
								var elements = document.getElementsByClassName("module__wrap active");
	            	while(elements.length > 0){
								    elements[0].classList.remove('active');
								}
	            	var element = document.getElementById(slug);
	            	console.log(element, slug)
	            	if(element){
		            	element.classList.add("active");
		            	if(scrollTo){
			            	element.scrollIntoView({behavior:"smooth"});
			            }
		            }
							}
							function tileHover(e){
								marker = markers[e.target.id];
								setActive(e.target.id, false);
								highlightMarker(marker);
							}
						  function initMap() {
						    map = new google.maps.Map(document.getElementById('map'), {
						      center: {lat: 40.8363144, lng: -73.9090465},
						      zoom: 12,
						      styles: style
						    });
						    var bounds = new google.maps.LatLngBounds();
						    for (var key in houses){
						    	console.log(key);
						    	console.log(houses[key].slug);
									var marker = new google.maps.Marker({
										map: map,
										draggable: true,
										animation: google.maps.Animation.DROP,
										position: houses[key].coords,//40.8363144,-73.9090465
										title: houses[key].title,
										icon: '<?=get_template_directory_uri()?>/images/marker.svg',
										slug: key,
										url: houses[key].url
									});
									markers[key] =  marker;
									bounds.extend(houses[key].coords);
									

									google.maps.event.addListener(marker, 'mouseover', (function (marker) {
					            return function(){
					            	var slug = marker.slug;
					            	setActive(slug);
					            	highlightMarker(marker);
					            	// while(elements.length > 0){
					            	// 	elements[0].classList.add("active");
					            	// }
					            }
					        })(marker));
									google.maps.event.addListener(marker, 'mouseout', (function(marker){
										
											console.log('ouseout')
											resetMarker(this);
										
									}));
									google.maps.event.addListener(marker, 'click', function() {
									    window.location.href = this.url;
									});
								}
								map.fitBounds(bounds);
								
								var tiles = document.getElementsByClassName("module__wrap");
								
							
								for (var i = 0; i < tiles.length; i++){
    								//tiles[i].addEventListener('mouseenter', highlightMarker, false);
    								tiles[i].addEventListener('mouseenter', tileHover, false);
    								tiles[i].addEventListener('mouseleave', function(e){resetMarker(markers[e.target.id])}, false);
  							}
						  }
						</script>
						<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBB0m1-hNGz_za3-BpD3uoc6JqwITWI_xg&channel=mocj&callback=initMap" async defer></script>
			  </div>
			  </section>		
			  <?php elseif($post_type->labels->name == 'Programs'): ?>
			  	<section class="archive-view">
			  		<div class="list-column">
			  			<?php
			  			$first = true;
			  			while ( have_posts() ) :
								the_post();
								$markers[get_the_title()] = [
					  			'coords' => ['lat' => (float)get_field('lattitude'), 'lng' => (float)get_field('longitude')],
					  			'slug' => get_post_field( 'post_name' )
					  		];
					  		?>
					  		<div class="module__wrap <?= $first ? 'active' : ''?>" id=<?= $post->post_name ?>>
					  			<div class="tile__thumbnail module__top" style="background-image: url('<?php the_post_thumbnail_url('spotlight-tile') ?>')"></div>
					  			<a href="javascript:void(0)">
										<div class="module__bottom">
											<h4><?php the_title(); ?></h4>
											<div class="link-text">Learn More</div>
										</div>
									</a>
								</div>
								<?php $first = false; ?>

								<?php wp_reset_postdata();?>
								<br>
							<?php endwhile; ?>
			  			
			  		</div>
			  		<div class="content-column">
							<?php
							$first = true;
			  			while ( have_posts() ) :
								the_post();
								$markers[get_the_title()] = [
					  			'coords' => ['lat' => (float)get_field('lattitude'), 'lng' => (float)get_field('longitude')],
					  			'slug' => get_post_field( 'post_name' )
					  		];
					  		?>
					  		<div class="module__wrap <?= $first ? 'active' : ''?>" id="view-<?= get_post_field('post_name') ?>">
					  			<div class="tile__thumbnail module__top" style="background-image: url('<?php the_post_thumbnail_url('spotlight-feature') ?>')"></div>
									<div class="module__bottom">
										<h4><?php the_title(); ?></h4>
										<?php the_content(); ?>
										<?php $reslink = get_field('resource_link') ?>
										<?php if ($reslink) :?>
											<div class="resource-link">
						            <span>To learn about the resources in your development, </span>
						            <a href="<?php echo $reslink ?>" target="_blank" rel="noopener noreferrer">click here &rarr;</a>
					            </div>
										<?php endif?>
									</div>
								</div>

								<?php 
									wp_reset_postdata();
									$first = false
								?>
							<?php endwhile; ?>
			  		</div>
			  	</section>
			  	<script>
			  		
			  		
			  			// document.getElement.
			  			var elements = document.querySelectorAll(".list-column .module__wrap");
			  			//var views = document.querySelectorAll(".content-column .module__wrap");
			  			for(i=0; i< elements.length; i++){
			  				elements[i].addEventListener('click', function(){
			  					console.log(this.id);

			  					document.querySelector(".content-column .module__wrap.active").classList.remove('active');
			  					document.getElementById('view-' + this.id).classList.add('active');
			  					document.querySelector(".list-column .module__wrap.active").classList.remove('active');
			  					this.classList.add('active');
			  				})
			  			}
			  		

			  	</script>
				<?php endif ?>			
		
		<?php
			else :

				get_template_part( 'template-parts/content', 'none' );

			endif;
		?>
		</main><!-- #main -->
	</div><!-- #primary -->
</section>
<?php
//get_sidebar();
get_footer();
