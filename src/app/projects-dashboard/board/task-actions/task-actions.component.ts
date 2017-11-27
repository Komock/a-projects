import { Component, OnInit, OnDestroy } from '@angular/core';

// RX
import { Subscription } from 'rxjs/Subscription';

// Services
import { ProjectsService } from '../../../projects.service';

// Classes
import { Task } from '../task-list/task/task.class';

@Component({
	selector: 'a-task-actions',
	templateUrl: './task-actions.component.html',
	styleUrls: ['./task-actions.component.scss']
})
export class TaskActionsComponent implements OnInit, OnDestroy {

	public activeTask: Task | null = null;
	public subscription: Subscription;

	public constructor(
		private _projectsService: ProjectsService
	) { }

	public closeTaskActions(): void {
		this._projectsService.currentTaskKey$$.next(null);
	}

	public delete(): void {
		this._projectsService.deleteTask(this.activeTask.$key);
		this._projectsService.currentTaskKey$$.next(null);
	}

	public updateTitleView(e: KeyboardEvent): void {
		this.activeTask.title = (e.target as HTMLTextAreaElement).value;
		this._projectsService.currentTaskKey$$.next(this.activeTask);
	}

	public updateTitle(e: KeyboardEvent): void {
		this._projectsService.updateTask(this.activeTask.$key, {
			title: (event.target as HTMLInputElement).value
		});
	}

	public ngOnInit(): void {
		this.subscription = this._projectsService.currentTaskKey$$
			.subscribe((task: Task | null) => {
				this.activeTask = task;
				return;
			});
	}

	public ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

}
