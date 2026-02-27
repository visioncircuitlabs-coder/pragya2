import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private transporter: nodemailer.Transporter | null = null;

    constructor(private configService: ConfigService) {
        const smtpHost = this.configService.get('SMTP_HOST');
        const smtpUser = this.configService.get('SMTP_USER');
        const smtpPass = this.configService.get('SMTP_PASS');

        // Only create transporter if SMTP is configured
        if (smtpHost && smtpUser && smtpPass) {
            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: this.configService.get('SMTP_PORT') || 587,
                secure: false,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
        } else {
            this.logger.warn('SMTP not configured. Emails will be logged to console.');
        }
    }

    async sendVerificationEmail(email: string, token: string): Promise<void> {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

        const mailOptions = {
            from: this.configService.get('EMAIL_FROM') || 'noreply@pragya.in',
            to: email,
            subject: 'Verify your Pragya account',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #014b3b;">Welcome to Pragya!</h1>
          <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; background-color: #014b3b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #666;">Or copy and paste this link: <br/>${verificationUrl}</p>
          <p style="color: #666; font-size: 12px;">This link expires in 24 hours.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;"/>
          <p style="color: #999; font-size: 12px;">Pragya - India's Pioneer Youth-Developed Career Ecosystem</p>
        </div>
      `,
        };

        if (this.transporter) {
            try {
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`Verification email sent to ${email}`);
            } catch (error) {
                this.logger.error(`Failed to send email to ${email}:`, error);
                throw error;
            }
        } else {
            // Log email to console for development
            this.logger.log(`
        ========== EMAIL (Dev Mode) ==========
        To: ${email}
        Subject: ${mailOptions.subject}
        Verification URL: ${verificationUrl}
        ======================================
      `);
        }
    }

    async sendOtpEmail(email: string, otp: string): Promise<void> {
        const mailOptions = {
            from: this.configService.get('EMAIL_FROM') || 'noreply@pragya.in',
            to: email,
            subject: 'Your Pragya verification code',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #014b3b;">Verify your email</h1>
          <p>Use the following 6-digit code to verify your Pragya account:</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #014b3b; background: #f0fdf4; padding: 16px 32px; border-radius: 12px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="color: #666;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #666;">If you didn't create a Pragya account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;"/>
          <p style="color: #999; font-size: 12px;">Pragya - India's Pioneer Youth-Developed Career Ecosystem</p>
        </div>
      `,
        };

        if (this.transporter) {
            try {
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`OTP email sent to ${email}`);
            } catch (error) {
                this.logger.error(`Failed to send OTP email to ${email}:`, error);
                throw error;
            }
        } else {
            // Log OTP to console for development
            this.logger.log(`
        ========== OTP EMAIL ==========
        To: ${email}
        Subject: ${mailOptions.subject}
        OTP Code: ${otp}
        ===============================
      `);
        }
    }

    async sendPasswordResetEmail(email: string, token: string): Promise<void> {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3001';
        const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

        const mailOptions = {
            from: this.configService.get('EMAIL_FROM') || 'noreply@pragya.in',
            to: email,
            subject: 'Reset your Pragya password',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #014b3b;">Reset Your Password</h1>
          <p>You requested a password reset. Click the button below to set a new password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: #014b3b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">
            Reset Password
          </a>
          <p style="color: #666;">Or copy and paste this link: <br/>${resetUrl}</p>
          <p style="color: #666; font-size: 12px;">This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
        };

        if (this.transporter) {
            try {
                await this.transporter.sendMail(mailOptions);
                this.logger.log(`Password reset email sent to ${email}`);
            } catch (error) {
                this.logger.error(`Failed to send password reset email to ${email}:`, error);
                throw error;
            }
        } else {
            this.logger.log(`
        ========== EMAIL (Dev Mode) ==========
        To: ${email}
        Subject: ${mailOptions.subject}
        Reset URL: ${resetUrl}
        ======================================
      `);
        }
    }
}
