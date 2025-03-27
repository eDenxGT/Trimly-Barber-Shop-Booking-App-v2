import {
	AdminModel,
	IAdminModel,
} from "../../../frameworks/database/mongoDb/models/admin.model.js";
import { BaseRepository } from "../base.repository.js";

export class AdminRepository extends BaseRepository<IAdminModel> {
	constructor() {
		super(AdminModel);
	}
}
