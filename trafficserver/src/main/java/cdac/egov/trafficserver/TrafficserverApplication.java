package cdac.egov.trafficserver;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Properties;

@SpringBootApplication
public class TrafficserverApplication extends SpringBootServletInitializer {

	@Value("${ng.url}")
	private String ngUrl;
	
	@Value("{ng.prod.url}")
	private String ngProdUrl;
	
	public static void main(String[] args) {
		SpringApplication.run(TrafficserverApplication.class, args);
	}

	@Bean
	public CorsFilter corsFilter() {
		CorsConfiguration corsConfiguration = new CorsConfiguration();

		corsConfiguration.setAllowCredentials(true);
		corsConfiguration.setAllowedOrigins(Arrays.asList(ngUrl, ngProdUrl));
		String accessControlAllowOrigin = "Access-Control-Allow-Origin";
		corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", accessControlAllowOrigin, "Content-Type",
				"Accept", "Authorization", "Origin, Accept", "X-Requested-With",
				"Access-Control-Request-Method", "Access-Control-Request-Headers"));

		corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization",
				accessControlAllowOrigin, accessControlAllowOrigin, "Access-Control-Allow-Credentials"));

		corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

		UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
		urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);

		return new CorsFilter(urlBasedCorsConfigurationSource);
	}
	
	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(TrafficserverApplication.class).properties(loadproperties());
	}
	
	private Properties loadproperties() {
		Properties props = new Properties();
		props.put("spring.config.location", "classpath:trafficsvr_config/");
		return props;
	}

}
