import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInputsComponent } from './admin-inputs/admin-inputs.component';
import { TrainingComponent } from './training/training.component';
import { Page2Component } from './page2/page2.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
	{ path:'', component:TrainingComponent },
	{ path:'page2', component:Page2Component },
	{ path:'signup', component:SignupComponent },
	{ path:'adminInput', component:AdminInputsComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
