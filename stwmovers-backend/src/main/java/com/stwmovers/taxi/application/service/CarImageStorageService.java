package com.stwmovers.taxi.application.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.stwmovers.taxi.config.AppProperties;
import com.stwmovers.taxi.exception.BadRequestException;
import com.stwmovers.taxi.exception.ResourceNotFoundException;

import jakarta.annotation.PostConstruct;

@Service
public class CarImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif", "ico");
    private static final Map<String, String> EXTENSION_MEDIA_TYPES = Map.ofEntries(
            Map.entry("jpg", MediaType.IMAGE_JPEG_VALUE),
            Map.entry("jpeg", MediaType.IMAGE_JPEG_VALUE),
            Map.entry("png", MediaType.IMAGE_PNG_VALUE),
            Map.entry("gif", MediaType.IMAGE_GIF_VALUE),
            Map.entry("webp", "image/webp"),
            Map.entry("svg", "image/svg+xml"),
            Map.entry("bmp", "image/bmp"),
            Map.entry("avif", "image/avif"),
            Map.entry("ico", "image/x-icon"));

    private final AppProperties appProperties;
    private Path carsUploadDir;

    public CarImageStorageService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    @PostConstruct
    void init() throws IOException {
        carsUploadDir = Paths.get(appProperties.getUploads().getCarsDir()).toAbsolutePath().normalize();
        Files.createDirectories(carsUploadDir);
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }

        String extension = resolveExtension(file);
        String storedName = UUID.randomUUID() + "." + extension;
        Path target = carsUploadDir.resolve(storedName).normalize();
        if (!target.startsWith(carsUploadDir)) {
            throw new BadRequestException("Invalid image file");
        }

        try {
            file.transferTo(target);
        } catch (IOException ex) {
            throw new BadRequestException("Could not store image file");
        }

        return "/api/v1/media/cars/" + storedName;
    }

    public void deleteIfStored(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }
        String prefix = "/api/v1/media/cars/";
        if (!imageUrl.startsWith(prefix)) {
            return;
        }
        String filename = imageUrl.substring(prefix.length());
        try {
            Files.deleteIfExists(resolveStoredFile(filename));
        } catch (ResourceNotFoundException ignored) {
            // already removed
        } catch (IOException ex) {
            throw new BadRequestException("Could not remove previous image");
        }
    }

    public Path resolveStoredFile(String filename) {
        String safeName = sanitizeFilename(filename);
        Path file = carsUploadDir.resolve(safeName).normalize();
        if (!file.startsWith(carsUploadDir) || !Files.isRegularFile(file)) {
            throw new ResourceNotFoundException("Image not found");
        }
        return file;
    }

    public String mediaTypeForFilename(String filename) {
        String extension = extensionFromFilename(filename);
        return EXTENSION_MEDIA_TYPES.getOrDefault(extension, MediaType.APPLICATION_OCTET_STREAM_VALUE);
    }

    private String resolveExtension(MultipartFile file) {
        String original = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "");
        String fromName = extensionFromFilename(original);
        if (ALLOWED_EXTENSIONS.contains(fromName)) {
            return fromName;
        }

        String fromContentType = extensionFromContentType(file.getContentType());
        if (fromContentType != null) {
            return fromContentType;
        }

        throw new BadRequestException("Unsupported image type. Allowed: JPG, PNG, GIF, WEBP, SVG, BMP, AVIF, ICO");
    }

    private static String extensionFromFilename(String filename) {
        if (filename == null || filename.isBlank()) {
            return "";
        }
        int dot = filename.lastIndexOf('.');
        if (dot < 0 || dot == filename.length() - 1) {
            return "";
        }
        return filename.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private static String extensionFromContentType(String contentType) {
        if (contentType == null || contentType.isBlank()) {
            return null;
        }
        String normalized = contentType.toLowerCase(Locale.ROOT).split(";", 2)[0].trim();
        return switch (normalized) {
            case MediaType.IMAGE_JPEG_VALUE -> "jpg";
            case MediaType.IMAGE_PNG_VALUE -> "png";
            case MediaType.IMAGE_GIF_VALUE -> "gif";
            case "image/webp" -> "webp";
            case "image/svg+xml" -> "svg";
            case "image/bmp" -> "bmp";
            case "image/avif" -> "avif";
            case "image/x-icon", "image/vnd.microsoft.icon" -> "ico";
            default -> null;
        };
    }

    private static String sanitizeFilename(String filename) {
        if (filename == null || !filename.matches("^[A-Za-z0-9._-]+$")) {
            throw new ResourceNotFoundException("Image not found");
        }
        return filename;
    }
}
