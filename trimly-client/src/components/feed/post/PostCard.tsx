// import { useState } from "react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
// } from "@/components/ui/card";
// import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { IPost } from "@/types/Feed";
// import { getSmartDate } from "@/utils/helpers/timeFormatter";

// interface PostCardProps {
//   post: IPost;
//   onToggleLike: (postId: string) => void;
//   onCommentClick: (postId: string) => void;
//   onClick: (postId: string) => void;
// }

// export function PostCard({
//   post,
//   onToggleLike,
//   onClick,
//   onCommentClick,
// }: PostCardProps) {
//   const [liked, setLiked] = useState(post.isLiked || false);
//   const [likeCount, setLikeCount] = useState(post.likesCount || 0);

//   const handleLike = () => {
//     onToggleLike(post.postId || "");
//     if (liked) {
//       setLikeCount(likeCount - 1);
//     } else {
//       setLikeCount(likeCount + 1);
//     }
//     setLiked(!liked);
//   };

//   const timeAgo = getSmartDate(post.createdAt?.toString() || "");

//   return (
//     <Card className="w-full max-w-md mx-auto overflow-hidden shadow-md">
//       <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
//         <div className="flex items-center gap-3">
//           <Avatar className="w-9 h-9 border">
//             <AvatarImage
//               src={post.userDetails?.avatar || "/placeholder.svg"}
//               alt={post.userDetails?.fullName || "Barber"}
//             />
//             <AvatarFallback>
//               {post.userDetails?.fullName?.charAt(0) || "B"}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <p className="text-sm font-medium">
//               {post.userDetails?.fullName || "Barber"}
//             </p>
//             <p className="text-xs text-muted-foreground">Barber</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <p className="text-xs text-muted-foreground">{timeAgo}</p>
//           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
//             <MoreHorizontal className="h-5 w-5" />
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div
//           className="relative w-full cursor-pointer"
//           onClick={() => onClick(post.postId || "")}
//         >
//           <img
//             src={post.image || "/placeholder.svg"}
//             alt="Barber post"
//             className="object-contain w-full h-full"
//             sizes="(max-width: 768px) 100vw, 500px"
//           />
//         </div>
//       </CardContent>
//       <CardFooter className="flex flex-col p-0">
//         <div className="flex items-center justify-between w-full p-3 pb-1">
//           <div className="flex items-center gap-3">
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-full"
//               onClick={handleLike}
//             >
//               <Heart
//                 className={cn(
//                   "h-6 w-6",
//                   post.isLiked ? "fill-rose-500 text-rose-500" : ""
//                 )}
//               />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-9 w-9 rounded-full"
//               onClick={() => onCommentClick(post.postId || "")}
//             >
//               <MessageCircle className="h-6 w-6" />
//             </Button>
//           </div>
//           <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
//             <Share2 className="h-6 w-6" />
//           </Button>
//         </div>

//         <div className="px-4 w-full">
//           <p className="text-sm font-semibold">
//             {post.likesCount?.toLocaleString()} likes
//           </p>
//           <div className="mt-1">
//             <p className="text-sm">
//               <span className="font-semibold">
//                 {post.userDetails?.fullName || "Barber"}
//               </span>{" "}
//               <span className="font-medium">{post.caption}</span>
//             </p>
//             <p className="text-sm text-muted-foreground mt-0.5">
//               {post.description}
//             </p>
//           </div>

//           {post.totalComments && post.totalComments > 0 && (
//             <div className="mt-2 space-y-1">
//               <p
//                 onClick={() => onCommentClick(post.postId || "")}
//                 className="text-sm cursor-pointer text-muted-foreground"
//               >
//                 View {post.totalComments > 1 ? "all" : ""} {post.totalComments}{" "}
//                 {post.totalComments > 1 ? "comments" : "comment"}
//               </p>
//             </div>
//           )}
//         </div>
//       </CardFooter>
//     </Card>
//   );
// }

import { useState } from "react";
import { format } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IPost } from "@/types/Feed";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getSmartDate } from "@/utils/helpers/timeFormatter";

interface SocialFeedCardProps {
  post: IPost;
  onToggleLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onViewDetail?: () => void;
}

export const PostCard = ({
  post,
  onToggleLike,
  onShare,
  onViewDetail,
}: SocialFeedCardProps) => {
  const [isLiked, setIsLiked] = useState(
    post.likes?.includes("currentUser") || false
  );
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    if (onToggleLike && post.postId) {
      onToggleLike(post.postId);
    }
  };

  const handleDoubleTapLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setShowLikeAnimation(true);
      setTimeout(() => setShowLikeAnimation(false), 1000);
      if (onToggleLike && post.postId) {
        onToggleLike(post.postId);
      }
    }
  };

  return (
    <Card className="overflow-hidden py-0 w-full gap-0 shadow-lg border border-slate-200 mb-6 max-w-md mx-auto bg-white rounded-lg transform transition-all duration-200 hover:shadow-md">
      {/* Card Header */}
      <div className="p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 border border-gray-200 ring-2 ring-white">
            <AvatarImage
              src={
                post.userDetails?.avatar || "https://i.pravatar.cc/150?img=4"
              }
              alt={post.userDetails?.fullName || "Barber"}
            />
            <AvatarFallback>
              {post.userDetails?.fullName?.charAt(0) || "B"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {post.userDetails?.fullName || "Your Barber"}
            </p>
            <p className="text-xs text-gray-500">Barber</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">
            {getSmartDate(post.createdAt?.toString() || "")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gray-100"
          >
            <MoreHorizontal className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Post Image */}
      <div
        className="cursor-pointer  relative"
        onClick={() => onViewDetail && onViewDetail()}
        onDoubleClick={handleDoubleTapLike}
      >
        <img
          onDoubleClick={handleDoubleTapLike}
          src={post.image}
          alt={post.caption}
          className="w-full object-cover max-h-[500px]"
        />

        {/* Heart animation on double tap */}
        {showLikeAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <Heart className="h-24 w-24 text-red-500 fill-red-500 drop-shadow-lg" />
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-2 flex justify-between">
        <div className="flex gap-0">
          <motion.div whileTap={{ scale: 0.8 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={handleToggleLike}
            >
              <Heart
                className={cn(
                  "h-6 w-6 transition-colors duration-300",
                  post.isLiked &&
                    "fill-rose-500 text-rose-500 scale-110 transition-transform"
                )}
              />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.8 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              onClick={() => onViewDetail && onViewDetail()}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>
        <motion.div whileTap={{ scale: 0.8 }}>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onShare && post.postId && onShare(post.postId)}
          >
            <Share2 className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Likes Count */}
      <div className="px-4 pb-1">
        <p className="text-sm font-semibold">
          {post.likesCount?.toLocaleString()}{" "}
          {post.likesCount === 1 ? "like" : "likes"}
        </p>
      </div>
      <Separator className="mb-2" />

      {/* Caption and Description */}
      <div className="px-4 py-1">
        <p className="text-sm">
          <span className="font-semibold mr-2">
            {post.userDetails?.fullName || "Your Barber"}
          </span>
          {post.caption}
        </p>
        {post.description && (
          <p className="text-sm text-gray-600 mt-1">{post.description}</p>
        )}
      </div>

      {/* Comments */}
      <div className="px-4">
        {post.totalComments
          ? post.totalComments > 0 && (
              <p
                className="text-sm text-gray-500 mb-2 cursor-pointer hover:underline"
                onClick={() => onViewDetail && onViewDetail()}
              >
                View {post.totalComments > 1 ? "all" : ""} {post.totalComments}{" "}
                {post.totalComments === 1 ? "comment" : "comments"}
              </p>
            )
          : null}
      </div>

      {/* Timestamp Footer */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-400 uppercase">
          {post.createdAt && format(post.createdAt, "MMMM d, yyyy")}
        </p>
      </div>

      {/* Comment Input */}
    </Card>
  );
};
