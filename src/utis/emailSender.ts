// mail.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GOOGLE_AUTH_EMAIL,
    pass: process.env.GOOGLE_AUTH_APP_PASSWORD,
  },
});

interface MailResult {
  status: number;
  message: string;
}

export const Mail_Sender = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<MailResult> => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SENDER_NAME} <${process.env.GOOGLE_AUTH_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return { status: 1, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('Error sending email:', error.message);
    return { status: 0, message: error.message };
  }
};
