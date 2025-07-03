import nodemailer from 'nodemailer';
import { config } from '../../../libs/shared/src/config';

export class LocalMailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: false,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    return this.transporter.sendMail({
      from: '"BanedonV" <no-reply@banedonv.com>',
      to,
      subject,
      html,
    });
  }
}
