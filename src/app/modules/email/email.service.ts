// ===================================================================
// Zayed Uddin - Email Service
// Professional email templates with branding
// ===================================================================

import nodemailer from 'nodemailer';
import config from '../../config';

// ===================================================================
// TRANSPORTER SETUP
// ===================================================================

const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

// ===================================================================
// BRAND CONSTANTS
// ===================================================================
const BRAND = {
    name: 'Zayed Uddin',
    tagline: 'Premium IT Solutions & Training',
    primaryColor: '#021E14',
    accentColor: '#D4AF37',
    gradientStart: '#021E14',
    gradientEnd: '#0a3d2a',
    logoUrl: 'https://i.ibb.co/zhQCxKt/zayed-logo.png', // Placeholder - replace with actual logo URL
};

// ===================================================================
// BASE TEMPLATE WITH PROFESSIONAL DESIGN
// ===================================================================

const getEmailWrapper = (content: string, preheader: string = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${BRAND.name}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif; background-color: #f0f2f5; -webkit-font-smoothing: antialiased; }
        a { text-decoration: none; }
        img { border: 0; display: block; }
    </style>
</head>
<body style="background-color: #f0f2f5; margin: 0; padding: 0;">
    <!-- Preheader text -->
    <div style="display: none; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #f0f2f5;">${preheader}</div>
    
    <!-- Email Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f0f2f5;">
        <tr>
            <td style="padding: 30px 15px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.08);">
                    
                    <!-- ===== HEADER WITH LOGO ===== -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${BRAND.gradientStart} 0%, ${BRAND.gradientEnd} 50%, ${BRAND.primaryColor} 100%); padding: 35px 40px; text-align: center;">
                            <!-- Gold accent line -->
                            <div style="width: 60px; height: 3px; background: ${BRAND.accentColor}; margin: 0 auto 20px; border-radius: 2px;"></div>
                            <h1 style="color: #ffffff; font-size: 26px; font-weight: 700; margin: 0; letter-spacing: 1px;">${BRAND.name}</h1>
                            <p style="color: ${BRAND.accentColor}; font-size: 12px; margin-top: 8px; letter-spacing: 2px; text-transform: uppercase; font-weight: 500;">${BRAND.tagline}</p>
                            <!-- Gold accent line -->
                            <div style="width: 60px; height: 3px; background: ${BRAND.accentColor}; margin: 20px auto 0; border-radius: 2px;"></div>
                        </td>
                    </tr>
                    
                    <!-- ===== CONTENT ===== -->
                    <tr>
                        <td style="padding: 40px 35px 30px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- ===== FOOTER ===== -->
                    <tr>
                        <td style="padding: 0 35px;">
                            <div style="border-top: 1px solid #e8e8e8;"></div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 25px 35px 30px; text-align: center;">
                            <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.6;">
                                © ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.
                            </p>
                            <p style="margin-top: 10px;">
                                <a href="${config.frontend_url}" style="color: ${BRAND.accentColor}; font-size: 12px; font-weight: 600; letter-spacing: 0.5px;">Visit Our Website →</a>
                            </p>
                            <p style="color: #bbb; font-size: 10px; margin-top: 12px;">
                                This email was sent from ${BRAND.name}. If you received this by mistake, please ignore it.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// ===================================================================
// EMAIL TEMPLATES
// ===================================================================

// ==================== WELCOME EMAIL ====================
const getWelcomeEmailTemplate = (firstName: string) => getEmailWrapper(`
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, ${BRAND.primaryColor}, ${BRAND.gradientEnd}); border-radius: 50%; margin: 0 auto 20px; line-height: 80px; text-align: center;">
            <span style="font-size: 36px;">🎉</span>
        </div>
        <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Welcome to ${BRAND.name}!</h2>
        <p style="color: #666; font-size: 15px;">We're excited to have you on board</p>
    </div>
    
    <p style="color: #333; font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
        Hi <strong>${firstName}</strong>,
    </p>
    
    <p style="color: #444; font-size: 15px; line-height: 1.7; margin-bottom: 25px;">
        Thank you for joining ${BRAND.name}! You now have access to our premium training programs, professional courses, and exclusive resources.
    </p>
    
    <div style="background: ${BRAND.primaryColor}; border-radius: 12px; padding: 25px; margin-bottom: 25px; color: #fff;">
        <h3 style="color: ${BRAND.accentColor}; font-size: 15px; margin-bottom: 15px; font-weight: 600;">✨ What Awaits You:</h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <tr><td style="padding: 6px 0; color: #e0e0e0; font-size: 14px;">📚 Professional IT Courses & Training</td></tr>
            <tr><td style="padding: 6px 0; color: #e0e0e0; font-size: 14px;">🎥 Live Classes & Batch Programs</td></tr>
            <tr><td style="padding: 6px 0; color: #e0e0e0; font-size: 14px;">🏆 Industry-Recognized Certificates</td></tr>
            <tr><td style="padding: 6px 0; color: #e0e0e0; font-size: 14px;">💬 24/7 Expert Support</td></tr>
        </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${config.frontend_url}/courses" style="display: inline-block; background: linear-gradient(135deg, ${BRAND.accentColor}, #b8941f); color: ${BRAND.primaryColor}; padding: 14px 45px; border-radius: 8px; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
            Explore Courses
        </a>
    </div>
`, 'Welcome to Zayed Uddin - Start your learning journey today!');

// ==================== EMAIL VERIFICATION ====================
const getVerificationEmailTemplate = (firstName: string, verificationLink: string) => getEmailWrapper(`
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; margin: 0 auto 20px; line-height: 80px; text-align: center;">
            <span style="font-size: 36px;">✉️</span>
        </div>
        <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Verify Your Email</h2>
        <p style="color: #666; font-size: 15px;">Almost there! Just one more step</p>
    </div>
    
    <p style="color: #333; font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
        Hi <strong>${firstName}</strong>,
    </p>
    
    <p style="color: #444; font-size: 15px; line-height: 1.7; margin-bottom: 25px;">
        Thanks for registering with ${BRAND.name}! Please verify your email address by clicking the button below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: #ffffff; padding: 14px 45px; border-radius: 8px; font-weight: 700; font-size: 15px;">
            ✅ Verify Email Address
        </a>
    </div>
    
    <div style="background: #eff6ff; border-radius: 10px; padding: 18px; margin: 25px 0; border-left: 4px solid #3b82f6;">
        <p style="color: #1e40af; font-size: 13px; margin: 0;">
            ⏰ This link will expire in <strong>24 hours</strong>. If you didn't create an account, please ignore this email.
        </p>
    </div>
    
    <p style="color: #999; font-size: 12px; margin-top: 20px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${verificationLink}" style="color: #3b82f6; word-break: break-all; font-size: 11px;">${verificationLink}</a>
    </p>
`, 'Please verify your email to activate your Zayed Uddin account');

// ==================== PASSWORD RESET ====================
const getPasswordResetEmailTemplate = (firstName: string, resetLink: string) => getEmailWrapper(`
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 50%; margin: 0 auto 20px; line-height: 80px; text-align: center;">
            <span style="font-size: 36px;">🔐</span>
        </div>
        <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Reset Your Password</h2>
        <p style="color: #666; font-size: 15px;">We received a password reset request</p>
    </div>
    
    <p style="color: #333; font-size: 16px; line-height: 1.7; margin-bottom: 20px;">
        Hi <strong>${firstName}</strong>,
    </p>
    
    <p style="color: #444; font-size: 15px; line-height: 1.7; margin-bottom: 25px;">
        We received a request to reset your password. Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff; padding: 14px 45px; border-radius: 8px; font-weight: 700; font-size: 15px;">
            🔑 Reset Password
        </a>
    </div>
    
    <div style="background: #fef3c7; border-radius: 10px; padding: 18px; margin: 25px 0; border-left: 4px solid #f59e0b;">
        <p style="color: #92400e; font-size: 13px; margin: 0;">
            ⏰ This link will expire in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.
        </p>
    </div>
    
    <p style="color: #999; font-size: 12px; margin-top: 20px;">
        If the button doesn't work, copy and paste this link:<br>
        <a href="${resetLink}" style="color: #f59e0b; word-break: break-all; font-size: 11px;">${resetLink}</a>
    </p>
`, 'Reset your Zayed Uddin account password');

// ==================== ORDER PENDING EMAIL ====================
interface OrderItem {
    title: string;
    price: number;
    productType?: string;
}

interface InvoiceData {
    firstName: string;
    email: string;
    orderId: string;
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: string;
    transactionId?: string;
    orderDate: Date;
    manualPaymentDetails?: {
        method?: string;
        senderNumber?: string;
        transactionId?: string;
        time?: string;
        date?: string;
    };
}

const getProductTypeLabel = (type?: string) => {
    switch (type) {
        case 'course': return '📚 Course';
        case 'website': return '🌐 Website Template';
        case 'design-template': return '🎨 Design Template';
        case 'software': return '💻 Software';
        default: return '📦 Product';
    }
};

const getOrderItemsHtml = (items: OrderItem[]) => items.map(item => `
    <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0;">
            <div style="font-weight: 600; color: #1a1a1a; font-size: 14px;">${item.title}</div>
            <div style="font-size: 11px; color: #888; margin-top: 3px;">${getProductTypeLabel(item.productType)}</div>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #f0f0f0; text-align: right; color: #1a1a1a; font-weight: 700; font-size: 15px;">
            ৳${item.price.toLocaleString()}
        </td>
    </tr>
`).join('');

const getOrderPendingEmailTemplate = (data: InvoiceData) => getEmailWrapper(`
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f59e0b, #ea580c); border-radius: 50%; margin: 0 auto 20px; line-height: 80px; text-align: center;">
            <span style="font-size: 36px;">⏳</span>
        </div>
        <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Order Received!</h2>
        <p style="color: #666; font-size: 15px;">Your order is pending confirmation</p>
    </div>
    
    <p style="color: #333; font-size: 16px; line-height: 1.7; margin-bottom: 15px;">
        Hi <strong>${data.firstName}</strong>,
    </p>
    
    <p style="color: #444; font-size: 15px; line-height: 1.7; margin-bottom: 25px;">
        We've received your order and it is currently <strong style="color: #ea580c;">pending confirmation</strong>. We'll notify you once your payment is verified.
    </p>
    
    <!-- Order Details Box -->
    <div style="background: #fafafa; border-radius: 12px; overflow: hidden; margin-bottom: 25px; border: 1px solid #e8e8e8;">
        <!-- Order Info Header -->
        <div style="background: ${BRAND.primaryColor}; padding: 16px 20px; display: flex;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px;">Order Number</div>
                        <div style="color: ${BRAND.accentColor}; font-weight: 700; font-size: 14px; margin-top: 3px;">#${data.orderId.slice(-8).toUpperCase()}</div>
                    </td>
                    <td style="text-align: center;">
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px;">Date</div>
                        <div style="color: #fff; font-weight: 600; font-size: 13px; margin-top: 3px;">${new Date(data.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    </td>
                    <td style="text-align: right;">
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px;">Status</div>
                        <div style="display: inline-block; background: #f59e0b; color: #000; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-top: 3px;">⏳ PENDING</div>
                    </td>
                </tr>
            </table>
        </div>
        
        <!-- Items Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <thead>
                <tr style="background: #f0f0f0;">
                    <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                    <th style="padding: 10px 16px; text-align: right; font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${getOrderItemsHtml(data.items)}
            </tbody>
            <tfoot>
                <tr>
                    <td style="padding: 16px; background: ${BRAND.primaryColor}; color: #fff; font-weight: 600; font-size: 15px; border-radius: 0 0 0 12px;">Total Amount</td>
                    <td style="padding: 16px; background: ${BRAND.primaryColor}; color: ${BRAND.accentColor}; font-weight: 800; font-size: 20px; text-align: right; border-radius: 0 0 12px 0;">৳${data.totalAmount.toLocaleString()}</td>
                </tr>
            </tfoot>
        </table>
    </div>
    
    ${data.manualPaymentDetails ? `
    <!-- Payment Details -->
    <div style="background: #fef3c7; border-radius: 10px; padding: 18px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
        <h4 style="color: #92400e; font-size: 13px; margin-bottom: 10px; font-weight: 700;">💳 Payment Information Submitted</h4>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr><td style="color: #a16207; font-size: 13px; padding: 3px 0;"><strong>Method:</strong> ${data.manualPaymentDetails.method || data.paymentMethod}</td></tr>
            ${data.manualPaymentDetails.senderNumber ? `<tr><td style="color: #a16207; font-size: 13px; padding: 3px 0;"><strong>Sender:</strong> ${data.manualPaymentDetails.senderNumber}</td></tr>` : ''}
            ${data.manualPaymentDetails.transactionId ? `<tr><td style="color: #a16207; font-size: 13px; padding: 3px 0;"><strong>Transaction ID:</strong> ${data.manualPaymentDetails.transactionId}</td></tr>` : ''}
            ${data.manualPaymentDetails.date ? `<tr><td style="color: #a16207; font-size: 13px; padding: 3px 0;"><strong>Date:</strong> ${data.manualPaymentDetails.date} ${data.manualPaymentDetails.time || ''}</td></tr>` : ''}
        </table>
    </div>
    ` : ''}
    
    <div style="background: #f8fafc; border-radius: 10px; padding: 18px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
        <p style="color: #475569; font-size: 13px; margin: 0; line-height: 1.6;">
            💡 <strong>What happens next?</strong> Our team will verify your payment and activate your order. You'll receive a confirmation email once completed.
        </p>
    </div>
`, 'Your order is pending confirmation - Zayed Uddin');

// ==================== ORDER COMPLETED / INVOICE EMAIL ====================
const getInvoiceEmailTemplate = (data: InvoiceData) => getEmailWrapper(`
    <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 20px; line-height: 80px; text-align: center;">
            <span style="font-size: 36px;">✅</span>
        </div>
        <h2 style="color: #1a1a1a; font-size: 24px; font-weight: 700; margin-bottom: 8px;">Payment Confirmed!</h2>
        <p style="color: #666; font-size: 15px;">Thank you for your purchase</p>
    </div>
    
    <p style="color: #333; font-size: 16px; line-height: 1.7; margin-bottom: 15px;">
        Hi <strong>${data.firstName}</strong>,
    </p>
    
    <p style="color: #444; font-size: 15px; line-height: 1.7; margin-bottom: 25px;">
        Your payment has been <strong style="color: #059669;">confirmed successfully</strong>! Here's your invoice:
    </p>
    
    <!-- Invoice Box -->
    <div style="background: #fafafa; border-radius: 12px; overflow: hidden; margin-bottom: 25px; border: 1px solid #e8e8e8;">
        <!-- Order Info Header -->
        <div style="background: ${BRAND.primaryColor}; padding: 16px 20px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                    <td>
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px;">Invoice Number</div>
                        <div style="color: ${BRAND.accentColor}; font-weight: 700; font-size: 14px; margin-top: 3px;">#${data.orderId.slice(-8).toUpperCase()}</div>
                    </td>
                    <td style="text-align: center;">
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px;">Date</div>
                        <div style="color: #fff; font-weight: 600; font-size: 13px; margin-top: 3px;">${new Date(data.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                    </td>
                    <td style="text-align: right;">
                        <div style="color: rgba(255,255,255,0.6); font-size: 11px;">Status</div>
                        <div style="display: inline-block; background: #10b981; color: #fff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-top: 3px;">✅ PAID</div>
                    </td>
                </tr>
            </table>
        </div>
        
        <!-- Items Table -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
            <thead>
                <tr style="background: #f0f0f0;">
                    <th style="padding: 10px 16px; text-align: left; font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Item</th>
                    <th style="padding: 10px 16px; text-align: right; font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${getOrderItemsHtml(data.items)}
            </tbody>
            <tfoot>
                <tr>
                    <td style="padding: 16px; background: ${BRAND.primaryColor}; color: #fff; font-weight: 600; font-size: 15px;">Total Paid</td>
                    <td style="padding: 16px; background: ${BRAND.primaryColor}; color: ${BRAND.accentColor}; font-weight: 800; font-size: 20px; text-align: right;">৳${data.totalAmount.toLocaleString()}</td>
                </tr>
            </tfoot>
        </table>
    </div>
    
    <!-- Payment Details -->
    <div style="background: #f0fdf4; border-radius: 10px; padding: 18px; margin-bottom: 25px; border-left: 4px solid #10b981;">
        <h4 style="color: #166534; font-size: 13px; margin-bottom: 10px; font-weight: 700;">💳 Payment Details</h4>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
            <tr><td style="color: #15803d; font-size: 13px; padding: 3px 0;"><strong>Method:</strong> ${data.paymentMethod}</td></tr>
            ${data.transactionId ? `<tr><td style="color: #15803d; font-size: 13px; padding: 3px 0;"><strong>Transaction ID:</strong> ${data.transactionId}</td></tr>` : ''}
        </table>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="${config.frontend_url}/dashboard/user" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: #ffffff; padding: 14px 45px; border-radius: 8px; font-weight: 700; font-size: 15px;">
            📥 Go to Dashboard
        </a>
    </div>
`, 'Payment confirmed - Your Zayed Uddin invoice');

// ===================================================================
// EMAIL SERVICE
// ===================================================================

const EmailService = {
    // Send welcome email
    async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: `"${BRAND.name}" <${config.email.from}>`,
                to: email,
                subject: `🎉 Welcome to ${BRAND.name} - Your Learning Journey Begins!`,
                html: getWelcomeEmailTemplate(firstName),
            });
            console.log(`✅ Welcome email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
            return false;
        }
    },

    // Send email verification
    async sendEmailVerificationEmail(email: string, firstName: string, verificationToken: string): Promise<boolean> {
        try {
            const verificationLink = `${config.frontend_url}/verify-email?token=${verificationToken}`;
            await transporter.sendMail({
                from: `"${BRAND.name}" <${config.email.from}>`,
                to: email,
                subject: `✉️ Verify Your Email - ${BRAND.name}`,
                html: getVerificationEmailTemplate(firstName, verificationLink),
            });
            console.log(`✅ Email verification sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send email verification:', error);
            return false;
        }
    },

    // Send password reset email
    async sendPasswordResetEmail(email: string, firstName: string, resetToken: string): Promise<boolean> {
        try {
            const resetLink = `${config.frontend_url}/reset-password?token=${resetToken}`;
            await transporter.sendMail({
                from: `"${BRAND.name}" <${config.email.from}>`,
                to: email,
                subject: `🔐 Reset Your Password - ${BRAND.name}`,
                html: getPasswordResetEmailTemplate(firstName, resetLink),
            });
            console.log(`✅ Password reset email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send password reset email:', error);
            return false;
        }
    },

    // Send order pending email
    async sendOrderPendingEmail(email: string, invoiceData: InvoiceData): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: `"${BRAND.name}" <${config.email.from}>`,
                to: email,
                subject: `⏳ Order Received #${invoiceData.orderId.slice(-8).toUpperCase()} - ${BRAND.name}`,
                html: getOrderPendingEmailTemplate(invoiceData),
            });
            console.log(`✅ Order pending email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send order pending email:', error);
            return false;
        }
    },

    // Send purchase invoice/completed email
    async sendInvoiceEmail(email: string, invoiceData: InvoiceData): Promise<boolean> {
        try {
            await transporter.sendMail({
                from: `"${BRAND.name}" <${config.email.from}>`,
                to: email,
                subject: `✅ Payment Confirmed - Invoice #${invoiceData.orderId.slice(-8).toUpperCase()} - ${BRAND.name}`,
                html: getInvoiceEmailTemplate(invoiceData),
            });
            console.log(`✅ Invoice email sent to ${email}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send invoice email:', error);
            return false;
        }
    },

    // Verify email connection
    async verifyConnection(): Promise<boolean> {
        try {
            await transporter.verify();
            console.log('✅ Email service connected successfully');
            return true;
        } catch (error) {
            console.error('❌ Email service connection failed:', error);
            return false;
        }
    },
};

export default EmailService;
export { InvoiceData, OrderItem };
