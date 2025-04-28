import { SocketUserStore } from "../../interfaceAdapters/websockets/socket-user.store.js";

export function getActiveUsersCount(members: { userId: string }[]): number {
  const socketUserStore = SocketUserStore.getInstance();
  const activeUsers = socketUserStore.getAllUsers().map(([userId]) => userId);

  const activeCount = members.filter((member) =>
    activeUsers.includes(member.userId)
  ).length;

  return activeCount;
}

export function getOnlineSocketIdsForMembers(
  memberUserIds: string[]
): string[] {
  const socketUserStore = SocketUserStore.getInstance();
  const allConnectedUsers = socketUserStore.getAllUsers();

  const onlineSocketIds: string[] = [];

  for (const [userId, socketId] of allConnectedUsers) {
    if (memberUserIds.includes(userId)) {
      onlineSocketIds.push(socketId);
    }
  }

  return onlineSocketIds;
}
