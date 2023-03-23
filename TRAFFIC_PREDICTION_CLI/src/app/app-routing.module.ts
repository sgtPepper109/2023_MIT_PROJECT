import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminInputsComponent } from './admin-inputs/admin-inputs.component';
import { TrainingComponent } from './training/training.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
	{ path: 'trafficcli', redirectTo: 'training', pathMatch: 'full' },
	{ path:'', redirectTo:'training', pathMatch:'full' },
	{ path:'training', component:TrainingComponent },
	{ path:'prediction', component:PredictionsComponent },
	{ path:'signup', component:SignupComponent },
	{ path:'junctionProperties', component:AdminInputsComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
