import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Params } from '@angular/router';

// RX
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ProjectResolverService implements Resolve<any> {

	public constructor(
		private _router: Router
	) { }
	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Params> {
		return Observable.of(route.params);
	}

}
