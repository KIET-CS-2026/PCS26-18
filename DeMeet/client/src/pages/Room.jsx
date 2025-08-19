import { useParams } from "react-router-dom";
import HuddleRoom from "@/components/Room/HuddleRoom";

const Room = () => {
  const { roomId } = useParams();

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] bg-gray-800">
      <HuddleRoom roomId={roomId} />
    </div>
  );
};

export default Room;
