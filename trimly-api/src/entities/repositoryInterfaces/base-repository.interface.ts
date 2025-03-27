export interface IBaseRepository<T> {
	findAll(
		filter: any,
		skip: number,
		limit: number
	): Promise<{ items: T[]; total: number }>;
	findOne(filter: any): Promise<T | null>;
	save(data: Partial<T>): Promise<T>;
	update(filter: any, updateData: Partial<T>): Promise<T | null>;
	delete(filter: any): Promise<T | null>;
}
