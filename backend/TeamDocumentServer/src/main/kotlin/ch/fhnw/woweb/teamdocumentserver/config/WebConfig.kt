package ch.fhnw.woweb.teamdocumentserver.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.core.userdetails.MapReactiveUserDetailsService
import org.springframework.security.core.userdetails.ReactiveUserDetailsService
import org.springframework.security.core.userdetails.User
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsWebFilter
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import org.springframework.web.reactive.config.EnableWebFlux

@Configuration
@EnableWebFlux
@EnableWebFluxSecurity
class WebConfig(
    private val properties: TeamDocumentServerProperties
)  {

    @Bean
    fun userDetailsService(): ReactiveUserDetailsService {
        val userDetails = User.withDefaultPasswordEncoder()
            .username(properties.userName)
            .password(properties.userPassword)
            .roles("USER")
            .build()
        return MapReactiveUserDetailsService(userDetails)
    }

    @Bean
    fun corsFilter(): CorsWebFilter = CorsWebFilter(
        UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**",
                CorsConfiguration().apply {
                    allowCredentials = true
                    allowedOriginPatterns = properties.allowedOrigins
                    allowedHeaders = mutableListOf("*")
                    allowedMethods = mutableListOf("*")
                }
            )
        }
    )

    @Bean
    fun springSecurityFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain? {
        http
            .authorizeExchange { exchanges: ServerHttpSecurity.AuthorizeExchangeSpec ->
                exchanges
                    .pathMatchers(HttpMethod.OPTIONS).permitAll()
                    .pathMatchers( "/api/v1/authentication").permitAll()
                    .anyExchange().authenticated()
            }
            .cors().disable()
            .httpBasic { }
            .csrf().disable()
        return http.build()
    }
}
