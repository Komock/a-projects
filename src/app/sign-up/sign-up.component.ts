import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/of';

import * as firebase from 'firebase/app';

// Animations
import { fadeInAnimation } from '../_animations/fade-in.animation';

@Component({
	selector: 'a-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class SignUpComponent implements OnInit {

	public formMsg: string = '';
	public submitted: boolean = false;
	public notValid: boolean = false;

	public model: LoginForm = {
		email: '',
		password: ''
	};

	public constructor(
		private _userService: UserService,
		private _router: Router
	) {}

	public onSubmit(e: Event): void {
		e.preventDefault();
		this._userService.signUpByEmail(this.model)
			.subscribe(null, (error: Error) => {
				console.warn('signUpByEmail error: ', error);
				this.formMsg = error.message; // Show error message
				return Observable.of(false);
			});
	}

	public signupByGoogle(): void {
		this._userService.signInByGoogle();
	}

	public ngOnInit(): void {
		this._userService.user$.subscribe((user: firebase.User) => {
			if (user !== null) {
				this._router.navigate(['projects']);
			}
		});
	}

}