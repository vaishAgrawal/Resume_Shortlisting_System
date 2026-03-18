package com.resumeshortlist.resume_shortlist_backend.config;

import com.resumeshortlist.resume_shortlist_backend.filter.JwtAuthenticationFilter;
import com.resumeshortlist.resume_shortlist_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${cors.allowed.origins}")
    private String allowedOrigins;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserRepository userRepository;
    private final ApplicationConfig applicationConfig;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF (Testing aur Postman ke liye zaroori hai)
            .csrf(csrf -> csrf.disable())

            // 2. Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Stateless session (JWT based)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // 4. 🔥 UPDATED AUTHORIZATION RULES
            .authorizeHttpRequests(auth -> auth
                // ✅ PUBLIC APIs (Inhe access karne ke liye token nahi chahiye)
                .requestMatchers(
                    "/api/auth/**",
                    "/api/resumes/upload/**",  // 👈 Postman se 50 resumes upload karne ke liye
                    "/api/resumes/parse/**",   // 👈 Parsing trigger karne ke liye
                    "/api/resumes/user/**",    // 👈 User ke resumes dekhne ke liye
                    "/api/job-postings/**",    // 👈 Backend se JD fetch karne ke liye
                    "/api/dashboard/**",       // 👈 Dashboard access ke liye
                    "/error",                  // 👈 Error handling ke liye
                    "/upload", 
                    "/parse", 
                    "/resume", 
                    "/job-description"
                ).permitAll()

                // 🔒 Protected APIs (Inke liye RECRUITER/USER role chahiye)
                .requestMatchers("/api/job-postings/manage/**").hasAnyRole("RECRUITER", "ADMIN")
                
                // Baki saari requests ke liye authentication zaroori hai
                .anyRequest().authenticated()
            )

            // 5. Authentication provider setup
            .authenticationProvider(authenticationProvider())

            // 6. Add JWT Filter before UsernamePassword filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(applicationConfig.userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-Requested-With"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}