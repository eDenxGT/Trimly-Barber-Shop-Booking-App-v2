//* ====== Registry Imports ====== *//
import { RepositoryRegistry } from "./repository.registry.js";
import { UseCaseRegistry } from "./usecase.registry.js";

// Registering all registries using a single class
export class DependencyInjection {
	static registerAll(): void {
		UseCaseRegistry.registerUseCases();
		RepositoryRegistry.registerRepositories();
	}
}
