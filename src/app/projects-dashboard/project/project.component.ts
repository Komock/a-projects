import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
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

import { Task } from '../task/task.class';

@Component({
	selector: 'a-project',
	templateUrl: './project.component.html',
	styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {
	public projectPath: string;
	public project: any;
	public projectSubscription: Subscription;
	public user: firebase.User;
	public firebaseProject: FirebaseObjectObservable<Project>;
	public formModel: FormGroup;
	public events: any[] = [];
	public title: FormControl = new FormControl();

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
		const tasksArray: FormArray = this.formModel.get('tasks') as FormArray;
		const index: number = tasksArray.length;

		// Add new default task
		this._db.object(`${this.projectPath}/tasks/${index}`)
			.set( new Task({ title: 'New task'}) )
			.catch(this.errorHandler);
	}

	public updateTask(updatedTask: {task: Task, index: number}): void {
		this._db.object(`${this.projectPath}/tasks/${updatedTask.index}`)
			.update(updatedTask.task)
			.catch(this.errorHandler);
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

		this._db.object(`${this.projectPath}/tasks/`)
			.set(tasksObj)
			.catch(this.errorHandler);
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
		// ==== Init form ==== //
		// =================== //
		this.formModel = this._formBuilder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			description: ['', []],
			tasks: this._formBuilder.array([])
		});

		// ==== Load Project ==== //
		// ====================== //
		const params$: Observable<any> = this._activatedRoute.params;
		const userExtraData$: Observable<any> = this._userService.userExtraData$; // User stream
		Observable.zip(params$, userExtraData$, (id: string, user: firebase.User) => ({id, user}))
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
						if (project.tasks) {
							this.formModel.setControl( 'tasks', this._formBuilder.array(project.tasks) );
						};

						this.project = project; // Store Project
						this._titleService.setTitle(project.title); // Set Page Title
					});
			});
	}

	public ngOnDestroy(): void {
		this.projectSubscription.unsubscribe();
	}

	private errorHandler(err: Error): void {
		console.error(err);
	}
}
