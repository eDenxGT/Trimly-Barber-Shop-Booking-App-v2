export interface IUserExistenceService {
	emailExists(email: string): Promise<boolean>;
}
