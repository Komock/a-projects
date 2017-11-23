import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

// Services
import { UserService } from '../user.service';

// Animations
import { fadeInUpAnimation } from '../_animations/fade-in-up.animation';
import { fadeInAnimation } from '../_animations/fade-in.animation';

@Component({
	selector: 'a-verify-email',
	templateUrl: './verify-email.component.html',
	styleUrls: ['./verify-email.component.scss'],
	animations: [fadeInAnimation, fadeInUpAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class VerifyEmailComponent implements OnInit {
	public showProcessMsg: boolean = false;
	public showSuccessMsg: boolean = false;
	public constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _userService: UserService
	) { }

	public ngOnInit(): void {
		this._activatedRoute.queryParams
			.subscribe((query: Params) => {
				if (!query.hash || !query.uid) {
					return this._router.navigate(['']);
				}
				const hash: string = query.hash;
				const uid: string = query.uid;
				this.showProcessMsg = true;
				this._userService.verifyEmail({hash, uid})
					.subscribe((response: any) => {
						this.showProcessMsg = false;
						console.log('response: ', response);
						if (response.error) {
							return this.errorHandler(response.error);
						}
						this.showSuccessMsg = true;
					});
			});
	}

	private errorHandler(err: Error): void {
		console.error(`${this.constructor.name}: `, err);
	}

}
