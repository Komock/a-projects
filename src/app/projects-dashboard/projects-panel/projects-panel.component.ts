import { Component, OnDestroy, OnInit } from '@angular/core';

// Classes
import { Project } from '../project/project.class';

// Services
import { ProjectsService } from '../../projects.service';
import { UserService } from '../../user.service';
import { ModalService } from '../../modal.service';

// Firebase
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
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
	public projects: FirebaseListObservable<Project[]>;
	public collectiveProjects: Observable<Project[]>;
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
		// Own Projects Subscription
		this.projectsSubscription$$ = this._projectsService.projectsSubject$$
			.catch((err: string ) => {
				console.warn(err);
				this.hiddeSpiner = true;
				this.msg = err;
				return Observable.from([]);
			})
			.subscribe((projects$: FirebaseListObservable<Project[]>) => {
				this.projects = projects$;
				this.projectsSubscription = this.projects.subscribe((projects: Project[]) => {
					if (!projects.length) {
						this.msg = `You don't have own Projects yet.`;
						return;
					}
					this.msg = '';
				});
				this.hiddeSpiner = true;
			});

		// Get User Data for Projects requests
		this.userExtraDataSubscription = this._userService
			.userExtraData$.subscribe((userExtraData: any) => {
				if (!userExtraData) {
					return;
				}
				// Get Own Projects
				this._projectsService.getProjects(userExtraData.uid);

				// Get Collective Projects
				if (userExtraData.collectiveProjects
					&& Object.keys(userExtraData.collectiveProjects).length > 0) {
					this.collectiveProjects = this._projectsService.getCollectiveProjects(userExtraData.collectiveProjects);
				}
			});
	}

	public ngOnDestroy(): void {
		console.log('ngOnDestroy panel');
		this.projectsSubscription.unsubscribe();
		this.projectsSubscription$$.unsubscribe();
		this.userExtraDataSubscription.unsubscribe();
	}
}
