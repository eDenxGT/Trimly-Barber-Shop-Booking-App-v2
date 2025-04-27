// ... keep existing code (MOCK_CHATS, MOCK_MESSAGES)

import {
  IChat,
  ICommunity,
  ICommunityChatPreview,
  ICommunityMessage,
  IDirectMessage,
} from "@/types/Chat";

export const MOCK_CHATS: IChat[] = [
  {
    id: "chat1",
    name: "John Smith",
    avatar: "/placeholder.svg",
    lastMessage: "When will you be available for a haircut?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 2,
    online: true,
  },
  {
    id: "chat2",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    lastMessage: "Thanks for the great service!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 0,
    online: false,
  },
  {
    id: "chat3",
    name: "Michael Brown",
    avatar: "/placeholder.svg",
    lastMessage: "Can I book an appointment for tomorrow?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 1,
    online: true,
  },
  {
    id: "chat4",
    name: "Emma Wilson",
    avatar: "/placeholder.svg",
    lastMessage: "Do you have any availability this weekend?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unread: 0,
    online: false,
  },
  {
    id: "chat5",
    name: "James Taylor",
    avatar: "/placeholder.svg",
    lastMessage: "I'll see you at 3pm tomorrow!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    unread: 0,
    online: true,
  },
];

// Sample messages data
export const MOCK_MESSAGES: Record<string, IDirectMessage[]> = {
  chat1: [
    {
      messageId: "msg1",
      senderId: "chat1",
      content: "Hello! I need a haircut.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    },
    {
      messageId: "msg2",
      senderId: "current-user",
      content:
        "Hi there! I'd be happy to help you with that. What kind of haircut are you looking for?",
      timestamp: new Date(Date.now() - 1000 * 60 * 55), // 55 minutes ago
    },
    {
      messageId: "msg3",
      senderId: "chat1",
      content:
        "I'm thinking of something short on the sides and a bit longer on top.",
      timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 minutes ago
      media: [
        {
          type: "image",
          url: "https://images.unsplash.com/photo-1614465000772-1b302f406c47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          caption: "Something like this",
        },
      ],
    },
    {
      id: "msg4",
      senderId: "current-user",
      text: "That looks good! I can definitely do that for you.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    },
    {
      id: "msg5",
      senderId: "chat1",
      text: "Great! When will you be available for a haircut?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
  ],
  chat2: [
    {
      id: "msg1",
      senderId: "chat2",
      text: "Hi, I'd like to schedule an appointment for a haircut.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    },
    {
      id: "msg2",
      senderId: "current-user",
      text: "Hello! I have availability tomorrow at 2pm or 4pm. Would either of those times work for you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
    },
    {
      id: "msg3",
      senderId: "chat2",
      text: "2pm would be perfect!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.2), // 2.2 hours ago
    },
    {
      id: "msg4",
      senderId: "current-user",
      text: "Great! I've got you down for 2pm tomorrow. See you then!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2.1), // 2.1 hours ago
    },
    {
      id: "msg5",
      senderId: "chat2",
      text: "Thanks for the great service!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
  ],
};

export const MOCK_COMMUNITY_GROUPS: ICommunityChatPreview[] = [
  {
    communityId: "barbers-group-1",
    name: "Elite Barbers Hub",
    description:
      "A group for professional barbers to share tips and techniques",
    imageUrl: "/placeholder.svg",
    createdBy: "user1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    lastMessage: {
      content: "When will you be available for a haircut?",
      messageType: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    membersCount: 4,
    members: ["user1", "user2", "user3", "user4"],
  },
  {
    communityId: "barbers-group-2",
    name: "Barber Masters",
    description:
      "A group for professional barbers to share tips and techniques",
    imageUrl: "/placeholder.svg",
    createdBy: "admin",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    lastMessage: {
      content: "When will you be available for a haircut?",
      messageType: "text",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    membersCount: 4,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    members: ["user1", "user2", "user3", "user4"],
  },
];

export const MOCK_COMMUNITY_MESSAGES: Record<string, ICommunityMessage[]> = {
  "barbers-group-1": [
    {
      messageId: "comm1",
      groupId: "barbers-group-1",
      senderId: "user1",
      senderName: "Robert Smith",
      senderAvatar: "/placeholder.svg",
      messageType: "text",
      content:
        "Hey everyone! I wanted to share some new techniques I learned at the barber convention last week.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: "read",
      readBy: ["user2", "user3"],
    },
    {
      messageId: "comm2",
      groupId: "barbers-group-1",
      senderId: "user2",
      senderName: "Amanda Johnson",
      senderAvatar: "/placeholder.svg",
      messageType: "text",
      content: "That sounds great Robert! What was your favorite technique?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23),
      status: "read",
      readBy: ["user1", "user3"],
    },
  ],
  "barbers-group-2": [],
};
