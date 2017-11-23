import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Firebase
import * as firebase from 'firebase/app';

@Component({
	selector: 'a-should-verify-email',
	templateUrl: './should-verify-email.component.html',
	styleUrls: ['./should-verify-email.component.scss']
})
export class ShouldVerifyEmailComponent implements OnInit {
	public constructor(
		private _router: Router
	) {}
	public ngOnInit(): void {
		
	}
}
