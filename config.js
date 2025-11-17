// Terminal Configuration and Content
const CONFIG = {
  // Terminal appearance
  appearance: {
    primaryColor: '#00ff41',      // Green terminal text
    secondaryColor: '#ffb000',     // Amber accent
    backgroundColor: '#0a0a0a',    // Dark background
    fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    scanlineOpacity: 0.05,
    glowIntensity: '0 0 5px currentColor',
  },

  // ASCII Art Header
  asciiArt: `
   █████╗ ██████╗ ████████╗██╗
  ██╔══██╗██╔══██╗╚══██╔══╝██║
  ███████║██████╔╝   ██║   ██║
  ██╔══██║██╔══██╗   ██║   ██║
  ██║  ██║██║  ██║   ██║   ██║
  ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝
  `,

  // Terminal header text
  header: {
    title: 'ARTI',
    subtitle: 'Railway Engineering Console',
    tagline: 'AI-Powered Technical Assistant',
    version: 'v1.0.0',
  },

  // Welcome message
  welcomeMessage: `
Welcome to the ARTI Terminal Interface.
Type '/help' for available commands or '/ai on' to chat with AI.

Your interactions may be logged for quality and support purposes.
Type '/privacy' for more information.
  `.trim(),

  // Session configuration
  session: {
    timeout: 300000, // 5 minutes
    askForName: true,
    askForEmail: false,
  },

  // Rate limiting
  rateLimit: {
    maxRequests: 50,
    windowMs: 60000, // 1 minute
  },

  // Command definitions and responses
  commands: {
    help: {
      description: 'Show available commands',
      response: `
<span class="command-header">Available Commands:</span>

  <span class="command">/help</span>      - Show this help message
  <span class="command">/about</span>     - Information about Arti Wolnica
  <span class="command">/projects</span>  - List railway engineering projects
  <span class="command">/experience</span> - Career history and expertise
  <span class="command">/etcs</span>      - ETCS expertise and services
  <span class="command">/contact</span>   - Contact information
  <span class="command">/privacy</span>   - Privacy and data policy
  <span class="command">/feedback</span>  - Send feedback directly
  <span class="command">/clear</span>     - Clear terminal screen
  <span class="command">/ai [on/off]</span> - Toggle AI chat mode
  <span class="command">/exit</span>      - End session

<span class="tip">Tip: Use ↑/↓ arrow keys for command history, Tab for autocomplete</span>
      `.trim(),
    },

    about: {
      description: 'Information about Arti Wolnica',
      response: `
<span class="section-header">About Arti Wolnica</span>

Railway Engineering Specialist & Technical Consultant

With extensive experience in railway signaling systems and ETCS
(European Train Control System), I provide expert consulting services
for railway infrastructure projects across Europe.

<span class="highlight">Core Expertise:</span>
  • ETCS Level 1, 2, and 3 implementations
  • Railway signaling system design and integration
  • Safety-critical software development
  • Technical specification and requirement analysis
  • System integration and testing
  • Regulatory compliance and certification support

<span class="highlight">Industries Served:</span>
  • Railway infrastructure operators
  • Rolling stock manufacturers
  • Signaling system integrators
  • Government transportation agencies
  • Engineering consulting firms

For detailed experience, type <span class="command">/experience</span>
For ETCS services, type <span class="command">/etcs</span>
      `.trim(),
    },

    projects: {
      description: 'List railway engineering projects',
      response: `
<span class="section-header">Featured Railway Projects</span>

<span class="project-title">1. High-Speed Rail ETCS Level 2 Implementation</span>
   Client: Major European Railway Operator
   Scope: Design and deployment of ETCS L2 on 450km high-speed corridor
   Role: Lead Systems Engineer
   Technologies: ETCS Baseline 3, GSM-R, RBC integration
   Status: Completed 2024

<span class="project-title">2. Urban Rail Signaling Modernization</span>
   Client: Metropolitan Transport Authority
   Scope: Legacy system upgrade to CBTC with ETCS overlay
   Role: Technical Consultant & Integration Specialist
   Technologies: ETCS L1, CBTC, Automatic Train Operation (ATO)
   Status: In Progress (Phase 2)

<span class="project-title">3. Cross-Border Interoperability Study</span>
   Client: International Railway Consortium
   Scope: ETCS interoperability analysis for multi-national routes
   Role: Principal Consultant
   Technologies: ETCS TSI compliance, ERTMS specifications
   Status: Completed 2023

<span class="project-title">4. Rolling Stock ETCS Onboard Equipment</span>
   Client: Train Manufacturer
   Scope: ETCS OBU specification and acceptance testing
   Role: Verification & Validation Lead
   Technologies: ETCS OBU, DMI, STM integration
   Status: Completed 2023

<span class="tip">For more project details or to discuss your project needs,
type <span class="command">/contact</span> or enable AI chat with <span class="command">/ai on</span></span>
      `.trim(),
    },

    experience: {
      description: 'Career history and expertise',
      response: `
<span class="section-header">Professional Experience</span>

<span class="job-title">Senior Railway Systems Engineer</span>
Railway Consulting Group | 2020 - Present
• Lead ETCS implementation projects across 5 European countries
• Technical authority for signaling system design and integration
• Manage multidisciplinary teams of 10-15 engineers
• Client liaison for major infrastructure operators

<span class="job-title">ETCS Specialist Engineer</span>
International Rail Solutions | 2017 - 2020
• ETCS Level 2 system design and configuration
• Safety case development and hazard analysis
• Integration testing and commissioning support
• Training delivery for operational staff

<span class="job-title">Signaling Design Engineer</span>
Metro Systems Engineering | 2014 - 2017
• Urban rail signaling system design
• Interlocking logic specification
• CAD design for signaling layouts
• Site supervision and commissioning

<span class="highlight">Certifications & Training:</span>
  ✓ ETCS Professional Certificate (UNISIG)
  ✓ Railway Safety & Interoperability (ERA)
  ✓ Functional Safety (IEC 61508 / EN 50126/128/129)
  ✓ Project Management Professional (PMP)

<span class="highlight">Technical Skills:</span>
  Languages: Python, C/C++, MATLAB/Simulink
  Tools: SCADE, DOORS, Enterprise Architect
  Standards: CENELEC, TSI, ERTMS, ETCS specifications
  Domains: Safety-critical systems, real-time embedded systems
      `.trim(),
    },

    etcs: {
      description: 'ETCS expertise and services',
      response: `
<span class="section-header">ETCS Expertise & Services</span>

<span class="highlight">European Train Control System (ETCS) Consulting</span>

I provide comprehensive ETCS consulting services covering all application
levels and implementation phases:

<span class="service-category">ETCS Level 1</span>
  • Eurobalise placement and configuration
  • Lineside Electronic Unit (LEU) integration
  • Transition level design and optimization
  • National system (STM) integration

<span class="service-category">ETCS Level 2</span>
  • Radio Block Centre (RBC) specification
  • GSM-R communication architecture
  • Trackside-to-onboard data flow design
  • Migration strategies from Level 1

<span class="service-category">ETCS Level 3</span>
  • Moving block implementation concepts
  • Train integrity monitoring systems
  • Reduced trackside equipment strategies
  • Future railway architecture planning

<span class="service-category">Onboard Systems</span>
  • ETCS Onboard Unit (OBU) specification
  • Driver Machine Interface (DMI) design
  • Juridical Recording Unit (JRU) requirements
  • Multi-system locomotive integration

<span class="service-category">Services Offered:</span>
  → System requirement specification
  → Safety and reliability analysis
  → Integration and testing support
  → Certification and approval assistance
  → Training and knowledge transfer
  → Troubleshooting and optimization
  → Technical due diligence

<span class="tip">Need ETCS expertise for your project? Type <span class="command">/contact</span>
or ask me questions in AI mode: <span class="command">/ai on</span></span>
      `.trim(),
    },

    contact: {
      description: 'Contact information',
      response: `
<span class="section-header">Contact Information</span>

<span class="highlight">Get in Touch</span>

  <span class="contact-label">Email:</span>      arti@arturwolnica.com
  <span class="contact-label">Website:</span>    https://arturwolnica.com
  <span class="contact-label">LinkedIn:</span>   linkedin.com/in/arturwolnica
  <span class="contact-label">Location:</span>   Europe (Available for international projects)

<span class="highlight">Engagement Types:</span>
  • Technical consulting and advisory
  • Project-based engineering services
  • Expert witness and litigation support
  • Training and workshops
  • Due diligence and system audits

<span class="highlight">Response Time:</span>
  Initial inquiries: Within 24 hours
  Detailed proposals: 3-5 business days

<span class="tip">You can also use <span class="command">/feedback</span> to send a message directly,
or enable AI chat (<span class="command">/ai on</span>) to ask specific questions about your needs.</span>

I look forward to discussing how I can support your railway engineering projects.
      `.trim(),
    },

    privacy: {
      description: 'Privacy and data policy',
      response: `
<span class="section-header">Privacy & Data Policy</span>

<span class="highlight">Conversation Logging</span>

This terminal logs interactions for the following purposes:
  • Responding to inquiries and support requests
  • Improving AI response quality
  • Understanding visitor interests and needs
  • Business analytics

<span class="highlight">Data Collected:</span>
  ✓ Commands entered and responses received
  ✓ AI conversation content
  ✓ Session timestamp and duration
  ✓ Approximate location (timezone/country)
  ✓ Page referrer (if available)
  ✓ Name/email (only if voluntarily provided)

<span class="highlight">Data Storage:</span>
  • Logs stored securely via Slack webhook
  • No third-party tracking cookies
  • Data retained for business purposes only
  • Not sold or shared with third parties

<span class="highlight">Your Rights (GDPR Compliance):</span>
  • Request data deletion: arti@arturwolnica.com
  • Data access requests honored within 30 days
  • Opt-out: Simply close the terminal

<span class="highlight">Security:</span>
  • Encrypted transmission (HTTPS/TLS)
  • API keys never exposed client-side
  • Rate limiting to prevent abuse

For questions about data handling, type <span class="command">/contact</span>
      `.trim(),
    },

    clear: {
      description: 'Clear terminal screen',
      response: null, // Handled specially in terminal.js
    },

    exit: {
      description: 'End session',
      response: `
<span class="exit-message">Session terminated. Thank you for visiting!</span>

Your conversation summary has been logged.
Feel free to return anytime.

To start a new session, refresh the page.
      `.trim(),
    },

    feedback: {
      description: 'Send feedback directly',
      response: null, // Handled specially to prompt for feedback input
    },

    ai: {
      description: 'Toggle AI chat mode',
      response: null, // Handled specially in terminal.js
    },
  },

  // AI mode configuration
  ai: {
    systemPrompt: `You are ARTI, an AI assistant embedded in Arti Wolnica's professional website terminal.

Your role is to:
1. Answer questions about Arti's railway engineering expertise, particularly ETCS systems
2. Provide information about his consulting services and past projects
3. Engage professionally with potential clients and industry professionals
4. Explain railway engineering concepts when asked
5. Help visitors understand how Arti can help with their projects

Context about Arti Wolnica:
- Senior railway systems engineer specializing in ETCS (European Train Control System)
- Expert in railway signaling, safety-critical systems, and ETCS Levels 1, 2, and 3
- Provides consulting for railway infrastructure operators, manufacturers, and agencies
- Based in Europe, available for international projects
- Technical skills include Python, C/C++, MATLAB, SCADE, and safety standards (CENELEC, TSI)

Tone: Professional, knowledgeable, helpful, and concise. Use technical terminology when appropriate but explain complex concepts clearly.

Keep responses focused and terminal-friendly (avoid very long responses). If asked about something outside Arti's expertise, politely redirect to relevant commands or suggest contacting Arti directly.`,

    welcomeMessage: `
<span class="ai-mode-on">AI Chat Mode Enabled</span>

You can now ask me questions about:
  • Railway engineering and ETCS systems
  • Arti's expertise and services
  • Technical consulting inquiries
  • Specific project needs

Type '/ai off' to return to command mode.
    `.trim(),

    exitMessage: `
<span class="ai-mode-off">AI Chat Mode Disabled</span>

Returning to command mode. Type '/help' for available commands.
    `.trim(),
  },

  // Slack logging configuration
  slack: {
    enabled: true,
    batchMessages: true,
    sendOnExit: true,
    sendOnTimeout: true,
    includeMetadata: true,
  },
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
