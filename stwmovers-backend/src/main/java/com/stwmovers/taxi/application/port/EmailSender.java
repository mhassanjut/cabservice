package com.stwmovers.taxi.application.port;

import java.util.List;

public interface EmailSender {

    void send(String to, String subject, String body);

    void sendHtml(
            String to,
            String subject,
            String htmlBody,
            String textBody,
            List<EmailAttachment> attachments,
            List<EmailInlineImage> inlineImages);
}
