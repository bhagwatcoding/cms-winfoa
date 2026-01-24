/**
 * Email Service Utility for Winfoa Platform
 * Simulated email sending with template support
 */

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
  variables?: Record<string, any>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  deliveryTime?: number;
  recipient: EmailRecipient;
}

export interface BulkEmailResult {
  success: boolean;
  sent: number;
  failed: number;
  results: EmailResult[];
}

// Email configuration
export const EMAIL_CONFIG = {
  fromEmail: process.env.EMAIL_FROM || 'noreply@winfoa.com',
  fromName: process.env.EMAIL_FROM_NAME || 'Winfoa Platform',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@winfoa.com',
  simulationMode: process.env.NODE_ENV !== 'production' || process.env.EMAIL_SIMULATION === 'true',
  maxBatchSize: 100,
  rateLimitMs: 1000, // 1 second between emails
};

/**
 * Email templates
 */
export const EMAIL_TEMPLATES = {
  welcome: {
    subject: 'Welcome to {{platformName}}!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Welcome to {{platformName}}!</h1>
        <p>Hi {{userName}},</p>
        <p>Thank you for joining {{platformName}}. We're excited to have you on board!</p>
        <p>Your account details:</p>
        <ul>
          <li><strong>Email:</strong> {{userEmail}}</li>
          <li><strong>Role:</strong> {{userRole}}</li>
          <li><strong>Account ID:</strong> {{userId}}</li>
        </ul>
        <p>You can now access all the features available to your role:</p>
        <ul>
          {{#each subdomains}}
          <li><a href="http://{{this}}.localhost:3000">{{this}} portal</a></li>
          {{/each}}
        </ul>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>The {{platformName}} Team</p>
      </div>
    `,
    text: `Welcome to {{platformName}}!\n\nHi {{userName}},\n\nThank you for joining {{platformName}}. We're excited to have you on board!\n\nYour account details:\n- Email: {{userEmail}}\n- Role: {{userRole}}\n- Account ID: {{userId}}\n\nBest regards,\nThe {{platformName}} Team`
  },

  courseEnrollment: {
    subject: 'Course Enrollment Confirmation - {{courseTitle}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Course Enrollment Confirmed!</h1>
        <p>Hi {{studentName}},</p>
        <p>You have successfully enrolled in <strong>{{courseTitle}}</strong>!</p>
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3>Course Details:</h3>
          <ul>
            <li><strong>Course Code:</strong> {{courseCode}}</li>
            <li><strong>Duration:</strong> {{courseDuration}}</li>
            <li><strong>Instructor:</strong> {{instructorName}}</li>
            <li><strong>Start Date:</strong> {{enrollmentDate}}</li>
            {{#if courseFee}}
            <li><strong>Fee Paid:</strong> {{currency}} {{courseFee}}</li>
            {{/if}}
          </ul>
        </div>
        <p>You can access your course materials at: <a href="http://academy.localhost:3000">Academy Portal</a></p>
        <p>Good luck with your studies!</p>
        <p>Best regards,<br>The {{platformName}} Team</p>
      </div>
    `,
    text: `Course Enrollment Confirmed!\n\nHi {{studentName}},\n\nYou have successfully enrolled in {{courseTitle}}!\n\nCourse Code: {{courseCode}}\nDuration: {{courseDuration}}\nInstructor: {{instructorName}}\n\nAccess your course at: http://academy.localhost:3000\n\nBest regards,\nThe {{platformName}} Team`
  },

  passwordReset: {
    subject: 'Password Reset Request - {{platformName}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Password Reset Request</h1>
        <p>Hi {{userName}},</p>
        <p>You requested a password reset for your {{platformName}} account.</p>
        <div style="background: #f0f8ff; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007bff;">
          <p><strong>Reset Code:</strong> <span style="font-size: 24px; letter-spacing: 3px; font-weight: bold;">{{resetCode}}</span></p>
          <p><em>This code will expire in 15 minutes.</em></p>
        </div>
        <p>If you didn't request this password reset, please ignore this email or contact support.</p>
        <p>Best regards,<br>The {{platformName}} Team</p>
      </div>
    `,
    text: `Password Reset Request\n\nHi {{userName}},\n\nYou requested a password reset for your {{platformName}} account.\n\nReset Code: {{resetCode}}\n\nThis code will expire in 15 minutes.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nThe {{platformName}} Team`
  },

  walletRecharge: {
    subject: 'Wallet Recharged Successfully - {{amount}} {{currency}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #28a745;">Wallet Recharged Successfully!</h1>
        <p>Hi {{userName}},</p>
        <p>Your wallet has been successfully recharged.</p>
        <div style="background: #d4edda; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #28a745;">
          <h3>Transaction Details:</h3>
          <ul>
            <li><strong>Amount Credited:</strong> {{currency}} {{amount}}</li>
            <li><strong>Payment Method:</strong> {{paymentMethod}}</li>
            <li><strong>Transaction ID:</strong> {{transactionId}}</li>
            <li><strong>New Balance:</strong> {{currency}} {{newBalance}}</li>
            <li><strong>Date:</strong> {{transactionDate}}</li>
          </ul>
        </div>
        <p>You can view your complete transaction history in the <a href="http://wallet.localhost:3000">Wallet Portal</a>.</p>
        <p>Thank you for using {{platformName}}!</p>
        <p>Best regards,<br>The {{platformName}} Team</p>
      </div>
    `,
    text: `Wallet Recharged Successfully!\n\nHi {{userName}},\n\nYour wallet has been recharged with {{currency}} {{amount}}.\n\nTransaction ID: {{transactionId}}\nNew Balance: {{currency}} {{newBalance}}\n\nView history at: http://wallet.localhost:3000\n\nBest regards,\nThe {{platformName}} Team`
  },

  certificateGenerated: {
    subject: 'Certificate Generated - {{courseTitle}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ffc107;">🎓 Congratulations!</h1>
        <p>Hi {{studentName}},</p>
        <p>Congratulations! You have successfully completed <strong>{{courseTitle}}</strong> and your certificate has been generated.</p>
        <div style="background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
          <h3>Certificate Details:</h3>
          <ul>
            <li><strong>Course:</strong> {{courseTitle}} ({{courseCode}})</li>
            <li><strong>Completion Date:</strong> {{completionDate}}</li>
            <li><strong>Grade:</strong> {{finalGrade}}%</li>
            <li><strong>Certificate ID:</strong> {{certificateId}}</li>
          </ul>
        </div>
        <p>You can download your certificate from the <a href="http://academy.localhost:3000/certificates">Academy Portal</a>.</p>
        <p>Well done on your achievement!</p>
        <p>Best regards,<br>The {{platformName}} Team</p>
      </div>
    `,
    text: `🎓 Congratulations!\n\nHi {{studentName}},\n\nYou have successfully completed {{courseTitle}}!\n\nCertificate ID: {{certificateId}}\nGrade: {{finalGrade}}%\n\nDownload at: http://academy.localhost:3000/certificates\n\nBest regards,\nThe {{platformName}} Team`
  }
};

/**
 * Simple template renderer (replaces {{variable}} with values)
 */
export function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;

  // Handle simple variables {{variable}}
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(regex, String(value || ''));
  }

  // Handle arrays {{#each array}} ... {{/each}}
  const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
  rendered = rendered.replace(eachRegex, (match, arrayName, content) => {
    const array = variables[arrayName];
    if (!Array.isArray(array)) return '';

    return array.map(item => {
      let itemContent = content;
      if (typeof item === 'string') {
        itemContent = itemContent.replace(/{{this}}/g, item);
      } else if (typeof item === 'object') {
        for (const [key, value] of Object.entries(item)) {
          itemContent = itemContent.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        }
      }
      return itemContent;
    }).join('');
  });

  // Handle conditionals {{#if variable}} ... {{/if}}
  const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
  rendered = rendered.replace(ifRegex, (match, varName, content) => {
    return variables[varName] ? content : '';
  });

  return rendered;
}

/**
 * Simulate email sending with realistic delays and success/failure rates
 */
export async function simulateEmailSending(
  to: EmailRecipient,
  template: EmailTemplate
): Promise<EmailResult> {
  // Simulate network delay
  const delay = 500 + Math.random() * 2000; // 0.5-2.5 seconds
  await new Promise(resolve => setTimeout(resolve, delay));

  // Simulate success/failure (95% success rate)
  const isSuccess = Math.random() > 0.05;

  if (!isSuccess) {
    return {
      success: false,
      error: getRandomEmailError(),
      recipient: to,
      deliveryTime: delay
    };
  }

  return {
    success: true,
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    recipient: to,
    deliveryTime: delay
  };
}

/**
 * Get random email error for simulation
 */
function getRandomEmailError(): string {
  const errors = [
    'Recipient email address invalid',
    'Mailbox full',
    'Temporary delivery failure',
    'SMTP server timeout',
    'Email blocked by spam filter'
  ];
  return errors[Math.floor(Math.random() * errors.length)];
}

/**
 * Send single email
 */
export async function sendEmail(
  to: EmailRecipient,
  templateName: keyof typeof EMAIL_TEMPLATES,
  variables: Record<string, any> = {}
): Promise<EmailResult> {
  try {
    const template = EMAIL_TEMPLATES[templateName];
    if (!template) {
      return {
        success: false,
        error: `Email template '${templateName}' not found`,
        recipient: to
      };
    }

    // Add default variables
    const templateVariables = {
      platformName: 'Winfoa Platform',
      currentYear: new Date().getFullYear(),
      supportEmail: EMAIL_CONFIG.replyTo,
      ...variables
    };

    // Render template
    const renderedTemplate: EmailTemplate = {
      subject: renderTemplate(template.subject, templateVariables),
      html: renderTemplate(template.html, templateVariables),
      text: template.text ? renderTemplate(template.text, templateVariables) : undefined,
      variables: templateVariables
    };

    if (EMAIL_CONFIG.simulationMode) {
      // Log email for development
      console.log(`📧 Email Simulation: ${templateName} to ${to.email}`);
      console.log(`Subject: ${renderedTemplate.subject}`);
      console.log(`Content Preview: ${renderedTemplate.text?.substring(0, 100)}...`);

      return await simulateEmailSending(to, renderedTemplate);
    } else {
      // In production, you would use a real email service here
      // For now, we'll still simulate
      return await simulateEmailSending(to, renderedTemplate);
    }

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email',
      recipient: to
    };
  }
}

/**
 * Send bulk emails
 */
export async function sendBulkEmails(
  recipients: EmailRecipient[],
  templateName: keyof typeof EMAIL_TEMPLATES,
  variables: Record<string, any> = {}
): Promise<BulkEmailResult> {
  const results: EmailResult[] = [];
  let sent = 0;
  let failed = 0;

  // Process in batches to avoid overwhelming the system
  const batchSize = Math.min(EMAIL_CONFIG.maxBatchSize, recipients.length);

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    // Send batch emails with rate limiting
    const batchPromises = batch.map(async (recipient, index) => {
      // Add delay between emails to respect rate limits
      await new Promise(resolve =>
        setTimeout(resolve, index * EMAIL_CONFIG.rateLimitMs)
      );

      return sendEmail(recipient, templateName, {
        ...variables,
        recipientName: recipient.name,
        recipientEmail: recipient.email
      });
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Count successes and failures
    batchResults.forEach(result => {
      if (result.success) {
        sent++;
      } else {
        failed++;
      }
    });

    // Log batch completion
    console.log(`📧 Email batch ${Math.floor(i / batchSize) + 1} completed: ${batchResults.length} emails processed`);
  }

  return {
    success: failed < sent, // Success if more emails sent than failed
    sent,
    failed,
    results
  };
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(
  user: {
    name: string;
    email: string;
    role: string;
    id: string;
    subdomains: string[];
  }
): Promise<EmailResult> {
  return sendEmail(
    { email: user.email, name: user.name },
    'welcome',
    {
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      userId: user.id,
      subdomains: user.subdomains
    }
  );
}

/**
 * Send course enrollment confirmation
 */
export async function sendEnrollmentConfirmation(
  student: { name: string; email: string },
  course: { title: string; code: string; duration: string; instructor: string },
  enrollment: { date: string; fee?: number; currency?: string }
): Promise<EmailResult> {
  return sendEmail(
    { email: student.email, name: student.name },
    'courseEnrollment',
    {
      studentName: student.name,
      courseTitle: course.title,
      courseCode: course.code,
      courseDuration: course.duration,
      instructorName: course.instructor,
      enrollmentDate: enrollment.date,
      courseFee: enrollment.fee,
      currency: enrollment.currency || 'USD'
    }
  );
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  user: { name: string; email: string },
  resetCode: string
): Promise<EmailResult> {
  return sendEmail(
    { email: user.email, name: user.name },
    'passwordReset',
    {
      userName: user.name,
      resetCode
    }
  );
}

/**
 * Send wallet recharge confirmation
 */
export async function sendWalletRechargeConfirmation(
  user: { name: string; email: string },
  transaction: {
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionId: string;
    newBalance: number;
    date: string;
  }
): Promise<EmailResult> {
  return sendEmail(
    { email: user.email, name: user.name },
    'walletRecharge',
    {
      userName: user.name,
      amount: transaction.amount,
      currency: transaction.currency,
      paymentMethod: transaction.paymentMethod,
      transactionId: transaction.transactionId,
      newBalance: transaction.newBalance,
      transactionDate: transaction.date
    }
  );
}

/**
 * Send certificate generation notification
 */
export async function sendCertificateNotification(
  student: { name: string; email: string },
  course: { title: string; code: string },
  certificate: {
    id: string;
    completionDate: string;
    grade: number;
  }
): Promise<EmailResult> {
  return sendEmail(
    { email: student.email, name: student.name },
    'certificateGenerated',
    {
      studentName: student.name,
      courseTitle: course.title,
      courseCode: course.code,
      certificateId: certificate.id,
      completionDate: certificate.completionDate,
      finalGrade: certificate.grade
    }
  );
}

export default {
  sendEmail,
  sendBulkEmails,
  sendWelcomeEmail,
  sendEnrollmentConfirmation,
  sendPasswordResetEmail,
  sendWalletRechargeConfirmation,
  sendCertificateNotification,
  renderTemplate,
  EMAIL_TEMPLATES,
  EMAIL_CONFIG
};
