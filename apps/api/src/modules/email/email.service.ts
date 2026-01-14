import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from '../../prisma/prisma.service';

interface ProductInfo {
  name: string;
  slug: string;
  fileUrl?: string | null;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private fromEmail: string;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Resend email service initialized');
    } else {
      this.logger.warn('RESEND_API_KEY not configured - emails will be logged only');
    }
    this.fromEmail = this.config.get<string>('EMAIL_FROM') || 'hello@twentyone.com';
  }

  async sendProductDelivery(email: string, product: ProductInfo) {
    const subject = `Your ${product.name} is ready!`;

    const html = this.getProductDeliveryHtml(product);

    if (!this.resend) {
      this.logger.log(`[DEV MODE] Would send email to ${email}: ${subject}`);
      await this.logEmail(email, subject, `purchase-${product.slug}`, null, 'dev');
      return { success: true, dev: true };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: `21|Twenty One <${this.fromEmail}>`,
        to: email,
        subject,
        html,
      });

      if (error) {
        this.logger.error(`Failed to send email to ${email}:`, error);
        await this.logEmail(email, subject, `purchase-${product.slug}`, null, 'failed');
        return { success: false, error };
      }

      await this.logEmail(email, subject, `purchase-${product.slug}`, data?.id, 'sent');
      this.logger.log(`Email sent to ${email}: ${subject}`);
      return { success: true, id: data?.id };
    } catch (error) {
      this.logger.error(`Error sending email to ${email}:`, error);
      await this.logEmail(email, subject, `purchase-${product.slug}`, null, 'failed');
      return { success: false, error };
    }
  }

  private getProductDeliveryHtml(product: ProductInfo): string {
    const downloadLink = product.fileUrl || '#';

    if (product.slug === '21-day-protocol') {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h1 style="color: #1e293b; font-size: 28px; margin: 0 0 20px;">Welcome to Your 21-Day Journey</h1>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Thank you for your purchase! Your 21-Day Attachment Healing Protocol is ready to begin.
              </p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                This transformative program will guide you through daily exercises, reflections, and healing practices designed to help you develop a more secure attachment style.
              </p>
              <a href="${downloadLink}" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Access Your Protocol
              </a>
              <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
                If you have any questions, simply reply to this email. We're here to support your healing journey.
              </p>
            </div>
          </div>
        </body>
        </html>
      `;
    }

    // Premium PDF or Free PDF template
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <h1 style="color: #1e293b; font-size: 28px; margin: 0 0 20px;">Your ${product.name} is Ready!</h1>
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
              Thank you for your interest in attachment healing. Your guide is ready to download.
            </p>
            <a href="${downloadLink}" style="display: inline-block; background: #3b82f6; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Download Your PDF
            </a>
            <p style="color: #94a3b8; font-size: 14px; margin-top: 30px;">
              Ready for deeper transformation? Check out our full 21-Day Protocol for a complete healing experience.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private async logEmail(
    to: string,
    subject: string,
    template: string,
    resendId: string | null | undefined,
    status: string,
  ) {
    await this.prisma.emailLog.create({
      data: {
        to,
        subject,
        template,
        resendId: resendId || null,
        status,
      },
    });
  }
}
