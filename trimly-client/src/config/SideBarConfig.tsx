import {
  Home,
  LayoutDashboard,
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

import { AiTwotoneShop } from "react-icons/ai";

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

    // {
    // 	title: "Chat",
    // 	icon: <MessageCircleMore className="h-5 w-5" />,
    // 	href: "/student/chat",
    // },
    // {
    // 	title: "Wishlist",
    // 	icon: <Heart className="h-5 w-5" />,
    // 	href: "/student/wishlist",
    // },
    // {
    // 	title: "Purchases",
    // 	icon: <ShoppingBag className="h-5 w-5" />,
    // 	href: "/student/purchases",
    // },
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
    // {
    // 	title: "Chat",
    // 	icon: <MessageCircleMore className="h-5 w-5" />,
    // 	href: "/tutor/chat",
    // },
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
    // {
    // 	title: "Categories",
    // 	icon: <Layers className="h-5 w-5" />,
    // 	link: "/admin/categories",
    // },
    // {
    // 	title: "Orders",
    // 	icon: <ShoppingBag className="h-5 w-5" />,
    // 	link: "/admin/orders",
    // },
    {
      title: "Manage Clients",
      icon: Users,
      path: "/admin/clients",
    },

    // {
    // 	title: "Manage Tutors",
    // 	icon: <Users className="h-5 w-5" />,
    // 	link: "/admin/tutors",
    // },
    {
      title: "Manage Shops",
      icon: Store,
      path: "/admin/shops",
    },
    {
      title: "Shop Applications",
      icon: NotepadText,
      path: "/admin/shop-applications",
    },
    // {
    // 	title: "Tutor Withdrawals",
    // 	icon: <PiHandWithdrawDuotone className="h-5 w-5" />,
    // 	link: "/admin/tutors/withdrawals",
    // },
    {
      title: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ],
};

export default navItems;
