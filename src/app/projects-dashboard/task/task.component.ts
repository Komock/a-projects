import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdCheckboxChange } from '@angular/material';

import { Task } from './task.class';

@Component({
	selector: 'a-task',
	templateUrl: './task.component.html',
	styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
	@Input()
	public task: FormControl;

	@Input()
	public index: number;

	@Input()
	public tabindex: number;

	@Output()
	public onDelete: EventEmitter<number> = new EventEmitter<number>();

	@Output()
	public onUpdate: EventEmitter<{index: number, task: Task}> = new EventEmitter<{index: number, task: Task}>();

	public constructor() {}

	public delete(index: number): void {
		this.onDelete.emit(index);
	}

	public updateTitle(e: Event): void {
		const el: HTMLInputElement = e.target as HTMLInputElement;
		const value: string = el.value;
		const updatedTask: Task = Object.assign({}, this.task.value);
		updatedTask.title = value;
		this.onUpdate.emit({
			index: this.index,
			task: updatedTask
		}, );
	}

	public changeStatus(status: 'pended' | 'completed' | 'expired'): void {
		const updatedTask: Task = Object.assign({}, this.task.value);
		updatedTask.status = status;
		this.onUpdate.emit({
			index: this.index,
			task: updatedTask
		}, );
	}

	public some(e: MdCheckboxChange): void {
		if (e.checked) {
			this.changeStatus('completed');
			return;
		}
		this.changeStatus('pended');
	}

	// TODO
	public ngOnInit(): void {
		// console.log(this.task);
	}
}
