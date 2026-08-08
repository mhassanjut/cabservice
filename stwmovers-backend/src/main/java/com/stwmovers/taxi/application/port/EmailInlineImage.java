package com.stwmovers.taxi.application.port;

public record EmailInlineImage(String contentId, String filename, byte[] content, String contentType) {}
