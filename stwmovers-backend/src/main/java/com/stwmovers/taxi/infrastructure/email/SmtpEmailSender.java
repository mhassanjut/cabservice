package com.stwmovers.taxi.infrastructure.email;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.EmailAttachment;
import com.stwmovers.taxi.application.port.EmailInlineImage;
import com.stwmovers.taxi.application.port.EmailSender;

import jakarta.mail.internet.MimeMessage;

@Component
public class SmtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;
    private final String fromAddress;

    public SmtpEmailSender(
            JavaMailSender mailSender,
            @Value("${spring.mail.username:}") String mailUsername,
            @Value("${MAIL_FROM:}") String mailFrom) {
        this.mailSender = mailSender;
        this.fromAddress = mailFrom.isBlank() ? mailUsername : mailFrom;
    }

    @Override
    public void send(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (!fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    @Override
    public void sendHtml(
            String to,
            String subject,
            String htmlBody,
            String textBody,
            List<EmailAttachment> attachments,
            List<EmailInlineImage> inlineImages) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            // Multipart is required for plain+HTML alternatives, and for inline/attached content.
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            if (!fromAddress.isBlank()) {
                helper.setFrom(fromAddress);
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(textBody, htmlBody);
            if (inlineImages != null) {
                for (EmailInlineImage inlineImage : inlineImages) {
                    helper.addInline(
                            inlineImage.contentId(),
                            new ByteArrayResource(inlineImage.content()),
                            inlineImage.contentType());
                }
            }
            if (attachments != null) {
                for (EmailAttachment attachment : attachments) {
                    helper.addAttachment(
                            attachment.filename(),
                            new ByteArrayResource(attachment.content()),
                            attachment.contentType());
                }
            }
            mailSender.send(message);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send email to " + to, e);
        }
    }
}
