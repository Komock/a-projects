import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DOMAIN_TOKEN } from '../../config';

// Firebase
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { Observable, ObservableInput } from 'rxjs/Observable';
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
				return this._db.object(`/users/${user.uid}`).valueChanges(); // Additional user data
			});

		// ==== Log User Data
		this.user$.subscribe((data: any) => {
			console.log('user$: ', data);
		});
		this.userExtraData$.subscribe((data: any) => {
			console.log('userExtraData$: ', data);
		});
	}


	// ==== Sign Up
	public signUpByEmail(form: LoginForm): Observable<firebase.User> {
		const userProm: Promise<any> = this._afAuth
			.auth.createUserWithEmailAndPassword(form.email, form.password)
			.then((fbUser: firebase.User) => {
				fbUser.updateProfile({
					displayName: form.displayName,
					photoURL: ''
				});
				this.addExtraUserToDB(fbUser, form.displayName);
			});
		return Observable.fromPromise(userProm);
	}


	// ==== Signin/Signup by Google
	public signInByGoogle(): void {
		this._afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
			.then((res: any) => {
				this.addExtraUserToDB(res.user);
				this.user$ = Observable.of(res.user);
			});
	}


	// ==== Sign In by E-mail
	public signInByEmail(user: HashMap): Promise<any> {
		return this._afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
	}


	// ==== Sign Out
	public signOut(): void {
		this._router.navigate([''])
			.then(() => {
				this._afAuth.auth.signOut();
			});
	}

	// ==== Send Verification E-mail
	public sendVerificationLink(token: string, uid: string, email: string): Observable<any> {
		if (!token || !uid) {
			console.error('Error: wrong data provided!');
			return Observable.of(false);
		}
		return this._httpClient
			.post( `${this._domain}api/sent-verification-link`, {token , uid, email});
	}

	// ==== Verify User E-mail
	public verifyEmail(query: { hash: string; uid: string}): Observable<any> {
		console.log(query);
		return this._httpClient
			.post( `${this._domain}api/verify-email`, query);
	}


	// ==== Add Extra User Data
	private addExtraUserToDB(fbUser: firebase.User, displayName?: string): void {
		const userData: HashMap = {};
		const fbUserProps: string[] = ['uid', 'photoURL', 'email', 'emailVerified', 'providerId', 'displayName'];
		fbUserProps.forEach((prop: string) => {
			if (fbUser[prop]) {
				userData[prop] = fbUser[prop];
			}
		});
		if (displayName) {
			userData.displayName = displayName;
		}
		this._db.object(`/users/${fbUser.uid}`)
			.set(userData)
			.catch((err: Error) => {
				console.error(err);
			});
	}


}
