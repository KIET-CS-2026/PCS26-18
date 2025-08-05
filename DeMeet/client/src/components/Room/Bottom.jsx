import { Mic, Video, PhoneOff, MicOff, VideoOff, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const Bottom = (props) => {
  const {
    muted,
    playing,
    toggleAudio,
    toggleVideo,
    leaveRoom,
    isScreenSharing,
    toggleScreenShare,
  } = props;

  return (
    <div className="absolute flex justify-between bottom-5 left-0 right-0 mx-auto w-[400px]">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full",
          muted
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-background hover:bg-background/90"
        )}
        onClick={toggleAudio}
      >
        {muted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full",
          playing
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-background hover:bg-background/90"
        )}
        onClick={toggleVideo}
      >
        {playing ? (
          <Video className="h-7 w-7" />
        ) : (
          <VideoOff className="h-7 w-7" />
        )}
      </Button>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full",
          isScreenSharing
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-background hover:bg-background/90"
        )}
        onClick={toggleScreenShare}
      >
        <Monitor className="h-7 w-7" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        className="h-14 w-14 rounded-full"
        onClick={leaveRoom}
      >
        <PhoneOff className="h-7 w-7" />
      </Button>
    </div>
  );
};

Bottom.propTypes = {
  muted: PropTypes.bool.isRequired,
  playing: PropTypes.bool.isRequired,
  toggleAudio: PropTypes.func.isRequired,
  toggleVideo: PropTypes.func.isRequired,
  leaveRoom: PropTypes.func.isRequired,
  isScreenSharing: PropTypes.bool.isRequired,
  toggleScreenShare: PropTypes.func.isRequired,
};

export default Bottom;
