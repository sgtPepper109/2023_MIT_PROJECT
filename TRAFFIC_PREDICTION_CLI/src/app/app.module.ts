import { APP_INITIALIZER, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { PredictionsComponent } from './predictions/predictions.component'
import { TrainingComponent } from './training/training.component'
import { AdminInputsComponent } from './admin-inputs/admin-inputs.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SignupComponent } from './signup/signup.component'
import { HttpClientModule } from '@angular/common/http'
import { PropService } from './services/propService/prop.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { MatInputModule } from '@angular/material/input'
import { NgxCsvParserModule } from 'ngx-csv-parser'
import { MatPaginatorModule } from '@angular/material/paginator'
import { MatStepperModule } from '@angular/material/stepper'
import { MatButtonModule } from '@angular/material/button'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatDividerModule } from '@angular/material/divider'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatMenuModule } from  '@angular/material/menu'
import { MatTabsModule } from '@angular/material/tabs'
import { MatSidenavModule }  from '@angular/material/sidenav'
import { MatSelectModule } from '@angular/material/select'
import { MatListModule } from '@angular/material/list'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { httpInterceptorProviders } from './security/http-interceptors/interceptors'
import { AppConfiguration } from './app-configuration.service'
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
	declarations: [
		AppComponent,
		PredictionsComponent,
		SignupComponent,
		AdminInputsComponent,
		TrainingComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatCardModule,
		MatSnackBarModule,
		MatIconModule,
		MatButtonToggleModule,
		MatInputModule,
		NgxCsvParserModule,
		MatPaginatorModule,
		MatStepperModule,
		MatButtonModule,
		MatGridListModule,
		MatFormFieldModule,
		MatDividerModule,
		MatToolbarModule,
		MatMenuModule,
		MatTabsModule,
		MatSidenavModule,
		MatSelectModule,
		MatListModule,
		MatSlideToggleModule,
		MatProgressBarModule,
		MatTooltipModule,
		MatBadgeModule,
		MatProgressSpinnerModule,
		ScrollingModule,
		MatExpansionModule,
		MatTreeModule,
		MatRadioModule,
		MatCheckboxModule
	],
	providers: [
		{
			provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
			useValue: {
				duration: 2500
			}
		},
		PropService,
		httpInterceptorProviders,
		AppConfiguration, {
			provide: APP_INITIALIZER,
			useFactory: AppConfigurationFactory,
			multi: true,
			deps: [AppConfiguration]
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule { }

export function AppConfigurationFactory(
	appConfig: AppConfiguration) {
		return () => appConfig.ensureInit();
	}