export class Task {
	public title: string;
	public description: string;
	public status: 'pended' | 'completed' | 'expired';
	public creationDate: number;
	public dueDate?: number;
	public $key?: string;
	public constructor (opts: any) {
		this.title = opts.title;
		this.description = opts.description || '';
		this.creationDate = Date.now();
		this.status = 'pended';
	}
}