import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DOMAIN_TOKEN } from '../../config';

// Firebase
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';

@Injectable()
export class UserService {

	public user$: Observable<firebase.User>;
	public userExtraData$: Observable<firebase.User>;

	public constructor(
		@Inject(DOMAIN_TOKEN) private _domain: string,
		private _router: Router,
		private _db: AngularFireDatabase,
		private _afAuth: AngularFireAuth,
		private _httpClient: HttpClient
		) {
		this.user$ = _afAuth.authState;
		this.userExtraData$ = this.user$
			.switchMap((user: firebase.User) => {
				if (user === null) {
					return Observable.of(null);
				}
				return this._db.object(`/users/${user.uid}`); // Additional user data
			});

		this.user$.subscribe((data: any) => {
			console.log('user$: ', data);
		});

		this.userExtraData$.subscribe((data: any) => {
			console.log('userExtraData$: ', data);
		});
	}

	// ==== Sign Up
	public signUpByEmail(user: LoginForm): Observable<firebase.User> {
		const userProm: firebase.Promise<any> = this._afAuth
			.auth.createUserWithEmailAndPassword(user.email, user.password);
		userProm.then((fbUser: firebase.User) => {
			console.log('this._afAuth: ', this._afAuth);
			// this._afAuth.auth.currentUser.sendEmailVerification()
			// 	.then(() => {
			// 		console.log('Verification e-mail was send!');
			// 	});
			this.addExtraUserToDB(fbUser);
		});
		return Observable.fromPromise(userProm);
	}

	// ==== Signin/Signup by Google
	public signInByGoogle(): void {
		this._afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then((res: any) => {
				console.log('GoogleAuthProvider: ', res);
				this.addExtraUserToDB(res.user);
				this.user$ = Observable.of(res.user);
			});
	}

	public signInByEmail(user: HashMap): firebase.Promise<any> {
		return this._afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
	}

	public signOut(): void {
		this._router.navigate([''])
			.then(() => {
				this._afAuth.auth.signOut();
			});
	}

	// ==== Send Verification Email
	public addVerificationLink(token: string, uid: string): Observable<any> {
		if (!token || !uid) {
			console.error('Error: wrong data provided!');
			return Observable.of(false);
		}
		return this._httpClient
			.post( `${this._domain}api/add-verification-link`, { token , uid});
	}

	public sendEmailVerification(token: string, uid: string, email: string): Observable<any> {
		if (!token || !uid || !email) {
			console.error('Error: wrong data provided!');
			return Observable.of(false);
		}
		return this._httpClient
			.post( `${this._domain}api/sent-verification-link`, { token , uid, email });
	}


	// ==== Add Extra User Data
	private addExtraUserToDB(fbUser: firebase.User): void {
		const userData: {[key: string]: any} = {};
		const fbUserProps: string[] = ['uid', 'photoURL', 'email', 'emailVerified', 'providerId', 'displayName'];
		fbUserProps.forEach((prop: string) => {
			if (fbUser[prop]) {
				userData[prop] = fbUser[prop];
			}
		});
		this._db.object(`/users/${fbUser.uid}`)
			.set(userData)
			.catch((err: Error) => {
				console.error(err);
			});
	}


}
