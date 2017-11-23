import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Project } from '../project/project.class';

import { ProjectsService } from '../../projects.service';
import { ModalService } from '../../modal.service';

import { AngularFireObject, AngularFireAction, DatabaseSnapshot } from 'angularfire2/database';

@Component({
	selector: 'a-project-thumb',
	templateUrl: './project-thumb.component.html',
	styleUrls: ['./project-thumb.component.scss']
})
export class ProjectThumbComponent implements OnInit {
	@Input() public isShared: boolean;
	@Input() public projectAction: AngularFireAction<any>;
	public project: Project;
	public projectThumbUrlSave: SafeStyle;
	public constructor(
		private _sanitizer: DomSanitizer
	) {}

	public ngOnInit(): void {
		// console.log(this.projectAction.payload.val());
		this.project = this.projectAction.payload.val();
		this.project.$key = this.projectAction.payload.key;

		if (this.isShared) {
			console.log('isShared: ', this.projectAction.payload.val());
			const proj: Project = this.project as Project;
			if (proj.thumbUrl) {
				this.projectThumbUrlSave = this._sanitizer
					.bypassSecurityTrustStyle(`url('${proj.thumbUrl}')`);
			}
		} else {
			console.log('isShared false: ', this.projectAction.payload.val());
		}
	}
}
