export interface IServiceEntity {
	serviceId: string;
	barberId: string;
	name: string;
	price: number;
	status: "active" | "blocked";
	duration: string;
	genderType: "male" | "female" | "unisex";
	description?: string;
}
