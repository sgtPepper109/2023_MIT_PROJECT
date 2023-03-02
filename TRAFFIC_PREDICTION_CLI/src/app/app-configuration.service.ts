import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AppConfiguration {

    restTrafficProdUrl!: string;
    appConfig!: AppConfiguration;

    constructor(private httpClient: HttpClient) {}

    ensureInit(): Promise<any> {
        return new Promise((r, e) => {

        this.httpClient.get('./assets/config/config.json')
            .subscribe(
            (content: any) => {
                Object.assign(this, content);
                r(this);
            },
            reason => e(reason));
        });
    }
  
}
