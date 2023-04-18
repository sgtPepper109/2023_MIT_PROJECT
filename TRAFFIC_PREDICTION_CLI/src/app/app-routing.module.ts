import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInputsComponent } from './admin-inputs/admin-inputs.component';
import { TrainingComponent } from './training/training.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { SigninComponent } from './signIn/signin.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
	{ path: 'trafficcli', redirectTo: 'training', pathMatch: 'full' },
	{ path: '', redirectTo: 'training', pathMatch: 'full' },
	{ path: 'training', component: TrainingComponent },
	{ path: 'prediction', component: PredictionsComponent },
	{ path: 'signin', component: SigninComponent },
	{ path: 'junctionProperties', component: AdminInputsComponent },
	{ path: 'register', component: RegisterComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			scrollPositionRestoration: 'enabled'
		})
	],
	exports: [RouterModule]
})

export class AppRoutingModule { }
