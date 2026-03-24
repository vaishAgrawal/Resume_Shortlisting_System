package com.resumeshortlist.resume_shortlist_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync // This tells Spring to allow background threading
public class AsyncConfig {

    @Bean(name = "parsingTaskExecutor")
    public Executor parsingTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // Base number of threads running
        executor.setCorePoolSize(5); 
        // Max number of concurrent threads (Perfect for your 20 resume limit)
        executor.setMaxPoolSize(20); 
        // Queue size if all threads are busy
        executor.setQueueCapacity(50);
        // Name of the threads in your console logs
        executor.setThreadNamePrefix("ResumeParser-");
        executor.initialize();
        return executor;
    }
}