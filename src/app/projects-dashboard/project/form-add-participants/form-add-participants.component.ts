import { Component, OnInit, OnDestroy, Inject, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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

// Animations
import { fadeInAnimation } from '../../../_animations/fade-in.animation';

// Config
import { DOMAIN_TOKEN } from '../../../../../config';

// Validators
import { emailValidator } from '../../../_validators/email-validator';

@Component({
	selector: 'a-form-add-participants',
	templateUrl: './form-add-participants.component.html',
	styleUrls: ['./form-add-participants.component.scss'],
	animations: [fadeInAnimation]
})
export class FormAddParticipantsComponent implements OnInit, OnDestroy {
	public formModel: FormGroup;
	@ViewChild('f') public formDir: any;
	public participantMail: string;
	public msg: string;
	public user: firebase.User;
	public participants$: Observable<Participant[]>;
	public projectSubscription: Subscription;
	public userSubscription: Subscription;
	@Input() public projectKey: string;

	public constructor(
		@Inject(DOMAIN_TOKEN) private _domain: string,
		private _httpClient: HttpClient,
		private _userService: UserService,
		private _projectsService: ProjectsService,
		private _formBuilder: FormBuilder
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

		const body: any = {
			ownerUid: this.user.uid,
			projectKey: this._projectsService.currentProjectKey,
			email: this.formModel.controls.email.value
		};
		this._httpClient.post(`${this._domain}api/add-participant`, body)
			.catch((response: HttpErrorResponse) => {
				return Observable.of({error: response.statusText});
			})
			.subscribe((data: any) => {
				if (data.msg) {
					this.msg = 'No user with this e-mail.';
					setTimeout(() => { this.msg = ''; }, 3000); // Hide MSG
					return;
				}
				if (data.error) {
					this.msg = 'Something went wrong. Pleace try later.';
					this.errorHandler(data.error);
					setTimeout(() => { this.msg = ''; }, 3000); // Hide MSG
					return;
				}
				if (data.uid) {
					this.msg = 'User added!';
					setTimeout(() => { this.msg = ''; }, 3000); // Hide MSG
				}
			});
		this.formModel.reset();
		this.formDir.resetForm();
		// this.formModel.controls['email'].setErrors(null); // Hack
	}

	public ngOnInit(): void {
		this.participants$ = this._projectsService.getParticipants().valueChanges();
		this.formModel = this._formBuilder.group({
			email: ['', [Validators.required, Validators.minLength(4)], emailValidator ], // emailValidator
		});
		this.userSubscription = this._userService.user$
			.subscribe((user: firebase.User) => this.user = user );
	}

	public ngOnDestroy(): void {
		this.userSubscription.unsubscribe();
	}

	private errorHandler(err: Error): void {
		console.error(`${this.constructor.name}: `, err);
	}
}
