import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../user.service';

// FB
import { FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'a-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
	public user: firebase.User;
	public navHidden: boolean = true; // Wait status from API, hide Nav
	public userSubscription: Subscription;

	public constructor(
		private _userService: UserService
	) { }

	public signOut(e: Event): void {
		e.preventDefault();
		this._userService.signOut();
	}

	public ngOnInit(): void {
		this.userSubscription = this._userService.userExtraData$
			.subscribe((user: firebase.User) => {
				console.log('userSubscription', user);
				this.user = user;
				this.navHidden = false;
			});
	}

	public ngOnDestroy(): void {
		this.userSubscription.unsubscribe();
	}

}
