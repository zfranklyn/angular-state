export class Task {
	public description: string;
	public completed: boolean;

	constructor(obj?: any) {
		this.description = obj.description;
		this.completed = false;
	}
}