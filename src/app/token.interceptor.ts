import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpEvent, HttpHandler } from '@angular/common/http';

// FB
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// RX
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

	public constructor(
		private _afAuth: AngularFireAuth
	) { }

	public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return this._afAuth.idToken
			.map((token: string) => token )
			.switchMap((token: string) => {
				request = request.clone({ setHeaders: { Authorization: token } });
				return next.handle(request);
			});
	}

}
