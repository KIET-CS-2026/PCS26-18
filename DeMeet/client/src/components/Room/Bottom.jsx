import { Mic, Video, PhoneOff, MicOff, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button"; // Importing Button from Shadcn UI
import PropTypes from "prop-types";

const Bottom = (props) => {
  const { muted, playing, toggleAudio, toggleVideo, leaveRoom } = props;

  return (
    <div className="absolute flex justify-between bottom-5 left-0 right-0 mx-auto w-[300px]">
      <Button
        className={`p-4 rounded-full text-white cursor-pointer ${
          muted ? "bg-destructive" : "bg-background"
        }`}
        size="lg"
        onClick={toggleAudio}
      >
        {muted ? <MicOff size={55} /> : <Mic size={55} />}
      </Button>
      <Button
        className={`p-4 rounded-full text-white cursor-pointer ${
          playing ? "bg-destructive" : "bg-background"
        }`}
        size="lg"
        onClick={toggleVideo}
      >
        {playing ? <Video size={55} /> : <VideoOff size={55} />}
      </Button>
      <Button
        className="p-4 rounded-full text-white cursor-pointer bg-secondary hover:bg-buttonPrimary"
        size="lg"
        onClick={leaveRoom}
      >
        <PhoneOff size={55} />
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
};

export default Bottom;
