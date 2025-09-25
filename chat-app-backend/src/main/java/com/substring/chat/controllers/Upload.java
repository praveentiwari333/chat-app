package com.substring.chat.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/upload")
@CrossOrigin("http://localhost:5173")
public class Upload {

    private static final Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads");

    public Upload() {
        try {
            Files.createDirectories(UPLOAD_DIR);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    @PostMapping
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty");
        }

        try {
            String cleanFileName = file.getOriginalFilename().replaceAll("\\s+", "_");
            String fileName = System.currentTimeMillis() + "_" + cleanFileName;
            Path targetPath = UPLOAD_DIR.resolve(fileName); // UPLOAD_DIR is now a Path
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/")
                    .path(fileName)
                    .toUriString();

            return ResponseEntity.ok(fileUrl);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not store file: " + e.getMessage());
        }
    }
}

