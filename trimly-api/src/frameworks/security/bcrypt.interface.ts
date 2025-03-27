export interface IBcrypt {
	hash(original: string): Promise<string>;
	compare(current: string, original: string): Promise<boolean>;
}