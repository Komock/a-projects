import { Component, HostListener, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

// Firebase
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from 'angularfire2/database';

// Services
import { UserService } from '../../user.service';
import { ProjectsService } from '../../projects.service';

// Classes
import { Board } from '../board/board.class';

@Component({
	selector: 'a-board-thumb',
	templateUrl: './board-thumb.component.html',
	styleUrls: ['./board-thumb.component.scss']
})
export class BoardThumbComponent implements OnInit {
	@Input() public boardAction: AngularFireAction<any>;
	@Input() public projectKey: string;
	public boardKey: string;
	public board: Board;
	public uid: string;
	public user: firebase.User;
	public constructor(
		private _userService: UserService,
		private _projectsService: ProjectsService
	) {}
	public ngOnInit(): void {
		this._userService.user$
			.subscribe((user: firebase.User) => {
				this.user = user;
				this.uid = this._projectsService.authorId;
				this.board = this.boardAction.payload.val();
				this.boardKey = this.boardAction.payload.key;
			});
	}
}