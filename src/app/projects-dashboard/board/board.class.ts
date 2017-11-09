import { Task } from '../task/task.class';
export class Board {
	public title: string;
	public description?: string;
	public tasks?: Task[];
	public $key?: string;
	public creationDate?: number;
	public updateDate?: number;
	public state?: string;
	public boards?: any;
	public constructor (opts: any) {
		this.title = opts.title;
		this.creationDate = Date.now();
		this.updateDate = Date.now();
		this.state = opts.state || 'active';
	};
}