/**
 * ARTI Retro Terminal Component
 * Main terminal logic and command handling
 */

class ArtiTerminal {
  constructor(containerId, config, slackLogger = null, aiHandler = null) {
    this.container = document.getElementById(containerId);
    this.config = config;
    this.slackLogger = slackLogger;
    this.aiHandler = aiHandler;

    // Terminal state
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentInput = '';
    this.isAIMode = false;
    this.sessionActive = true;
    this.awaitingFeedback = false;
    this.awaitingName = false;

    // Rate limiting
    this.requestCount = 0;
    this.requestWindowStart = Date.now();

    // DOM elements
    this.outputElement = null;
    this.inputElement = null;
    this.promptElement = null;
    this.cursorElement = null;
    this.suggestionsElement = null;

    // Initialize
    this.init();
  }

  /**
   * Initialize terminal
   */
  init() {
    this.render();
    this.setupEventListeners();
    this.showWelcome();

    // Ask for visitor name if configured
    if (this.config.session.askForName) {
      this.askForName();
    }

    // Handle page unload
    window.addEventListener('beforeunload', () => {
      if (this.slackLogger) {
        this.slackLogger.destroy();
      }
    });
  }

  /**
   * Render terminal HTML structure
   */
  render() {
    this.container.innerHTML = `
      <div class="terminal-container">
        <div class="terminal-titlebar">
          <div class="terminal-traffic-lights">
            <div class="traffic-light close"></div>
            <div class="traffic-light minimize"></div>
            <div class="traffic-light maximize"></div>
          </div>
          <div class="terminal-title">arti@railway-console ~ zsh</div>
        </div>
        <div class="terminal-viewport">
          <div class="terminal-screen" id="terminal-screen">
            <div class="terminal-output" id="terminal-output"></div>
            <div class="terminal-line">
              <span class="terminal-prompt" id="terminal-prompt">arti@console:~$</span>
              <div class="terminal-input-wrapper">
                <input
                  type="text"
                  class="terminal-input"
                  id="terminal-input"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  spellcheck="false"
                  aria-label="Terminal input"
                />
                <div class="autocomplete-suggestions" id="autocomplete-suggestions" style="display: none;"></div>
              </div>
              <span class="terminal-cursor" id="terminal-cursor"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Store references to DOM elements
    this.outputElement = document.getElementById('terminal-output');
    this.inputElement = document.getElementById('terminal-input');
    this.promptElement = document.getElementById('terminal-prompt');
    this.cursorElement = document.getElementById('terminal-cursor');
    this.suggestionsElement = document.getElementById('autocomplete-suggestions');
    this.screenElement = document.getElementById('terminal-screen');

    // Focus input
    this.inputElement.focus();
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Input handling
    this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));
    this.inputElement.addEventListener('input', (e) => this.handleInput(e));

    // Keep input focused
    this.container.addEventListener('click', () => {
      if (this.sessionActive) {
        this.inputElement.focus();
      }
    });

    // Handle blur
    this.inputElement.addEventListener('blur', () => {
      setTimeout(() => {
        if (this.sessionActive) {
          this.inputElement.focus();
        }
      }, 100);
    });
  }

  /**
   * Handle keyboard input
   */
  handleKeyDown(e) {
    if (!this.sessionActive) {
      e.preventDefault();
      return;
    }

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        this.handleCommand();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.navigateHistory('up');
        break;

      case 'ArrowDown':
        e.preventDefault();
        this.navigateHistory('down');
        break;

      case 'Tab':
        e.preventDefault();
        this.handleTabComplete();
        break;

      case 'l':
      case 'L':
        if (e.ctrlKey) {
          e.preventDefault();
          this.clearScreen();
        }
        break;

      case 'c':
      case 'C':
        if (e.ctrlKey) {
          e.preventDefault();
          this.cancelInput();
        }
        break;

      case 'Escape':
        this.hideSuggestions();
        break;
    }
  }

  /**
   * Handle input changes
   */
  handleInput(e) {
    this.currentInput = e.target.value;
    this.updateSuggestions();
  }

  /**
   * Handle command submission
   */
  async handleCommand() {
    const input = this.inputElement.value.trim();

    if (!input) {
      this.printPromptLine('');
      return;
    }

    // Check rate limiting
    if (!this.checkRateLimit()) {
      this.printError('Rate limit exceeded. Please wait before sending more commands.');
      this.printPromptLine(input);
      return;
    }

    this.printPromptLine(input);
    this.inputElement.value = '';
    this.currentInput = '';
    this.hideSuggestions();

    // Handle different input modes
    if (this.awaitingName) {
      this.handleNameInput(input);
      return;
    }

    if (this.awaitingFeedback) {
      await this.handleFeedbackInput(input);
      return;
    }

    if (this.isAIMode) {
      await this.handleAIInput(input);
      return;
    }

    // Process as command
    await this.processCommand(input);

    // Add to history
    this.commandHistory.push(input);
    this.historyIndex = this.commandHistory.length;

    this.scrollToBottom();
  }

  /**
   * Process terminal command
   */
  async processCommand(input) {
    // Parse command
    const parts = input.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Remove leading slash if present
    const cleanCommand = command.startsWith('/') ? command.substring(1) : command;

    // Handle commands
    switch (cleanCommand) {
      case 'help':
        this.printOutput(this.config.commands.help.response);
        this.logCommand(input, this.config.commands.help.response);
        break;

      case 'about':
        this.printOutput(this.config.commands.about.response);
        this.logCommand(input, this.config.commands.about.response);
        break;

      case 'projects':
        this.printOutput(this.config.commands.projects.response);
        this.logCommand(input, this.config.commands.projects.response);
        break;

      case 'experience':
        this.printOutput(this.config.commands.experience.response);
        this.logCommand(input, this.config.commands.experience.response);
        break;

      case 'etcs':
        this.printOutput(this.config.commands.etcs.response);
        this.logCommand(input, this.config.commands.etcs.response);
        break;

      case 'contact':
        this.printOutput(this.config.commands.contact.response);
        this.logCommand(input, this.config.commands.contact.response);
        break;

      case 'privacy':
        this.printOutput(this.config.commands.privacy.response);
        this.logCommand(input, this.config.commands.privacy.response);
        break;

      case 'clear':
      case 'cls':
        this.clearScreen();
        break;

      case 'exit':
      case 'quit':
        this.exitSession();
        break;

      case 'feedback':
        this.promptForFeedback();
        break;

      case 'ai':
        this.handleAICommand(args);
        break;

      default:
        this.printError(`Command not found: ${cleanCommand}. Type '/help' for available commands.`);
        this.logCommand(input, `Command not found: ${cleanCommand}`);
    }
  }

  /**
   * Handle AI mode toggle
   */
  handleAICommand(args) {
    if (args.length === 0) {
      this.printOutput(`AI mode is currently <span class="highlight">${this.isAIMode ? 'ON' : 'OFF'}</span>. Use '/ai on' or '/ai off' to toggle.`);
      return;
    }

    const action = args[0].toLowerCase();

    if (action === 'on') {
      if (!this.aiHandler) {
        this.printError('AI integration is not configured. Please check your Gemini API key.');
        return;
      }
      this.isAIMode = true;
      this.printOutput(this.config.ai.welcomeMessage);
      this.updatePrompt('arti@ai:~$');
    } else if (action === 'off') {
      this.isAIMode = false;
      this.printOutput(this.config.ai.exitMessage);
      this.updatePrompt('arti@console:~$');

      // Send AI conversation summary to Slack
      if (this.slackLogger) {
        this.slackLogger.sendSessionSummary('ai_conversation_end');
      }
    } else {
      this.printError(`Invalid AI command. Use '/ai on' or '/ai off'.`);
    }
  }

  /**
   * Handle AI chat input
   */
  async handleAIInput(input) {
    // Check if it's a command to exit AI mode
    if (input.toLowerCase() === '/ai off' || input.toLowerCase() === '/exit') {
      this.isAIMode = false;
      this.printOutput(this.config.ai.exitMessage);
      this.updatePrompt('arti@console:~$');

      if (this.slackLogger) {
        this.slackLogger.sendSessionSummary('ai_conversation_end');
      }
      return;
    }

    if (!this.aiHandler) {
      this.printError('AI handler not configured.');
      return;
    }

    // Show thinking indicator
    const thinkingId = this.printThinking();

    try {
      const response = await this.aiHandler.sendMessage(input);
      this.removeThinking(thinkingId);
      this.printAIResponse(response);

      // Log to Slack
      if (this.slackLogger) {
        this.slackLogger.logAIInteraction(input, response);
      }
    } catch (error) {
      this.removeThinking(thinkingId);
      this.printError(`AI Error: ${error.message}`);
      console.error('AI Error:', error);
    }
  }

  /**
   * Ask for visitor name
   */
  askForName() {
    this.awaitingName = true;
    this.printOutput(`<span class="name-prompt">👋 Welcome! What's your name? (Optional, press Enter to skip)</span>`);
  }

  /**
   * Handle name input
   */
  handleNameInput(input) {
    this.awaitingName = false;

    if (input && input.toLowerCase() !== 'skip') {
      if (this.slackLogger) {
        this.slackLogger.setVisitorInfo(input);
      }
      this.printOutput(`<span class="highlight">Nice to meet you, ${input}!</span>`);
    } else {
      this.printOutput(`<span class="highlight">No problem! Proceeding anonymously.</span>`);
    }
  }

  /**
   * Prompt for feedback
   */
  promptForFeedback() {
    this.awaitingFeedback = true;
    this.printOutput(`<span class="name-prompt">💬 Please enter your feedback message:</span>`);
  }

  /**
   * Handle feedback input
   */
  async handleFeedbackInput(input) {
    this.awaitingFeedback = false;

    if (!input) {
      this.printOutput('Feedback cancelled.');
      return;
    }

    if (this.slackLogger) {
      this.slackLogger.logFeedback(input);
      this.printOutput(`<span class="highlight">✓ Thank you! Your feedback has been sent.</span>`);
    } else {
      this.printOutput(`<span class="highlight">Feedback recorded: ${input}</span>`);
    }
  }

  /**
   * Navigate command history
   */
  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;

    if (direction === 'up') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.inputElement.value = this.commandHistory[this.historyIndex];
      }
    } else if (direction === 'down') {
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
        this.inputElement.value = this.commandHistory[this.historyIndex];
      } else {
        this.historyIndex = this.commandHistory.length;
        this.inputElement.value = '';
      }
    }

    this.currentInput = this.inputElement.value;
  }

  /**
   * Handle tab completion
   */
  handleTabComplete() {
    const input = this.inputElement.value.toLowerCase();
    const commands = Object.keys(this.config.commands).map(cmd => `/${cmd}`);

    const matches = commands.filter(cmd => cmd.startsWith(input));

    if (matches.length === 1) {
      this.inputElement.value = matches[0];
      this.currentInput = matches[0];
      this.hideSuggestions();
    } else if (matches.length > 1) {
      this.showSuggestions(matches);
    }
  }

  /**
   * Update autocomplete suggestions
   */
  updateSuggestions() {
    const input = this.currentInput.toLowerCase();

    if (input.length === 0 || !input.startsWith('/')) {
      this.hideSuggestions();
      return;
    }

    const commands = Object.keys(this.config.commands).map(cmd => `/${cmd}`);
    const matches = commands.filter(cmd => cmd.startsWith(input));

    if (matches.length > 0 && input !== matches[0]) {
      this.showSuggestions(matches);
    } else {
      this.hideSuggestions();
    }
  }

  /**
   * Show autocomplete suggestions
   */
  showSuggestions(suggestions) {
    this.suggestionsElement.innerHTML = suggestions
      .map(cmd => `<div class="suggestion-item">${cmd}</div>`)
      .join('');

    this.suggestionsElement.style.display = 'block';

    // Click handlers for suggestions
    this.suggestionsElement.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        this.inputElement.value = item.textContent;
        this.currentInput = item.textContent;
        this.hideSuggestions();
        this.inputElement.focus();
      });
    });
  }

  /**
   * Hide autocomplete suggestions
   */
  hideSuggestions() {
    this.suggestionsElement.style.display = 'none';
  }

  /**
   * Print output to terminal
   */
  printOutput(html) {
    const outputLine = document.createElement('div');
    outputLine.className = 'command-output';
    outputLine.innerHTML = html;
    this.outputElement.appendChild(outputLine);
  }

  /**
   * Print prompt line (user input echo)
   */
  printPromptLine(input) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span class="terminal-prompt">${this.promptElement.textContent}</span> ${this.escapeHtml(input)}`;
    this.outputElement.appendChild(line);
  }

  /**
   * Print error message
   */
  printError(message) {
    this.printOutput(`<span class="error-message">✗ ${this.escapeHtml(message)}</span>`);
  }

  /**
   * Print AI response
   */
  printAIResponse(message) {
    this.printOutput(`<div class="ai-response">${this.escapeHtml(message)}</div>`);
  }

  /**
   * Print thinking indicator
   */
  printThinking() {
    const thinkingId = `thinking-${Date.now()}`;
    const thinkingLine = document.createElement('div');
    thinkingLine.id = thinkingId;
    thinkingLine.className = 'ai-thinking';
    thinkingLine.innerHTML = 'AI is thinking<span class="loading-dots"></span>';
    this.outputElement.appendChild(thinkingLine);
    this.scrollToBottom();
    return thinkingId;
  }

  /**
   * Remove thinking indicator
   */
  removeThinking(thinkingId) {
    const element = document.getElementById(thinkingId);
    if (element) {
      element.remove();
    }
  }

  /**
   * Show welcome message
   */
  showWelcome() {
    const header = `
      <div class="terminal-header">
        <pre class="ascii-art">${this.config.asciiArt}</pre>
        <div class="header-title">${this.config.header.subtitle}</div>
        <div class="header-subtitle">${this.config.header.tagline}</div>
        <div class="header-version">${this.config.header.version}</div>
      </div>
      <div class="welcome-message">${this.config.welcomeMessage}</div>
    `;

    this.printOutput(header);
    this.scrollToBottom();
  }

  /**
   * Clear screen
   */
  clearScreen() {
    this.outputElement.innerHTML = '';
    this.showWelcome();
  }

  /**
   * Cancel current input
   */
  cancelInput() {
    this.inputElement.value = '';
    this.currentInput = '';
    this.printPromptLine('^C');
  }

  /**
   * Update prompt text
   */
  updatePrompt(prompt) {
    this.promptElement.textContent = prompt;
  }

  /**
   * Exit session
   */
  exitSession() {
    this.sessionActive = false;
    this.printOutput(this.config.commands.exit.response);
    this.inputElement.disabled = true;
    this.cursorElement.style.display = 'none';

    if (this.slackLogger) {
      this.slackLogger.sendSessionSummary('user_exit');
    }
  }

  /**
   * Scroll to bottom
   */
  scrollToBottom() {
    setTimeout(() => {
      this.screenElement.scrollTop = this.screenElement.scrollHeight;
    }, 10);
  }

  /**
   * Check rate limiting
   */
  checkRateLimit() {
    const now = Date.now();
    const windowMs = this.config.rateLimit.windowMs;

    // Reset window if expired
    if (now - this.requestWindowStart > windowMs) {
      this.requestCount = 0;
      this.requestWindowStart = now;
    }

    this.requestCount++;

    return this.requestCount <= this.config.rateLimit.maxRequests;
  }

  /**
   * Log command to Slack
   */
  logCommand(command, response) {
    if (this.slackLogger) {
      this.slackLogger.logCommand(command, response);
    }
  }

  /**
   * Escape HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArtiTerminal;
}
