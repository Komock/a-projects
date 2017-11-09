import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
	selector: 'a-should-verify-email',
	templateUrl: './should-verify-email.component.html',
	styleUrls: ['./should-verify-email.component.scss']
})
export class ShouldVerifyEmailComponent implements OnInit {
	public constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute
		) { }
	public ngOnInit(): void {
		this._activatedRoute.params
			.subscribe((params: Params) => {
				console.log('params: ', params);
			});
	}

}
