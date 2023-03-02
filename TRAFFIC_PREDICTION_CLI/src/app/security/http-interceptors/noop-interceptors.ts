import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfiguration } from "src/app/app-configuration.service";
import { environment } from "src/environments/environment";

@Injectable()
export class NoopInterceptor implements HttpInterceptor {
	private trafficPredApiUrl = '/trafficmodule';

	constructor(private appConfig: AppConfiguration) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (request.url.includes('./assets/config/config.json')) {
			return next.handle(request);
		} else {
			let clonedRequest!: any;

			switch (environment.name) {
				case 'dev':
				this.trafficPredApiUrl = 'http://localhost:8080/';
				clonedRequest = request.clone({
					url: this.trafficPredApiUrl + request.url
				});
				break;

				case 'production':
				this.trafficPredApiUrl = '/trafficsvr-1.0.0/';
				console.log('this.appConfig.restTrafficProdUrl',this.appConfig.restTrafficProdUrl);
				
				clonedRequest = request.clone({
					url: this.appConfig.restTrafficProdUrl + this.trafficPredApiUrl + request.url
				});
				break;
			}
			return next.handle(clonedRequest);
		}
	
	}

}