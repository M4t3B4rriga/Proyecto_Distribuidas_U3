package com.inventorymanagement.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.List;

@Configuration
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ✅ EMPLOYEES & ADMINS can update stock
                        .requestMatchers(HttpMethod.PUT, "/inventory/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        // ✅ Only ADMINS can view inventory movements
                        .requestMatchers(HttpMethod.GET, "/inventory/movements").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/inventory/movements/{storeId}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/inventory/movements/metrics").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        try {
            RSAPublicKey publicKey = readPublicKey();
            return NimbusJwtDecoder.withPublicKey(publicKey).build();
        } catch (Exception e) {
            logger.error("Error loading RSA public key for JWT decoding", e);
            throw new RuntimeException("Failed to load public key", e);
        }
    }

    private RSAPublicKey readPublicKey() throws Exception {
        String key = new String(Files.readAllBytes(Paths.get("src/main/resources/public.pem")))
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        byte[] decodedKey = java.util.Base64.getDecoder().decode(key);
        return (RSAPublicKey) KeyFactory.getInstance("RSA")
                .generatePublic(new X509EncodedKeySpec(decodedKey));
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            String role = jwt.getClaimAsString("role");

            if (role == null) {
                logger.warn("JWT does not contain a role claim.");
                return List.of();
            }

            // ✅ Convert role to uppercase and apply correct format
            String formattedRole = "ROLE_" + role.toUpperCase();
            logger.info("Extracted Role from JWT: {}", formattedRole);

            return List.of(new SimpleGrantedAuthority(formattedRole));
        });
        return converter;
    }
}