import { Component, OnDestroy, OnInit } from '@angular/core';

// Classes
import { Project } from '../project/project.class';

// Services
import { ProjectsService } from '../../projects.service';
import { UserService } from '../../user.service';
import { ModalService } from '../../modal.service';

// Firebase
import { AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/zip';

// Animations
import { fadeInUpAnimation } from '../../_animations/fade-in-up.animation';
import { fadeInAnimation } from '../../_animations/fade-in.animation';


// Components
import { FormAddProjectComponent } from '../form-add-project/form-add-project.component';

@Component({
	selector: 'a-projects-panel',
	templateUrl: './projects-panel.component.html',
	styleUrls: ['./projects-panel.component.scss'],
	animations: [fadeInAnimation, fadeInUpAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class ProjectsPanelComponent implements OnInit, OnDestroy {
	public msg: string = '';
	public hiddeSpiner: boolean = false;
	public projects: Project[];
	public collectiveProjects$: Observable<AngularFireAction<any>[]>;
	public projectsSubscription$$: Subscription;
	public projectsSubscription: Subscription;
	public fullUserSubscription: Subscription;
	public userExtraDataSubscription: Subscription;

	public constructor(
		private _userService: UserService,
		private _projectsService: ProjectsService,
		private _modalService: ModalService
	) {}

	public openFormAddProject(): void {
		this._modalService.open({
			component: FormAddProjectComponent,
			modalClass: 'modal--white',
			context: {}
		});
	}

	public ngOnInit(): void {
		// Get User Data for Projects requests
		this.userExtraDataSubscription = this._userService
			.userExtraData$.subscribe((userExtraData: any) => {
				// Get Own Projects
				this.projectsSubscription = this._projectsService.getProjects().snapshotChanges()
					.catch((err: string ) => {
						console.warn(err);
						this.hiddeSpiner = true;
						this.msg = err;
						return Observable.from([]);
					})
					.subscribe((projects: Project[]) => {
						this.hiddeSpiner = true;
						this.projects = projects;
						if (!projects.length) {
							this.msg = `You don't have own Projects yet.`;
							return;
						}
						this.msg = '';
					});

				// Get Collective Projects
				console.log(userExtraData.collectiveProjects);
				if (userExtraData.collectiveProjects
					&& Object.keys(userExtraData.collectiveProjects).length > 0) {
					this.collectiveProjects$ = this._projectsService.getCollectiveProjects(userExtraData.collectiveProjects);
					this.collectiveProjects$.subscribe((some: any) => {
						console.log(some);
					});
				}
			});
	}

	public ngOnDestroy(): void {
		this.projectsSubscription.unsubscribe();
		this.userExtraDataSubscription.unsubscribe();
	}
}
