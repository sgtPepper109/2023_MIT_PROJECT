import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from '../services/db/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-signup',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css']
})
export class SigninComponent {
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


	async validateSignInDetails() {
		return new Promise<void>((resolve, reject) => {
			let signInDetails: Object = {
				email: this.email,
				password: this.password
			}
			this.userService.checkEmailAndPassword(signInDetails).subscribe({
				next: (response) => {
					if (response == true) {
						resolve()
					} else {
						this.toggleWarningToast= true
						this.errorString = 'Note: Incorrect email and password'
						setTimeout(() => {
							this.toggleWarningToast = false
						}, 3000);
						reject()
					}
				}, error: (error: HttpErrorResponse) => {
					reject()
					alert(error.message)
				}
			})
		})
	}

	signIn() {
		if (this.email != "" && this.password != "") {
			this.userService.getUsersWithEmail(this.email).subscribe({
				next: (response) => {
					this.userExists = (response == true)? true: false
					if (!this.userExists) {
						this.toggleWarningToast= true
						this.errorString = 'Note: User does not exist'
						setTimeout(() => {
							this.toggleWarningToast = false
						}, 3000);
					} else {
						this.validateSignInDetails().then(() => {
							this.router.navigate(['/training'])
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


	navigateToRegister() {
		this.router.navigate(['/register'])
	}

}
