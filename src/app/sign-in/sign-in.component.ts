import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

import { Observable } from 'rxjs/Observable';

import * as firebase from 'firebase/app';

// Animations
import { fadeInAnimation } from '../_animations/fade-in.animation';

@Component({
	selector: 'a-login',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class SignInComponent implements OnInit {
	public formMsg: string = '';
	public submitted: boolean = false;
	public notValid: boolean = false;

	public model: HashMap = {
		email: '',
		password: ''
	};

	public constructor(
		private _userService: UserService,
		private _router: Router
	) {}

	public onSubmit(e: Event): void {
		e.preventDefault();
		this._userService.signInByEmail(this.model)
			.catch((error: Error) => {
				console.warn('signInByEmail error: ', error);
				this.formMsg = error.message; // Show error message
			});
	}

	public signInByGoogle(): void {
		this._userService.signInByGoogle();
	}

	public ngOnInit(): void {
		this._userService.user$.subscribe((user: firebase.User) => {
			if (user !== null ) {
				if (user.emailVerified) {
					this._router.navigate(['projects']);
					return;
				}
				this._router.navigate(['should-verify-email']);
			}
		});
	}

}
