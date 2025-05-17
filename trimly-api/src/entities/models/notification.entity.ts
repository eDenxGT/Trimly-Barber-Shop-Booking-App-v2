export interface INotificationEntity {
  notificationId: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
