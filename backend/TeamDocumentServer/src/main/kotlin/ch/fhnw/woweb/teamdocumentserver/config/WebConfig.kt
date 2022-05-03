package ch.fhnw.woweb.teamdocumentserver.config

import org.springframework.beans.factory.annotation.Value
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
class WebConfig {

    @Value("\${teamdocument.userName}")
    private val userName: String = ""

    @Value("\${teamdocument.userPassword}")
    private val userPassword: String = ""

    @Value("\${teamdocument.allowedOrigins}")
    private val allowedOrigins: List<String> = mutableListOf()

    @Bean
    fun userDetailsService(): ReactiveUserDetailsService {
        val userDetails = User.withDefaultPasswordEncoder()
            .username(userName)
            .password(userPassword)
            .roles("USER")
            .build()
        return MapReactiveUserDetailsService(userDetails)
    }

//    @Bean
//    fun corsConfigurationSource(): CorsConfigurationSource {
//        allowedOrigins.forEach { s -> println(s) }
//        val configuration = CorsConfiguration()
//        configuration.applyPermitDefaultValues()
//        configuration.allowedOriginPatterns = mutableListOf("*")
//        configuration.allowedMethods = mutableListOf("*")
//        configuration.allowedHeaders = mutableListOf("*")
//        configuration.allowCredentials = true
//        val source = UrlBasedCorsConfigurationSource()
//        source.registerCorsConfiguration("/**", configuration)
//        return source
//    }

    @Bean
    fun corsFilter(): CorsWebFilter = CorsWebFilter(
        UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**",
                CorsConfiguration().apply {
                    allowCredentials = true
                    // allowedOriginPatterns = mutableListOf("*") works on localhost with dev profile
                    // TODO: It somewhat makes a difference if this list is taken from app.yaml ?????????????
                    allowedOriginPatterns = mutableListOf("http://localhost:3000", "https://localhost")
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
                    .anyExchange().authenticated()
            }
            .cors().disable()
            .httpBasic { }
            .csrf().disable()
        return http.build()
    }
}
