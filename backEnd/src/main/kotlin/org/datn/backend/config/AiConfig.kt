package org.datn.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
class AiConfig {
    @Bean
    fun webClient(): WebClient =
        WebClient // This was moved to its own line
            .builder()
            .baseUrl("http://localhost:11434")
            .build()
}
