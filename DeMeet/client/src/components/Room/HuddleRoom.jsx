import { HuddleIframe, iframeApi, useEventListener } from "@huddle01/iframe";
import { useNavigate } from "react-router-dom";
const HuddleRoom = ({ roomId }) => {
  const navigate = useNavigate();

  useEventListener("app:initialized", () => {
    void iframeApi.initialize({
      logoUrl: "https://dy95p8aq490x0.cloudfront.net/logo_dark.png",
      background: "",
      redirectUrlOnLeave: "http://localhost:5173/dashboard",
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
      isRoomLocked: true,
    });
  });

  useEventListener("room:me-left", () => navigate("/dashboard"));

  return (
    <HuddleIframe
      roomUrl={`https://iframe.huddle01.com/${roomId}/lobby`}
      className="w-full h-full border-none"
      projectId={import.meta.env.VITE_PROJECT_ID}
    />
  );
};

export default HuddleRoom;
