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

  async sendEmailVerification(
    email: string,
    token: string,
    username: string
  ): Promise<void> {
    const domain =
      this.configService.get("APP_DOMAIN") ||
      this.configService.get("FRONTEND_URL");
    this.logger.log(`Using domain for email verification: ${domain}`);
    const verificationUrl = `${domain}/verify-email?token=${token}`;

    const emailContent = `
      <h2>Xác thực Email</h2>
      <p>Xin chào ${username},</p>
      <p>Cảm ơn bạn đã đăng ký tài khoản tại Edu Review Hub. Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
      <a href="${verificationUrl}">Xác thực Email</a>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br>Edu Review Hub Team</p>
    `;

    // Gửi email thật
    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Xác thực Email - Edu Review Hub",
      html: emailContent,
    });

    this.logger.log(`Email verification sent to ${email} for user ${username}`);
    this.logger.log(`Verification URL: ${verificationUrl}`);
    this.logger.log(`Email content: ${emailContent}`);
  }

  async sendPasswordReset(
    email: string,
    token: string,
    username: string
  ): Promise<void> {
    const resetUrl = `${this.configService.get(
      "FRONTEND_URL"
    )}/reset-password?token=${token}`;

    this.logger.log(
      `Password reset email sent to ${email} for user ${username}`
    );
    this.logger.log(`Reset URL: ${resetUrl}`);

    const emailContent = `
      <h2>Đặt lại Mật khẩu</h2>
      <p>Xin chào ${username},</p>
      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${resetUrl}">Đặt lại Mật khẩu</a>
      <p>Link này sẽ hết hạn sau 1 giờ.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br>Edu Review Hub Team</p>
    `;

    this.logger.log(`Email content: ${emailContent}`);
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    this.logger.log(`Welcome email sent to ${email} for user ${username}`);

    const emailContent = `
      <h2>Chào mừng đến với Edu Review Hub!</h2>
      <p>Xin chào ${username},</p>
      <p>Chào mừng bạn đến với cộng đồng Edu Review Hub! Tài khoản của bạn đã được tạo thành công.</p>
      <p>Bạn có thể bắt đầu:</p>
      <ul>
        <li>Đọc và viết đánh giá về các trường đại học</li>
        <li>Chia sẻ trải nghiệm học tập</li>
        <li>Tham gia thảo luận với cộng đồng</li>
        <li>Nhận gợi ý trường đại học phù hợp</li>
      </ul>
      <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi.</p>
      <p>Trân trọng,<br>Edu Review Hub Team</p>
    `;

    this.logger.log(`Email content: ${emailContent}`);
  }

  async sendEmailChangeConfirmation(
    email: string,
    token: string,
    username: string
  ): Promise<void> {
    const confirmationUrl = `${this.configService.get(
      "FRONTEND_URL"
    )}/confirm-email-change?token=${token}`;

    this.logger.log(
      `Email change confirmation sent to ${email} for user ${username}`
    );
    this.logger.log(`Confirmation URL: ${confirmationUrl}`);

    const emailContent = `
      <h2>Xác nhận Thay đổi Email</h2>
      <p>Xin chào ${username},</p>
      <p>Chúng tôi nhận được yêu cầu thay đổi email cho tài khoản của bạn. Click vào link bên dưới để xác nhận:</p>
      <a href="${confirmationUrl}">Xác nhận Thay đổi Email</a>
      <p>Link này sẽ hết hạn sau 24 giờ.</p>
      <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
      <p>Trân trọng,<br>Edu Review Hub Team</p>
    `;

    await this.transporter.sendMail({
      from: `"Edu Review Hub" <${this.configService.get("SMTP_USER")}>`,
      to: email,
      subject: "Xác nhận Thay đổi Email - Edu Review Hub",
      html: emailContent,
    });

    this.logger.log(`Email content: ${emailContent}`);
  }

  async sendAccountDeactivated(
    email: string,
    username: string,
    reason?: string
  ): Promise<void> {
    this.logger.log(
      `Account deactivation email sent to ${email} for user ${username}`
    );
    const emailContent = `
      <h2>Tài khoản của bạn đã bị vô hiệu hóa</h2>
      <p>Xin chào ${username},</p>
      <p>Tài khoản của bạn đã được vô hiệu hóa theo yêu cầu.</p>
      ${reason ? `<p>Lý do: ${reason}</p>` : ""}
      <p>Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
      <p>Bạn có thể đăng nhập lại để kích hoạt lại tài khoản bất cứ lúc nào.</p>
      <p>Trân trọng,<br>Edu Review Hub Team</p>
    `;
    this.logger.log(`Email content: ${emailContent}`);
  }

  async sendAccountDeleted(
    email: string,
    username: string,
    reason?: string
  ): Promise<void> {
    this.logger.log(
      `Account deletion email sent to ${email} for user ${username}`
    );
    const emailContent = `
      <h2>Tài khoản của bạn đã bị xóa</h2>
      <p>Xin chào ${username},</p>
      <p>Tài khoản của bạn đã được xóa khỏi hệ thống.</p>
      ${reason ? `<p>Lý do: ${reason}</p>` : ""}
      <p>Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
      <p>Mọi dữ liệu liên quan đến tài khoản sẽ bị xóa vĩnh viễn (nếu bạn đã xác nhận xóa vĩnh viễn).</p>
      <p>Trân trọng,<br>Edu Review Hub Team</p>
    `;
    this.logger.log(`Email content: ${emailContent}`);
  }
}
