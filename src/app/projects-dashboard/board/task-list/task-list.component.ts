import { Component, OnInit } from '@angular/core';
import {AnimationTriggerMetadata, trigger, transition, style, animate, query} from '@angular/animations';
import * as firebase from 'firebase/app';

// Services
import { ProjectsService } from '../../../projects.service';
import { UserService } from '../../../user.service';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

// FB
import { AngularFireAction } from 'angularfire2/database';

// Classes
import { Project } from '../../project/project.class';
import { Task } from './task/task.class';

const taskAnimation: any =
	trigger('taskAnimation', [
		transition('void <=> *', [ // each time the binding value changes
			query(':leave', [
				style({ height: '!' }),
				animate('0.3s', style({
					opacity: 0,
					height: 0
				}))
			], { optional: true }),
			query(':enter', [
				style({
					opacity: 0,
					height: 0
				}),
				animate('0.3s', style({
					opacity: 1,
					height: '!'
				}))
			], { optional: true })
		])
	]);

@Component({
	selector: 'a-task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.scss'],
	animations: [taskAnimation],
})
export class TaskListComponent implements OnInit {
	public msg: string = '';
	public taskList: Task[];
	public fullTaskList: Task[];
	public user: firebase.User;
	public selectedStatus: string = 'all';
	public selectedTaskKey: string;
	public statuses: HashMap[] = [
			{ name: 'All', val: 'all' },
			{ name: 'Completed', val: 'completed' },
			{ name: 'Pended', val: 'pended' },
			{ name: 'Expired', val: 'expired' }
		];
	public constructor (
		private _userService: UserService,
		private _projectsService: ProjectsService
	) { }

	// ====== Task Actions
	public addTask(): void {
		this._projectsService.getTasks()
			.push(new Task({ title: 'New Task'}));
	}

	public filterTaskList(e: any): void {
		if (e.value === 'all') {
			this.taskList = this.fullTaskList;
			return;
		}
		this.taskList = this.fullTaskList.filter((task: Task) => task.status === e.value);
	}

	public ngOnInit(): void {
		this._userService.user$
			.switchMap((user: firebase.User) => {
				this.user = user;
				return this._projectsService.getTasks().snapshotChanges();
			})
			.map((tasksActions: AngularFireAction<any>[]) => {
				const tasks: Task[] = [];
				tasksActions.forEach((action: AngularFireAction<any>) => {
					const task: Task = action.payload.val();
					task.$key = action.payload.key;
					tasks.push(task);
				});
				return tasks;
			})
			.subscribe((tasks: Task[]) => {
				this.fullTaskList = tasks.slice();
				this.msg = '';
				if (this.selectedStatus === 'all') {
					this.taskList = tasks;
				} else {
					this.taskList = this.fullTaskList
						.filter((task: Task) => task.status === this.selectedStatus);
				}
				if (!tasks.length) {
					this.msg = 'No tasks added yet';
					return;
				}
			});
		this._projectsService.activeTask$$
			.subscribe((task: Task) => {
				if (task) {
					this.selectedTaskKey = task.$key;
				}
			});
	}

	private errorHandler(err: Error): void {
		console.error(`${this.constructor.name}: `, err);
	}

}
