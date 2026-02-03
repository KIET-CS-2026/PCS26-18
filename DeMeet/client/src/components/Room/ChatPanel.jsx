import { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import api from "@/lib/axios";

export default function ChatPanel({
  isOpen,
  onClose,
  socket,
  roomId,
  userId,
  myName,
  messages,
  setMessages,
}) {
  const [inputMessage, setInputMessage] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Auto-scroll to bottom on new messages (only if near bottom)
  useEffect(() => {
    if (isInitialLoad.current && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialLoad.current = false;
    } else if (messages.length > 0) {
      // Check if user is near bottom before auto-scrolling
      const scrollContainer = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        if (isNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [messages]);

  // Load older messages when scrolling to top
  const handleScroll = useCallback(
    async (e) => {
      const { scrollTop } = e.target;

      if (scrollTop === 0 && hasMore && !isLoadingMore && messages.length > 0) {
        setIsLoadingMore(true);
        const oldestMessage = messages[0];

        try {
          const response = await api.get(`chat/${roomId}`, {
            params: {
              cursor: oldestMessage._id,
              limit: 20,
            },
          });

          const { messages: olderMessages, hasMore: moreAvailable } =
            response.data.data;

          if (olderMessages.length > 0) {
            // Prepend older messages
            setMessages((prev) => [...olderMessages, ...prev]);
          }
          setHasMore(moreAvailable);
        } catch (error) {
          console.error("Error loading older messages:", error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    },
    [hasMore, isLoadingMore, messages, roomId, setMessages]
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket) {
      return;
    }

    socket.emit("send-message", {
      roomId,
      senderId: userId,
      senderName: myName || "You",
      message: inputMessage.trim(),
    });

    setInputMessage("");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[350px] sm:w-[400px] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>In-call messages</SheetTitle>
        </SheetHeader>

        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 p-4"
          onScrollCapture={handleScroll}
        >
          {isLoadingMore && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs mt-1">
                Messages can only be seen by people in the call
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex flex-col ${
                    msg.senderId === userId ? "items-end" : "items-start"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {msg.senderId === userId ? "You" : msg.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.senderId === userId
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Send a message to everyone"
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}

ChatPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  socket: PropTypes.object,
  roomId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  myName: PropTypes.string,
  messages: PropTypes.array.isRequired,
  setMessages: PropTypes.func.isRequired,
};
