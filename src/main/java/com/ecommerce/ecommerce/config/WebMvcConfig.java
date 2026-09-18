package com.ecommerce.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static files from the frontend directory
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/frontend/", "classpath:/static/", "classpath:/public/");
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Set landing page as default
        registry.addViewController("/").setViewName("forward:/landing.html");
    }
}