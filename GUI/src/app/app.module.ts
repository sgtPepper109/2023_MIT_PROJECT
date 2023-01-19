import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Page2Component } from './page2/page2.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { OperationService } from './operation.service';

@NgModule({
  declarations: [
    AppComponent,
    Page2Component,
    HomeComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [OperationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
