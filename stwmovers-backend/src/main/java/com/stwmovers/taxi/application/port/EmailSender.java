package com.stwmovers.taxi.application.port;

public interface EmailSender {

    void send(String to, String subject, String body);
}
