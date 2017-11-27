import { Component, HostListener, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Project } from './project.class';

// Firebase
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireList, AngularFireObject,
	SnapshotAction, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';

// Services
import { TitleService } from '../../title.service';
import { ProjectsService } from '../../projects.service';
import { UserService } from '../../user.service';
import { ModalService } from '../../modal.service';

// Components
import { FormAddParticipantsComponent } from './form-add-participants/form-add-participants.component';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

// Animations
import { fadeInUpAnimation } from '../../_animations/fade-in-up.animation';
import { fadeInAnimation } from '../../_animations/fade-in.animation';

// Classes
import { Board } from '../board/board.class';


@Component({
	selector: 'a-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
	animations: [fadeInAnimation, fadeInUpAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class ProjectComponent implements OnInit, OnDestroy {
	public project: Project;
	public projectKey: string;
	public boards$: Observable<any[]>;
	public subscription: Subscription;
	public user: firebase.User;
	public project$: Observable<AngularFireAction<any>>;
	public formModel: FormGroup;
	public tasksArray: FormArray;

	public constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder,
		private _projectsService: ProjectsService,
		private _userService: UserService,
		private _modalService: ModalService,
		private _titleService: TitleService,
		private _db: AngularFireDatabase,
	) {}

	public get pageTitle(): string {
		return this.project.title;
	}

	public back(): void {
		this._router.navigate(['projects']);
	}

	// ==== Project Actions ==== //
	public deleteProject(key: string): void {
		this._router.navigate(['projects']);
		this._projectsService.deleteProject(key);
	}

	public updateProject(e: Event | any): void {
		const el: HTMLInputElement = e.srcElement;
		this._projectsService.getProject()
			.update({
				[el.name]: el.value
			})
			.catch(this.errorHandler);
	}

	public addBoard(): void {
		if (!this.project.boards) {
			this.project.boards = [];
		}
		this._projectsService.addBoard(new Board({ title: 'New Board!'}));
	}

	public openFormAddProject(): void {
		this._modalService.open({
			component: FormAddParticipantsComponent,
			modalClass: 'modal--white',
			context: {}
		});
	}

	public ngOnInit(): void {
		// ==== Project Info Form Model ==== //
		this.formModel = this._formBuilder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			description: ['', []]
		});

		// ==== Load Project ==== //
		this.subscription = this._userService.userExtraData$
			.switchMap((user: firebase.User) => {
				this.user = user; // Store User
				return this._activatedRoute.params;
			})
			.switchMap((params: Params) => {
				this._projectsService.authorId = params.uid;
				this._projectsService.isCollectiveProject = params.uid !== this.user.uid;
				this._projectsService.currentProjectKey = params.key;
				this.boards$ = this._projectsService.getBoards().snapshotChanges();
				this.project$ = this._projectsService.getProject().snapshotChanges();
				return this.project$;
			})
			.subscribe((action: AngularFireAction<any>) => {
				if (!action) {
					this._router.navigate(['projects']);
				}
				this.project = action.payload.val(); // Store Project
				this.projectKey = action.payload.key;
				this.formModel.patchValue({
					title: this.project.title,
					description: this.project.description
				});
			});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this._projectsService.currentProjectKey = '';
		this._projectsService.authorId = '';
		this._projectsService.isCollectiveProject = false;
	}

	private errorHandler(err: Error): void {
		console.error(`${this.constructor.name}: `, err);
	}
}
