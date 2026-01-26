import nodemailer from "nodemailer";
import { env } from "../config/env.config";
import { logger } from "../utils/logger";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    text?: string
  ): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
      });
      logger.info(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw new Error("Failed to send email");
    }
  }

  async sendOrderConfirmation(
    email: string,
    orderId: number,
    trackingNumber: string,
    totalAmount: number
  ): Promise<void> {
    const html = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
      <p>We'll keep you updated on your order status.</p>
    `;

    await this.sendEmail(
      email,
      `Order Confirmation - #${orderId}`,
      html
    );
  }

  async sendOrderStatusUpdate(
    email: string,
    orderId: number,
    status: string,
    trackingNumber?: string
  ): Promise<void> {
    const html = `
      <h2>Order Status Update</h2>
      <p>Your order status has been updated.</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Status:</strong> ${status}</p>
      ${trackingNumber ? `<p><strong>Tracking:</strong> ${trackingNumber}</p>` : ""}
    `;

    await this.sendEmail(
      email,
      `Order #${orderId} - ${status}`,
      html
    );
  }
}

export default new EmailService();