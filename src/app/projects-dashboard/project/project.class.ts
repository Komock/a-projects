import { Board } from '../board/board.class';
export class Project {
	public authorId: string;
	public title: string;
	public description?: string;
	public thumbUrl?: string;
	public participants?: any[];
	public $key?: string;
	public creationDate?: number;
	public state?: string;
	public boards: Board[];
	public constructor (opts: any) {
		this.authorId = opts.authorId;
		this.title = opts.title;
		this.creationDate = Date.now();
		this.state = opts.state || 'active';
		this.boards = [];
	};
}