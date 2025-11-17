# Quick Start Guide

## Run Locally (5 minutes)

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/) (v14 or higher)

### 2. Setup

```bash
# Clone and enter directory
cd arti-terminal

# Copy environment file
copy .env.example .env    # Windows
# OR
cp .env.example .env      # Mac/Linux

# Edit .env file and add your keys (optional for basic testing)
# You can skip this step to test without AI/Slack features
```

### 3. Start Server

**Windows:** Double-click `start.bat`

**Mac/Linux:** Run `./start.sh` or `npm start`

**Manual:** `npx serve -p 3000`

### 4. Open Browser
Visit: **http://localhost:3000**

---

## What You Need to Configure

### ✅ Required Files
All files are already included - nothing to download!

### ⚙️ Optional API Keys (for full features)

Edit `.env` file:

**For AI Chat:**
1. Get key from: https://makersuite.google.com/app/apikey
2. Add to `.env`: `GEMINI_API_KEY=your_key_here`

**For Slack Logging:**
1. Create webhook at: https://api.slack.com/apps
2. Add to `.env`: `SLACK_WEBHOOK_URL=your_webhook_url`

**Without API keys:** Terminal works with all commands except `/ai on` and Slack logging.

---

## WordPress Integration

See `WORDPRESS.md` for complete WordPress setup.

### Quick Embed (WordPress Block Editor):

1. Go to your WordPress page
2. Add **Custom HTML** block
3. Paste this code:

```html
<!-- ARTI Terminal -->
<link href="https://yourdomain.com/terminal/terminal.css" rel="stylesheet">
<div id="arti-terminal" style="margin: 20px 0;"></div>
<script src="https://yourdomain.com/terminal/config.js"></script>
<script src="https://yourdomain.com/terminal/slack-logger.js"></script>
<script src="https://yourdomain.com/terminal/ai-handler.js"></script>
<script src="https://yourdomain.com/terminal/terminal.js"></script>
<script>
  window.GEMINI_API_KEY = '';  // Add your key or leave empty
  window.SLACK_WEBHOOK_URL = '';  // Add your webhook or leave empty

  const slackLogger = window.SLACK_WEBHOOK_URL ? new SlackLogger(window.SLACK_WEBHOOK_URL, CONFIG.slack) : null;
  const aiHandler = window.GEMINI_API_KEY ? new GeminiAIHandler(window.GEMINI_API_KEY, CONFIG.ai.systemPrompt) : null;
  new ArtiTerminal('arti-terminal', CONFIG, slackLogger, aiHandler);
</script>
```

4. Upload terminal files to `/wp-content/uploads/terminal/`
5. Update URLs in the code above

---

## Troubleshooting

**Port 3000 already in use?**
```bash
npx serve -p 8080  # Use different port
```

**"npm not found"?**
- Install Node.js from https://nodejs.org/

**Terminal works but AI doesn't?**
- Add `GEMINI_API_KEY` to `.env` file
- Restart server

**Need help?**
- Check `README.md` for full documentation
- Open issue on GitHub
