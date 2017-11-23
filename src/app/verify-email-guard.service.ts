import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import * as firebase from 'firebase/app';

// RXJS
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Services
import { UserService } from './user.service';

@Injectable()
export class VerifyEmailGuardService {

	public constructor(
		private _userService: UserService,
		private _router: Router
	) { }
	public canActivate(): Observable<boolean> {
		return this._userService.user$
			.map((user: firebase.User) => {
				if (!user) {
					return true;
				}
				if (!user.emailVerified) {
					this._router.navigate(['/should-verify-email']);
					return false;
				}
				return true;
			});
	}

}
