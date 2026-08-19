import { User, Lesson, QuizQuestion, Simulation, PhishingReport, UserProgress, QuizAttempt, SimulationAttempt } from '../types';

export const INITIAL_USERS: User[] = [];

export const LESSONS: Lesson[] = [
  {
    id: 'les-1',
    title: 'Lesson 1: What is Phishing?',
    description: 'Understanding the fundamentals of social engineering, deceptive digital communications, and the attacker mindset.',
    estimatedMinutes: 5,
    orderNumber: 1,
    status: 'published',
    sections: [
      {
        heading: '1. Definition & Core Concept',
        content: 'Phishing is a form of social engineering where cyber attackers disguise themselves as trustworthy entities (such as colleagues, banks, IT administrators, or executive leadership) to manipulate individuals into performing actions that compromise security.',
        bulletPoints: [
          'Credential Harvesting: Tricking victims into submitting corporate passwords on fraudulent login pages.',
          'Malware Deployment: Coaxing users to open infected attachments (macros, fake PDFs, malicious scripts).',
          'Financial Fraud: Diverting invoices, wire transfers, or gift card purchases to attacker-controlled accounts.',
          'Data Exfiltration: Stealing proprietary intellectual property, employee records, or customer PII.'
        ],
        callout: {
          type: 'danger',
          title: 'The Human Factor in Security',
          message: 'Over 85% of corporate cyber breaches involve a human element—specifically clicking on malicious links or executing deceptive attachments.'
        }
      },
      {
        heading: '2. Why Attackers Target Employees',
        content: 'Technical security perimeters like firewalls and endpoint agents have become formidable. Attackers recognize that it is often far easier to trick an employee through psychological manipulation (fear, urgency, authority, curiosity) than to crack 256-bit encryption.',
        bulletPoints: [
          'Pretexting: Creating a believable fake scenario (e.g., "Urgent: Unpaid Invoice from Q4").',
          'Impersonation: Spoofing executive names or brand logos to bypass natural skepticism.',
          'Exploiting Routine: Sending communications during peak hours when staff are multi-tasking and rushed.'
        ]
      }
    ],
    keyTakeaways: [
      'Phishing relies on psychological manipulation rather than brute-force software hacking.',
      'Attackers disguise themselves as trusted figures (IT, HR, vendors, executives).',
      'The primary goal is credentials, malware execution, or fraudulent fund transfers.'
    ]
  },
  {
    id: 'les-2',
    title: 'Lesson 2: Types of Phishing Attacks',
    description: 'Explore the different attack vectors including Spear Phishing, Smishing, Vishing, Business Email Compromise (BEC), and Malicious Attachments.',
    estimatedMinutes: 7,
    orderNumber: 2,
    status: 'published',
    sections: [
      {
        heading: '1. Email Phishing (Mass Phishing)',
        content: 'Broad, generic broadcast campaigns sent to thousands of recipients simultaneously. Usually impersonates popular consumer services (DHL delivery notices, Netflix billing, Microsoft 365 password resets) hoping a fraction of recipients fall for it.'
      },
      {
        heading: '2. Spear Phishing & Whaling',
        content: 'Highly customized, targeted attacks where the cybercriminal researches the specific victim using LinkedIn, corporate press releases, or social media.',
        bulletPoints: [
          'Spear Phishing: Uses your exact name, title, current internal projects, and coworker references.',
          'Whaling: Spear phishing aimed specifically at C-suite executives, board members, or financial controllers with high approval limits.'
        ],
        callout: {
          type: 'warning',
          title: 'Spear Phishing Indicator',
          message: 'If an email mentions a real ongoing project but comes from an external email address or asks to bypass standard approvals, treat it as high-risk.'
        }
      },
      {
        heading: '3. Business Email Compromise (BEC)',
        content: 'An attacker impersonates a CEO, CFO, or trusted external vendor. They request urgent wire transfers, invoice bank account changes, or employee payroll redirection without traditional malicious attachments or obvious typos.'
      },
      {
        heading: '4. Smishing (SMS) & Vishing (Voice Phishing)',
        content: 'Phishing conducted via SMS text messages (Smishing) or telephone calls (Vishing). Examples include fake courier package delivery links or callers pretending to be the IT Helpdesk asking for 2FA one-time codes.'
      },
      {
        heading: '5. Malicious Attachments (Weaponized Documents)',
        content: 'Files disguised as benign invoices (`invoice_2026.pdf.exe`, `contract.docm` with malicious macros, or password-protected ZIP archives designed to evade email gateway scanners).'
      }
    ],
    keyTakeaways: [
      'Phishing extends beyond email to SMS (smishing) and voice calls (vishing).',
      'Spear phishing is personalized and often much harder to identify at first glance.',
      'Business Email Compromise (BEC) often uses pure social pressure without links or attachments.'
    ]
  },
  {
    id: 'les-3',
    title: 'Lesson 3: How to Spot Phishing Indicators',
    description: 'Learn the definitive anatomical breakdown of a phishing attack: sender anomalies, deceptive domains, lookalike URLs, and emotional triggers.',
    estimatedMinutes: 8,
    orderNumber: 3,
    status: 'published',
    sections: [
      {
        heading: '1. Inspecting the Sender Address (Display Name Spoofing)',
        content: 'Email clients display a friendly "Display Name" alongside the actual sender email address. Attackers often set the Display Name to "Company IT Support" while the real address is `support@it-security-portal-auth.com` or `helpdesk.company@gmail.com`.',
        bulletPoints: [
          'Always expand the sender field on mobile and desktop to view the actual email address between angle brackets `< >`.',
          'Look for subtle typosquatting: `micosoft.com`, `paypal-security.support`, or `company-portal.net` instead of `company.com`.'
        ],
        callout: {
          type: 'tip',
          title: 'Pro-Tip: Look Past The Friendly Name',
          message: 'The display name can be typed as anything by an attacker. Always inspect the exact domain after the @ symbol.'
        }
      },
      {
        heading: '2. Deceptive Hyperlinks & Hover Inspection',
        content: 'The anchor text of a link can display a safe URL (e.g. `https://intranet.company.com`) while pointing to a malicious destination (e.g. `https://evil-phish.xyz/login`).',
        bulletPoints: [
          'Hover your mouse cursor over the link before clicking to view the destination in your browser/client status bar.',
          'On mobile devices, long-press a link to inspect the destination URL without opening it.',
          'Watch out for URL shorteners (bit.ly, tinyurl) or mismatched top-level domains (.xyz, .top, .ru, .work).'
        ]
      },
      {
        heading: '3. Psychological Triggers: Urgency & Fear',
        content: 'Attackers create an artificial crisis to disable critical thinking. Phrases like "Your account will be suspended within 2 hours", "Immediate Termination", or "Confidential bonus expiring today" are designed to induce panic.',
        bulletPoints: [
          'Demands for immediate secret action without verification.',
          'Requests to bypass standard procurement or payment approval workflows.',
          'Generic greetings ("Dear Customer" / "Dear Valued Colleague") when they claim to be an internal department.'
        ]
      }
    ],
    keyTakeaways: [
      'Display names can be faked; inspect the actual sending domain.',
      'Always hover or long-press links to inspect the destination URL before clicking.',
      'Urgency and fear are intentional psychological tactics to make you act without thinking.'
    ]
  },
  {
    id: 'les-4',
    title: 'Lesson 4: How to Verify a Message (STOP → CHECK → VERIFY → REPORT)',
    description: 'Master the 4-step cybersecurity operational procedure to safely analyze and validate any suspicious communication.',
    estimatedMinutes: 6,
    orderNumber: 4,
    status: 'published',
    sections: [
      {
        heading: '1. The 4-Step Verification Framework',
        content: 'Whenever you receive an unexpected request, an urgent notification, or a message containing links or attachments, execute the 4-step framework:',
        bulletPoints: [
          'STEP 1: STOP — Pause immediately. Do not click links, open attachments, or reply. Take a breath and recognize any emotional urgency.',
          'STEP 2: CHECK — Inspect the sender email domain, hover over URLs, evaluate tone, check for strange grammar, and assess if the request is routine.',
          'STEP 3: VERIFY — Contact the sender through an independent, trusted out-of-band channel (call their official internal phone extension, message them on verified Teams/Slack, or walk to their desk). NEVER reply directly to the email.',
          'STEP 4: REPORT — Use the official Phishing Awareness reporting button or forward the message headers to the IT Security Team.'
        ],
        callout: {
          type: 'info',
          title: 'Out-Of-Band Verification',
          message: 'Out-of-band verification means confirming through a separate communication channel. If you receive an email from the CFO asking for gift cards, call the CFO on their verified office extension.'
        }
      },
      {
        heading: '2. Safe Handling of Attachments',
        content: 'Never enable macros in Office documents. Macro-enabled files (`.docm`, `.xlsm`, `.pptm`) can execute ransomware or backdoor scripts within seconds. If an attachment asks you to "Enable Editing" or "Enable Content to view protected invoice", close it immediately.'
      }
    ],
    keyTakeaways: [
      'Follow STOP → CHECK → VERIFY → REPORT on all unexpected requests.',
      'Verify through an out-of-band communication channel, never by replying.',
      'Never enable macros on unexpected incoming attachments.'
    ]
  },
  {
    id: 'les-5',
    title: 'Lesson 5: What To Do If You Click',
    description: 'Immediate, actionable incident response protocols if you accidentally click a suspicious link, submit credentials, or open an attachment.',
    estimatedMinutes: 5,
    orderNumber: 5,
    status: 'published',
    sections: [
      {
        heading: '1. Five Immediate Containment Actions',
        content: 'Mistakes happen. Speed of reporting is the single most critical factor in stopping a cyber breach before attackers move laterally.',
        bulletPoints: [
          '1. Stop Interacting Immediately: Close the browser tab or disconnect the application. Do not fill out further forms.',
          '2. Do NOT Hide the Mistake: Prompt reporting allows SecOps to isolate the session and revoke compromised tokens before damage occurs.',
          '3. Disconnect Network (if file was downloaded/executed): Unplug Ethernet cable or disconnect from Wi-Fi to stop malware spreading laterally.',
          '4. Reset Corporate Passwords: From a known clean secondary device, change your passwords and revoke active sessions.',
          '5. Notify IT Security Team: Contact SecOps or use the Phishing Awareness Reporting tool immediately with all details.'
        ],
        callout: {
          type: 'danger',
          title: 'Blameless Security Culture',
          message: 'Our organization maintains a blameless reporting policy. Reporting a click promptly protects the entire organization and is praised by the security team.'
        }
      },
      {
        heading: '2. Information Security Incident Response Flow',
        content: 'Once reported, the security team investigates server logs, checks whether multi-factor authentication was triggered, blacklists malicious IP addresses across the corporate firewall, and purges the phishing email from all other employee mailboxes.'
      }
    ],
    keyTakeaways: [
      'Immediately stop interacting with the page or file.',
      'Disconnect from the network if an attachment was executed.',
      'Report the incident immediately—early detection prevents catastrophic breaches.'
    ]
  }
];

export const PRE_TEST_QUESTIONS: QuizQuestion[] = [
  {
    id: 'pre-1',
    question: 'What is the primary goal of most phishing attacks directed at corporate employees?',
    options: [
      { id: 'a', text: 'To perform routine security tests on corporate firewalls' },
      { id: 'b', text: 'To deceive employees into revealing credentials, deploying malware, or transferring funds' },
      { id: 'c', text: 'To update outdated computer software automatically' },
      { id: 'd', text: 'To measure employee typing and email response speed' }
    ],
    correctAnswer: 'b',
    explanation: 'Phishing is a social engineering attack aimed at stealing credentials, installing malware, or committing financial fraud by deceiving individuals.'
  },
  {
    id: 'pre-2',
    question: 'You receive an email where the sender display name says "IT Helpdesk", but the email address is "helpdesk-support@portal-login-auth.xyz". What does this indicate?',
    options: [
      { id: 'a', text: 'It is a legitimate sub-domain operated by the company IT department' },
      { id: 'b', text: 'It is Display Name Spoofing and a major indicator of a phishing attack' },
      { id: 'c', text: 'The IT department updated their email server protocol' },
      { id: 'd', text: 'The email was forwarded through a secure encryption proxy' }
    ],
    correctAnswer: 'b',
    explanation: 'Attackers can easily set any Display Name. The actual sender domain (.xyz) does not match the official corporate domain, indicating spoofing.'
  },
  {
    id: 'pre-3',
    question: 'What is "Spear Phishing"?',
    options: [
      { id: 'a', text: 'A random spam message sent indiscriminately to millions of public addresses' },
      { id: 'b', text: 'A highly targeted, customized attack aimed at a specific individual or organization' },
      { id: 'c', text: 'An automated computer virus that corrupts physical hard drives' },
      { id: 'd', text: 'A legitimate marketing email sent by verified corporate sponsors' }
    ],
    correctAnswer: 'b',
    explanation: 'Spear phishing involves thorough attacker reconnaissance to craft believable, highly tailored messages referencing real coworkers and projects.'
  },
  {
    id: 'pre-4',
    question: 'What should you do before clicking on any hyperlink in an unexpected email?',
    options: [
      { id: 'a', text: 'Click it immediately to see if the website is blocked by your browser' },
      { id: 'b', text: 'Hover your cursor over the link to inspect the actual destination URL' },
      { id: 'c', text: 'Forward the email to all your department colleagues to ask if they received it' },
      { id: 'd', text: 'Reply to the sender asking if the link is safe' }
    ],
    correctAnswer: 'b',
    explanation: 'Hovering over a hyperlink reveals the true underlying destination URL in the status bar, helping you spot fraudulent domains.'
  },
  {
    id: 'pre-5',
    question: 'An urgent email from the "CEO" asks you to purchase $1,500 in gift cards for a confidential client meeting immediately. What attack type is this?',
    options: [
      { id: 'a', text: 'Business Email Compromise (BEC) / CEO Fraud' },
      { id: 'b', text: 'DDoS Network Flooding' },
      { id: 'c', text: 'Hardware Keylogger Infection' },
      { id: 'd', text: 'Legitimate corporate emergency procurement' }
    ],
    correctAnswer: 'a',
    explanation: 'Business Email Compromise (BEC) relies on executive authority, artificial urgency, and secrecy to bypass financial controls.'
  },
  {
    id: 'pre-6',
    question: 'Why do phishing emails frequently use urgent deadlines like "Your account will be terminated in 2 hours"?',
    options: [
      { id: 'a', text: 'Because email servers delete unread messages after 2 hours' },
      { id: 'b', text: 'To induce panic and pressure the victim into acting without thinking' },
      { id: 'c', text: 'To comply with international cybersecurity data privacy laws' },
      { id: 'd', text: 'Because corporate licenses expire automatically every 120 minutes' }
    ],
    correctAnswer: 'b',
    explanation: 'Artificial urgency is a psychological tactic designed to short-circuit critical evaluation and provoke hasty, unverified actions.'
  },
  {
    id: 'pre-7',
    question: 'What is "Smishing"?',
    options: [
      { id: 'a', text: 'Phishing conducted via SMS text messages' },
      { id: 'b', text: 'Phishing conducted via telephone voice calls' },
      { id: 'c', text: 'Smashing infected computer hardware with a hammer' },
      { id: 'd', text: 'Deleting spam messages in bulk' }
    ],
    correctAnswer: 'a',
    explanation: 'Smishing combines "SMS" and "Phishing", referring to fraudulent text messages containing deceptive links or phone numbers.'
  },
  {
    id: 'pre-8',
    question: 'If you receive an unexpected invoice attachment in `.docm` format requesting you to "Enable Macros", what should you do?',
    options: [
      { id: 'a', text: 'Enable macros immediately to decode the billing table' },
      { id: 'b', text: 'Do not enable macros, close the document, and report it to IT Security' },
      { id: 'c', text: 'Convert the document to a PDF and email it to Finance' },
      { id: 'd', text: 'Print the document on an office network printer' }
    ],
    correctAnswer: 'b',
    explanation: 'Office macros can execute malicious scripts that download ransomware or backdoors. Never enable macros on unexpected files.'
  },
  {
    id: 'pre-9',
    question: 'What is the recommended 4-step framework when handling suspicious messages?',
    options: [
      { id: 'a', text: 'CLICK → DOWNLOAD → INSTALL → REBOOT' },
      { id: 'b', text: 'STOP → CHECK → VERIFY → REPORT' },
      { id: 'c', text: 'IGNORE → DELETE → FORGET → ARCHIVE' },
      { id: 'd', text: 'REPLY → ARGUE → COMPLAIN → BLOCK' }
    ],
    correctAnswer: 'b',
    explanation: 'The industry-standard verification framework is STOP (pause), CHECK (inspect indicators), VERIFY (out-of-band), and REPORT (to SecOps).'
  },
  {
    id: 'pre-10',
    question: 'If you accidentally submitted your corporate password onto a suspicious login page, what is the best immediate action?',
    options: [
      { id: 'a', text: 'Wait until the end of the week to see if anything strange happens' },
      { id: 'b', text: 'Immediately change your password and report the incident to IT Security' },
      { id: 'c', text: 'Delete your browser history and restart your computer' },
      { id: 'd', text: 'Send an angry email to the website administrator' }
    ],
    correctAnswer: 'b',
    explanation: 'Prompt reporting allows the security operations team to revoke active sessions and rotate credentials before the attacker logs in.'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'qz-1',
    question: 'Which of the following sender email addresses is most likely a phishing attempt impersonating Microsoft?',
    options: [
      { id: 'a', text: 'account-security@microsoft.com' },
      { id: 'b', text: 'security-update@micros0ft-support.cloud.xyz' },
      { id: 'c', text: 'no-reply@microsoft.com' },
      { id: 'd', text: 'billing@microsoft.com' }
    ],
    correctAnswer: 'b',
    explanation: 'The domain `micros0ft-support.cloud.xyz` uses typosquatting (a zero instead of an "o") and an untrusted `.xyz` top-level domain.',
    relatedLessonId: 'les-3'
  },
  {
    id: 'qz-2',
    question: 'What does "out-of-band verification" mean in cybersecurity awareness?',
    options: [
      { id: 'a', text: 'Replying to the email using high-priority exclamation marks' },
      { id: 'b', text: 'Confirming the request via an entirely separate, known trusted communication channel (e.g. calling their verified phone extension)' },
      { id: 'c', text: 'Checking if the sender has a public LinkedIn profile' },
      { id: 'd', text: 'Searching Google to see if other people got the same message' }
    ],
    correctAnswer: 'b',
    explanation: 'Out-of-band verification means confirming the request using a separate trusted medium (such as an in-person conversation or direct phone call).',
    relatedLessonId: 'les-4'
  },
  {
    id: 'qz-3',
    question: 'An email claims you have won an internal corporate employee raffle bonus of $5,000, but requires you to enter your corporate login credentials. What psychological tactic is being used?',
    options: [
      { id: 'a', text: 'Greed / Excitement manipulation' },
      { id: 'b', text: 'Technical denial of service' },
      { id: 'c', text: 'Packet sniffing' },
      { id: 'd', text: 'Hardware depreciation' }
    ],
    correctAnswer: 'a',
    explanation: 'Enticing offers and fake prizes trigger excitement and greed, prompting users to overlook standard security safeguards.',
    relatedLessonId: 'les-1'
  },
  {
    id: 'qz-4',
    question: 'What is the danger of opening an attachment named `Q3_Financial_Report.pdf.exe`?',
    options: [
      { id: 'a', text: 'It will open a PDF in Adobe Acrobat safely' },
      { id: 'b', text: 'It uses double file extensions to disguise an executable malware program as a document' },
      { id: 'c', text: 'It will consume too much printer toner if printed' },
      { id: 'd', text: 'It will change your desktop wallpaper' }
    ],
    correctAnswer: 'b',
    explanation: 'Double extensions like `.pdf.exe` exploit Windows default settings that hide file extensions, tricking users into executing malicious code.',
    relatedLessonId: 'les-2'
  },
  {
    id: 'qz-5',
    question: 'When is it safe to send corporate passwords via plain unencrypted email?',
    options: [
      { id: 'a', text: 'Only when requested by the IT Director' },
      { id: 'b', text: 'Only during end-of-year system audits' },
      { id: 'c', text: 'Never. Legitimate IT staff will never ask for your password via email.' },
      { id: 'd', text: 'Whenever the email has an "Urgent" header' }
    ],
    correctAnswer: 'c',
    explanation: 'Legitimate administrators have administrative tools and will never ask you to send passwords over email or plaintext channels.',
    relatedLessonId: 'les-3'
  },
  {
    id: 'qz-6',
    question: 'What is "Vishing"?',
    options: [
      { id: 'a', text: 'Phishing through voice phone calls where attackers impersonate bank reps or IT technicians' },
      { id: 'b', text: 'Phishing through video game streaming platforms' },
      { id: 'c', text: 'Viewing phishing emails on a virtual machine' },
      { id: 'd', text: 'Validating security certificates' }
    ],
    correctAnswer: 'a',
    explanation: 'Vishing (Voice Phishing) uses phone calls to extract sensitive information, often pretending to be IT helpdesk or fraud departments.',
    relatedLessonId: 'les-2'
  },
  {
    id: 'qz-7',
    question: 'Why should you use the designated "Report Phishing" button instead of simply deleting a suspicious message?',
    options: [
      { id: 'a', text: 'Reporting alerts the Security Team so they can purge the email from other colleagues’ inboxes and block the malicious domain' },
      { id: 'b', text: 'Deleting the email slows down your computer processor' },
      { id: 'c', text: 'Reporting sends a fine to the attacker’s home address' },
      { id: 'd', text: 'Reporting is legally required to earn annual leave' }
    ],
    correctAnswer: 'a',
    explanation: 'Reporting alerts security analysts to investigate, block the threat across email gateways, and protect coworkers who might also receive it.',
    relatedLessonId: 'les-4'
  },
  {
    id: 'qz-8',
    question: 'A link in an email displays `https://intranet.ourcompany.com/payroll`, but hovering over it reveals `http://185.220.101.45/login.php`. What is this?',
    options: [
      { id: 'a', text: 'A direct IP address hyperlink used to deceive users with mismatched anchor text' },
      { id: 'b', text: 'A faster official connection route to the intranet server' },
      { id: 'c', text: 'A modern cloud load balancer' },
      { id: 'd', text: 'An encrypted SSL channel' }
    ],
    correctAnswer: 'a',
    explanation: 'Mismatched anchor text linking directly to an arbitrary raw IP address is a classic credential harvesting indicator.',
    relatedLessonId: 'les-3'
  },
  {
    id: 'qz-9',
    question: 'What policy protects employees who immediately disclose an accidental phishing click to the IT team?',
    options: [
      { id: 'a', text: 'A Blameless / Non-Punitive Security Reporting Policy' },
      { id: 'b', text: 'Zero Tolerance Disciplinary Policy' },
      { id: 'c', text: 'Mandatory Salary Deduction Policy' },
      { id: 'd', text: 'Public Incident Wall of Shame' }
    ],
    correctAnswer: 'a',
    explanation: 'A blameless reporting culture encourages rapid notification, allowing defenders to contain breaches before damage spreads.',
    relatedLessonId: 'les-5'
  },
  {
    id: 'qz-10',
    question: 'Which of the following is a sign of a high-quality, legitimate communication?',
    options: [
      { id: 'a', text: 'Sender domain matches official domain exactly, expected context, no forced urgency, normal communication channels' },
      { id: 'b', text: 'Generic greeting, urgent 1-hour deadline, link pointing to an external `.top` domain' },
      { id: 'c', text: 'Attachment named `Invoice.zip` containing a `.js` file with a password given in the email body' },
      { id: 'd', text: 'Request to wire funds to a personal overseas account bypassing ERP systems' }
    ],
    correctAnswer: 'a',
    explanation: 'Legitimate business emails follow established protocols, use verified internal domains, provide realistic timelines, and respect standard procedures.',
    relatedLessonId: 'les-3'
  }
];

export const POST_TEST_QUESTIONS: QuizQuestion[] = [
  {
    id: 'post-1',
    question: 'Which element is the most reliable indicator of where an email actually originated from?',
    options: [
      { id: 'a', text: 'The friendly Display Name (e.g., "Microsoft Support")' },
      { id: 'b', text: 'The actual domain in the sender email address header (e.g., user@domain.com)' },
      { id: 'c', text: 'The logo embedded in the email body' },
      { id: 'd', text: 'The font color of the subject line' }
    ],
    correctAnswer: 'b',
    explanation: 'Display names and logos are easily faked. The actual sender email domain is the reliable indicator of source.'
  },
  {
    id: 'post-2',
    question: 'You receive an email from "HR Benefits" stating: "Click here immediately to claim your 2026 inflation adjustment bonus or forfeit it today." What is the best action?',
    options: [
      { id: 'a', text: 'Click the link quickly before the deadline expires' },
      { id: 'b', text: 'Execute the STOP → CHECK → VERIFY framework and contact HR via your internal phone directory' },
      { id: 'c', text: 'Reply with your bank account details directly in the email' },
      { id: 'd', text: 'Forward the bonus link to your family' }
    ],
    correctAnswer: 'b',
    explanation: 'Artificial urgency and high-value incentives are hallmarks of social engineering. Verify independently with HR.'
  },
  {
    id: 'post-3',
    question: 'What is the primary danger of typosquatted domains such as `c0mpany-portal.com` vs `company-portal.com`?',
    options: [
      { id: 'a', text: 'They cause the email to load slowly on mobile phones' },
      { id: 'b', text: 'They mimic legitimate corporate domains to deceive victims into entering credentials on clone sites' },
      { id: 'c', text: 'They reduce browser screen brightness' },
      { id: 'd', text: 'They automatically encrypt your local printer' }
    ],
    correctAnswer: 'b',
    explanation: 'Typosquatting substitutes visually similar characters (like `0` for `o` or `rn` for `m`) to fool users into trusting fake sites.'
  },
  {
    id: 'post-4',
    question: 'If you click a link and land on a login page asking for your corporate password, what should you inspect first in the browser address bar?',
    options: [
      { id: 'a', text: 'The background color of the webpage' },
      { id: 'b', text: 'The exact Domain Name (URL) to verify it is the official corporate domain (e.g. `login.microsoftonline.com` or `company.com`)' },
      { id: 'c', text: 'The time displayed on your computer clock' },
      { id: 'd', text: 'Whether there is a picture of a padlock anywhere on the web page body' }
    ],
    correctAnswer: 'b',
    explanation: 'Always inspect the exact Domain Name in the browser address bar. Phishing sites can copy login aesthetics perfectly on fake domains.'
  },
  {
    id: 'post-5',
    question: 'An email from a trusted vendor asks you to update their bank account details for upcoming invoice payments. What is this attack type called?',
    options: [
      { id: 'a', text: 'Vendor Email Compromise (VEC) / Business Email Compromise (BEC)' },
      { id: 'b', text: 'Cross-Site Scripting (XSS)' },
      { id: 'c', text: 'SQL Injection' },
      { id: 'd', text: 'Buffer Overflow' }
    ],
    correctAnswer: 'a',
    explanation: 'Vendor Email Compromise involves hijacking or spoofing a vendor’s email to divert invoice payments to fraudster bank accounts.'
  },
  {
    id: 'post-6',
    question: 'Why do attackers often send password-protected ZIP attachments and provide the password inside the email body?',
    options: [
      { id: 'a', text: 'To comply with corporate encryption standards' },
      { id: 'b', text: 'To bypass automated email security gateways from scanning the malicious archive contents' },
      { id: 'c', text: 'To make the file download 10x faster' },
      { id: 'd', text: 'Because Microsoft Outlook requires passwords for all attachments' }
    ],
    correctAnswer: 'b',
    explanation: 'Password-protecting malicious ZIP files prevents automated antivirus scanners from inspecting the internal payload.'
  },
  {
    id: 'post-7',
    question: 'What is the correct protocol if you suspect you received a simulated phishing campaign email in this training portal?',
    options: [
      { id: 'a', text: 'Click all the links to test if your antivirus is working' },
      { id: 'b', text: 'Use the "Report Phishing" button to safely flag and record the suspicious email' },
      { id: 'c', text: 'Post the link on public social media' },
      { id: 'd', text: 'Ignore it and do not participate in training' }
    ],
    correctAnswer: 'b',
    explanation: 'Reporting simulated or real phishing through the designated reporting button reinforces defensive incident response habits.'
  },
  {
    id: 'post-8',
    question: 'What is the risk of a "Vishing" attack where the caller claims to be from IT Support and requests your 2FA / OTP code?',
    options: [
      { id: 'a', text: 'They want to help configure your email client' },
      { id: 'b', text: 'They already have your password and need the OTP to bypass multi-factor authentication and hijack your account' },
      { id: 'c', text: 'They are testing your telephone sound quality' },
      { id: 'd', text: 'There is no risk because OTP codes are public information' }
    ],
    correctAnswer: 'b',
    explanation: 'Attackers use real-time vishing to capture one-time passcodes, allowing them to bypass MFA and breach protected corporate accounts.'
  },
  {
    id: 'post-9',
    question: 'Which of the following is the single most important action after realizing you downloaded and executed a suspicious email attachment?',
    options: [
      { id: 'a', text: 'Disconnect your device from the network (Wi-Fi / Ethernet) and immediately notify IT Security' },
      { id: 'b', text: 'Turn off your computer monitor and go to lunch' },
      { id: 'c', text: 'Try opening the attachment 5 more times' },
      { id: 'd', text: 'Keep quiet to avoid getting in trouble' }
    ],
    correctAnswer: 'a',
    explanation: 'Disconnecting network connectivity isolates the host, stopping ransomware or malware from spreading laterally across the company network.'
  },
  {
    id: 'post-10',
    question: 'How does continuous cybersecurity awareness training protect the organization as a whole?',
    options: [
      { id: 'a', text: 'It transforms employees into active, vigilant human firewalls who detect and report threats early' },
      { id: 'b', text: 'It completely eliminates the need for antivirus software or firewalls' },
      { id: 'c', text: 'It allows IT staff to stop monitoring servers' },
      { id: 'd', text: 'It prevents computer hardware from overheating' }
    ],
    correctAnswer: 'a',
    explanation: 'Staff awareness builds a resilient human sensor network. Early reporting enables security teams to neutralize threats rapidly.'
  }
];

export const SIMULATIONS: Simulation[] = [
  {
    id: 'sim-1',
    title: 'Critical IT Security Alert: Mandatory Password Expiration',
    difficulty: 'Beginner',
    category: 'Credential Harvester',
    senderName: 'Global IT Helpdesk',
    senderEmail: 'support@it-security-portal-auth.test',
    recipientEmail: 'staff.member@company.test',
    subject: 'ACTION REQUIRED: Your Corporate Password Expires In 2 Hours',
    dateString: 'Today at 08:42 AM',
    messageHtml: `
      <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">
        <div style="border-bottom: 2px solid #ef4444; padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="color: #dc2626; margin: 0; font-size: 18px;">⚠️ URGENT IT NOTIFICATION</h2>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Incident Ref: SEC-99482-EXP</p>
        </div>
        <p>Dear Valued Employee,</p>
        <p>Your network and email access password is scheduled to expire in <strong>120 minutes</strong> in accordance with corporate security compliance policy.</p>
        <p>Failure to validate your credentials will result in immediate suspension of your Microsoft 365, VPN, and internal workstation access.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="#" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Keep Same Password & Prevent Lockout</a>
        </div>
        <p style="font-size: 12px; color: #64748b;">If button does not work, visit: <code>http://secure-login.portal-auth.test/reset-verify?id=99281</code></p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #94a3b8;">IT Security Operations Team &copy; 2026 Internal Systems Services</p>
      </div>
    `,
    messageText: 'Your network and email access password is scheduled to expire in 120 minutes. Keep your same password by clicking the link.',
    hasAttachment: false,
    displayUrl: 'http://secure-login.portal-auth.test/reset-verify?id=99281',
    actualDestinationUrl: 'http://evil-credential-harvester.xyz/login.php',
    isPhishing: true,
    warningSigns: [
      'Sender address uses suspicious domain `@it-security-portal-auth.test` instead of `@company.test`.',
      'Extreme artificial urgency ("Expires in 2 hours", "Immediate suspension").',
      'Offers to "Keep Same Password", which violates standard password rotation policies.',
      'Hyperlink points to an external unverified domain `evil-credential-harvester.xyz`.',
      'Generic salutation ("Dear Valued Employee") rather than your personalized name.'
    ],
    explanation: 'This is a classic credential harvesting phishing attack. IT departments will never send a 2-hour emergency countdown link prompting you to keep an expired password on an external website.',
    tacticsUsed: ['Display Name Spoofing', 'Urgency & Fear', 'Credential Harvesting Link', 'Generic Greeting']
  },
  {
    id: 'sim-2',
    title: 'HR Department: Annual Performance Bonus & Compensation Review',
    difficulty: 'Intermediate',
    category: 'HR / Payroll Scams',
    senderName: 'Human Resources Benefits',
    senderEmail: 'hr-department@company-portal-benefits.test',
    recipientEmail: 'staff.member@company.test',
    subject: 'CONFIDENTIAL: 2026 Mid-Year Discretionary Bonus Allocation',
    dateString: 'Yesterday at 04:15 PM',
    messageHtml: `
      <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">
        <div style="background-color: #f8fafc; padding: 12px; border-left: 4px solid #3b82f6; margin-bottom: 16px;">
          <strong style="color: #1e40af;">Internal HR Notice — Highly Confidential</strong>
        </div>
        <p>Dear Colleague,</p>
        <p>The Executive Remuneration Committee has finalized the 2026 Mid-Year Discretionary Staff Bonus allocation for your department.</p>
        <p>To review your individual payout statement and verify your direct deposit banking details for the upcoming payroll run, please open the attached secure PDF document.</p>
        <div style="background: #f1f5f9; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px dashed #cbd5e1;">
          <span style="font-size: 20px; vertical-align: middle;">📎</span>
          <strong style="margin-left: 8px;">Attached:</strong> <code>Bonus_Statement_2026.pdf.exe (2.4 MB)</code>
          <p style="font-size: 12px; color: #64748b; margin: 6px 0 0 0;">Password to decrypt attachment: <strong>Company2026!</strong></p>
        </div>
        <p>Please confirm receipt before Friday 5:00 PM to ensure on-time payment.</p>
        <p>Best regards,<br><strong>Department of Human Resources & People Operations</strong></p>
      </div>
    `,
    messageText: 'Executive Remuneration Committee finalized bonus allocation. Open attached Bonus_Statement_2026.pdf.exe to verify banking details.',
    hasAttachment: true,
    attachmentName: 'Bonus_Statement_2026.pdf.exe',
    attachmentSize: '2.4 MB',
    attachmentType: 'application/x-msdownload',
    isPhishing: true,
    warningSigns: [
      'Attachment has a double extension `.pdf.exe` which is an executable Windows program, not a PDF document.',
      'Sender domain `@company-portal-benefits.test` is a lookalike domain, not the real corporate email domain.',
      'Appeals to excitement and greed (unexpected monetary bonus).',
      'Provides a password inside the email body, a tactic used to evade email gateway sandbox detection.'
    ],
    explanation: 'This is a weaponized attachment phishing attack. The `.pdf.exe` double extension disguises malware as a benign statement document.',
    tacticsUsed: ['Double File Extension (.pdf.exe)', 'Greed / Excitement Incentive', 'Lookalike Domain Spoofing', 'Gateway Bypass Password']
  },
  {
    id: 'sim-3',
    title: 'Urgent Wire Transfer & Vendor Bank Account Update (From CFO)',
    difficulty: 'Advanced',
    category: 'Urgent Invoice / BEC',
    senderName: 'Robert Sterling (Chief Financial Officer)',
    senderEmail: 'robert.sterling.cfo@gmail.com',
    recipientEmail: 'staff.member@company.test',
    subject: 'URGENT: Confidential Acquisition Wire Transfer — Process Immediately',
    dateString: 'Today at 10:12 AM',
    messageHtml: `
      <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">
        <p>Hi,</p>
        <p>I am currently off-site attending closed-door negotiations for the acquisition of our European supplier. Due to confidentiality agreements, I cannot take voice calls right now.</p>
        <p>We need an initial escrow deposit of <strong>$38,500 USD</strong> wired to the holding escrow account before 1:00 PM to seal the contract exclusivity.</p>
        <p>Please process this immediately using the revised wire details below. Do not discuss this with the rest of the team until our public press release tomorrow morning.</p>
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px; margin: 12px 0;">
          <p style="margin: 0; font-family: monospace; font-size: 13px; color: #991b1b;">
            Bank Name: Offshore Trust Escrow Bank<br>
            Routing / SWIFT: OFSTRUS33XX<br>
            Account No: 9948-2819-0021<br>
            Beneficiary: EuroGlobal Escrow Ltd
          </p>
        </div>
        <p>Let me know as soon as the transfer wire confirmation receipt is generated.</p>
        <p>Thanks,<br><strong>Robert Sterling</strong><br><span style="font-size: 12px; color: #64748b;">Chief Financial Officer</span></p>
      </div>
    `,
    messageText: 'Urgent wire transfer needed for European supplier acquisition. Do not discuss with team, process $38,500 escrow wire immediately.',
    hasAttachment: false,
    isPhishing: true,
    warningSigns: [
      'Sender email address is a personal `@gmail.com` account pretending to be the corporate CFO.',
      'Demands strict secrecy ("Do not discuss with the rest of the team") to prevent verification.',
      'Claims inability to take phone calls to block out-of-band voice confirmation.',
      'Urgent financial transfer bypassing normal ERP purchase order and two-person authorization controls.'
    ],
    explanation: 'This is a classic Business Email Compromise (BEC) / CEO Fraud attack. High-value wire transfers must always follow strict multi-signatory protocols and out-of-band verification.',
    tacticsUsed: ['Executive Impersonation', 'Urgency & Confidentiality Pressure', 'Bypassing Financial Controls', 'Channel Blocking ("Cannot take calls")']
  },
  {
    id: 'sim-4',
    title: 'Cloud Document Sharing: Contract Review from Legal Partner',
    difficulty: 'Intermediate',
    category: 'Cloud Security Alert',
    senderName: 'Microsoft SharePoint Notification',
    senderEmail: 'no-reply@sharepoint-cloud-docs.test',
    recipientEmail: 'staff.member@company.test',
    subject: 'Legal counsel shared "NDA_Master_Services_Agreement_2026.docx" with you',
    dateString: '2 hours ago',
    messageHtml: `
      <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6; max-width: 550px; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <div style="background-color: #0284c7; color: white; width: 36px; height: 36px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px;">S</div>
          <div>
            <h3 style="margin: 0; font-size: 16px; color: #0f172a;">SharePoint Online</h3>
            <span style="font-size: 12px; color: #64748b;">Enterprise Cloud Collaboration</span>
          </div>
        </div>
        <p><strong>Davis & Partners LLP (External Legal Counsel)</strong> has invited you to view and collaborate on the following document:</p>
        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px; margin: 16px 0;">
          <p style="margin: 0; font-weight: bold; color: #0284c7;">📄 NDA_Master_Services_Agreement_2026.docx</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Size: 412 KB &bull; Permissions: View & Edit</p>
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <a href="#" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: 600; display: inline-block;">Open Document in SharePoint</a>
        </div>
        <p style="font-size: 11px; color: #94a3b8;">This link will expire in 24 hours. If you did not expect this document, please contact your administrator.</p>
      </div>
    `,
    messageText: 'Davis & Partners LLP shared NDA_Master_Services_Agreement_2026.docx with you. Open Document in SharePoint.',
    hasAttachment: false,
    displayUrl: 'https://company.sharepoint.com/personal/legal_counsel/_layouts/15/Doc.aspx',
    actualDestinationUrl: 'https://fake-microsoft-365-login.net/auth/oauth2/authorize',
    isPhishing: true,
    warningSigns: [
      'Sending domain is `@sharepoint-cloud-docs.test`, which is NOT an official Microsoft domain (`sharepointonline.com` or `microsoft.com`).',
      'The destination link leads to `fake-microsoft-365-login.net` to harvest corporate SSO credentials.',
      'You have no prior engagement with "Davis & Partners LLP".'
    ],
    explanation: 'Cloud service notifications (SharePoint, OneDrive, Google Drive, DocuSign) are frequently mimicked to lure users into fake single-sign-on login pages.',
    tacticsUsed: ['Brand Impersonation (SharePoint)', 'OAuth / SSO Credential Theft', 'Mismatched Target URL']
  },
  {
    id: 'sim-5',
    title: 'Legitimate: Company All-Hands Meeting Invitation & Agenda',
    difficulty: 'Beginner',
    category: 'Legitimate Official Notice',
    senderName: 'Internal Communications Team',
    senderEmail: 'internal-comms@company.test',
    recipientEmail: 'staff.member@company.test',
    subject: 'Quarterly All-Hands Meeting & Q2 Strategic Roadmap (Calendar Invite)',
    dateString: 'Yesterday at 02:00 PM',
    messageHtml: `
      <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 12px; margin-bottom: 16px;">
          <strong style="color: #15803d;">Official Internal Announcement &bull; All Staff</strong>
        </div>
        <p>Hello Team,</p>
        <p>Please join us this Thursday at 3:00 PM for our upcoming Q2 All-Hands meeting hosted by our executive leadership team.</p>
        <p><strong>Agenda:</strong></p>
        <ul>
          <li>Q1 Financial Highlights & Growth Update</li>
          <li>Product Roadmap & Cybersecurity Resilience Initiatives</li>
          <li>Employee Recognition & Live Q&A Session</li>
        </ul>
        <p>The meeting will be hosted on our official internal Microsoft Teams channel. You can join directly from your corporate Outlook calendar or via the verified internal intranet link below:</p>
        <p style="background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">
          Intranet Hub: <a href="#" style="color: #2563eb; text-decoration: underline;">https://intranet.company.test/events/all-hands-q2</a>
        </p>
        <p>No passwords or personal details are required to join. See you all there!</p>
        <p>Best regards,<br><strong>Internal Communications & Workplace Experience</strong><br>Email: <code>internal-comms@company.test</code></p>
      </div>
    `,
    messageText: 'Quarterly All-Hands meeting this Thursday at 3:00 PM on official Microsoft Teams. Agenda includes Q1 highlights and Q&A.',
    hasAttachment: false,
    displayUrl: 'https://intranet.company.test/events/all-hands-q2',
    actualDestinationUrl: 'https://intranet.company.test/events/all-hands-q2',
    isPhishing: false,
    warningSigns: [
      'None: This is a legitimate corporate communication.'
    ],
    explanation: 'This is a LEGITIMATE email. The sender domain matches the verified corporate domain (`@company.test`), links point directly to the internal intranet (`https://intranet.company.test`), and no credentials, urgent transfers, or risky attachments are requested.',
    tacticsUsed: ['Legitimate Communication Pattern']
  },
  {
    id: 'sim-6',
    title: 'IT Helpdesk: Scheduled Workstation Security Patch Maintenance',
    difficulty: 'Intermediate',
    category: 'IT Support / Impersonation',
    senderName: 'IT Operations & Endpoint Management',
    senderEmail: 'it-support@company.test',
    recipientEmail: 'staff.member@company.test',
    subject: 'Notice: Routine Workstation Security Patching This Weekend',
    dateString: 'Yesterday at 09:30 AM',
    messageHtml: `
      <div style="font-family: sans-serif; color: #1e293b; line-height: 1.6;">
        <p>Good Morning,</p>
        <p>Please be advised that the IT Infrastructure Team will be deploying routine operating system security updates this Saturday starting at 10:00 PM.</p>
        <p><strong>What you need to do:</strong></p>
        <ol>
          <li>Save all open documents before leaving the office on Friday.</li>
          <li>Leave your workstation connected to the office network and plugged into power.</li>
          <li>Do NOT turn off your machine.</li>
        </ol>
        <p><strong>Important Note:</strong> IT will NEVER ask for your password, PIN, or multi-factor authentication tokens to perform this update.</p>
        <p>For questions or support requests, submit a ticket through the official helpdesk portal at <a href="#" style="color: #2563eb;">https://helpdesk.company.test</a> or call internal ext. <strong>#4357</strong>.</p>
        <p>Thank you for your cooperation.<br><strong>IT Endpoint Operations</strong></p>
      </div>
    `,
    messageText: 'Routine workstation security updates this Saturday at 10:00 PM. Leave computer plugged in. IT will never ask for your password.',
    hasAttachment: false,
    displayUrl: 'https://helpdesk.company.test',
    actualDestinationUrl: 'https://helpdesk.company.test',
    isPhishing: false,
    warningSigns: [
      'None: This is an authentic internal announcement.'
    ],
    explanation: 'This is a LEGITIMATE email. It comes from the verified `@company.test` domain, explicitly reminds staff that IT never requests passwords, provides standard internal extension contacts, and contains no manipulative links.',
    tacticsUsed: ['Legitimate Security Best-Practice Notice']
  }
];

export const INITIAL_REPORTS: PhishingReport[] = [];

export const INITIAL_PROGRESS_LIST: UserProgress[] = [];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [];

export const INITIAL_SIM_ATTEMPTS: SimulationAttempt[] = [];

