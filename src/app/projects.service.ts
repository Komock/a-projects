import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Services
import { UserService } from './user.service';

// Classes
import { Project } from './projects-dashboard/project/project.class';
import { Board } from './projects-dashboard/board/board.class';
import { Task } from './projects-dashboard/task/task.class';

// RX
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';

@Injectable()
export class ProjectsService {
	public user: firebase.User;
	public projects$: FirebaseListObservable<Project[]>;
	public tasks$: FirebaseListObservable<Task[]>;
	public currentProjectKey: string;
	public currentBoardKey: string;
	public activeTask$$: Subject< Task | null> = new Subject();

	public constructor(
		public _db: AngularFireDatabase,
		public _userService: UserService
	) {
		this._userService.user$
			.subscribe((user: firebase.User) => {
				this.user = user;
			});
	}

	public dataPath(target: string): string {
		const uid: string = this.user.uid;
		switch (target) {
			case 'projects':
				return `projects/${uid}`;
			case 'project':
				return `projects/${uid}/${this.currentProjectKey}`;
			case 'participants':
				return `projects/${uid}/${this.currentProjectKey}/participants`;
			case 'boards':
				return `projects/${uid}/${this.currentProjectKey}/boards`;
			case 'board':
				return `projects/${uid}/${this.currentProjectKey}/boards/${this.currentBoardKey}`;
			case 'tasks':
				return `projects/${uid}/${this.currentProjectKey}/boards/${this.currentBoardKey}/tasks`;
			default:
				return 'Path error!';
		}
	}


	// ==== Projects Actions
	public getProjects(): FirebaseListObservable<Project[]> {
		this.projects$ = this._db.list(this.dataPath('projects'));
		return this.projects$;
	}

	public getCollectiveProjects(projectsObj: {[key: string]: any}): Observable<Project[]> {
		const projectsObservablesArr: FirebaseObjectObservable<Project>[] = [];
		Object.keys(projectsObj)
			.forEach((key: string) => {
				const projectObservable$: FirebaseObjectObservable<Project> = this._db
					.object(`projects/${key}/${projectsObj[key]}`);
				projectsObservablesArr.push(projectObservable$);
			});
		return Observable.zip(...projectsObservablesArr);
	}

	public getParticipants(): FirebaseListObservable<{ uid: string }[]> {
		return this._db.list(this.dataPath('participants'));
	}

	public addParticipant(participant: Participant): firebase.Promise<void> {
		return this.getParticipants().push(participant);
	}


	// ==== Single Project Actions
	public getProject(): FirebaseObjectObservable<Project> {
		return this._db.object(this.dataPath('project'));
	}

	public addProject(uid: string, project: Project): void {
		this.getProjects().push(project)
			.then((projRef: any) => { // Add First Board
				this.getBoards().push(new Board({ title: 'First board'}));
			});
	}

	public deleteProject(uid: string, key: string): firebase.Promise<void> {
		return this.getProjects().remove(key);
	}

	// ==== Boards Actions
	public getBoards(): FirebaseListObservable<Board[]> {
		return this._db.list( this.dataPath('boards') );
	}

	// ==== Single Board Actions
	public getBoard(): FirebaseObjectObservable<Board> {
		return this._db.object(this.dataPath('board'));
	}

	public addBoard(board: Board): firebase.Promise<void> {
		return this.getBoards().push(board);
	}

	public deleteBoard(key: string): firebase.Promise<void> {
		return this.getBoards().remove(key);
	}


	// ==== Tasks Actions
	public getTasks(): FirebaseListObservable<Task[]> {
		return this._db.list(this.dataPath('tasks'));
	}

	public deleteTask(key: string): firebase.Promise<void> {
		return this.getTasks().remove(key);
	}

	// ==== Single Task Actions
	public getTask(key: string): FirebaseObjectObservable<Task[]> {
		return this._db.object(`${this.dataPath('tasks')}/${key}`);
	}

	public updateTask(key: string, upd: any): firebase.Promise<void> {
		return this.getTask(key).update(upd);
	}

}
