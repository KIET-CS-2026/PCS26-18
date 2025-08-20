import { HuddleIframe, iframeApi, useEventListener } from "@huddle01/iframe";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HuddleRoom = ({ roomId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Log room entry
    console.log("Entering room:", roomId);
  }, [roomId]);

  useEventListener("app:initialized", () => {
    try {
      void iframeApi.initialize({
        logoUrl: "https://dy95p8aq490x0.cloudfront.net/logo_dark.png",
        background: "",
        redirectUrlOnLeave: "http://localhost:5174/dashboard",
      });

      iframeApi.setTheme({
        iconColor: "#94A3B8",
        textColor: "#f8fafc",
        borderColor: "#1C1E24",
        brandColor: "#246BFD",
        interfaceColor: "#181A20",
        onBrandColor: "#ffffff",
        backgroundColor: "#121214",
      });
      
      iframeApi.changeAvatarUrl("");
      
      iframeApi.updateFeatures({
        isChatEnabled: true,
        isReactionsEnabled: true,
        isVirtualBgEnabled: true,
        isCopyInviteLinkEnabled: true,
        isRecordingEnabled: true,
        isScreenShareEnabled: true,
        isRoomLocked: false, // Set to false to avoid permission issues
      });
    } catch (error) {
      console.error("Error initializing Huddle01:", error);
    }
  });

  useEventListener("room:me-left", () => {
    console.log("Left room, navigating to dashboard");
    navigate("/dashboard");
  });

  // Add error handling for iframe errors
  useEventListener("app:errored", (error) => {
    console.error("Huddle01 iframe error:", error);
  });

  if (!roomId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white">Invalid room ID</p>
      </div>
    );
  }

  return (
    <HuddleIframe
      roomUrl={`https://iframe.huddle01.com/${roomId}/lobby`}
      className="w-full h-full border-none"
      projectId={import.meta.env.VITE_PROJECT_ID}
    />
  );
};

export default HuddleRoom;
