package com.group_6.book_store.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**") // Áp dụng cho tất cả các endpoint
        .allowedOrigins("http://localhost:3000") // React app chạy ở cổng 3000
        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS") // Cho phép các phương thức
        .allowedHeaders("*") // Cho phép mọi header
        .allowCredentials(true) // Cho phép gửi cookie/token
        .maxAge(3600); // Cache cấu hình CORS trong 1h
  }
}
