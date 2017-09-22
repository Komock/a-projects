import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { Project } from './projects-dashboard/project/project.class';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/zip';

@Injectable()
export class ProjectsService {
	public projects: FirebaseListObservable<Project[]>;
	public projectsSubject$$: Subject<FirebaseListObservable<Project[]>> =
		new Subject < FirebaseListObservable<Project[]> > ();

	public constructor(
		public _db: AngularFireDatabase
	) {}

	// Own Projects
	public getProjects(uid: string): void {
		console.log('ProjectsService.getProjects: ', uid);
		this.projects = this._db.list(`/projects/${uid}`);
		this.projectsSubject$$.next(this.projects);
	}

	// Collective Projects
	public getCollectiveProjects(projectsObj: {[key: string]: any}): Observable<Project[]> {
		const projectsObservablesArr: FirebaseObjectObservable<Project>[] = [];
		console.log('projectsObj: ', projectsObj);
		Object.keys(projectsObj)
			.forEach((key: string) => {
				const projectObservable$: FirebaseObjectObservable<Project> = this._db
					.object(`projects/${key}/${projectsObj[key]}`);
				projectsObservablesArr.push(projectObservable$);
			});
		return Observable.zip(...projectsObservablesArr);
	}

	public addProject(project: Project): void {
		this.projects.push(project);
	}

	public removeProject(key: string): firebase.Promise<void> {
		return this.projects.remove(key);
	}

}
