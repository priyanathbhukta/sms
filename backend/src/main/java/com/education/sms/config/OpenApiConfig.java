package com.education.sms.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                                .info(new Info()
                                                .title("School Management System API")
                                                .version("2.0.0")
                                                .description("""
                                                                SMS Core Service API documentation.

                                                                ## Roles
                                                                - **ADMIN**: System governance, user management, reports
                                                                - **FACULTY**: Academic management (exams, results, attendance)
                                                                - **LIBRARIAN**: Library operations (books, issues, fines)
                                                                - **STUDENT**: Self-service (view grades, request books)

                                                                ## Authentication
                                                                Use the Authorize button to set your JWT token.
                                                                """)
                                                .contact(new Contact()
                                                                .name("SMS Support")
                                                                .email("support@sms.edu.in"))
                                                .license(new License()
                                                                .name("MIT License")
                                                                .url("https://opensource.org/licenses/MIT")))
                                .servers(List.of(
                                                new Server().url("http://localhost:8080")
                                                                .description("Development Server")))
                                .addSecurityItem(new SecurityRequirement().addList("Bearer Authentication"))
                                .components(new Components()
                                                .addSecuritySchemes("Bearer Authentication",
                                                                new SecurityScheme()
                                                                                .type(SecurityScheme.Type.HTTP)
                                                                                .scheme("bearer")
                                                                                .bearerFormat("JWT")
                                                                                .description("Enter your JWT token")));
        }

        // Temporarily commented out to use default /v3/api-docs
        // @Bean
        // public GroupedOpenApi publicApi() {
        // return GroupedOpenApi.builder()
        // .group("sms-api")
        // .packagesToScan("com.education.sms.controller")
        // .pathsToMatch("/api/**")
        // .build();
        // }
}
