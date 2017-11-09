import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// RXJS
import { Observable } from 'rxjs/Observable';

// Services
import { ProjectsService } from '../../projects.service';

@Injectable()
export class BoardGuardService implements CanActivate {

	public constructor(
		private _projectsService: ProjectsService
	) { }

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		const pathArr: string[] = state.url.split('/');
		const projectKey: string = pathArr[pathArr.length - 2];
		this._projectsService.currentProjectKey = projectKey;
		return Observable.of(true);
	}

}
