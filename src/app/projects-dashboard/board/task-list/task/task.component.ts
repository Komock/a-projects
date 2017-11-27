import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import * as firebase from 'firebase/app';

// Services
import { TitleService } from '../../../../title.service';
import { ProjectsService } from '../../../../projects.service';
import { UserService } from '../../../../user.service';

// FB
import { AngularFireAction } from 'angularfire2/database';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// Classes
import { Task } from './task.class';

@Component({
	selector: 'a-task',
	templateUrl: './task.component.html',
	styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
	@Input() public taskAction: AngularFireAction<any>;
	@Input() public index: number;
	public task: Task;
	// public taskMoreLink: string;
	public user: firebase.User;
	public isActive: boolean = false;
	public activeTaskSubscription: Subscription;
	public constructor(
		private _userService: UserService,
		private _projectsService: ProjectsService
	) {}

	public delete(): void {
		this._projectsService.deleteTask(this.task.$key);
	}

	public updateTitle(e: Event): void {
		const input: HTMLInputElement = e.target as HTMLInputElement;
		this._projectsService.updateTask(this.task.$key, { title: input.value});
	}

	public updateTaskActionsTitle(e: KeyboardEvent): void {
		const input: HTMLInputElement = e.target as HTMLInputElement;
		this.task.title = input.value;
		this._projectsService.currentTaskKey$$.next(this.task);
	}

	public changeStatus(e: MatCheckboxChange): void {
		const status: 'pended' | 'completed' = e.checked ? 'completed' : 'pended';
		this.task.status = status;
		this._projectsService.currentTaskKey$$.next(this.task);
		setTimeout(() => {
			this._projectsService.updateTask(this.task.$key, { status });
		}, 400);
	}

	public showTaskActions(): void {
		this._projectsService.currentTaskKey$$.next(this.task);
	}

	public get taskStateClasses(): string {
		const stateClass: string = 'task--' + this.task.status;
		if (!this.isActive) {
			return stateClass;
		}
		return stateClass + ' task--active';
	}

	// TODO
	public ngOnInit(): void {
		this.task = this.taskAction.payload.val();
		this.task.$key = this.taskAction.key;
		// this.taskMoreLink =
		// `/projects/${this._projectsService.currentProjectKey}/${this._projectsService.currentBoardKey}/${this.task.$key}/`;
		if (this._projectsService.currentTaskKey === this.task.$key) {
			this.isActive = true;
		}

		this._userService.user$
			.subscribe((user: firebase.User) => {
				this.user = user;
			});

		this.activeTaskSubscription = this._projectsService.currentTaskKey$$
			.subscribe((task: Task | null) => {
				if (task && this.task.$key === task.$key) {
					this.isActive = true;
				} else {
					this.isActive = false;
				}
			});
	}

	public ngOnDestroy(): void {
		this.activeTaskSubscription.unsubscribe();
	}

}
