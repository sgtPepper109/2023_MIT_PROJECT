import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent {
	constructor(private router: Router) { }

	inputemail :string = ""
	inputpassword :string = ""

	// error message to be displayed on the screen
	errorstring :string = ""

	// for displaying if validations are not correct
	toggleErrorString = false;

	signup() {
		if (this.inputemail !== "" && this.inputpassword !== "") {
			var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

			if (this.inputemail.match(validRegex)) {
				this.router.navigate([''])
			} else {
				this.errorstring = "Note: Incorrect Email-id"
				this.toggleErrorString = true
			}
		} else {
			this.errorstring = "Note: All fields are required"
			this.toggleErrorString = true
		}
	}

}
