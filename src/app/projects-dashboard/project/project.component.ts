import { Component, HostListener, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Project } from './project.class';

// Firebase
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

// Services
import { TitleService } from '../../title.service';
import { ProjectsService } from '../../projects.service';
import { UserService } from '../../user.service';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/zip';

// Animations
import { fadeInUpAnimation } from '../../_animations/fade-in-up.animation';
import { fadeInAnimation } from '../../_animations/fade-in.animation';

// Classes
import { Task } from '../task/task.class';

import {AnimationTriggerMetadata, trigger, transition, style, animate, query} from '@angular/animations';

const taskAnimation: any =
	trigger('taskAnimation', [
		transition('* => *', [ // each time the binding value changes
			query(':leave', [
				// style({ height: '!' }),
				animate('0.3s', style({
					opacity: 0,
					// height: 0,
					transform: 'scale(0.8)'
				}))
			], { optional: true }),
			query(':enter', [
				style({
					opacity: 0,
					// height: 0,
					transform: 'scale(0.9)'
				}),
				animate('0.3s', style({
					opacity: 1,
					// height: '!',
					transform: 'scale(1)'
				}))
			], { optional: true })
		])
	]);

@Component({
	selector: 'a-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss'],
	animations: [fadeInAnimation, fadeInUpAnimation, taskAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class ProjectComponent implements OnInit, OnDestroy {
	public projectPath: string;
	public project: any;
	public projectSubscription: Subscription;
	public userDataSubscription: Subscription;
	public user: firebase.User;
	public firebaseProject: FirebaseObjectObservable<Project>;
	public formModel: FormGroup;
	public tasksArray: FormArray;
	public events: any[] = [];
	public title: FormControl = new FormControl();
	public isIntialProjectData: boolean = true;

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

	@HostListener('window:keyup', ['$event.keyCode'])
	public escBack(code: number = 27): void {
		if (code !== 27) {
			return;
		}
		this.back();
	}


	// ====== Project Actions
	// ======================
	public deleteProject(key: string): void {
		this._projectsService.removeProject(key)
			.then(() => {
				this.back();
			});
	}

	public updateProject(e: Event | any): void {
		const el: HTMLInputElement = e.srcElement;
		this._db.object(this.projectPath).update({
			[el.name]: el.value
		})
		.catch(this.errorHandler);
	}


	// ====== Task Actions
	// ===================
	public addTask(): void {
		// Add new default task to DB
		// const length: number = this.tasksArray ?  : 0;
		this._db.object(`${this.projectPath}/tasks/${this.tasksArray.length}`)
			.set( new Task({ title: 'New task'}) )
			.catch(this.errorHandler);
			// .then(() => {});
			// Update view
			this.tasksArray.push(new FormControl(new Task({ title: 'New task'})));
	}

	public updateTask(updatedTask: {task: Task, index: number}): void {
		this._db.object(`${this.projectPath}/tasks/${updatedTask.index}`)
			.update(updatedTask.task)
			.catch(this.errorHandler);
			// .then(() => {});
			// Update view
			this.formModel.controls.tasks['controls'][updatedTask.index].patchValue(updatedTask.task);

	}

	public deleteTask(i: number): void {
		const tasksObj: {[key: string]: Task} = {};
		let newIndex: number = 0;
		this.project.tasks.forEach((task: Task, index: number) => {
			if (index !== i) {
				tasksObj[newIndex] = task;
				++newIndex;
			}
		});
		// Update DB
		this._db.object(`${this.projectPath}/tasks/`)
			.set(tasksObj)
			.catch(this.errorHandler);
			// .then(() => {});
		// Update view
		this.tasksArray.removeAt(i);
	}

	// ==== Participant Actions ==== //
	// ============================= //
	public addParticipant(obj: {[key: string]: User}): void {
		console.log('obj: ', obj);
		const participantId: string = Object.keys(obj)[0];
		const participant: User = obj[participantId];

		console.log(`projects/${this.user.uid}/${this.project.$key}`);
		this._db.list(`projects/${this.user.uid}/${this.project.$key}/participants`)
			.push({
				uid: participantId,
				email: participant.email,
				displayName: participant.displayName,
				photoURL: participant.photoURL || ''
			})
			.catch(this.errorHandler);
	}

	public ngOnInit(): void {
		// ==== Init Project ==== //
		// ====================== //
		this.formModel = this._formBuilder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			description: ['', []],
			tasks: this._formBuilder.array([])
		});

		// ==== Load Project ==== //
		// ====================== //
		const params$: Observable<any> = this._activatedRoute.params;
		const userExtraData$: Observable<any> = this._userService.userExtraData$; // User stream
		this.userDataSubscription = Observable.zip(params$, userExtraData$, (id: string, user: firebase.User) => ({id, user}))
			.subscribe((result: any) => {
				this.user = result.user; // Store User
				this.projectPath = `/projects/${this.user.uid}/${result.id.id}`;
				this.firebaseProject = this._db.object(this.projectPath); // Store FB Project
				this.projectSubscription = this.firebaseProject
					.subscribe((project: Project) => {
						this.formModel.patchValue({
							title: project.title,
							description: project.description
						});

						if (this.isIntialProjectData) {
							if (project.tasks) {
								this.formModel.setControl('tasks', this._formBuilder.array(project.tasks));
							}
							this.isIntialProjectData = false;
						}
						this.tasksArray = this.formModel.get('tasks') as FormArray;
						this.project = project; // Store Project
						this._titleService.setTitle(project.title); // Set Page Title
					});
			});
	}

	public ngOnDestroy(): void {
		this.projectSubscription.unsubscribe();
		this.userDataSubscription.unsubscribe();
	}

	private errorHandler(err: Error): void {
		console.error(err);
	}
}
