package com.retailinventory.controller;

import com.retailinventory.model.User;
import com.retailinventory.security.JwtUtil;
import com.retailinventory.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user, BindingResult result) {
        if (result.hasErrors()) {
            Map<String, String> errors = result.getFieldErrors().stream()
                    .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            User registeredUser = authService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> user = authService.validateUser(loginRequest.getEmail(), loginRequest.getPassword());

        if (user.isPresent()) {
            String token = jwtUtil.generateToken(user.get().getEmail(), user.get().getRole());
            return ResponseEntity.ok(Map.of("message", "Login Successful", "token", token));
        } else {
            return ResponseEntity.status(401).body("Invalid Credentials");
        }
    }

    @PostMapping("/token/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> requestBody) {
        String token = requestBody.get("token");

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(400).body("Token is required");
        }

        if (jwtUtil.validateToken(token)) {
            return ResponseEntity.ok(Map.of("message", "Token is valid"));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid or expired token"));
        }
    }
}