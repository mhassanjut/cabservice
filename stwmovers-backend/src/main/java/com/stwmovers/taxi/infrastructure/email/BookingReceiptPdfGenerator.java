package com.stwmovers.taxi.infrastructure.email;

import java.io.ByteArrayOutputStream;

import org.jsoup.Jsoup;
import org.jsoup.helper.W3CDom;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.stwmovers.taxi.domain.entity.Booking;

@Component
public class BookingReceiptPdfGenerator {

    private final BookingReceiptHtmlBuilder htmlBuilder;

    public BookingReceiptPdfGenerator(BookingReceiptHtmlBuilder htmlBuilder) {
        this.htmlBuilder = htmlBuilder;
    }

    public byte[] generate(Booking booking) {
        String html = htmlBuilder.build(booking);
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = Jsoup.parse(html);
            document.outputSettings().syntax(Document.OutputSettings.Syntax.xml);
            org.w3c.dom.Document w3cDocument = new W3CDom().fromJsoup(document);

            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.withW3cDocument(w3cDocument, null);
            builder.toStream(output);
            builder.run();
            return output.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("Failed to generate booking receipt PDF", e);
        }
    }
}
