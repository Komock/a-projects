import { Component, HostListener, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRouteSnapshot, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

// Firebase
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireObject, AngularFireAction } from 'angularfire2/database';

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
	public constructor() {}
	public ngOnInit(): void {
		this.board = this.boardAction.payload.val();
		this.boardKey = this.boardAction.payload.key;
	}
}