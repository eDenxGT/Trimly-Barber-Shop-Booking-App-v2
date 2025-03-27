import { ClientModel, IClientModel } from "../../../frameworks/database/mongoDb/models/client.model.js";
import { BaseRepository } from "../base.repository.js";

export class ClientRepository extends BaseRepository<IClientModel> {
   constructor() {
       super(ClientModel); 
   }
}
