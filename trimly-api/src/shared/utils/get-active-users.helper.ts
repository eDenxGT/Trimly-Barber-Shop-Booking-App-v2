import { SocketUserStore } from "../../interfaceAdapters/websockets/socket-user.store.js";

export function getActiveUsersCount(members: { userId: string }[]): number {
  const socketUserStore = SocketUserStore.getInstance();
  const activeUsers = socketUserStore.getAllUsers().map(([userId]) => userId);

  const activeCount = members.filter((member) =>
    activeUsers.includes(member.userId)
  ).length;

  return activeCount;
}
