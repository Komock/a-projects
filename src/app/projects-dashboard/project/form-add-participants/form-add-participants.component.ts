import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Response } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../../user.service';
import { ProjectsService } from '../../../projects.service';
import { Project } from '../project.class';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// Firebase
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

// Animations
import { fadeInAnimation } from '../../../_animations/fade-in.animation';

import { DOMAIN_TOKEN } from '../../../../../config';

@Component({
	selector: 'a-form-add-participants',
	templateUrl: './form-add-participants.component.html',
	styleUrls: ['./form-add-participants.component.scss'],
	animations: [fadeInAnimation]
})
export class FormAddParticipantsComponent implements OnInit, OnDestroy {
	public formModel: FormGroup;
	public participantMail: string;
	public msg: string;
	public user: firebase.User;
	public projectId: string;
	public participants: firebase.User[] = [];
	public projectSubscription: Subscription;
	@Input()
	public project$: FirebaseObjectObservable<Project>;


	public constructor(
		@Inject(DOMAIN_TOKEN) private _domain: string,
		private _httpClient: HttpClient,
		private _userService: UserService,
		private _projectsService: ProjectsService,
		private _formBuilder: FormBuilder,
		private _db: AngularFireDatabase
	) {}

	public onSubmit(e: Event): void | false {
		e.preventDefault();
		if (this.user.email === this.formModel.controls.email.value) {
			this.msg = 'You can\'t add own e-mail';
			this.formModel.controls.email.reset();
			this.formModel.controls.email.markAsPending();
			setTimeout(() => this.msg = '' , 3000);
			return false;
		}

		this.user.getIdToken().then((token: string) => { // Authorize Custom API by Token
			const body: any = {
				uid: this.user.uid,
				projectId: this.projectId,
				email: this.formModel.controls.email.value
			};
			this._httpClient.post(
					`${this._domain}api/add-participant`,
					body,
					{ headers: new HttpHeaders().set( 'Authorization', token )} )
				.catch((response: HttpErrorResponse) => {
					return Observable.of({error: response.statusText});
				})
				.subscribe((data: any) => {
					console.log('Participant: ', data);
					if (!data) {
						this.msg = 'No user with this e-mail.';
						setTimeout(() => { this.msg = ''; }, 3000); // Hide MSG
					} else if (data.error) {
						this.msg = 'Something went wrong. Pleace try later.';
					} else {
						// const user: User = data[ Object.keys(data)[0] ];
						// this._projectsService.addParticipant({
						// 		participantUid: user.uid,
						// 		email: user.email,
						// 		displayName: user.displayName || '',
						// 		photoURL: user.photoURL || ''
						// 	}).catch(this.errorHandler);
					}
				});
			this.participantMail = '';
		});
	}

	public ngOnInit(): void {
		this.formModel = this._formBuilder.group({
			email: ['', [Validators.required, Validators.minLength(4)]],
		});

		this._userService.user$
			.subscribe((user: firebase.User) => {
				this.user = user;
			});

		this.projectSubscription = this.project$
			.subscribe((project: Project) => {
				this.projectId = project.$key; // Get Project key
				if (project.participants) {
					// const participants: firebase.User[] = [];
					for (const key of Object.keys(project.participants)) {
						this.participants.push(project.participants[key]);
					}
					// this.participants = participants;
				}
			});
	}

	public ngOnDestroy(): void {
		this.projectSubscription.unsubscribe();
	}

	private errorHandler(err: Error): void {
		console.error(`${this.constructor.name}: `, err);
	}
}
