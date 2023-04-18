import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/interfaces/all-interfaces';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient) { }

	public getUsersWithEmail(email: string) { return this.http.get("user/getUsersWithEmail?email=" + email) }
	public checkEmailAndPassword(signInDetails: Object) { return this.http.post("user/checkEmailAndPassword", signInDetails) }
	public saveUser(user: User) { return this.http.post("user/saveUser", user) }
	public setUserInactive(user: User) { return this.http.get("/user/setUserInactive?email=" + user.email) }

}
