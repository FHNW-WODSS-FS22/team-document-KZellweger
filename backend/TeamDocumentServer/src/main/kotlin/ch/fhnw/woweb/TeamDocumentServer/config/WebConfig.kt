package ch.fhnw.woweb.TeamDocumentServer.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsWebFilter
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import org.springframework.web.reactive.config.EnableWebFlux

@Configuration
@EnableWebFlux
class WebConfig {

    @Bean
    fun corsFilter(): CorsWebFilter = CorsWebFilter(
        UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**",
            CorsConfiguration().apply {
                allowCredentials = true
                allowedOriginPatterns = mutableListOf("*")
                allowedHeaders = mutableListOf("*")
                allowedMethods = mutableListOf("*")
            }
            )
        }
    )


}
