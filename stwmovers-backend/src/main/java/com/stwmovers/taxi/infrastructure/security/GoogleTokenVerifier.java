package com.stwmovers.taxi.infrastructure.security;

import java.util.Collections;

import org.springframework.stereotype.Component;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.exception.BadRequestException;

@Component
public class GoogleTokenVerifier {

    private final AppProperties appProperties;

    public GoogleTokenVerifier(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public GoogleIdToken.Payload verify(String idToken) {
        String clientId = appProperties.getGoogle().getClientId();
        if (clientId == null || clientId.isBlank()) {
            throw new BadRequestException("Google sign-in is not configured");
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(clientId))
                    .build();
            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) {
                throw new BadRequestException("Invalid Google ID token");
            }
            return token.getPayload();
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new BadRequestException("Unable to verify Google ID token");
        }
    }
}
