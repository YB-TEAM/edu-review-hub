import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IEmailService } from "@/application/services/email.service.interface";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: Number(this.configService.get("SMTP_PORT")),
      secure: false, // true nếu dùng port 465, false cho 587
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASS"),
      },
    });
  }

  getEmailLayout(content: string, title: string): string {
    return `
      <div style="background:#f7f7f7;padding:24px 0;min-height:100vh;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.07);overflow:hidden;font-family:'Segoe UI',Arial,sans-serif;">
          <tr>
            <td style="background:linear-gradient(90deg,#ffb347 0%,#ffcc33 100%);padding:24px 0;text-align:center;">
              <span style="font-size:2rem;font-weight:700;letter-spacing:1px;color:#fff;">Edu Review Hub</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px 16px 24px;">
              <h2 style="margin:0 0 12px 0;font-size:1.3rem;color:#ff9800;font-weight:600;">${title}</h2>
              <div style="font-size:1rem;color:#333;line-height:1.7;">${content}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 32px 24px;color:#888;font-size:0.95rem;text-align:center;">
              <div style="margin-top:24px;">Trân trọng,<br><b>Edu Review Hub Team</b></div>
              <div style="margin-top:12px;font-size:0.85rem;">© ${new Date().getFullYear()} Edu Review Hub</div>
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  async sendEmailVerification(
    email: string,
    otp: string,
    username: string
  ): Promise<void> {
    const content = `
      <p>Xin chào <b>${username}</b>,</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại Edu Review Hub. Mã xác thực email của bạn là:</p>
      <div style="margin:24px 0;text-align:center;"><span style="display:inline-block;font-size:2rem;font-weight:700;color:#ff9800;background:#fff3cd;padding:12px 32px;border-radius:8px;letter-spacing:2px;">${otp}</span></div>
      <p>Mã này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    `;
    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Xác thực Email - Edu Review Hub",
      html: this.getEmailLayout(content, "Xác thực Email"),
    });
    this.logger.log(`Email verification OTP sent to ${email} for user ${username}`);
    this.logger.log(`OTP: ${otp}`);
    this.logger.log(`Email content: ${content}`);
  }

  async sendPasswordReset(
    email: string,
    otp: string,
    username: string
  ): Promise<void> {
    const content = `
      <p>Xin chào <b>${username}</b>,</p>
      <p>Mã đặt lại mật khẩu của bạn là:</p>
      <div style="margin:24px 0;text-align:center;"><span style="display:inline-block;font-size:2rem;font-weight:700;color:#ff9800;background:#fff3cd;padding:12px 32px;border-radius:8px;letter-spacing:2px;">${otp}</span></div>
      <p>Mã này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    `;
    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Đặt lại Mật khẩu - Edu Review Hub",
      html: this.getEmailLayout(content, "Đặt lại Mật khẩu"),
    });
    this.logger.log(`Password reset OTP sent to ${email} for user ${username}`);
    this.logger.log(`OTP: ${otp}`);
    this.logger.log(`Email content: ${content}`);
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    const content = `
      <p>Xin chào <b>${username}</b>,</p>
      <p>Chào mừng bạn đến với cộng đồng <b>Edu Review Hub</b>! Tài khoản của bạn đã được tạo thành công.</p>
      <ul style="margin:16px 0 0 16px;padding:0 0 0 16px;color:#ff9800;">
        <li>Đọc và viết đánh giá về các trường đại học</li>
        <li>Chia sẻ trải nghiệm học tập</li>
        <li>Tham gia thảo luận với cộng đồng</li>
        <li>Nhận gợi ý trường đại học phù hợp</li>
      </ul>
      <p style="margin-top:16px;">Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
    `;
    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Chào mừng đến với Edu Review Hub!",
      html: this.getEmailLayout(content, "Chào mừng!"),
    });
    this.logger.log(`Email content: ${content}`);
  }

  async sendEmailChangeConfirmation(
    email: string,
    otp: string,
    username: string
  ): Promise<void> {
    const content = `
      <p>Xin chào <b>${username}</b>,</p>
      <p>Mã xác nhận thay đổi email của bạn là:</p>
      <div style="margin:24px 0;text-align:center;"><span style="display:inline-block;font-size:2rem;font-weight:700;color:#ff9800;background:#fff3cd;padding:12px 32px;border-radius:8px;letter-spacing:2px;">${otp}</span></div>
      <p>Mã này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    `;
    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Xác nhận Thay đổi Email - Edu Review Hub",
      html: this.getEmailLayout(content, "Xác nhận Thay đổi Email"),
    });
    this.logger.log(`Email change confirmation OTP sent to ${email} for user ${username}`);
    this.logger.log(`OTP: ${otp}`);
    this.logger.log(`Email content: ${content}`);
  }

  async sendAccountDeactivated(
    email: string,
    username: string,
    reason?: string
  ): Promise<void> {
    const content = `
      <p>Xin chào <b>${username}</b>,</p>
      <p>Tài khoản của bạn đã được vô hiệu hóa theo yêu cầu.</p>
      ${reason ? `<p><b>Lý do:</b> <span style='color:#ff9800;'>${reason}</span></p>` : ""}
      <p>Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
      <p>Bạn có thể đăng nhập lại để kích hoạt lại tài khoản bất cứ lúc nào.</p>
    `;
    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Tài khoản bị vô hiệu hóa - Edu Review Hub",
      html: this.getEmailLayout(content, "Tài khoản bị vô hiệu hóa"),
    });
    this.logger.log(`Email content: ${content}`);
  }

  async sendAccountDeleted(
    email: string,
    username: string,
    reason?: string
  ): Promise<void> {
    const content = `
      <p>Xin chào <b>${username}</b>,</p>
      <p>Tài khoản của bạn đã được xóa khỏi hệ thống.</p>
      ${reason ? `<p><b>Lý do:</b> <span style='color:#ff9800;'>${reason}</span></p>` : ""}
      <p>Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
      <p>Mọi dữ liệu liên quan đến tài khoản sẽ bị xóa vĩnh viễn (nếu bạn đã xác nhận xóa vĩnh viễn).</p>
    `;
    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Tài khoản đã bị xóa - Edu Review Hub",
      html: this.getEmailLayout(content, "Tài khoản đã bị xóa"),
    });
    this.logger.log(`Email content: ${content}`);
  }
}
