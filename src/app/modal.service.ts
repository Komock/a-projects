import { Component, Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ModalService {

	private _modalSequence$$: Subject<any> = new Subject();

	// Open
	public open(componentObj: { component: any, context: any, modalClass: string }): void {
		this._modalSequence$$.next(componentObj);
	}

	// Close
	public close(): void {
		this._modalSequence$$.next(null)
	}

	public get modalSequence$(): Observable<any> {
		return this._modalSequence$$.asObservable();
	}

	constructor() { }

}
