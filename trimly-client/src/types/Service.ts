export interface IService {
	serviceId: string;
	barberId?: string;
	name: string;
	price: number;
	status?: "active" | "blocked";
	genderType: "male" | "female" | "unisex";
	description?: string;
}
