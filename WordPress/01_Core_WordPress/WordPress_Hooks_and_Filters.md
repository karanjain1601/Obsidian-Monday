---
title: WordPress Hooks and Filters
aliases: [WP Hooks, WordPress Actions and Filters, WordPress Plugin API]
tags: [WordPress, core-wordpress]
domain: WordPress
difficulty: Intermediate
created: 2026-07-29
related: [WordPress_Theme_Development, WordPress_Plugin_Development, WordPress_Database_and_Queries]
status: complete
---

# WordPress Hooks and Filters

> [!abstract] TL;DR
> WordPress's hook system is the entire extension mechanism: **actions** let you run code at a specific moment; **filters** let you modify data before it is used. You almost never modify core files — you hook into them. Master `add_action()`, `add_filter()`, priority, and argument count and you can do virtually anything in WordPress.

## Actions vs Filters

| Aspect | Actions | Filters |
|---|---|---|
| Purpose | Execute code at a specific point | Modify a value before it is used |
| Return value | Not expected (ignored) | **Must return** the modified value |
| Core function | `do_action( $tag, ...$args )` | `apply_filters( $tag, $value, ...$args )` |
| Register with | `add_action( $tag, $callback, $priority, $accepted_args )` | `add_filter( $tag, $callback, $priority, $accepted_args )` |
| Remove with | `remove_action( $tag, $callback, $priority )` | `remove_filter( $tag, $callback, $priority )` |
| Example use | Send an email on post publish | Modify post content before display |

> [!tip] Technically, filters and actions share the same global hook registry in WordPress. `add_action` is literally an alias for `add_filter`. The difference is conceptual: actions are for side effects, filters are for transformations.

## Core Function Signatures

```php
// Register an action callback
add_action(
    string $hook_name,
    callable $callback,
    int $priority = 10,   // lower number = runs earlier (default: 10)
    int $accepted_args = 1
);

// Register a filter callback
add_filter(
    string $hook_name,
    callable $callback,
    int $priority = 10,
    int $accepted_args = 1
);

// Fire an action hook (used inside plugins/themes/core)
do_action( string $hook_name, mixed ...$args );

// Apply a filter hook (used inside plugins/themes/core)
$value = apply_filters( string $hook_name, mixed $value, mixed ...$args );

// Remove a previously added callback
remove_action( string $hook_name, callable $callback, int $priority = 10 );
remove_filter( string $hook_name, callable $callback, int $priority = 10 );

// Check if a hook has callbacks registered
has_action( string $hook_name, callable|false $callback = false );
has_filter( string $hook_name, callable|false $callback = false );
```

## Priority and Arguments

```php
// Priority: lower number fires first (default 10)
add_action( 'init', 'my_early_setup', 5 );   // fires before priority 10
add_action( 'init', 'my_late_setup', 99 );   // fires after priority 10

// accepted_args must match what the hook actually passes
// the_content passes $content only → 1 arg (default is fine)
add_filter( 'the_content', 'my_content_filter' );
function my_content_filter( $content ) {
    return $content . '<p>Footer text</p>';
}

// save_post passes ($post_id, $post, $update) → 3 args needed
add_action( 'save_post', 'my_save_post', 10, 3 );
function my_save_post( $post_id, $post, $update ) {
    // do something with all three args
}
```

## Common Hooks Reference

### Action Hooks

| Hook | When It Fires | Typical Use |
|---|---|---|
| `plugins_loaded` | After all plugins are loaded | Plugin compatibility checks, late plugin setup |
| `init` | Early in WP bootstrap, after plugins loaded | Register CPTs, taxonomies, rewrite rules |
| `wp_loaded` | After `init`, after WP fully loaded | Safe to use all WP APIs |
| `wp_enqueue_scripts` | When front-end scripts/styles are enqueued | Enqueue CSS/JS for themes and plugins |
| `admin_enqueue_scripts` | When admin scripts/styles are enqueued | Admin-only CSS/JS |
| `wp_head` | Inside `<head>` on front-end | Output meta tags, inline styles |
| `wp_footer` | Before `</body>` on front-end | Output analytics, deferred scripts |
| `after_setup_theme` | After active theme is loaded | Register menus, theme support, image sizes |
| `template_redirect` | Before WP loads a template | Custom redirects, access control |
| `save_post` | After a post is saved to DB | Custom field saving, notifications |
| `publish_post` | When a post status changes to "publish" | Send emails, trigger webhooks |
| `delete_post` | Before a post is deleted | Cleanup related data |
| `user_register` | After a new user is created | Welcome emails, default role assignment |
| `wp_login` | After successful login | Audit logging |
| `wp_logout` | After logout | Session cleanup |
| `shutdown` | At the very end of every request | Profiling, deferred tasks |

### Filter Hooks

| Hook | What It Filters | Typical Use |
|---|---|---|
| `the_content` | Post content HTML before display | Add social share buttons, nofollow links |
| `the_title` | Post title before display | Append/prepend text to titles |
| `the_excerpt` | Post excerpt | Customise excerpt length and trailing text |
| `excerpt_length` | Excerpt word count (integer) | Change default 55-word excerpt |
| `wp_title` | `<title>` tag (classic themes) | Custom title format |
| `body_class` | Array of `<body>` CSS classes | Add conditional body classes |
| `post_class` | Array of post container classes | Add custom post classes |
| `login_redirect` | URL after login | Role-based redirects |
| `wp_mail` | Email args before sending | Modify From header, add CC |
| `upload_mimes` | Allowed upload mime types | Allow SVG, CSV uploads |
| `wp_nav_menu_items` | Nav menu HTML | Inject extra menu items |
| `template_include` | Template file path | Override which template file loads |
| `posts_where` | SQL WHERE clause for WP_Query | Advanced custom query filters |
| `wp_insert_post_data` | Post data array before DB insert | Sanitise/transform post data |

## Real-World Examples

### Example 1: Add a Banner After Post Content

```php
// In your theme's functions.php or a plugin
add_filter( 'the_content', 'my_add_author_bio', 20 ); // priority 20: runs after default content filters

function my_add_author_bio( $content ) {
    // Only on single posts for logged-out readers
    if ( is_single() && ! is_user_logged_in() ) {
        $author_id   = get_the_author_meta( 'ID' );
        $author_name = get_the_author_meta( 'display_name' );
        $bio         = get_the_author_meta( 'description' );

        if ( $bio ) {
            $bio_html = sprintf(
                '<div class="author-bio"><strong>About %s</strong><p>%s</p></div>',
                esc_html( $author_name ),
                esc_html( $bio )
            );
            $content .= $bio_html;
        }
    }
    return $content; // ALWAYS return from a filter
}
```

### Example 2: Register a Custom Post Type on `init`

```php
add_action( 'init', 'my_register_portfolio_cpt' );

function my_register_portfolio_cpt() {
    register_post_type( 'portfolio', array(
        'label'  => 'Portfolio',
        'public' => true,
        'supports' => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
        'menu_icon' => 'dashicons-portfolio',
        'rewrite' => array( 'slug' => 'portfolio' ),
    ) );
}
```

### Example 3: Send a Slack Notification on Post Publish

```php
add_action( 'publish_post', 'my_slack_notify_publish', 10, 2 );

function my_slack_notify_publish( $post_id, $post ) {
    $webhook_url = get_option( 'slack_webhook_url' );
    if ( ! $webhook_url ) return;

    $message = sprintf( 'New post published: %s — %s',
        $post->post_title,
        get_permalink( $post_id )
    );

    wp_remote_post( $webhook_url, array(
        'body'    => wp_json_encode( array( 'text' => $message ) ),
        'headers' => array( 'Content-Type' => 'application/json' ),
    ) );
}
```

### Example 4: Removing a Hook Added by a Plugin

```php
// You need to call remove_action/remove_filter AFTER the original add_action ran.
// Use the same priority as the original registration.

add_action( 'init', 'my_remove_plugin_hook', 20 ); // 20 > the plugin's priority

function my_remove_plugin_hook() {
    remove_filter( 'the_content', array( 'SomePlugin', 'add_banner' ), 10 );
}
```

### Example 5: Custom `apply_filters()` in Your Own Code

```php
// In your plugin/theme — expose a filter so others can customise your output
function my_get_greeting( $name ) {
    $greeting = 'Hello, ' . esc_html( $name ) . '!';
    // Allow any other code to modify the greeting
    return apply_filters( 'my_plugin_greeting', $greeting, $name );
}

// Another plugin or the theme can now hook in:
add_filter( 'my_plugin_greeting', function( $greeting, $name ) {
    return 'Howdy, ' . esc_html( $name ) . '!';
}, 10, 2 );
```

## Hook Priority Deep Dive

```
Priority 1   ──▶  runs first
Priority 5
Priority 10  ──▶  WordPress default (most plugins)
Priority 11
Priority 20
Priority 99
Priority 9999  ──▶ runs last (good for "override everything")
```

When two callbacks share the same priority on the same hook, they run in the order they were added with `add_action/add_filter`.

## Common Pitfalls

1. **Forgetting to `return` from a filter** — A filter callback that returns nothing implicitly returns `null`, which can blank out content, break queries, or cause fatal errors. Every filter must return a value — even if you don't change it: `return $content;`.
2. **Using the wrong `accepted_args` count** — WordPress only passes as many arguments to your callback as `$accepted_args` declares. If a hook passes three arguments and you declare `1`, your callback only receives the first. Declare the correct count for multi-argument hooks.
3. **Trying to `remove_action` before the hook was added** — If you call `remove_action` in `functions.php` at priority 10, but the plugin registers its hook also at priority 10 during `plugins_loaded`, the order matters. Wrap your `remove_action` in a later hook (higher priority number) to ensure it fires after the registration.

## Review Questions

1. What is the fundamental difference between an action hook and a filter hook? What happens if you return `null` from a filter callback?
2. You want to run a callback on the `init` hook *after* all plugins have registered their `init` callbacks (which use default priority 10). What priority should you use?
3. How do you remove a hook that was registered using an anonymous class method, e.g. `add_action( 'save_post', array( $plugin_instance, 'save' ), 10 )`?

## See Also

- [[WordPress_Theme_Development]]
- [[WordPress_Plugin_Development]]
- [[WordPress_Database_and_Queries]]
- [[WordPress_REST_API]]
- [[_MOC_WordPress_Master]]
- [[_MOC_PHP_Master]]
