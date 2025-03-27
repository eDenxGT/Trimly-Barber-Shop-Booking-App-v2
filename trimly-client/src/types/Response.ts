import { UserDTO } from "./User";

export interface IAxiosResponse {
	success: boolean;
	message: string;
}

export interface IAuthResponse extends IAxiosResponse {
	user: UserDTO;
}
