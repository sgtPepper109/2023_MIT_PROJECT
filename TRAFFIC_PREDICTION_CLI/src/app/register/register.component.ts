import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../services/db/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../interfaces/all-interfaces';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent {
	constructor(
		private router: Router,
		private userService: UserService
	) { }

	userExists: boolean = true
	emailFormControl = new FormControl('', [Validators.required, Validators.email]);
	matcher = new MyErrorStateMatcher();
	hide: boolean = true
	name: string = ""
	email: string = ""
	password: string = ""
	toggleWarningToast: boolean = false
	errorString: string = ""
	role: string = "user"

	signUp() {
		if (this.name != "" && this.email != "" && this.password != "") {
			this.userService.getUsersWithEmail(this.email).subscribe({
				next: (response) => {
					this.userExists = (response == true)? true: false
					if (this.userExists) {
						this.toggleWarningToast= true
						this.errorString = 'Invalid: Email already registered'
						setTimeout(() => {
							this.toggleWarningToast = false
						}, 3000);
					} else {
						let newUser: User = {
							name: this.name,
							email: this.email,
							password: this.password,
							role: this.role, 
							active: true
						}
						this.userService.saveUser(newUser).subscribe({
							next: (response) => {
								if (response != null) {
									this.router.navigate(['/training'])
								}
							},
							error: (error: HttpErrorResponse) => {
								alert(error.message)
							}
						})
					}
				},
				error: (error: HttpErrorResponse) => {
					alert(error.message)
				}
			})
		} else {
			this.toggleWarningToast= true
			this.errorString = 'Note: All fields are required'
			setTimeout(() => {
				this.toggleWarningToast = false
			}, 3000);
		}
	}

	navigateToSignIn() {
		this.router.navigate(['/signin'])
	}

}
