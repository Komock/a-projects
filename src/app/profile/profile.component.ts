import { Component, OnInit } from '@angular/core';

// Services
import { UserService } from '../user.service';

// RX
import { Observable } from 'rxjs/Observable';

// FB
import * as firebase from 'firebase/app';

@Component({
	selector: 'a-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
	public user$: Observable<firebase.User>;

	public constructor(
		private _userService: UserService) { }

	public ngOnInit(): void {
		this.user$ = this._userService.user$;
	}

}
