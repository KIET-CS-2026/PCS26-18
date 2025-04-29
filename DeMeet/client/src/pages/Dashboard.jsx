import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const createAndJoin = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) navigate(`/room/${roomId}`);
    else {
      alert("Please provide a valid room id");
    }
  };
  return (
    <div className="flex flex-row w-full items-center justify-center p-4">
      <div className="flex flex-col items-center space-y-4 w-1/2">
        <Input
          className="w-4/12 p-3 rounded-md border border-foreground"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button
          className="w-4/12 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
          onClick={joinRoom}
        >
          Join Room
        </Button>
        <span className="text-muted-foreground mb-4">
          --------------- OR ---------------
        </span>
        <Button
          className="w-4/12 bg-green-500 text-white p-3 rounded-md hover:bg-green-600"
          onClick={createAndJoin}
        >
          Create a new room
        </Button>
      </div>
    </div>
  );
}
