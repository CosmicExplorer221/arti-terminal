# 🖥️ ARTI Terminal - Railway Engineering Console

A retro-styled terminal web component for arturwolnica.com featuring:
- **CRT monitor aesthetic** with scanlines, glow effects, and monospace fonts
- **Command system** for showcasing professional information
- **AI chat integration** using Google Gemini 2.5 Flash API
- **Slack webhook logging** for conversation tracking and lead generation
- **Responsive design** for desktop, tablet, and mobile devices

![ARTI Terminal](https://img.shields.io/badge/status-production--ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
  - [Google Gemini API Setup](#google-gemini-api-setup)
  - [Slack Webhook Setup](#slack-webhook-setup)
- [Deployment](#deployment)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [Static Hosting](#static-hosting)
- [Embedding](#embedding)
- [Customization](#customization)
- [Security](#security)
- [Privacy & GDPR Compliance](#privacy--gdpr-compliance)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Visual Design
- Dark background (#0a0a0a) with green terminal text (#00ff41)
- Retro CRT monitor effects (scanlines, glow, curvature)
- ASCII art header displaying "ARTI"
- Blinking cursor animation
- macOS-style terminal window with traffic lights
- JetBrains Mono monospace font
- Responsive design for all screen sizes

### Command System
- `/help` - Show available commands
- `/about` - Information about Arti Wolnica
- `/projects` - Railway engineering projects showcase
- `/experience` - Career history and expertise
- `/etcs` - ETCS expertise and consulting services
- `/contact` - Contact information
- `/privacy` - Privacy and data policy
- `/feedback` - Send direct feedback
- `/clear` - Clear terminal screen
- `/ai [on/off]` - Toggle AI chat mode
- `/exit` - End session

### AI Integration
- Google Gemini 2.5 Flash API for conversational AI
- Context-aware responses about railway engineering
- Streaming responses with typing animation
- Custom system prompt for domain expertise
- Conversation history management

### Slack Logging
- Automatic logging of all user interactions
- Rich message formatting with Slack blocks
- Session tracking with unique IDs
- Metadata collection (timezone, referrer, browser info)
- Batch message sending for efficiency
- Session timeout detection (5 minutes)
- Direct feedback messages
- Error handling with local queue storage

### Interactive Features
- Command history (↑/↓ arrow keys)
- Tab autocomplete for commands
- Keyboard shortcuts (Ctrl+L to clear, Ctrl+C to cancel)
- Auto-scroll to bottom
- Mobile-friendly touch interface
- Rate limiting (50 requests/minute)
- Optional visitor name collection

---

## 🚀 Quick Start

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/arti-terminal.git
   cd arti-terminal
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Add your API keys to `.env`:**
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   ```

4. **Start local server:**
   ```bash
   npm start
   ```

5. **Open in browser:**
   ```
   http://localhost:3000
   ```

---

## 📦 Installation

### Option 1: NPM (Recommended for development)

```bash
npm install
npm start
```

This will start a local development server on port 3000.

### Option 2: Static Files

Simply copy all files to your web server:
- `index.html`
- `terminal.js`
- `terminal.css`
- `config.js`
- `slack-logger.js`
- `ai-handler.js`

No build step required!

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required for AI features
GEMINI_API_KEY=your_gemini_api_key_here

# Required for Slack logging
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Optional configuration
SESSION_TIMEOUT=300000          # 5 minutes in milliseconds
RATE_LIMIT_MAX_REQUESTS=50      # Max requests per window
RATE_LIMIT_WINDOW_MS=60000      # Rate limit window (1 minute)
```

### Google Gemini API Setup

1. **Get API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Click "Create API Key"
   - Copy your API key

2. **Add to environment:**
   ```env
   GEMINI_API_KEY=AIzaSyC...your_key_here
   ```

3. **Test the integration:**
   - Start terminal
   - Type `/ai on`
   - Ask a question about railway engineering

**API Pricing:** Gemini 2.0 Flash has a generous free tier (15 requests/minute). See [pricing details](https://ai.google.dev/pricing).

### Slack Webhook Setup

#### Step 1: Create Slack App

1. Go to [Slack API: Your Apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Name: "ARTI Terminal Logger"
5. Select your workspace
6. Click **"Create App"**

#### Step 2: Enable Incoming Webhooks

1. In your app settings, click **"Incoming Webhooks"**
2. Toggle **"Activate Incoming Webhooks"** to On
3. Click **"Add New Webhook to Workspace"**
4. Select channel: `#website-terminal-logs` (recommended)
5. Click **"Allow"**
6. Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

#### Step 3: Configure Webhook

Add webhook URL to `.env`:

```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
```

#### Step 4: Recommended Channel Structure

Create these Slack channels:
- `#website-terminal-logs` - All terminal interactions
- `#website-feedback` - Direct feedback messages
- `#website-ai-conversations` - AI chat sessions

#### Step 5: Message Format Example

When a visitor interacts with the terminal, Slack receives:

```
🖥️ Terminal Session: John Doe (john@example.com)

Session ID: session_1234567890_abc123
Duration: 3m 45s
Interactions: 5
Reason: 🤖 AI Chat Ended

Location: Europe/Warsaw
Referrer: https://google.com

Conversation Log:

[14:30:15] Command: `/help`
Available Commands: /help - Show this help message...

[14:31:20] Command: `/ai on`
AI Chat Mode Enabled

[14:31:35] User: What is ETCS Level 2?
AI: ETCS Level 2 is a train control system that uses radio...

📧 Follow up with: john@example.com
```

#### Privacy Compliance Notes

⚠️ **Important:** Inform users that conversations are logged:
- Privacy notice is included in `/privacy` command
- Welcome message mentions logging
- Users can opt out by not using the terminal
- Comply with GDPR by offering data deletion

---

## 🚢 Deployment

### Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add environment variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `GEMINI_API_KEY` and `SLACK_WEBHOOK_URL`

4. **Inject variables in HTML:**

   Create `vercel.json`:
   ```json
   {
     "functions": {
       "api/**/*.js": {
         "memory": 1024,
         "maxDuration": 10
       }
     }
   }
   ```

   For static sites, use build-time injection or serverless functions.

### Netlify

1. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

2. **Add environment variables:**
   - Go to Site Settings → Build & Deploy → Environment
   - Add `GEMINI_API_KEY` and `SLACK_WEBHOOK_URL`

3. **Build configuration:**

   Create `netlify.toml`:
   ```toml
   [build]
     publish = "."
     command = "echo 'No build required'"

   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

### Cloudflare Pages

1. **Deploy:**
   - Connect your GitHub repo to Cloudflare Pages
   - Set build command: `echo 'No build'`
   - Set publish directory: `/`

2. **Add environment variables:**
   - Settings → Environment Variables
   - Add `GEMINI_API_KEY` and `SLACK_WEBHOOK_URL`

3. **Use Cloudflare Workers** for API proxy (recommended)

### Static Hosting (GitHub Pages, S3, etc.)

For static hosting without environment variable support:

1. **Create a server-side proxy** (recommended)
2. **Or hardcode values** (NOT recommended for production):

   ```javascript
   // In index.html
   window.GEMINI_API_KEY = 'your_key_here';  // ⚠️ NOT SECURE
   window.SLACK_WEBHOOK_URL = 'your_webhook_here';
   ```

⚠️ **Security Warning:** Never commit API keys to public repositories!

---

## 🔗 Embedding

### Method 1: Direct Include

```html
<link href="https://yourdomain.com/terminal.css" rel="stylesheet">
<div id="arti-terminal"></div>
<script src="https://yourdomain.com/config.js"></script>
<script src="https://yourdomain.com/slack-logger.js"></script>
<script src="https://yourdomain.com/ai-handler.js"></script>
<script src="https://yourdomain.com/terminal.js"></script>
<script>
  const slackLogger = new SlackLogger('YOUR_WEBHOOK_URL', CONFIG.slack);
  const aiHandler = new GeminiAIHandler('YOUR_API_KEY', CONFIG.ai.systemPrompt);
  const terminal = new ArtiTerminal('arti-terminal', CONFIG, slackLogger, aiHandler);
</script>
```

### Method 2: iframe Embed

```html
<iframe
  src="https://yourdomain.com/terminal/"
  width="100%"
  height="700px"
  frameborder="0"
  title="ARTI Terminal"
></iframe>
```

See `embed.html` for more examples.

---

## 🎨 Customization

### Changing Colors

Edit `terminal.css`:

```css
:root {
  --terminal-bg: #0a0a0a;       /* Background */
  --terminal-green: #00ff41;     /* Primary text */
  --terminal-amber: #ffb000;     /* Accent */
}
```

Popular color schemes:
- **Green on Black** (default): `#00ff41` on `#0a0a0a`
- **Amber on Black**: `#ffb000` on `#0a0a0a`
- **White on Blue**: `#ffffff` on `#0000aa`
- **Green on Dark Gray**: `#33ff33` on `#1a1a1a`

### Customizing Content

Edit `config.js`:

```javascript
// Change header
header: {
  title: 'YOUR NAME',
  subtitle: 'Your Tagline',
  tagline: 'Your Description',
}

// Add new commands
commands: {
  mycmd: {
    description: 'My custom command',
    response: 'Your response here',
  },
}

// Customize AI system prompt
ai: {
  systemPrompt: 'Your custom system prompt...',
}
```

### Adding New Commands

1. **Add to `config.js`:**
   ```javascript
   commands: {
     portfolio: {
       description: 'View portfolio',
       response: '<span class="section-header">Portfolio</span>...',
     },
   }
   ```

2. **Handle in `terminal.js`** (optional for special behavior):
   ```javascript
   case 'portfolio':
     this.printOutput(this.config.commands.portfolio.response);
     this.logCommand(input, this.config.commands.portfolio.response);
     break;
   ```

### Changing Fonts

Replace JetBrains Mono with another monospace font:

```html
<!-- In index.html -->
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
/* In terminal.css */
:root {
  --font-family: 'Fira Code', monospace;
}
```

Popular monospace fonts:
- JetBrains Mono (default)
- Fira Code
- Source Code Pro
- IBM Plex Mono
- Inconsolata

---

## 🔒 Security

### Best Practices

1. **Never commit `.env` to version control**
   ```bash
   # .gitignore should include:
   .env
   .env.local
   .env.production
   ```

2. **Use server-side API proxy** (recommended for production):
   - Don't expose API keys in client-side code
   - Create serverless functions for Gemini API calls
   - Validate and sanitize all user inputs

3. **Implement rate limiting:**
   - Already included (50 requests/minute)
   - Adjust in `config.js` if needed

4. **Sanitize user inputs:**
   - All inputs are escaped before display
   - Slack messages are sanitized

5. **Use HTTPS:**
   - Required for Gemini API
   - Required for Slack webhooks
   - Always deploy with SSL/TLS

6. **CORS configuration:**
   - Restrict allowed origins
   - Implement proper CORS headers

### Server-Side Proxy Example

Create `api/chat.js` (Vercel/Netlify):

```javascript
export default async function handler(req, res) {
  const { message } = req.body;

  // Validate input
  if (!message || message.length > 500) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Call Gemini API server-side
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
    }
  );

  const data = await response.json();
  res.json(data);
}
```

Then in `ai-handler.js`, call your proxy:
```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message: userMessage }),
});
```

---

## 🔐 Privacy & GDPR Compliance

### Data Collected

The terminal collects:
- User commands and AI conversations
- Session metadata (timestamp, duration, timezone)
- Browser information (user agent, screen resolution)
- Referrer URL
- Name/email (optional, user-provided)

### User Rights (GDPR)

Users have the right to:
1. **Access their data** - Contact via `/contact`
2. **Delete their data** - Request deletion via email
3. **Opt-out** - Don't use the terminal, or close it anytime

### Compliance Checklist

- ✅ Privacy notice displayed (`/privacy` command)
- ✅ User informed about data collection
- ✅ Data used only for stated purposes
- ✅ Secure data transmission (HTTPS)
- ✅ Data deletion process in place
- ✅ No third-party data selling
- ✅ Users can opt-out

### Privacy Policy Template

Add to your website:

> **ARTI Terminal Privacy Notice**
>
> When you use the ARTI Terminal on this website:
> - Your interactions (commands and AI conversations) are logged
> - Session metadata is collected (time, timezone, browser info)
> - Data is stored securely via Slack webhook
> - Data is used to respond to inquiries and improve services
> - Data is not sold or shared with third parties
> - You can request data deletion at arti@arturwolnica.com
>
> By using the terminal, you consent to this data collection.

---

## 🐛 Troubleshooting

### AI Chat Not Working

**Problem:** AI responds with errors or doesn't respond

**Solutions:**
1. Check Gemini API key is correct
2. Verify API key has Gemini API enabled
3. Check browser console for errors
4. Test API key directly:
   ```bash
   curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_KEY" \
     -H 'Content-Type: application/json' \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
   ```

### Slack Logging Not Working

**Problem:** Messages not appearing in Slack

**Solutions:**
1. Verify webhook URL is correct (starts with `https://hooks.slack.com/`)
2. Check Slack app has permissions
3. Test webhook directly:
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H 'Content-Type: application/json' \
     -d '{"text":"Test message"}'
   ```
4. Check browser console for errors
5. Verify network requests in DevTools

### Styling Issues

**Problem:** Terminal looks broken or unstyled

**Solutions:**
1. Ensure `terminal.css` is loaded (check Network tab)
2. Clear browser cache
3. Check for CSS conflicts with existing site styles
4. Use iframe for complete isolation

### Mobile Issues

**Problem:** Terminal not working on mobile

**Solutions:**
1. Check viewport meta tag is present
2. Test touch events (should work like click)
3. Ensure input field gets focus
4. Check for JavaScript errors in mobile browser

### Rate Limiting

**Problem:** "Rate limit exceeded" errors

**Solutions:**
1. Wait 1 minute for rate limit to reset
2. Adjust limits in `config.js`:
   ```javascript
   rateLimit: {
     maxRequests: 100,  // Increase if needed
     windowMs: 60000,
   }
   ```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use vanilla JavaScript (no frameworks)
- Keep dependencies minimal
- Test on multiple browsers
- Maintain retro terminal aesthetic
- Document all new features
- Follow existing code style

---

## 📄 License

MIT License - feel free to use for your own projects!

---

## 🙏 Acknowledgments

- Inspired by classic Unix terminals
- Uses [Google Gemini API](https://ai.google.dev/)
- Slack integration via [Incoming Webhooks](https://api.slack.com/messaging/webhooks)
- Font: [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/arti-terminal/issues)
- **Email:** arti@arturwolnica.com
- **Website:** https://arturwolnica.com

---

## 🎯 Roadmap

- [ ] NPM package distribution
- [ ] React/Vue/Angular component versions
- [ ] More terminal themes (amber, white, blue)
- [ ] File system simulation
- [ ] Tab completion for AI responses
- [ ] Voice input support
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Session replay functionality
- [ ] Webhooks for other platforms (Discord, Teams)

---

Made with ❤️ for railway engineering professionals

**Version 1.0.0** | Last updated: 2024