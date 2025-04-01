export interface IService {
	serviceId: string;
	barberId?: string;
	name: string;
	price: number;
	duration: string;
	status?: "active" | "blocked";
	genderType: "male" | "female" | "unisex";
	description?: string;
}
