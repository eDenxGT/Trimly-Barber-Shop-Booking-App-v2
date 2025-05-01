import { injectable } from "tsyringe";
import {
  ClientModel,
  IClientModel,
} from "../../../frameworks/database/mongoDb/models/client.model.js";
import { BaseRepository } from "../base.repository.js";
import { IClientRepository } from "../../../entities/repositoryInterfaces/users/client-repository.interface.js";
import { IAdminDashboardResponse } from "../../../shared/dtos/dashboard-data.dto.js";

@injectable()
export class ClientRepository
  extends BaseRepository<IClientModel>
  implements IClientRepository
{
  constructor() {
    super(ClientModel);
  }

  async updateWallet(userId: string, amount: number): Promise<void> {
    if (!amount || isNaN(amount)) return;

    await ClientModel.updateOne(
      { userId },
      { $inc: { walletBalance: amount } }
    );
  }

  async getRecentClients(): Promise<IAdminDashboardResponse["recentClients"]> {
    const clients = await ClientModel.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("userId fullName createdAt")
      .lean();

    return clients.map((client) => ({
      userId: client.userId || "",
      name: client.fullName || "",
      createdAt: client.createdAt || new Date(),
    }));
  }
}
