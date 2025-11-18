/**
 * AI Handler - Google Gemini Integration
 * Handles AI chat functionality using Gemini 2.5 Flash API
 */

class GeminiAIHandler {
  constructor(apiKey, systemPrompt) {
    this.apiKey = apiKey;
    this.systemPrompt = systemPrompt;
    this.conversationHistory = [];
    // Using Gemini 2.0 Flash (experimental) - latest available model
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
  }

  /**
   * Send message to Gemini and get response
   */
  async sendMessage(userMessage) {
    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured');
    }

    // Add user message to conversation history
    this.conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    try {
      const response = await this.callGeminiAPI();

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
      }

      const data = await response.json();

      // Extract response text
      const assistantMessage = this.extractResponseText(data);

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'model',
        parts: [{ text: assistantMessage }],
      });

      return assistantMessage;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  /**
   * Call Gemini API
   */
  async callGeminiAPI() {
    const url = `${this.baseUrl}?key=${this.apiKey}`;

    // Build request payload
    const payload = {
      contents: this.conversationHistory,
      systemInstruction: {
        parts: [{ text: this.systemPrompt }],
      },
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
      ],
    };

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  /**
   * Extract response text from Gemini API response
   */
  extractResponseText(data) {
    try {
      if (data.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text;
        }
      }

      // Check for blocked content
      if (data.promptFeedback && data.promptFeedback.blockReason) {
        throw new Error(`Content blocked: ${data.promptFeedback.blockReason}`);
      }

      throw new Error('No response text found in API response');
    } catch (error) {
      console.error('Error extracting response:', error);
      throw error;
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }

  /**
   * Set system prompt
   */
  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeminiAIHandler;
}
