import {
  CalendarIcon,
  Home,
  LayoutDashboard,
  MessageCircleMore,
  Newspaper,
  Notebook,
  NotebookText,
  NotepadText,
  ScrollText,
  Settings,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { GiHairStrands } from "react-icons/gi";
import { PiHandWithdrawDuotone } from "react-icons/pi";
import { AiTwotoneShop } from "react-icons/ai";
import { MdGroups } from "react-icons/md";
import { FaRobot } from "react-icons/fa";

const navItems = {
  client: [
    {
      title: "Home",
      icon: Home,
      path: "/home",
    },
    {
      title: "Shops",
      icon: AiTwotoneShop,
      path: "/shops",
    },
    {
      title: "My Bookings",
      icon: NotebookText,
      path: "/my-bookings",
    },
    {
      title: "Feed",
      icon: Newspaper,
      path: "/feed",
    },
    {
      title: "Wallet",
      icon: Wallet,
      path: "/wallet",
    },
    {
      title: "Chat",
      icon: MessageCircleMore,
      path: "/chat",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ],
  barber: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/barber/dashboard",
    },
    {
      title: "Bookings",
      icon: ScrollText,
      path: "/barber/bookings",
    },
    {
      title: "Wallet",
      icon: Wallet,
      path: "/barber/wallet",
    },
    {
      title: "My Posts",
      icon: Notebook,
      path: "/barber/my-posts",
    },
    {
      title: "Chat",
      icon: MessageCircleMore,
      path: "/barber/chat",
    },
    {
      title: "Communities",
      icon: MdGroups,
      path: "/barber/communities",
    },
    {
      title: "AI Hairstyle Tool",
      icon: FaRobot,
      path: "/barber/ai-hairstyle-tool",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/barber/settings",
    },
  ],
  admin: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      title: "Manage Clients",
      icon: Users,
      path: "/admin/clients",
    },
    {
      title: "Manage Shops",
      icon: Store,
      path: "/admin/shops",
    },
    {
      title: "Manage Communities",
      icon: MdGroups,
      path: "/admin/communities",
    },
    {
      title: "Manage Meetings",
      icon: CalendarIcon,
      path: "/admin/communities/meetings",
    },
    {
      title: "Shop Applications",
      icon: NotepadText,
      path: "/admin/shop-applications",
    },
    {
      title: "User Withdrawals",
      icon: PiHandWithdrawDuotone,
      path: "/admin/withdrawal-requests",
    },
    {
      title: "Manage Hairstyles",
      icon: GiHairStrands,
      path: "/admin/hairstyles",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ],
};

export default navItems;
