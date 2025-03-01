package com.Eureka_Server_Service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer  // ✅ Enables Eureka Server

public class EurekaServerServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(EurekaServerServiceApplication.class, args);
	}
}
