import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Router, Params } from '@angular/router';

// Firebase
import * as firebase from 'firebase/app';

// Classes
import { Project } from '../project/project.class';

import { AngularFireAction } from 'angularfire2/database';

@Component({
	selector: 'a-project-thumb',
	templateUrl: './project-thumb.component.html',
	styleUrls: ['./project-thumb.component.scss']
})
export class ProjectThumbComponent implements OnInit {
	@Input() public isCollective: boolean;
	@Input() public projectAction: AngularFireAction<any>;
	public project: Project;
	public projectThumbUrlSave: SafeStyle;
	public user: firebase.User;
	public constructor(
		private _sanitizer: DomSanitizer
	) {}

	public ngOnInit(): void {
		this.project = this.projectAction.payload.val();
		this.project.$key = this.projectAction.payload.key;

		if (this.isCollective) {
			if (this.project.thumbUrl) {
				this.projectThumbUrlSave = this._sanitizer
					.bypassSecurityTrustStyle(`url('${this.project.thumbUrl}')`);
			}
		}
	}
}
