package com.ecommerce.ecommerce.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    public HealthController() {
    }

    @GetMapping("/health")
    public String health() {
        return "E-Commerce API is running";
    }
}
