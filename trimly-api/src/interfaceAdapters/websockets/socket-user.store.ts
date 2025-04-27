export class SocketUserStore {
	private static instance: SocketUserStore;
	private connectedUsers: Map<string, string> = new Map(); 

	private constructor() {}

	public static getInstance(): SocketUserStore {
		if (!SocketUserStore.instance) {
			SocketUserStore.instance = new SocketUserStore();
		}
		return SocketUserStore.instance;
	}

	public addUser(userId: string, socketId: string) {
		this.connectedUsers.set(userId, socketId);
	}

	public removeUser(userId: string) {
		this.connectedUsers.delete(userId);
	}

	public getSocketId(userId: string): string | undefined {
		return this.connectedUsers.get(userId);
	}

	public getAllUsers() {
		return Array.from(this.connectedUsers.entries());
	}
}
