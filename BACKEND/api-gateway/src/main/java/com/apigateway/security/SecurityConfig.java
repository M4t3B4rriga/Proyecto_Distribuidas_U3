package com.apigateway.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers("/auth/**").permitAll()
                        .pathMatchers(HttpMethod.PUT, "/inventory/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        // ✅ Only Admins can view movements & metrics
                        .pathMatchers(HttpMethod.GET, "/inventory/movements").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.GET, "/inventory/movements/metrics").hasRole("ADMIN")

                        // ✅ Employees & Admins can view & manage products
                        .pathMatchers(HttpMethod.GET, "/products/**").hasAnyRole("ADMIN", "EMPLOYEE")
                        .pathMatchers(HttpMethod.POST, "/products").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

                        // ✅ Stores Service (Admin Only)
                        .pathMatchers(HttpMethod.GET, "/stores/**").hasAnyRole("ADMIN", "EMPLOYEE")
                        .pathMatchers(HttpMethod.POST, "/stores").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/stores/**").hasRole("ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/stores/**").hasRole("ADMIN")
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> jwt.jwtDecoder(jwtDecoder())))
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint((exchange, ex) -> {
                            logger.error("Unauthorized access: {}", ex.getMessage());
                            return Mono.fromRunnable(() -> exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.UNAUTHORIZED));
                        })
                        .accessDeniedHandler((exchange, ex) -> {
                            logger.error("Access denied: {}", ex.getMessage());
                            return Mono.fromRunnable(() -> exchange.getResponse().setStatusCode(org.springframework.http.HttpStatus.FORBIDDEN));
                        })
                );
        return http.build();
    }

    @Bean
    public ReactiveJwtDecoder jwtDecoder() {
        return NimbusReactiveJwtDecoder.withJwkSetUri("http://localhost:8080/oauth2/jwks").build();
    }
}