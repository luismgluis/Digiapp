export interface Auth {
	id?: string;
	user: string;
	password: string;
	name: string;
	creationDate: number;
	token?:string
}