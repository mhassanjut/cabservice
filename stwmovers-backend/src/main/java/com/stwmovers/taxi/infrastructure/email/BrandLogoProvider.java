package com.stwmovers.taxi.infrastructure.email;

import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

import org.springframework.stereotype.Component;

import com.stwmovers.taxi.application.port.EmailInlineImage;

@Component
public class BrandLogoProvider {

    public static final String EMAIL_CONTENT_ID = "brand-logo";
    private static final String LOGO_RESOURCE = "brand/logo-white.png";

    private final byte[] logoBytes;
    private final String dataUri;

    public BrandLogoProvider() {
        try (InputStream input = getClass().getClassLoader().getResourceAsStream(LOGO_RESOURCE)) {
            if (input == null) {
                throw new IllegalStateException("Missing brand logo resource: " + LOGO_RESOURCE);
            }
            logoBytes = input.readAllBytes();
            dataUri = "data:image/png;base64," + Base64.getEncoder().encodeToString(logoBytes);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load brand logo resource", e);
        }
    }

    public byte[] logoBytes() {
        return logoBytes;
    }

    public String dataUri() {
        return dataUri;
    }

    public String emailCidReference() {
        return "cid:" + EMAIL_CONTENT_ID;
    }

    public EmailInlineImage emailInlineImage() {
        return new EmailInlineImage(EMAIL_CONTENT_ID, "logo-white.png", logoBytes, "image/png");
    }
}
