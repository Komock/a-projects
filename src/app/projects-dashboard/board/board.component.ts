import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';

// Services
import { TitleService } from '../../title.service';
import { ProjectsService } from '../../projects.service';
import { UserService } from '../../user.service';

// RX
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/switchMap';

// Animations
import { fadeInAnimation } from '../../_animations/fade-in.animation';

// Classes
import { Project } from '../project/project.class';
import { Board } from '../board/board.class';
import { Task } from '../task/task.class';

@Component({
	selector: 'a-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	animations: [fadeInAnimation],
	host: { '[@fadeInAnimation]': '' }
})
export class BoardComponent implements OnInit, OnDestroy {
	public board: Board;
	public user: firebase.User;
	public key: string;
	public boardModel: FormGroup;
	public activatedRouteSubscription: Subscription;
	public activeTask: Task | null = null;

	public constructor(
		private _router: Router,
		private _activatedRoute: ActivatedRoute,
		private _projectsService: ProjectsService,
		private _db: AngularFireDatabase,
		private _userService: UserService,
		private _titleService: TitleService,
		private _formBuilder: FormBuilder
	) { }

	public back(): void {
		this._router.navigateByUrl(`projects/${this._projectsService.currentProjectKey}`);
	}

	public deleteBoard(key: string): void {
		this._router.navigate([`projects/${this._projectsService.currentProjectKey}`])
			.then(() => {
				this._projectsService.deleteBoard(key);
			});
	}

	@HostListener('window:keyup', ['$event.keyCode'])
	public escBack(code: number = 27): void {
		if (code !== 27) {
			return;
		}
		this.back();
	}

	public updateBoard(e: Event | any): void {
		const el: HTMLInputElement = e.srcElement;
		this._projectsService.getBoard()
			.update({ [el.name]: el.value })
			.catch(this.errorHandler);
	}


	public ngOnInit(): void {
		this.activatedRouteSubscription = this._activatedRoute.params
			.switchMap((params: { key: string}) => {
				this.key = params.key;
				this._projectsService.currentBoardKey = this.key;
				return this._userService.user$;
			})
			.switchMap((user: firebase.User) => {
				this.user = user;
				return this._projectsService.getBoard();
			})
			.subscribe((board: Board) => {
				this.board = board;
				this.boardModel = this._formBuilder.group({
					title: [board.title, [Validators.required, Validators.minLength(4)]],
					description: [board.description || '', []]
				});
			});

			this._projectsService.activeTask$$
				.subscribe((val: Task | null) => {
					this.activeTask = val;
				});

	}

	public ngOnDestroy(): void {
		this.activatedRouteSubscription.unsubscribe();
		this._projectsService.currentBoardKey = '';
	}

	private errorHandler(err: Error): void {
		console.error(`${this.constructor.name}: `, err);
	}

}
