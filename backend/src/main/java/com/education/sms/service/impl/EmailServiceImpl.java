package com.education.sms.service.impl;

import com.education.sms.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@sms.edu.in}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    @Async
    public void sendCredentialsEmail(String to, String systemEmail, String tempPassword, String role,
            String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Welcome to SMS Portal - Your Login Credentials");

            String htmlContent = buildCredentialsEmailHtml(firstName, systemEmail, tempPassword, role);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Credentials email sent successfully to: {}", to);

        } catch (MessagingException e) {
            log.error("Failed to send credentials email to {}: {}", to, e.getMessage());
            // Fallback to simple text email
            sendSimpleCredentialsEmail(to, systemEmail, tempPassword, role, firstName);
        }
    }

    private void sendSimpleCredentialsEmail(String to, String systemEmail, String tempPassword, String role,
            String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Welcome to SMS Portal - Your Login Credentials");
            message.setText(String.format("""
                    Hello %s,

                    Welcome to the School Management System!

                    Your account has been created with the following credentials:

                    Role: %s
                    Login Email: %s
                    Temporary Password: %s

                    Login URL: %s/login

                    IMPORTANT: You must change your password upon first login.

                    If you did not request this account, please contact the administrator immediately.

                    Best regards,
                    SMS Administration Team
                    """, firstName, role, systemEmail, tempPassword, frontendUrl));

            mailSender.send(message);
            log.info("Simple credentials email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send simple credentials email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send credentials email", e);
        }
    }

    @Override
    @Async
    public void sendPasswordResetEmail(String to, String resetToken, String firstName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("SMS Portal - Password Reset Request");

            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
            String htmlContent = buildPasswordResetEmailHtml(firstName, resetLink);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email sent successfully to: {}", to);

        } catch (MessagingException e) {
            log.error("Failed to send password reset email to {}: {}", to, e.getMessage());
            // Fallback to simple text email
            sendSimplePasswordResetEmail(to, resetToken, firstName);
        }
    }

    private void sendSimplePasswordResetEmail(String to, String resetToken, String firstName) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("SMS Portal - Password Reset Request");
            message.setText(String.format("""
                    Hello %s,

                    We received a request to reset your password for your SMS Portal account.

                    Click the link below to reset your password:
                    %s

                    This link will expire in 30 minutes.

                    If you did not request a password reset, please ignore this email or contact the administrator.

                    Best regards,
                    SMS Administration Team
                    """, firstName, resetLink));

            mailSender.send(message);
            log.info("Simple password reset email sent successfully to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send simple password reset email to {}: {}", to, e.getMessage());
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Override
    @Async
    public void sendPasswordChangedNotification(String to, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("SMS Portal - Password Changed Successfully");
            message.setText(String.format("""
                    Hello %s,

                    Your password for SMS Portal has been changed successfully.

                    If you did not make this change, please contact the administrator immediately.

                    Best regards,
                    SMS Administration Team
                    """, firstName));

            mailSender.send(message);
            log.info("Password changed notification sent to: {}", to);

        } catch (Exception e) {
            log.error("Failed to send password changed notification to {}: {}", to, e.getMessage());
        }
    }

    private String buildCredentialsEmailHtml(String firstName, String systemEmail, String tempPassword, String role) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .credentials { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                                .credentials p { margin: 10px 0; }
                                .label { font-weight: bold; color: #555; }
                                .value { font-family: monospace; background: #eee; padding: 5px 10px; border-radius: 4px; }
                                .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
                                .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>🎓 Welcome to SMS Portal</h1>
                                    <p>School Management System</p>
                                </div>
                                <div class="content">
                                    <h2>Hello %s,</h2>
                                    <p>Your account has been successfully created! Here are your login credentials:</p>

                                    <div class="credentials">
                                        <p><span class="label">Role:</span> <span class="value">%s</span></p>
                                        <p><span class="label">Login Email:</span> <span class="value">%s</span></p>
                                        <p><span class="label">Temporary Password:</span> <span class="value">%s</span></p>
                                    </div>

                                    <div class="warning">
                                        ⚠️ <strong>Important:</strong> You must change your password upon first login for security purposes.
                                    </div>

                                    <center>
                                        <a href="%s/login" class="btn">Login to SMS Portal</a>
                                    </center>

                                    <p style="margin-top: 30px;">If you did not request this account, please contact the administrator immediately.</p>
                                </div>
                                <div class="footer">
                                    <p>© 2026 SMS Portal - School Management System</p>
                                    <p>This is an automated message. Please do not reply.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                firstName, role, systemEmail, tempPassword, frontendUrl);
    }

    private String buildPasswordResetEmailHtml(String firstName, String resetLink) {
        return String.format(
                """
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <style>
                                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                                .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                                .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                                .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
                                .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
                                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <div class="header">
                                    <h1>🔐 Password Reset</h1>
                                    <p>SMS Portal - School Management System</p>
                                </div>
                                <div class="content">
                                    <h2>Hello %s,</h2>
                                    <p>We received a request to reset your password for your SMS Portal account.</p>

                                    <center>
                                        <a href="%s" class="btn">Reset My Password</a>
                                    </center>

                                    <div class="warning">
                                        ⏰ <strong>Note:</strong> This link will expire in 30 minutes.
                                    </div>

                                    <p>If you did not request a password reset, please ignore this email or contact the administrator if you believe your account has been compromised.</p>
                                </div>
                                <div class="footer">
                                    <p>© 2026 SMS Portal - School Management System</p>
                                    <p>This is an automated message. Please do not reply.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                        """,
                firstName, resetLink);
    }
}
