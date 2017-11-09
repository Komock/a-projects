import { Component, HostListener, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Project } from './project.class';

// Firebase
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

// Services
import { TitleService } from '../../title.service';
import { ProjectsService } from '../../projects.service';
import { UserService } from '../../user.service';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

// Animations
import { fadeInUpAnimation } from '../../_animations/fade-in-up.animation';
import { fadeInAnimation } from '../../_animations/fade-in.animation';

// Classes
import { Task } from '../task/task.class';
import { Board } from '../board/board.class';

import { AnimationTriggerMetadata, trigger, transition, style, animate, query } from '@angular/animations';


@Component({
	selector: 'a-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
	animations: [fadeInAnimation, fadeInUpAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class ProjectComponent implements OnInit, OnDestroy {
	public project: any;
	public projectSubscription: Subscription;
	public boards$: FirebaseListObservable<Board[]>;
	public userDataSubscription: Subscription;
	public user: firebase.User;
	public firebaseProject: FirebaseObjectObservable<Project>;
	public formModel: FormGroup;
	public tasksArray: FormArray;

	public constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _formBuilder: FormBuilder,
		private _projectsService: ProjectsService,
		private _userService: UserService,
		private _titleService: TitleService,
		private _db: AngularFireDatabase,
	) {}

	public get pageTitle(): string {
		return this.project.title;
	}

	public back(): void {
		this._router.navigate(['projects']);
	}

	// @HostListener('window:keyup', ['$event.keyCode'])
	// public escBack(code: number = 27): void {
	// 	if (code !== 27) {
	// 		return;
	// 	}
	// 	this.back();
	// }


	// ==== Project Actions ==== //
	public deleteProject(key: string): void {
		this._router.navigate(['projects']);
		this._projectsService.deleteProject(this.user.uid, key);
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
		console.log(Board);
		this._projectsService.addBoard(new Board({ title: 'New Board!'}));
	}

	public ngOnInit(): void {
		// ==== Project Info Form Model ==== //
		this.formModel = this._formBuilder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			description: ['', []]
		});


		// ==== Load Project ==== //
		this.userDataSubscription = this._userService.userExtraData$
			.switchMap((user: firebase.User) => {
				this.user = user; // Store User
				return this._activatedRoute.params;
			})
			.subscribe((params: Params) => {
				this._projectsService.currentProjectKey = params.key;
				this.firebaseProject = this._projectsService.getProject();
				this.boards$ = this._projectsService.getBoards();
				this.projectSubscription = this.firebaseProject
					.subscribe((project: Project) => {
						if (!(project as any).$exists()) {
							this._router.navigate(['projects']);
							return;
						}
						this.formModel.patchValue({
							title: project.title,
							description: project.description
						});
						this.project = project; // Store Project
					});
			});
	}

	public ngOnDestroy(): void {
		this.projectSubscription.unsubscribe();
		this.userDataSubscription.unsubscribe();
		this._projectsService.currentProjectKey = '';
	}

	private errorHandler(err: Error): void {
		console.error(`${this.constructor.name}: `, err);
	}
}
