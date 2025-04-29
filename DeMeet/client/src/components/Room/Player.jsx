import ReactPlayer from "react-player";
import { Mic, MicOff, UserSquare2 } from "lucide-react";
import { cn } from "@/lib/utils";
import PropTypes from "prop-types";

const Player = (props) => {
  const { url, muted, playing, isActive } = props;

  return (
    <div
      className={cn(
        "relative overflow-hidden mb-5 h-full",
        isActive ? "rounded-lg" : "rounded-md h-min w-[200px] shadow-lg", // Tailwind classes for active and not active states
        !playing && "flex items-center justify-center"
      )}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
        />
      ) : (
        <UserSquare2 className="text-white" size={isActive ? 400 : 150} />
      )}

      {!isActive && (
        <div className="absolute right-2 bottom-2 text-white">
          {muted ? <MicOff size={20} /> : <Mic size={20} />}
        </div>
      )}
    </div>
  );
};
Player.propTypes = {
  url: PropTypes.string.isRequired,
  muted: PropTypes.bool.isRequired,
  playing: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default Player;
