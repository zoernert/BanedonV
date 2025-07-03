import nodemailer from 'nodemailer';
import { config } from '@banedonv/shared/src/config';

export class LocalMailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
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
