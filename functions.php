<?php
/**
 * MOCJ functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package MOCJ
 */

if ( ! function_exists( 'mocj_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function mocj_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on MOCJ, use a find and replace
		 * to change 'mocj' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'mocj', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		add_theme_support('editor-styles');

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size( 300, 300, true );
		add_image_size( 'spotlight-tile', 600, 460, array('center', 'center'));
		add_image_size( 'spotlight-feature', 1200, 650, array('center', 'center'));
		add_image_size( 'community-tile', 600, 460, array('center', 'center'));
		add_image_size( 'community-banner', 2800, 1200, array('center', 'center'));

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'menu-1' => esc_html__( 'Primary', 'mocj' ),
		) );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'mocj_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		) );
	}
endif;
add_action( 'after_setup_theme', 'mocj_setup' );



 
/**
 * Custom walker class.
 */
class GenerateCommunitiesNav extends Walker_Nav_Menu {
 
    /**
     * Starts the list before the elements are added.
     *
     * Adds classes to the unordered list sub-menus.
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param int    $depth  Depth of menu item. Used for padding.
     * @param array  $args   An array of arguments. @see wp_nav_menu()
     */
    function start_lvl( &$output, $depth = 0, $args = array() ) {
        // Depth-dependent classes.
        $indent = ( $depth > 0  ? str_repeat( "\t", $depth ) : '' ); // code indent
        $display_depth = ( $depth + 1); // because it counts the first submenu as 0
        $classes = array(
            'sub-menu',
            ( $display_depth % 2  ? 'menu-odd' : 'menu-even' ),
            ( $display_depth >=2 ? 'sub-sub-menu' : '' ),
            'menu-depth-' . $display_depth
        );
        $class_names = implode( ' ', $classes );
 
        // Build HTML for output.
        $output .= "\n" . $indent . '<ul class="' . $class_names . '">' . "\n";
    }
 
    /**
     * Start the element output.
     *
     * Adds main/sub-classes to the list items and links.
     *
     * @param string $output Passed by reference. Used to append additional content.
     * @param object $item   Menu item data object.
     * @param int    $depth  Depth of menu item. Used for padding.
     * @param array  $args   An array of arguments. @see wp_nav_menu()
     * @param int    $id     Current item ID.
     */
    function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
        global $wp_query;
        $indent = ( $depth > 0 ? str_repeat( "\t", $depth ) : '' ); // code indent
        
        // Depth-dependent classes.
        $depth_classes = array(
            ( $depth == 0 ? 'main-menu-item main-nav__item' : 'sub-menu-item' ),
            ( $depth >=2 ? 'sub-sub-menu-item' : '' ),
            ( $depth % 2 ? 'menu-item-odd' : 'menu-item-even' ),
            'menu-item-depth-' . $depth
        );
        $depth_class_names = esc_attr( implode( ' ', $depth_classes ) );
        
        /* Generate Communities Nav*/
        if($item->title == 'Communities'){
          $args->after =  '<ul class="list--reset subnav-trigger__list">' . community_links('mocj_communities') . '</ul>';
          $depth_class_names .= ' menu-item-has-children communities-dd';
        }

        // Passed classes.
        $classes = empty( $item->classes ) ? array() : (array) $item->classes;
        $class_names = esc_attr( implode( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item ) ) );
 
        // Build HTML.
        $output .= $indent . '<li id="nav-menu-item-'. $item->ID . '" class="' . $depth_class_names . ' ' . $class_names . '">';
 
        // Link attributes.
        $attributes  = ! empty( $item->attr_title ) ? ' title="'  . esc_attr( $item->attr_title ) .'"' : '';
        $attributes .= ! empty( $item->target )     ? ' target="' . esc_attr( $item->target     ) .'"' : '';
        $attributes .= ! empty( $item->xfn )        ? ' rel="'    . esc_attr( $item->xfn        ) .'"' : '';
        $attributes .= ! empty( $item->url )        ? ' href="'   . esc_attr( $item->url        ) .'"' : '';
        $attributes .= ' class="link--inline type--black menu-link ' . ( $depth > 0 ? 'sub-menu-link' : 'main-menu-link' ) . '"';
 
        // Build HTML output and pass through the proper filter.



        $item_output = sprintf( '%1$s<a%2$s>%3$s%4$s%5$s</a>%6$s',
            $args->before,
            $attributes,
            $args->link_before,
            apply_filters( 'the_title', $item->title, $item->ID ),
            $args->link_after,
            $args->after
        );

        $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
        $args->after = "";
        // if($item->title == 'Communities'){
        //   $output .= '<li class="community-links-dd"><ul>' . community_links('mocj_communities') . '</ul></li>';
        // }
    }
}

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function mocj_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'mocj_content_width', 640 );
}
add_action( 'after_setup_theme', 'mocj_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function mocj_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'mocj' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'mocj' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'mocj_widgets_init' );

/**
  * Create custom post types
  *
  */
add_action( 'admin_menu', 'remove_default_post_type' );

function remove_default_post_type() {
    remove_menu_page( 'edit.php' );
}
function create_post_type() {
  // register_post_type( 'mocj_pillars',
  //   array(
  //     'labels' => array(
  //       'name' => __( 'Pillars' ),
  //       'singular_name' => __( 'Pillars' )
  //     ),
  //     'public' => true,
  //     'has_archive' => true,
  //     'supports' => array( 'thumbnail' ),
  //   )
  // );
  register_post_type( 'mocj_communities',
    array(
      'labels' => array(
        'name' => __( 'Communities' ),
        'singular_name' => __( 'Community' )
      ),
      'menu_position' => 2,
      'public' => true,
      'supports' => array( 'title', 'thumbnail' ),
      'has_archive' => true,
      'singular_name' => __( 'Community' ),
      'rewrite'               => array( 'slug' => 'communities' ),
    )
  );
}
add_action( 'init', 'create_post_type' );

function community_links( $post_type )
{
    $out = '';
    $boros = get_terms('boroughs');
    foreach($boros as $boro){
      
      $out .= '<li><span class="borough-label">' . $boro->name . '</span><ul>';

      $comms = get_posts(array(
        'post_type' => 'mocj_communities',
        'numberposts' => -1,
        'orderby' => 'title',
        'tax_query' => array(
          array(
            'taxonomy' => 'boroughs',
            'field' => 'id',
            'terms' => $boro->term_id, // Where term_id of Term 1 is "1".
            'include_children' => false
          )
        )
      ));

      foreach($comms as $comm){
        // echo $comm->post_title;
        $out .= '<li><a href="' . get_permalink( $comm ) . '">' . esc_html( $comm->post_title ) . '</a></li>';
      }

      $out .= '</ul></li>';
    }
    // $posts = get_posts(
    //     array(
    //         'post_type'  => $post_type,
    //         'numberposts' => -1,
    //         'orderby' => title,

    //     )
    // );
    // if( ! $boros ) return;

    
    // foreach( $posts as $p )
    // {
    //     $out .= '<li><a href="' . get_permalink( $p ) . '">' . esc_html( $p->post_title ) . '</a></li>';
    // }
    
    return $out;
}
function wpsites_query( $query ) {
  if ( $query->is_archive() && $query->is_main_query() && !is_admin() ) {
          $query->set( 'posts_per_page', 100 );
      }
  }
add_action( 'pre_get_posts', 'wpsites_query' );

add_filter( 'manage_objective_posts_columns', 'mocj_objective_columns' );
function mocj_objective_columns( $columns ) {
  
    $columns = array(
      'cb' => $columns['cb'],
      'title' => __( 'Title' ),
      'date' => __( 'Date' ),
      'communities' => __( 'Communities'),
    );
  
  return $columns;
}
add_action( 'manage_objective_posts_custom_column', 'mocj_objective_column', 10, 2);
function mocj_objective_column( $column, $post_id ) {
  // Image column
  if ( 'communities' === $column ) {
  	$terms = wp_get_post_terms( $post_id, 'communities_tax', array("fields" => "names"));
  	echo implode($terms, ', ');
    
  }
}
add_filter( 'manage_spotlights_posts_columns', 'mocj_spotlights_columns' );
function mocj_spotlights_columns( $columns ) {
  
    $columns = array(
      'cb' => $columns['cb'],
      'title' => __( 'Title' ),
      'date' => __( 'Date' ),
      'communities' => __( 'Communities'),
    );
  
  return $columns;
}
add_action( 'manage_spotlights_posts_custom_column', 'mocj_spotlights_column', 10, 2);
function mocj_spotlights_column( $column, $post_id ) {
  // Image column
  if ( 'communities' === $column ) {
  	$terms = wp_get_post_terms( $post_id, 'communities_tax', array("fields" => "names"));
  	echo implode($terms, ', ');
    
  }
}

function mocj_get_metrics($post_type, $limit = 0, $pillars = false, $ajax = false){
	$custom_taxterms = get_term_by('name', get_the_title($ajax ? $ajax['postID'] : ''), 'communities_tax');
	$args = array(
		'post_type' => $post_type,
		'post_status' => 'publish',
		'posts_per_page' => $limit, // you may edit this number
		'orderby' => 'menu_order',
		'order' => 'ASC',
		'tax_query' => array(
			'relation' => 'AND',
			array(
			  'taxonomy' => 'communities_tax',
			  'field' => 'term_id',
			  'terms' => $custom_taxterms,
			),
		),
		'post__not_in' => array ($post->ID),
		);
	if($ajax){
		$args['tax_query']['relation'] = 'AND';
		array_push($args['tax_query'], array(
			'taxonomy' => 'pillar',
			'field' => 'term_id',
			'terms' => $ajax['pillarID'],
		));
	}
	$related_items = new WP_Query( $args );

	if($pillars){
		$comm_metrics = []; 
		while ( $related_items->have_posts() ) : $related_items->the_post();

			if($comm_metrics[get_field('stat_metric_title')] === undefined){
				$comm_metrics[get_field('stat_metric_title')][intval(get_field('year'))][get_field('interval')] = [];	
			}
			$comm_metrics[get_field('stat_metric_title')][intval(get_field('year'))][get_field('interval')] = get_post();
		endwhile;

		return $comm_metrics;
	}
	return $related_items;
}

function create_mocj_taxonomies(){
	$labels = array(
		'name'              => _x( 'Demographic Categories', 'taxonomy general name', 'textdomain' ),
		'singular_name'     => _x( 'Demographic Category', 'taxonomy singular name', 'textdomain' ),
		'search_items'      => __( 'Search Demographic Categories', 'textdomain' ),
		'all_items'         => __( 'All Demographic Categories', 'textdomain' ),
		'parent_item'       => null,
		'parent_item_colon' => null,
		'edit_item'         => __( 'Edit Demographic Category', 'textdomain' ),
		'update_item'       => __( 'Update Demographic Category', 'textdomain' ),
		'add_new_item'      => __( 'Add New  Demographic Category', 'textdomain' ),
		'new_item_name'     => __( 'New Demographic Category Name', 'textdomain' ),
		'menu_name'         => __( ' Demographic Category', 'textdomain' ),
	);
	$args = array(
		'hierarchical'          => false,
		'labels'                => $labels,
		'show_ui'               => true,
		'show_admin_column'     => true,
		'update_count_callback' => '_update_post_term_count',
		'query_var'             => true,
		'rewrite'               => array( 'slug' => 'demographic-category' ),
	);
	register_taxonomy( 'demogrpahic_category', 'mocj_communities', $args );
}

add_action( 'init', 'create_mocj_taxonomies' );

/**
 * Enqueue scripts and styles.
 */

function mocj_scripts() {
	wp_enqueue_style( 'mocj-style', get_stylesheet_uri() . '?v=0.59');

	wp_enqueue_script( 'popper-js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js' );
	wp_enqueue_script( 'google-charts-js', 'https://www.gstatic.com/charts/loader.js' );

	wp_enqueue_script( 'mocj-script', get_template_directory_uri() . '/main.js?v=0.5', array ( ), 1.1, true);

	wp_enqueue_script( 'mocj-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20151215', true );

	wp_enqueue_script( 'mocj-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20151215', true );
	
	wp_enqueue_script( 'ajax-metrics',  get_stylesheet_directory_uri() . '/js/ajax-metrics.js', array( 'jquery' ), '1.0', true );
	global $wp_query;
	wp_localize_script( 'ajax-metrics', 'ajaxmetrics', array(
		'ajaxurl' => admin_url( 'admin-ajax.php' ),
		'query_vars' => json_encode( $wp_query->query )
	));

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'mocj_scripts' );

function mocj_add_editor_styles() {
    add_editor_style( 'editor.css' );
}
add_action( 'admin_init', 'mocj_add_editor_styles' );


if( function_exists('acf_add_options_page') ) {

    acf_add_options_page(array(
        'page_title'  => __('Site Options', 'mocj'),
        'menu_title'  => __('Site Options', 'mocj'),
        'menu_slug'   => 'theme-options',
        'capability'  => 'edit_posts',
        'redirect'      => false
    ));
}

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

add_action('init', 'remove_comment_support', 100);

function remove_comment_support() {
remove_post_type_support( 'page', 'comments' );
}

function tweek_mce( $init ) {
	$init['content_style'] = "body { font-family: 'Mercury Display A','Mercury Display B', Times, serif; }";
	$init['font_formats'] = "aktiv-grotesk=aktiv-grotesk,sans-serif;Mercury Display A='Mercury Display A','Mercury Display B',Times,serif;";
	$init['fontsize_formats'] = "14px 16px 18px 24px";
	return $init;
}
add_filter('tiny_mce_before_init', 'tweek_mce');

// Initialize TinyMCE table plugin
function add_the_table_plugin( $plugins ) {
	$plugins['table'] = get_template_directory_uri() . '/tinymce-plugins/table/plugin.min.js';
	return $plugins;
}
add_filter( 'mce_external_plugins', 'add_the_table_plugin' );

// Add table button to TinyMCE buttons
function mce_table_button( $buttons ) {
	array_push( $buttons, 'table' );
	return $buttons;
}
// Register our callback to the appropriate filter
add_filter( 'mce_buttons', 'mce_table_button' );

add_filter( 'acf/fields/wysiwyg/toolbars', function ( $toolbars ) {
	array_unshift( $toolbars['Full'][2], 'fontsizeselect' );
	array_unshift( $toolbars['Full'][2], 'fontselect' );
	return $toolbars;
} );

function mocj_allow_json_uploads($mime_types) {
  $mime_types['json'] = 'text/plain';
  return $mime_types;
}
add_filter('upload_mimes', 'mocj_allow_json_uploads', 1, 1);


add_action('init', function() {
  register_block_style('core/paragraph', [
    'name' => 'serif',
    'label' => __('Serif', 'mocj'),
  ]);
});

// Domain Content Custom Fields (ACF)
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_6185669d36979',
	'title' => 'Domain Content',
	'fields' => array(
		array(
			'key' => 'field_618edd9a524ee',
			'label' => 'Thumbnail Image',
			'name' => 'thumb',
			'type' => 'image',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'id',
			'preview_size' => 'medium',
			'library' => 'all',
			'min_width' => '',
			'min_height' => '',
			'min_size' => '',
			'max_width' => '',
			'max_height' => '',
			'max_size' => '',
			'mime_types' => '',
		),
		array(
			'key' => 'field_61ae0d9486d9a',
			'label' => 'Short Title',
			'name' => 'short_title',
			'type' => 'text',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
			'prepend' => '',
			'append' => '',
			'maxlength' => '',
		),
		array(
			'key' => 'field_618566b3f4ad2',
			'label' => 'Subdomains',
			'name' => 'subdomains',
			'type' => 'repeater',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => 'foobar',
				'id' => '',
			),
			'collapsed' => '',
			'min' => 0,
			'max' => 0,
			'layout' => 'table',
			'button_label' => 'Add Subdomain',
			'sub_fields' => array(
				array(
					'key' => 'field_618566d0f4ad3',
					'label' => 'Title',
					'name' => 'title',
					'type' => 'text',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
				array(
					'key' => 'field_618566e9f4ad4',
					'label' => 'Description',
					'name' => 'description',
					'type' => 'wysiwyg',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'tabs' => 'all',
					'toolbar' => 'basic',
					'media_upload' => 0,
					'delay' => 0,
				),
				array(
					'key' => 'field_61856700f4ad5',
					'label' => 'Subdomain Data',
					'name' => 'subdomain_data',
					'type' => 'repeater',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'collapsed' => '',
					'min' => 0,
					'max' => 0,
					'layout' => 'row',
					'button_label' => 'Add Data',
					'sub_fields' => array(
						array(
							'key' => 'field_61856715f4ad6',
							'label' => 'Title',
							'name' => 'title',
							'type' => 'text',
							'instructions' => '',
							'required' => 1,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
							'maxlength' => '',
						),
						array(
							'key' => 'field_6185674bf4ad7',
							'label' => 'Description',
							'name' => 'description',
							'type' => 'wysiwyg',
							'instructions' => '',
							'required' => 1,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'tabs' => 'all',
							'toolbar' => 'full',
							'media_upload' => 0,
							'delay' => 0,
						),
					),
				),
			),
		),
		array(
			'key' => 'field_6196b35d16838',
			'label' => 'Call to Action',
			'name' => 'cta',
			'type' => 'link',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'array',
		),
		array(
			'key' => 'field_619690997a37d',
			'label' => 'Components',
			'name' => 'components',
			'type' => 'repeater',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'collapsed' => '',
			'min' => 0,
			'max' => 0,
			'layout' => 'row',
			'button_label' => 'Add Component',
			'sub_fields' => array(
				array(
					'key' => 'field_619690ae7a37e',
					'label' => 'Component',
					'name' => 'component',
					'type' => 'select',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'choices' => array(
						'quotes' => 'Quote Carousel',
						'richtext' => 'Rich Text',
						'cta' => 'CTA',
						'ctabanner' => 'CTA Banner',
					),
					'default_value' => array(
					),
					'allow_null' => 0,
					'multiple' => 0,
					'ui' => 0,
					'return_format' => 'value',
					'ajax' => 0,
					'placeholder' => '',
				),
				array(
					'key' => 'field_619690ed7a37f',
					'label' => 'Rich Text',
					'name' => 'richtext',
					'type' => 'wysiwyg',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => array(
						array(
							array(
								'field' => 'field_619690ae7a37e',
								'operator' => '==',
								'value' => 'richtext',
							),
						),
					),
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'tabs' => 'all',
					'toolbar' => 'full',
					'media_upload' => 1,
					'delay' => 0,
				),
				array(
					'key' => 'field_6196910a7a380',
					'label' => 'Quotes',
					'name' => 'quotes',
					'type' => 'repeater',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => array(
						array(
							array(
								'field' => 'field_619690ae7a37e',
								'operator' => '==',
								'value' => 'quotes',
							),
						),
					),
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'collapsed' => '',
					'min' => 0,
					'max' => 0,
					'layout' => 'table',
					'button_label' => 'Quote',
					'sub_fields' => array(
						array(
							'key' => 'field_6196911a7a381',
							'label' => 'Quote',
							'name' => 'quote',
							'type' => 'text',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
							'maxlength' => '',
						),
					),
				),
				array(
					'key' => 'field_619692255f374',
					'label' => 'CTA',
					'name' => 'cta',
					'type' => 'link',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => array(
						array(
							array(
								'field' => 'field_619690ae7a37e',
								'operator' => '==',
								'value' => 'cta',
							),
						),
					),
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'return_format' => 'array',
				),
				array(
					'key' => 'field_61a64c9012443',
					'label' => 'CTA Banner',
					'name' => 'ctabanner',
					'type' => 'group',
					'instructions' => '',
					'required' => 0,
					'conditional_logic' => array(
						array(
							array(
								'field' => 'field_619690ae7a37e',
								'operator' => '==',
								'value' => 'ctabanner',
							),
						),
					),
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'layout' => 'block',
					'sub_fields' => array(
						array(
							'key' => 'field_61a64cbc12444',
							'label' => 'Title',
							'name' => 'title',
							'type' => 'text',
							'instructions' => '',
							'required' => 1,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
							'maxlength' => '',
						),
						array(
							'key' => 'field_61a64f9912445',
							'label' => 'Description',
							'name' => 'description',
							'type' => 'text',
							'instructions' => '',
							'required' => 1,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'default_value' => '',
							'placeholder' => '',
							'prepend' => '',
							'append' => '',
							'maxlength' => '',
						),
						array(
							'key' => 'field_61a64fa112446',
							'label' => 'CTA',
							'name' => 'cta',
							'type' => 'link',
							'instructions' => '',
							'required' => 0,
							'conditional_logic' => 0,
							'wrapper' => array(
								'width' => '',
								'class' => '',
								'id' => '',
							),
							'return_format' => 'array',
						),
					),
				),
			),
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'domain',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
));

endif;



// Hero content (ACF)
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_6193c1f6a6858',
	'title' => 'Hero Details',
	'fields' => array(
		array(
			'key' => 'field_6193c21558791',
			'label' => 'Hero Description',
			'name' => 'hero_description',
			'type' => 'wysiwyg',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'tabs' => 'all',
			'toolbar' => 'full',
			'media_upload' => 0,
			'delay' => 0,
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'domain',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
));

endif;

// Data Explorer Content (ACF)
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_6189322d5dd63',
	'title' => 'Data Explorer',
	'fields' => array(
		array(
			'key' => 'field_61b255db76613',
			'label' => 'Config Data',
			'name' => 'config_data',
			'type' => 'file',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'json',
		),
		array(
			'key' => 'field_61b37662cda45',
			'label' => 'Demographic Data',
			'name' => 'demographic_data',
			'type' => 'file',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b37671cda46',
			'label' => 'Community Data',
			'name' => 'community_data',
			'type' => 'file',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'json',
		),
		array(
			'key' => 'field_61b265245a3c0',
			'label' => '311 Complaints Rates',
			'name' => '311_complaints',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b265415a3c1',
			'label' => 'DOI Evictions',
			'name' => 'doi_evictions',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b265505a3c2',
			'label' => 'NYPD SQF',
			'name' => 'nypd_sqf',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b2655f5a3c3',
			'label' => 'NYPD Calls',
			'name' => 'nypd_calls',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b2656a5a3c4',
			'label' => 'NYPD Arrests',
			'name' => 'nypd_arrests',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b267205a3c5',
			'label' => 'NYPD Complaints',
			'name' => 'nypd_complaints',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b2672f5a3c6',
			'label' => 'NYPD Shootings',
			'name' => 'nypd_shootings',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b2673f5a3c7',
			'label' => 'Census Indicators',
			'name' => 'census_indicators',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61b2674b5a3c8',
			'label' => 'Panel Survey',
			'name' => 'panel_survey',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
		array(
			'key' => 'field_61bcad5537082',
			'label' => 'Panel Survey by Demographic',
			'name' => 'panel_survey_demo',
			'type' => 'file',
			'instructions' => '',
			'required' => 1,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'return_format' => 'url',
			'library' => 'uploadedTo',
			'min_size' => '',
			'max_size' => '',
			'mime_types' => 'csv',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_template',
				'operator' => '==',
				'value' => 'page-data-explorer.php',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
));

endif;

// Add Data Indicators settings (ACF)
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_61ae63476e57d',
	'title' => 'Data Indicators',
	'fields' => array(
		array(
			'key' => 'field_61ae634c48316',
			'label' => 'Data Indicators',
			'name' => 'data_indicators',
			'type' => 'repeater',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'collapsed' => '',
			'min' => 0,
			'max' => 0,
			'layout' => 'table',
			'button_label' => '',
			'sub_fields' => array(
				array(
					'key' => 'field_61c9e98657688',
					'label' => 'Indicator ID',
					'name' => 'indicator_id',
					'type' => 'number',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'min' => '',
					'max' => '',
					'step' => '',
				),
				array(
					'key' => 'field_61c9e98f57689',
					'label' => 'Title',
					'name' => 'title',
					'type' => 'text',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
				array(
					'key' => 'field_61c9e9945768a',
					'label' => 'Description',
					'name' => 'description',
					'type' => 'text',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
			),
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'options_page',
				'operator' => '==',
				'value' => 'theme-options',
			),
		),
	),
	'menu_order' => 1,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
));

endif;

// Domain Overview fields (ACF)
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_61cb24106ab81',
	'title' => 'Domain Overview',
	'fields' => array(
		array(
			'key' => 'field_61cb24154db97',
			'label' => 'Domains',
			'name' => 'domains',
			'type' => 'repeater',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'collapsed' => '',
			'min' => 0,
			'max' => 0,
			'layout' => 'table',
			'button_label' => '',
			'sub_fields' => array(
				array(
					'key' => 'field_61cb241e4db98',
					'label' => 'Title',
					'name' => 'title',
					'type' => 'text',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'prepend' => '',
					'append' => '',
					'maxlength' => '',
				),
				array(
					'key' => 'field_61cb242e4db99',
					'label' => 'Description',
					'name' => 'description',
					'type' => 'textarea',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'default_value' => '',
					'placeholder' => '',
					'maxlength' => '',
					'rows' => '',
					'new_lines' => '',
				),
				array(
					'key' => 'field_61cb24334db9a',
					'label' => 'Link',
					'name' => 'link',
					'type' => 'page_link',
					'instructions' => '',
					'required' => 1,
					'conditional_logic' => 0,
					'wrapper' => array(
						'width' => '',
						'class' => '',
						'id' => '',
					),
					'post_type' => array(
						0 => 'domain',
					),
					'taxonomy' => '',
					'allow_null' => 0,
					'allow_archives' => 1,
					'multiple' => 0,
				),
			),
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_template',
				'operator' => '==',
				'value' => 'page-domain-overview.php',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => true,
	'description' => '',
));

endif;
