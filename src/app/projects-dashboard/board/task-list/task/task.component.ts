import { Component, OnInit, Input } from '@angular/core';
import { MatCheckboxChange } from '@angular/material';
import * as firebase from 'firebase/app';

// Services
import { TitleService } from '../../../../title.service';
import { ProjectsService } from '../../../../projects.service';
import { UserService } from '../../../../user.service';

// FB
import { AngularFireAction } from 'angularfire2/database';

// Classes
import { Task } from './task.class';

@Component({
	selector: 'a-task',
	templateUrl: './task.component.html',
	styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
	@Input() public task: Task;
	@Input() public index: number;
	public user: firebase.User;
	public isActive: boolean = false;
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
		this._projectsService.activeTask$$.next(this.task);
	}

	public changeStatus(e: MatCheckboxChange): void {
		const status: 'pended' | 'completed' = e.checked ? 'completed' : 'pended';
		this.task.status = status;
		this._projectsService.activeTask$$.next(this.task);
		this._projectsService.updateTask(this.task.$key, { status });
	}

	public showTaskActions(): void {
		this._projectsService.activeTask$$.next(this.task);
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
		this._userService.user$
			.subscribe((user: firebase.User) => {
				this.user = user;
			});

		this._projectsService.activeTask$$
			.subscribe((task: Task | null) => {
				if (task && this.task.$key === task.$key) {
					this.isActive = true;
				} else {
					this.isActive = false;
				}
			});
	}
}
