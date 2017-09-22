import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

import { Project } from '../project/project.class';

import { ProjectsService } from '../../projects.service';
import { ModalService } from '../../modal.service';

import { FirebaseObjectObservable } from 'angularfire2/database';

@Component({
	selector: 'a-project-thumb',
	templateUrl: './project-thumb.component.html',
	styleUrls: ['./project-thumb.component.scss']
})
export class ProjectThumbComponent implements OnInit {
	@Input() public isShared: boolean;
	@Input() public project: Project | FirebaseObjectObservable<Project>;
	public projectThumbUrlSave: SafeStyle;
	public constructor(
		private _sanitizer: DomSanitizer,
		private _projectsService: ProjectsService,
		private _modalService: ModalService
	) {}

	public ngOnInit(): void {
		if (!this.isShared) {
			const proj: Project = this.project as Project;
			if (proj.thumbUrl) {
				this.projectThumbUrlSave = this._sanitizer
					.bypassSecurityTrustStyle(`url('${proj.thumbUrl}')`);
			}
		}
	}
}
