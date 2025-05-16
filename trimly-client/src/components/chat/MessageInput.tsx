import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ImageIcon, Smile, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useOutletContext } from "react-router-dom";
import { uploadToS3 } from "@/services/s3/uploadToS3";
import { getPresignedUrl } from "@/services/s3/getPresignedUrl";
import { useToaster } from "@/hooks/ui/useToaster";

interface MessageInputProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>();
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const role = useOutletContext<{ role: "barber" | "client" }>().role;

  const { errorToast } = useToaster();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEmojiPickerOpen &&
        emojiPickerRef.current &&
        emojiButtonRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        !emojiButtonRef.current.contains(event.target as Node)
      ) {
        setIsEmojiPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmojiPickerOpen]);

  // const handleSend = () => {
  //   if (message.trim() || imageUrl) {
  //     onSendMessage(message.trim(), imageUrl);
  //     setMessage("");
  //     setImageUrl(undefined);
  //     setImagePreview(undefined);
  //   }
  // };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSend = async () => {
    let finalImageUrl: string | undefined = undefined;

    if (fileToUpload) {
      try {
        const path = `chat-images/${uuidv4()}-${fileToUpload.name}`;

        const presignedUrl = await getPresignedUrl(path, role, "putObject");
        await uploadToS3(presignedUrl, fileToUpload);
        // finalImageUrl = presignedUrl.split("?")[0];
        finalImageUrl = path;

        setImagePreview(undefined);
        setFileToUpload(null);
      } catch (err) {
        console.error("Image upload failed:", err);
        errorToast("Failed to upload image");
        return;
      }
    }

    if (message.trim() || finalImageUrl) {
      onSendMessage(message.trim(), finalImageUrl);
      setMessage("");
      setImageUrl(undefined);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        errorToast("Only image files are allowed.");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setFileToUpload(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(message + emojiData.emoji);
  };

  const removeImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setFileToUpload(null);
    setImageUrl(undefined);
    setImagePreview(undefined);
  };

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(!isEmojiPickerOpen);
  };

  return (
    <div className="p-3 border-t bg-white">
      {imagePreview && (
        <div className="mb-3 flex items-center">
          <div className="relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-20 w-auto rounded-md object-cover border"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <span className="ml-3 text-sm text-gray-500">Image attached</span>
        </div>
      )}
      <div className="flex items-center gap-1 relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                ref={emojiButtonRef}
                onClick={toggleEmojiPicker}
                type="button"
                size="icon"
                variant="ghost"
                className="text-[var(--darkblue)] hover:bg-gray-100 rounded-full h-10 w-10"
              >
                <Smile className="h-5 w-5" />
                <span className="sr-only">Add emoji</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add emoji</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {isEmojiPickerOpen && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-14 left-0 z-50 shadow-lg rounded-lg"
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              lazyLoadEmojis={true}
            />
          </div>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleImageClick}
                className="text-[var(--darkblue)] hover:bg-gray-100 rounded-full h-10 w-10"
              >
                <ImageIcon className="h-5 w-5" />
                <span className="sr-only">Attach image</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attach image</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 mx-1 bg-gray-50 border-1 rounded-full py-6"
        />

        {/* {!message.trim() ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="text-[var(--darkblue)] hover:bg-gray-100 rounded-full h-10 w-10"
                >
                  <Mic className="h-5 w-5" />
                  <span className="sr-only">Voice message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Record voice message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : ( */}
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={!message.trim() && !imageUrl && !fileToUpload}
          className="bg-[var(--darkblue)] hover:bg-[var(--darkblue-hover)] rounded-sm h-10 w-10"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
        {/* )} */}
      </div>
    </div>
  );
}
