import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationEnd } from '@angular/router';

// Services
import { TitleService } from './title.service';

// Components
import { HeaderComponent } from './header/header.component';
import { ModalService } from './modal.service';

// RX
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';

@Component({
	selector: 'a-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	public contentClass: string = '';

	public constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _titleService: TitleService
	) {}

	public ngOnInit(): void {
		console.log('App started!');
		this._router.events
			.filter((event: Event) => event instanceof NavigationEnd )
			.map(() => this._activatedRoute )
			.map((route: ActivatedRoute) => {
				while (route.firstChild) {
					route = route.firstChild;
				}
				return route;
			})
			.filter((route: ActivatedRoute) => route.outlet === 'primary' )
			.mergeMap((route: ActivatedRoute) => route.data )
			.subscribe((data: any) => {
				this._titleService.setTitle(data.title || 'Projects');
			});
	}
}

