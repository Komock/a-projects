import { Component, OnInit } from '@angular/core';

import { ProjectsService } from '../../../projects.service';
import { Task } from '../../task/task.class';

@Component({
	selector: 'a-task-actions',
	templateUrl: './task-actions.component.html',
	styleUrls: ['./task-actions.component.scss']
})
export class TaskActionsComponent implements OnInit {

	public activeTask: Task | null = null;

	public constructor(
		private _projectsService: ProjectsService
	) { }

	public closeTaskActions(): void {
		this._projectsService.activeTask$$.next(null);
	}

	public delete(): void {
		this._projectsService.deleteTask(this.activeTask.$key);
		this._projectsService.activeTask$$.next(null);
	}

	public updateTitleView(e: KeyboardEvent): void {
		this.activeTask.title = (e.target as HTMLTextAreaElement).value;
		this._projectsService.activeTask$$.next(this.activeTask);
	}

	public updateTitle(e: KeyboardEvent): void {
		this._projectsService.updateTask(this.activeTask.$key, {
			title: (event.target as HTMLInputElement).value
		});
	}

	public ngOnInit(): void {
		this._projectsService.activeTask$$
			.subscribe((task: Task | null) => {
				// if (!this.activeTask) {
					this.activeTask = task;
					return;
				// }
				// if ( task ) { // && this.activeTask.$key === task.$key
				// 	this.activeTask = task;
				// }
			});
	}

}
