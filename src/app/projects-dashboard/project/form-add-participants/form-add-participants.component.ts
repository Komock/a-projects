import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Response } from '@angular/http';
import { HttpService } from '../../../http.service';
import { UserService } from '../../../user.service';
import { Project } from '../project.class';

// Firebase
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

import { DOMAIN_TOKEN } from '../../../../../config';

@Component({
	selector: 'a-form-add-participants',
	templateUrl: './form-add-participants.component.html',
	styleUrls: ['./form-add-participants.component.scss']
})
export class FormAddParticipantsComponent implements OnInit {

	public formModel: FormGroup;
	public participantMail: string;
	public msg: string;
	public user: firebase.User;
	public projectId: string;
	public participants: firebase.User[];
	@Input()
	public project$: FirebaseObjectObservable<Project>;
	@Output()
	public onAddParticipant: EventEmitter<{[key: string]: User}> = new EventEmitter<{[key: string]: User}>();

	public constructor(
		@Inject(DOMAIN_TOKEN) private _domain: string,
		private _http: HttpService,
		private _userService: UserService,
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

		console.log();

		// Authorize Custom API by Token
		this.user.getIdToken().then((token: string) => {
			this._http.post( `${this._domain}api/add-participant`, {
					token,
					uid: this.user.uid,
					projectId: this.projectId,
					email: this.formModel.controls.email.value
				})
				.subscribe((participant: {[key: string]: User} | any[]) => {
					console.log('participant: ', participant);
					if (participant === []) {
						this.msg = 'No user with this e-mail.';
						setTimeout(() => { this.msg = ''; }, 3000);
						return;
					}
					this.onAddParticipant.emit(participant as {[key: string]: User});
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

		this.project$
			.subscribe((project: Project) => {
				this.projectId = project.$key; // Get Project key
				if (project.participants) {
					const participants: any[] = [];
					for (const key of Object.keys(project.participants)) {
						participants.push(project.participants[key]);
					}
					this.participants = participants;
				}
			});
	}
}