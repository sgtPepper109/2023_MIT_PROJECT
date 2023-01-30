import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Page2Component } from './page2/page2.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
	{ path:'', component:HomeComponent },
	{ path:'page2', component:Page2Component },
	{ path:'signup', component:SignupComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
