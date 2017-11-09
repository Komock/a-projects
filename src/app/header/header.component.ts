import { Component, OnInit } from '@angular/core';

import { NavComponent } from '../nav/nav.component';
import { Router, ActivatedRoute, UrlSegment, NavigationEnd } from '@angular/router';


@Component({
	selector: 'a-main-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	public isStart: boolean = false;

	public constructor(
		private  _router: Router,
		private _activatedRoute: ActivatedRoute,
	) {}

	public ngOnInit(): void {
		this._router.events
			.subscribe((event: any) => {
				if (event instanceof NavigationEnd) {
					if (event.url === '/') {
						this.isStart = true;
						return;
					}
					this.isStart = false;
				}
			});
	}

}
