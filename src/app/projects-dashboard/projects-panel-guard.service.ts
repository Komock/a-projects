import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { UserService } from '../user.service';

@Injectable()
export class ProjectsPanelGuardService implements CanActivate {

	public constructor(
		private _userService: UserService,
		private _router: Router
	) {}

	public canActivate(): Observable<boolean> {
		return this._userService.user$
			.switchMap((user: firebase.User) => {
				console.log('ProjectsPanelGuardService: ', user);
				if (user && user.emailVerified) {
					return Observable.of(true);
				}
				this._router.navigate(['']);
				return Observable.of(false);
			});
	}
}