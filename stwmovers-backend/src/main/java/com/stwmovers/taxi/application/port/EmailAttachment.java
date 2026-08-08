package com.stwmovers.taxi.application.port;

public record EmailAttachment(String filename, byte[] content, String contentType) {}
