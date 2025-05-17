export interface INotification {
  notificationId: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
