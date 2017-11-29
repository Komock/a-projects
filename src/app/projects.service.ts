import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject,
	AngularFireAction, DatabaseReference } from 'angularfire2/database';
import * as firebase from 'firebase/app';

// Services
import { UserService } from './user.service';

// Classes
import { Project } from './projects-dashboard/project/project.class';
import { Board } from './projects-dashboard/board/board.class';
import { Task } from './projects-dashboard/board/task-list/task/task.class';

// RX
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class ProjectsService {
	public user: firebase.User;
	public authorId: string;
	public isCollectiveProject: boolean = false;
	public projects$: AngularFireList<Project>;
	public tasks$: AngularFireList<Task>;
	public currentProjectKey: string;
	public currentBoardKey: string;
	public currentTaskKey: string;
	public currentTaskKey$$: Subject< Task | null> = new Subject();

	public constructor(
		public _db: AngularFireDatabase,
		public _userService: UserService
	) {
		this._userService.user$
			.subscribe((user: firebase.User) => {
				this.user = user;
			});
		this.currentTaskKey$$
			.subscribe((task: Task) => {
				if (task) {
					this.currentTaskKey = task.$key;
				}
			});
	}

	public dataPath(target: string): string {
		const uid: string = this.isCollectiveProject ? this.authorId : this.user.uid;
		switch (target) {
			case 'projects':
				return `projects/${uid}`;
			case 'project':
				return `projects/${uid}/${this.currentProjectKey}`;
			case 'boards':
				return `boards/${uid}/${this.currentProjectKey}`;
			case 'board':
				return `boards/${uid}/${this.currentProjectKey}/${this.currentBoardKey}`;
			case 'tasks':
				return `tasks/${uid}/${this.currentProjectKey}/${this.currentBoardKey}`;
			case 'task':
				return `tasks/${uid}/${this.currentProjectKey}/${this.currentBoardKey}/${this.currentTaskKey}`;
			case 'participants':
				return `projects/${uid}/${this.currentProjectKey}/participants`;
			default:
				return 'Path error!';
		}
	}


	// ==== Projects Actions
	public getProjects(): AngularFireList<Project> {
		this.projects$ = this._db.list('/projects',
			(ref: DatabaseReference) => ref.orderByChild('authorId').equalTo(this.user.uid));
		return this.projects$;
	}

	public getCollectiveProjects(collectiveProjectsObj: {[key: string]: any}): Observable<AngularFireAction<any>[]> {
		const projectsObservablesArr: Observable<AngularFireAction<any>>[] = [];
		Object.keys(collectiveProjectsObj)
			.forEach((key: string) => {
				const project$: Observable<AngularFireAction<any>> = this._db
					.object(`projects/${collectiveProjectsObj[key].authorId}/${key}`).snapshotChanges();
				projectsObservablesArr.push(project$);
			});
		return Observable.zip(...projectsObservablesArr);
	}

	public getParticipants(): AngularFireList<Participant> {
		return this._db.list(this.dataPath('participants'));
	}

	public addParticipant(participant: Participant): firebase.database.ThenableReference {
		return this.getParticipants().push(participant);
	}


	// ==== Single Project Actions
	public getProject(): AngularFireObject<Project> {
		return this._db.object(this.dataPath('project'));
	}

	public addProject(project: Project): void {
		this.getProjects().push(project)
			.then((projRef: any) => { // Add First Board
				this.currentProjectKey = projRef.key;
				this.getBoards().push(new Board({ title: 'First board'}));
				this.currentProjectKey = '';
			});
	}

	public deleteProject(key: string): Observable<any[]> {
		return Observable.forkJoin([
			this.getProject().remove(),
			this.getBoards().remove(),
			this.getTasks().remove()
		]);
	}

	// ==== Boards Actions
	public getBoards(): AngularFireList<Board> {
		return this._db.list(this.dataPath('boards'));
	}

	// ==== Single Board Actions
	public getBoard(): AngularFireObject<Board> {
		return this._db.object(this.dataPath('board'));
	}

	public addBoard(board: Board): firebase.database.ThenableReference {
		return this.getBoards().push(board);
	}

	public deleteBoard(key: string): Observable<any[]> {
		return Observable.forkJoin([ this.getBoard().remove(), this.getTasks().remove() ]);
	}


	// ==== Tasks Actions
	public getTasks(): AngularFireList<Task> {
		return this._db.list(this.dataPath('tasks'));
	}

	public deleteTask(key: string): Promise<void> {
		return this.getTasks().remove(key);
	}

	// ==== Single Task Actions
	public getTask(key: string): AngularFireObject<Task> {
		return this._db.object(`${this.dataPath('tasks')}/${key}`);
	}

	public updateTask(key: string, upd: any): Promise<void> {
		return this.getTask(key).update(upd);
	}

}
