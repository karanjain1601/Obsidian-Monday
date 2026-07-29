---
title: WordPress Plugin Development
aliases: [WP Plugin Dev, WordPress Plugins, Building WP Plugins]
tags: [WordPress, core-wordpress]
domain: WordPress
difficulty: Intermediate
created: 2026-07-29
related: [WordPress_Hooks_and_Filters, WordPress_Theme_Development, WordPress_Database_and_Queries]
status: complete
---

# WordPress Plugin Development

> [!abstract] TL;DR
> A WordPress plugin is a PHP file (or folder of files) in `wp-content/plugins/` that adds functionality through hooks. Every plugin needs a header comment in its main file. Use custom post types for new data structures, the Settings API for options, and nonces for every form. Always prefix everything to avoid conflicts.

## Plugin File Structure

| Structure | Use Case |
|---|---|
| Single file: `wp-content/plugins/my-plugin.php` | Simple, single-purpose plugins |
| Folder: `wp-content/plugins/my-plugin/my-plugin.php` | Everything else (recommended) |

```
wp-content/plugins/my-plugin/
├── my-plugin.php          # Main file — must contain header comment
├── includes/
│   ├── class-my-plugin.php        # Main plugin class
│   ├── class-my-plugin-cpt.php    # Custom Post Type registration
│   ├── class-my-plugin-admin.php  # Admin pages and settings
│   └── class-my-plugin-api.php    # REST API endpoints
├── admin/
│   ├── css/admin-style.css
│   └── js/admin-script.js
├── public/
│   ├── css/public-style.css
│   └── js/public-script.js
├── languages/             # .pot, .po, .mo translation files
└── readme.txt             # Required for wordpress.org repo submission
```

## Plugin Header Comment

The header comment in the main file is what WordPress reads to recognise the plugin:

```php
<?php
/**
 * Plugin Name:       My Plugin
 * Plugin URI:        https://example.com/my-plugin
 * Description:       A brief description of the plugin.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            Your Name
 * Author URI:        https://example.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       my-plugin
 * Domain Path:       /languages
 */

// Security: abort if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define constants
define( 'MY_PLUGIN_VERSION', '1.0.0' );
define( 'MY_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'MY_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

// Include the main class
require_once MY_PLUGIN_DIR . 'includes/class-my-plugin.php';

// Bootstrap
function my_plugin_init() {
    return My_Plugin::get_instance();
}
add_action( 'plugins_loaded', 'my_plugin_init' );
```

## Activation and Deactivation Hooks

```php
// Register activation hook — runs once when plugin is activated
register_activation_hook( __FILE__, 'my_plugin_activate' );
function my_plugin_activate() {
    // Create custom database tables
    global $wpdb;
    $table_name = $wpdb->prefix . 'my_plugin_data';
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS $table_name (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        user_id bigint(20) unsigned NOT NULL,
        data longtext NOT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY  (id),
        KEY user_id (user_id)
    ) $charset_collate;";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql ); // Smart upgrade-safe table creation

    // Set default options
    add_option( 'my_plugin_settings', array(
        'feature_enabled' => true,
        'api_key'         => '',
    ) );

    // Schedule a cron event
    if ( ! wp_next_scheduled( 'my_plugin_daily_cron' ) ) {
        wp_schedule_event( time(), 'daily', 'my_plugin_daily_cron' );
    }

    // Flush rewrite rules (needed after registering CPTs)
    flush_rewrite_rules();
}

// Register deactivation hook
register_deactivation_hook( __FILE__, 'my_plugin_deactivate' );
function my_plugin_deactivate() {
    // Clear scheduled events
    wp_clear_scheduled_hook( 'my_plugin_daily_cron' );
    // Flush rewrite rules
    flush_rewrite_rules();
    // NOTE: Do NOT delete user data on deactivate — save that for uninstall.php
}
```

## Custom Post Types (CPTs)

```php
add_action( 'init', 'my_plugin_register_cpts' );

function my_plugin_register_cpts() {
    $labels = array(
        'name'               => 'Books',
        'singular_name'      => 'Book',
        'add_new_item'       => 'Add New Book',
        'edit_item'          => 'Edit Book',
        'view_item'          => 'View Book',
        'search_items'       => 'Search Books',
        'not_found'          => 'No books found.',
        'menu_name'          => 'Books',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true,  // Enables block editor + REST API
        'query_var'          => true,
        'rewrite'            => array( 'slug' => 'books' ),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => null,
        'menu_icon'          => 'dashicons-book',
        'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
    );

    register_post_type( 'book', $args );
}
```

## Custom Taxonomies

```php
add_action( 'init', 'my_plugin_register_taxonomies' );

function my_plugin_register_taxonomies() {
    // Hierarchical (like categories)
    register_taxonomy( 'genre', 'book', array(
        'label'        => 'Genres',
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => array( 'slug' => 'genre' ),
    ) );

    // Non-hierarchical (like tags)
    register_taxonomy( 'author_name', 'book', array(
        'label'        => 'Authors',
        'hierarchical' => false,
        'show_in_rest' => true,
        'rewrite'      => array( 'slug' => 'book-author' ),
    ) );
}
```

## Custom Fields (Meta Boxes)

```php
// Add a meta box
add_action( 'add_meta_boxes', 'my_book_meta_box' );
function my_book_meta_box() {
    add_meta_box(
        'my_book_details',          // HTML id
        'Book Details',             // Title
        'my_book_details_callback', // Render callback
        'book',                     // Post type
        'normal',                   // Context: normal | side | advanced
        'high'                      // Priority: high | low
    );
}

function my_book_details_callback( $post ) {
    // Output nonce for verification
    wp_nonce_field( 'my_book_details_nonce', 'my_book_nonce' );

    $isbn = get_post_meta( $post->ID, '_book_isbn', true );
    $pages = get_post_meta( $post->ID, '_book_pages', true );
    ?>
    <label for="book_isbn">ISBN:</label>
    <input type="text" id="book_isbn" name="book_isbn"
           value="<?php echo esc_attr( $isbn ); ?>">

    <label for="book_pages">Pages:</label>
    <input type="number" id="book_pages" name="book_pages"
           value="<?php echo esc_attr( $pages ); ?>">
    <?php
}

// Save meta box data
add_action( 'save_post_book', 'my_save_book_details', 10, 2 );
function my_save_book_details( $post_id, $post ) {
    // Verify nonce
    if ( ! isset( $_POST['my_book_nonce'] ) ||
         ! wp_verify_nonce( $_POST['my_book_nonce'], 'my_book_details_nonce' ) ) {
        return;
    }
    // Bail on autosave
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    // Check permissions
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;

    // Sanitise and save
    if ( isset( $_POST['book_isbn'] ) ) {
        update_post_meta( $post_id, '_book_isbn',
            sanitize_text_field( $_POST['book_isbn'] ) );
    }
    if ( isset( $_POST['book_pages'] ) ) {
        update_post_meta( $post_id, '_book_pages',
            absint( $_POST['book_pages'] ) );
    }
}
```

## Creating Admin Pages and the Settings API

```php
// Add admin menu item
add_action( 'admin_menu', 'my_plugin_admin_menu' );
function my_plugin_admin_menu() {
    add_options_page(
        'My Plugin Settings',   // Page title
        'My Plugin',            // Menu title
        'manage_options',       // Required capability
        'my-plugin-settings',   // Menu slug
        'my_plugin_settings_page' // Render callback
    );
}

// Register settings via Settings API
add_action( 'admin_init', 'my_plugin_register_settings' );
function my_plugin_register_settings() {
    register_setting( 'my_plugin_options_group', 'my_plugin_settings', array(
        'sanitize_callback' => 'my_plugin_sanitize_settings',
    ) );

    add_settings_section( 'my_plugin_main', 'Main Settings',
        '__return_false', 'my-plugin-settings' );

    add_settings_field( 'api_key', 'API Key',
        'my_plugin_api_key_field', 'my-plugin-settings', 'my_plugin_main' );
}

function my_plugin_api_key_field() {
    $options = get_option( 'my_plugin_settings' );
    echo '<input type="text" name="my_plugin_settings[api_key]"
          value="' . esc_attr( $options['api_key'] ?? '' ) . '">';
}

function my_plugin_sanitize_settings( $input ) {
    $clean = array();
    $clean['api_key'] = sanitize_text_field( $input['api_key'] ?? '' );
    return $clean;
}

// Render settings page
function my_plugin_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) return;
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'My Plugin Settings', 'my-plugin' ); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields( 'my_plugin_options_group' );
            do_settings_sections( 'my-plugin-settings' );
            submit_button();
            ?>
        </form>
    </div>
    <?php
}
```

## Nonces (Security)

Nonces ("number used once") are time-limited tokens that protect against CSRF attacks.

```php
// Generate a nonce in a form
wp_nonce_field( 'my_action_nonce', 'my_nonce_field' );

// Generate a nonce for URL-based actions
$delete_url = wp_nonce_url(
    admin_url( 'admin.php?action=delete&id=' . $item_id ),
    'delete_item_' . $item_id
);

// Verify a nonce from form submission
if ( ! wp_verify_nonce( $_POST['my_nonce_field'], 'my_action_nonce' ) ) {
    wp_die( 'Security check failed.' );
}

// Verify nonce from AJAX request
check_ajax_referer( 'my_ajax_nonce', 'nonce' ); // Dies on failure
```

## Plugin Best Practices

```php
// 1. ALWAYS prefix functions, classes, constants, and hooks
function my_plugin_do_thing() {}   // Good
function do_thing() {}             // Bad — potential conflict

// 2. Use a class or namespace to avoid globals
class My_Plugin {
    private static $instance = null;

    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action( 'init', array( $this, 'init' ) );
    }

    public function init() { /* ... */ }
}

// 3. Check WordPress functions before calling
if ( function_exists( 'some_plugin_function' ) ) {
    some_plugin_function();
}

// 4. Use wp_die() not die() or exit() for admin errors
wp_die( __( 'Something went wrong.', 'my-plugin' ) );

// 5. Always sanitise input and escape output
$user_input = sanitize_text_field( $_POST['field'] );
echo esc_html( $user_input );        // Echo plain text
echo esc_attr( $user_input );        // Echo in HTML attribute
echo esc_url( $user_input );         // Echo as URL
echo wp_kses_post( $user_input );    // Echo HTML (allow safe tags)
```

## Common Pitfalls

1. **Using direct SQL instead of `$wpdb->prepare()`** — String-concatenated SQL queries are vulnerable to SQL injection. Always use `$wpdb->prepare()` with placeholders for any user-supplied data.
2. **Omitting nonces on forms and AJAX handlers** — Without nonce verification, any authenticated user (or a forged cross-site request) can trigger your form handler. Every admin form and AJAX handler needs a nonce.
3. **Calling `flush_rewrite_rules()` on every page load** — This is expensive. Call it only once: in the activation hook after registering CPTs/taxonomies. Calling it on `init` or `plugins_loaded` adds ~200ms to every request.

## Review Questions

1. What is the purpose of the plugin header comment, and what is the minimum required field?
2. Explain the difference between `register_activation_hook()` and an `init` action. Why can't you use `init` to create database tables?
3. Why should you use `dbDelta()` instead of a plain `$wpdb->query( "CREATE TABLE ..." )` to create plugin database tables?

## See Also

- [[WordPress_Hooks_and_Filters]]
- [[WordPress_Database_and_Queries]]
- [[WordPress_REST_API]]
- [[WordPress_Theme_Development]]
- [[_MOC_WordPress_Master]]
- [[_MOC_PHP_Master]]
- [[_MOC_Database_Master]]
