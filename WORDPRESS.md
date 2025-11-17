# WordPress Integration Guide

## Method 1: Embed in Page/Post (Easiest - 5 minutes)

### Step 1: Upload Files

1. **Via FTP/File Manager:**
   - Upload all files to: `/wp-content/uploads/arti-terminal/`
   - Files needed: `terminal.css`, `terminal.js`, `config.js`, `slack-logger.js`, `ai-handler.js`

2. **Via WordPress Media Library:**
   - Go to Media → Add New
   - Upload the 5 files above
   - Note the file URLs

### Step 2: Add to Page

1. Edit your page/post in WordPress
2. Add **Custom HTML** block
3. Paste this code:

```html
<!-- ARTI Terminal Embed -->
<link href="/wp-content/uploads/arti-terminal/terminal.css" rel="stylesheet">

<div id="arti-terminal" style="margin: 20px 0; max-width: 1200px;"></div>

<script src="/wp-content/uploads/arti-terminal/config.js"></script>
<script src="/wp-content/uploads/arti-terminal/slack-logger.js"></script>
<script src="/wp-content/uploads/arti-terminal/ai-handler.js"></script>
<script src="/wp-content/uploads/arti-terminal/terminal.js"></script>

<script>
  // Configure API keys (optional)
  window.GEMINI_API_KEY = '';  // Add your Gemini API key here
  window.SLACK_WEBHOOK_URL = '';  // Add your Slack webhook URL here

  // Initialize terminal
  const slackLogger = window.SLACK_WEBHOOK_URL ?
    new SlackLogger(window.SLACK_WEBHOOK_URL, CONFIG.slack) : null;

  const aiHandler = window.GEMINI_API_KEY ?
    new GeminiAIHandler(window.GEMINI_API_KEY, CONFIG.ai.systemPrompt) : null;

  new ArtiTerminal('arti-terminal', CONFIG, slackLogger, aiHandler);
</script>
```

4. **Update the script** if you uploaded to different location
5. Publish the page

**Done!** Visit your page to see the terminal.

---

## Method 2: WordPress Plugin (Reusable - 10 minutes)

### Step 1: Create Plugin

1. Go to `/wp-content/plugins/`
2. Create folder: `arti-terminal`
3. Create file: `arti-terminal.php` (see code below)
4. Copy terminal files into this folder

### Step 2: Plugin Code

Create `/wp-content/plugins/arti-terminal/arti-terminal.php`:

```php
<?php
/**
 * Plugin Name: ARTI Terminal
 * Plugin URI: https://arturwolnica.com
 * Description: Retro terminal web component with AI chat and Slack logging
 * Version: 1.0.0
 * Author: Arti Wolnica
 * Author URI: https://arturwolnica.com
 * License: MIT
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

class ArtiTerminal {

    private static $instance = null;

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new ArtiTerminal();
        }
        return self::$instance;
    }

    private function __construct() {
        // Register shortcode
        add_shortcode('arti_terminal', array($this, 'renderTerminal'));

        // Add settings page
        add_action('admin_menu', array($this, 'addSettingsPage'));
        add_action('admin_init', array($this, 'registerSettings'));
    }

    public function renderTerminal($atts) {
        $atts = shortcode_atts(array(
            'height' => '600px',
        ), $atts);

        $plugin_url = plugin_dir_url(__FILE__);

        // Get API keys from settings
        $gemini_key = get_option('arti_terminal_gemini_key', '');
        $slack_webhook = get_option('arti_terminal_slack_webhook', '');

        ob_start();
        ?>

        <link href="<?php echo $plugin_url; ?>terminal.css" rel="stylesheet">

        <div id="arti-terminal" style="height: <?php echo esc_attr($atts['height']); ?>"></div>

        <script src="<?php echo $plugin_url; ?>config.js"></script>
        <script src="<?php echo $plugin_url; ?>slack-logger.js"></script>
        <script src="<?php echo $plugin_url; ?>ai-handler.js"></script>
        <script src="<?php echo $plugin_url; ?>terminal.js"></script>

        <script>
        (function() {
            window.GEMINI_API_KEY = '<?php echo esc_js($gemini_key); ?>';
            window.SLACK_WEBHOOK_URL = '<?php echo esc_js($slack_webhook); ?>';

            const slackLogger = window.SLACK_WEBHOOK_URL ?
                new SlackLogger(window.SLACK_WEBHOOK_URL, CONFIG.slack) : null;

            const aiHandler = window.GEMINI_API_KEY ?
                new GeminiAIHandler(window.GEMINI_API_KEY, CONFIG.ai.systemPrompt) : null;

            new ArtiTerminal('arti-terminal', CONFIG, slackLogger, aiHandler);
        })();
        </script>

        <?php
        return ob_get_clean();
    }

    public function addSettingsPage() {
        add_options_page(
            'ARTI Terminal Settings',
            'ARTI Terminal',
            'manage_options',
            'arti-terminal',
            array($this, 'renderSettingsPage')
        );
    }

    public function registerSettings() {
        register_setting('arti_terminal_settings', 'arti_terminal_gemini_key');
        register_setting('arti_terminal_settings', 'arti_terminal_slack_webhook');
    }

    public function renderSettingsPage() {
        ?>
        <div class="wrap">
            <h1>ARTI Terminal Settings</h1>

            <form method="post" action="options.php">
                <?php settings_fields('arti_terminal_settings'); ?>
                <?php do_settings_sections('arti_terminal_settings'); ?>

                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="arti_terminal_gemini_key">Google Gemini API Key</label>
                        </th>
                        <td>
                            <input type="text"
                                   id="arti_terminal_gemini_key"
                                   name="arti_terminal_gemini_key"
                                   value="<?php echo esc_attr(get_option('arti_terminal_gemini_key')); ?>"
                                   class="regular-text"
                                   placeholder="AIzaSyC...">
                            <p class="description">
                                Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a>.
                                Leave empty to disable AI features.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="arti_terminal_slack_webhook">Slack Webhook URL</label>
                        </th>
                        <td>
                            <input type="text"
                                   id="arti_terminal_slack_webhook"
                                   name="arti_terminal_slack_webhook"
                                   value="<?php echo esc_attr(get_option('arti_terminal_slack_webhook')); ?>"
                                   class="regular-text"
                                   placeholder="https://hooks.slack.com/services/...">
                            <p class="description">
                                Create webhook at <a href="https://api.slack.com/apps" target="_blank">Slack API</a>.
                                Leave empty to disable logging.
                            </p>
                        </td>
                    </tr>
                </table>

                <?php submit_button(); ?>
            </form>

            <hr>

            <h2>Usage</h2>
            <p>Add this shortcode to any page or post:</p>
            <code>[arti_terminal]</code>

            <p>Or with custom height:</p>
            <code>[arti_terminal height="700px"]</code>

            <h2>PHP Template Usage</h2>
            <p>Add this to your theme template:</p>
            <code>&lt;?php echo do_shortcode('[arti_terminal]'); ?&gt;</code>
        </div>
        <?php
    }
}

// Initialize plugin
ArtiTerminal::getInstance();
```

### Step 3: Copy Terminal Files

Copy these files to `/wp-content/plugins/arti-terminal/`:
- `terminal.css`
- `terminal.js`
- `config.js`
- `slack-logger.js`
- `ai-handler.js`

### Step 4: Activate Plugin

1. Go to WordPress Admin → Plugins
2. Find "ARTI Terminal"
3. Click **Activate**

### Step 5: Configure API Keys

1. Go to Settings → ARTI Terminal
2. Enter your API keys:
   - **Gemini API Key** (optional - for AI chat)
   - **Slack Webhook URL** (optional - for logging)
3. Click **Save Changes**

### Step 6: Use Shortcode

Add to any page/post:
```
[arti_terminal]
```

Or with custom height:
```
[arti_terminal height="700px"]
```

**In PHP template:**
```php
<?php echo do_shortcode('[arti_terminal]'); ?>
```

---

## Method 3: Add to Theme Header/Footer

### Via Theme Customizer:

1. Go to Appearance → Customize
2. Additional CSS → Add this:

```css
/* Load terminal styles */
@import url('/wp-content/uploads/arti-terminal/terminal.css');
```

3. Go to Appearance → Theme File Editor
4. Edit `footer.php` or use a hook
5. Add before `</body>`:

```php
<div id="arti-terminal-container">
    <div id="arti-terminal"></div>
</div>

<script src="/wp-content/uploads/arti-terminal/config.js"></script>
<script src="/wp-content/uploads/arti-terminal/slack-logger.js"></script>
<script src="/wp-content/uploads/arti-terminal/ai-handler.js"></script>
<script src="/wp-content/uploads/arti-terminal/terminal.js"></script>
<script>
    window.GEMINI_API_KEY = '';
    window.SLACK_WEBHOOK_URL = '';

    const slackLogger = window.SLACK_WEBHOOK_URL ? new SlackLogger(window.SLACK_WEBHOOK_URL, CONFIG.slack) : null;
    const aiHandler = window.GEMINI_API_KEY ? new GeminiAIHandler(window.GEMINI_API_KEY, CONFIG.ai.systemPrompt) : null;
    new ArtiTerminal('arti-terminal', CONFIG, slackLogger, aiHandler);
</script>
```

---

## Security Best Practices for WordPress

### ⚠️ Never Hardcode API Keys in Public Code!

**Bad (Insecure):**
```javascript
window.GEMINI_API_KEY = 'AIzaSyC123...';  // ❌ Exposed in page source!
```

**Good (Secure):**

Use WordPress `wp-config.php`:

1. Add to `wp-config.php`:
```php
define('ARTI_GEMINI_KEY', 'AIzaSyC123...');
define('ARTI_SLACK_WEBHOOK', 'https://hooks.slack.com/...');
```

2. Access in plugin/theme:
```php
$gemini_key = defined('ARTI_GEMINI_KEY') ? ARTI_GEMINI_KEY : '';
```

### Better: Use WordPress REST API Proxy

Create `/wp-content/plugins/arti-terminal/api-proxy.php`:

```php
<?php
// Proxy for Gemini API calls
add_action('rest_api_init', function () {
    register_rest_route('arti/v1', '/chat', array(
        'methods' => 'POST',
        'callback' => 'arti_proxy_chat',
        'permission_callback' => '__return_true'
    ));
});

function arti_proxy_chat($request) {
    $message = $request->get_param('message');

    if (empty($message)) {
        return new WP_Error('invalid_message', 'Message is required', array('status' => 400));
    }

    $api_key = defined('ARTI_GEMINI_KEY') ? ARTI_GEMINI_KEY : '';

    $response = wp_remote_post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' . $api_key,
        array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array(
                'contents' => array(
                    array('parts' => array(array('text' => $message)))
                )
            ))
        )
    );

    return json_decode(wp_remote_retrieve_body($response));
}
```

Then modify `ai-handler.js` to use WordPress API:
```javascript
// In callGeminiAPI() method
const url = '/wp-json/arti/v1/chat';
```

---

## Troubleshooting WordPress

**Terminal doesn't appear?**
- Check browser console for errors (F12)
- Verify file paths are correct
- Make sure files are uploaded properly

**Styles look broken?**
- Check for theme CSS conflicts
- Try adding `!important` to terminal CSS
- Use iframe embed for complete isolation

**Plugin doesn't activate?**
- Check PHP version (needs 7.0+)
- Verify all files are in plugin folder
- Check WordPress error log

**API keys not working?**
- Never put real keys in public HTML
- Use wp-config.php or plugin settings
- Consider using REST API proxy

---

## Quick Reference

| Method | Difficulty | Best For | API Key Storage |
|--------|-----------|----------|-----------------|
| Custom HTML Block | Easy | Single page | Hardcoded (insecure) |
| Plugin | Medium | Multiple pages | Plugin settings |
| Theme Integration | Hard | Site-wide | wp-config.php |
| REST API Proxy | Hard | Production | wp-config.php (secure) |

**Recommended:** Use Plugin method for best balance of ease and security.
