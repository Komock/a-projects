import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable()
export class TitleService {

	public constructor (
		private _title: Title
	) {}

	public setTitle(title: string): void {
		this._title.setTitle(title);
	}

}
