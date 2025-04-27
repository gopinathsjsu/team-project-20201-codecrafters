package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.util.TimeZone;

@SpringBootApplication
@EnableScheduling
public class ServerApplication {

	public static void main(String[] args) {
		System.out.println(">>> Starting application...");
		TimeZone.setDefault(TimeZone.getTimeZone("America/Los_Angeles"));
		TimeZone timeZone = TimeZone.getDefault();
		System.out.println(">>> Current Timezone: " + timeZone.getID());
		System.out.println(">>> Current Time: " + new java.util.Date());
		SpringApplication.run(ServerApplication.class, args);
		System.out.println(">>> Application started successfully.");
		System.out.println(">>> Current Time: " + new java.util.Date());
		System.out.println(">>> Current Timezone: " + timeZone.getID());	}

}
