/**
 * Slack Logger Module
 * Logs terminal interactions to Slack via webhook
 */

class SlackLogger {
  constructor(webhookUrl, config = {}) {
    this.webhookUrl = webhookUrl;
    this.config = {
      enabled: config.enabled !== false,
      batchMessages: config.batchMessages !== false,
      sendOnExit: config.sendOnExit !== false,
      sendOnTimeout: config.sendOnTimeout !== false,
      includeMetadata: config.includeMetadata !== false,
    };

    this.sessionId = this.generateSessionId();
    this.messageQueue = [];
    this.sessionStartTime = new Date();
    this.lastActivityTime = new Date();
    this.visitorName = null;
    this.visitorEmail = null;
    this.metadata = this.collectMetadata();

    // Timeout checker
    this.timeoutCheckInterval = null;
    if (this.config.sendOnTimeout) {
      this.startTimeoutChecker();
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Collect browser and session metadata
   */
  collectMetadata() {
    const metadata = {};

    try {
      // Timezone and approximate location
      metadata.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      metadata.locale = navigator.language;

      // Browser info
      metadata.userAgent = navigator.userAgent;
      metadata.platform = navigator.platform;

      // Screen info
      metadata.screenResolution = `${window.screen.width}x${window.screen.height}`;
      metadata.viewport = `${window.innerWidth}x${window.innerHeight}`;

      // Referrer
      metadata.referrer = document.referrer || 'Direct';

      // Current URL
      metadata.currentUrl = window.location.href;

      // Session start time
      metadata.sessionStart = this.sessionStartTime.toISOString();
    } catch (error) {
      console.warn('Could not collect all metadata:', error);
    }

    return metadata;
  }

  /**
   * Set visitor information
   */
  setVisitorInfo(name, email = null) {
    this.visitorName = name;
    this.visitorEmail = email;
  }

  /**
   * Log a user command
   */
  logCommand(command, response) {
    this.lastActivityTime = new Date();

    const logEntry = {
      type: 'command',
      timestamp: new Date().toISOString(),
      command: command,
      response: this.stripHtml(response),
      sessionTime: this.getSessionDuration(),
    };

    this.messageQueue.push(logEntry);

    if (!this.config.batchMessages) {
      this.sendToSlack();
    }
  }

  /**
   * Log an AI interaction
   */
  logAIInteraction(userMessage, aiResponse) {
    this.lastActivityTime = new Date();

    const logEntry = {
      type: 'ai_chat',
      timestamp: new Date().toISOString(),
      userMessage: userMessage,
      aiResponse: this.stripHtml(aiResponse),
      sessionTime: this.getSessionDuration(),
    };

    this.messageQueue.push(logEntry);

    if (!this.config.batchMessages) {
      this.sendToSlack();
    }
  }

  /**
   * Log feedback message
   */
  logFeedback(message) {
    this.lastActivityTime = new Date();

    const logEntry = {
      type: 'feedback',
      timestamp: new Date().toISOString(),
      message: message,
      sessionTime: this.getSessionDuration(),
    };

    this.messageQueue.push(logEntry);

    // Always send feedback immediately
    this.sendToSlack();
  }

  /**
   * Send session summary on exit
   */
  sendSessionSummary(reason = 'user_exit') {
    if (!this.config.enabled || this.messageQueue.length === 0) {
      return;
    }

    this.sendToSlack(reason);
  }

  /**
   * Get session duration in human-readable format
   */
  getSessionDuration() {
    const duration = Date.now() - this.sessionStartTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  /**
   * Strip HTML tags from text
   */
  stripHtml(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  /**
   * Format messages for Slack
   */
  formatSlackMessage(reason = 'batch_send') {
    const visitorInfo = this.visitorName
      ? `${this.visitorName}${this.visitorEmail ? ` (${this.visitorEmail})` : ''}`
      : 'Anonymous Visitor';

    // Build message blocks
    const blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `🖥️ Terminal Session: ${visitorInfo}`,
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Session ID:*\n\`${this.sessionId}\``,
          },
          {
            type: 'mrkdwn',
            text: `*Duration:*\n${this.getSessionDuration()}`,
          },
          {
            type: 'mrkdwn',
            text: `*Interactions:*\n${this.messageQueue.length}`,
          },
          {
            type: 'mrkdwn',
            text: `*Reason:*\n${this.formatReason(reason)}`,
          },
        ],
      },
    ];

    // Add metadata if enabled
    if (this.config.includeMetadata && this.metadata) {
      blocks.push({
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Location:*\n${this.metadata.timezone || 'Unknown'}`,
          },
          {
            type: 'mrkdwn',
            text: `*Referrer:*\n${this.metadata.referrer || 'Direct'}`,
          },
        ],
      });
    }

    blocks.push({
      type: 'divider',
    });

    // Add conversation log
    let conversationText = '';
    this.messageQueue.forEach((entry, index) => {
      const time = new Date(entry.timestamp).toLocaleTimeString();

      if (entry.type === 'command') {
        conversationText += `\n*[${time}] Command:* \`${entry.command}\`\n`;
        const responsePreview = entry.response.substring(0, 200);
        conversationText += `${responsePreview}${entry.response.length > 200 ? '...' : ''}\n`;
      } else if (entry.type === 'ai_chat') {
        conversationText += `\n*[${time}] User:* ${entry.userMessage}\n`;
        const responsePreview = entry.aiResponse.substring(0, 200);
        conversationText += `*AI:* ${responsePreview}${entry.aiResponse.length > 200 ? '...' : ''}\n`;
      } else if (entry.type === 'feedback') {
        conversationText += `\n*[${time}] 💬 Feedback:* ${entry.message}\n`;
      }
    });

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Conversation Log:*${conversationText}`,
      },
    });

    // Add contact CTA if email provided
    if (this.visitorEmail) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `📧 *Follow up with:* ${this.visitorEmail}`,
        },
      });
    }

    return {
      blocks: blocks,
      text: `Terminal session from ${visitorInfo} - ${this.messageQueue.length} interactions`,
    };
  }

  /**
   * Format reason for display
   */
  formatReason(reason) {
    const reasons = {
      'user_exit': '🚪 User Exit',
      'session_timeout': '⏱️ Session Timeout',
      'batch_send': '📦 Batch Send',
      'ai_conversation_end': '🤖 AI Chat Ended',
    };
    return reasons[reason] || reason;
  }

  /**
   * Send messages to Slack webhook
   */
  async sendToSlack(reason = 'batch_send') {
    if (!this.config.enabled || !this.webhookUrl || this.messageQueue.length === 0) {
      return;
    }

    // Don't send if webhook URL is placeholder
    if (this.webhookUrl.includes('YOUR/WEBHOOK/URL')) {
      console.warn('Slack webhook not configured - skipping log');
      return;
    }

    const payload = this.formatSlackMessage(reason);

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Session logged to Slack successfully');
        // Clear queue after successful send
        this.messageQueue = [];
      } else {
        console.error('Failed to send to Slack:', response.status, response.statusText);
        // Store failed messages locally for retry
        this.storeFailedMessages(payload);
      }
    } catch (error) {
      console.error('Error sending to Slack:', error);
      this.storeFailedMessages(payload);
    }
  }

  /**
   * Store failed messages in localStorage for potential retry
   */
  storeFailedMessages(payload) {
    try {
      const failedMessages = JSON.parse(localStorage.getItem('slack_failed_messages') || '[]');
      failedMessages.push({
        timestamp: new Date().toISOString(),
        payload: payload,
      });

      // Keep only last 10 failed attempts
      if (failedMessages.length > 10) {
        failedMessages.shift();
      }

      localStorage.setItem('slack_failed_messages', JSON.stringify(failedMessages));
    } catch (error) {
      console.warn('Could not store failed messages:', error);
    }
  }

  /**
   * Start timeout checker
   */
  startTimeoutChecker() {
    // Check every minute for timeout
    this.timeoutCheckInterval = setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivityTime.getTime();
      const timeoutThreshold = 5 * 60 * 1000; // 5 minutes

      if (inactiveTime > timeoutThreshold && this.messageQueue.length > 0) {
        console.log('Session timeout detected, sending summary to Slack');
        this.sendSessionSummary('session_timeout');
        this.stopTimeoutChecker();
      }
    }, 60000); // Check every minute
  }

  /**
   * Stop timeout checker
   */
  stopTimeoutChecker() {
    if (this.timeoutCheckInterval) {
      clearInterval(this.timeoutCheckInterval);
      this.timeoutCheckInterval = null;
    }
  }

  /**
   * Cleanup on session end
   */
  destroy() {
    this.stopTimeoutChecker();
    if (this.config.sendOnExit && this.messageQueue.length > 0) {
      this.sendSessionSummary('user_exit');
    }
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SlackLogger;
}
