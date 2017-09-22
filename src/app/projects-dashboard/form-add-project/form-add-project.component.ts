import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { Project } from '../project/project.class';

import { ModalService } from '../../modal.service';
import { ProjectsService } from '../../projects.service';
import { UserService } from '../../user.service';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import { Observable } from 'rxjs/Observable';

import { Task } from '../task/task.class';
import { TaskComponent } from '../task/task.component';

@Component({
	selector: 'a-form-add-project',
	templateUrl: './form-add-project.component.html',
	styleUrls: ['./form-add-project.component.scss']
})
export class FormAddProjectComponent implements OnInit {
	public project: Project;
	public thumbFile: File;
	public fileUploadProgress: number = 0;
	public fileUploadError: string;
	public thumbBg: SafeStyle;
	public thumbLoading: boolean = false;
	public projects: FirebaseListObservable<Project[]>;

	private user: firebase.User;

	public constructor(
		private _projectsService: ProjectsService,
		private _userService: UserService,
		private _modalService: ModalService,
		private _sanitizer: DomSanitizer,
		private _firebaseApp: FirebaseApp
	) {}

	public onFileChange(input: HTMLInputElement): void {
		const file: File = input.files[0];
		if ( file.size > (1024 * 1024) ) {
			this.fileUploadError = 'File should be less than 1mb';
			return;
		}
		this.thumbFile = file;
		const fileReader: FileReader = new FileReader();
		fileReader.readAsDataURL(file);
		fileReader.onload = (e: ProgressEvent | any) => {
			this.thumbBg = this._sanitizer.bypassSecurityTrustStyle(`url('${e.target.result}')`);
		};
	}

	public uploadThumb(): firebase.storage.UploadTask {
		const storageRef: firebase.storage.Reference = this._firebaseApp.storage()
			.ref(`${this.user.uid}/thumb/${this.thumbFile.name}`);
		return storageRef.put(this.thumbFile);
	}

	public onSubmit(e: Event): void {
		e.preventDefault();
		console.log(this.project);
		this._projectsService.addProject(this.project);
		this._modalService.close();
		// if (this.thumbFile) {
		// 	const uploadTask: firebase.storage.UploadTask = this.uploadThumb();
		// 	uploadTask.on('state_changed',
		// 		// progress
		// 		(snapshot: any): void =>  {
		// 			console.log(snapshot);
		// 			this.fileUploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		// 		},
		// 		// error
		// 		(err: Error): void =>  {
		// 			console.warn(err);
		// 		},
		// 		// complete
		// 		(): void =>  {
		// 			this.project.thumbUrl = uploadTask.snapshot.downloadURL;
		// 			console.log('Upload completed!', this.project.thumbUrl);
		// 		}
		// 	);
		// }
	}

	public ngOnInit(): void {
		this._userService.user$
			.subscribe((user: firebase.User) => {
				this.user = user;
				this.project = new Project({
					title: '',
					description: '',
					ownerId: this.user.uid
				});
			});
	}
}
