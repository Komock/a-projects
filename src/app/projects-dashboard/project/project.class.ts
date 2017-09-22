export class Project {
	public ownerId?: string;
	public title: string;
	public description?: string;
	public thumbUrl?: string;
	public tasks?: any[];
	public participants?: any[];
	public $key?: string;
	public creationDate?: number;
	public state?: string;
	public constructor (opts: any) {
		this.ownerId = opts.ownerId;
		this.title = opts.title;
		this.creationDate = Date.now();
		this.state = opts.state || 'pended';
		if (opts.thumbUrl) {
			this.thumbUrl = opts.thumbUrl;
		}
	};
}