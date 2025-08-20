import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeetService } from "@/services/meet/hooks";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const { useCreateRoom } = useMeetService();
  const { mutate, isLoading } = useCreateRoom();

  const createWeb2Meeting = () => {
    mutate();
  };

  const createSolanaMeeting = () => {
    // Use the same service as Web2 meeting but navigate to solana-room
    mutate(undefined, {
      onSuccess: (data) => {
        // Assuming the service returns room data with roomId
        const roomId = data?.roomId || uuidv4();
        navigate(`/solana-room/${roomId}`);
      },
      onError: (error) => {
        console.error("Error creating Solana meeting:", error);
        // Fallback to UUID if service fails
        const roomId = uuidv4();
        navigate(`/solana-room/${roomId}`);
      },
    });
  };

  const joinRoom = () => {
    if (roomId) navigate(`/room/${roomId}`);
    else {
      alert("Please provide a valid room id");
    }
  };

  // Sample scheduled meetings
  const scheduledMeetings = [
    { id: "meeting1", title: "Team Sync", time: "10:00 AM" },
    { id: "meeting2", title: "Project Review", time: "2:00 PM" },
  ];

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Create Web2 Meeting */}
        <div className="flex flex-col items-center space-y-4 p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold text-foreground">
            Create Web2 Meeting
          </h2>
          <p className="text-muted-foreground text-center">
            Start a new meeting instantly
          </p>
          <Button
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            onClick={createWeb2Meeting}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Meeting"}
          </Button>
        </div>

        {/* Create Solana Gated Meeting */}
        <div className="flex flex-col items-center space-y-4 p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold text-foreground">
            Solana Gated Meeting
          </h2>
          <p className="text-muted-foreground text-center">
            Meeting for Solana wallet holders
          </p>
          <Button
            className="w-full bg-purple-500 text-white p-3 rounded-md hover:bg-purple-600"
            onClick={createSolanaMeeting}
          >
            Create Solana Meeting
          </Button>
        </div>

        {/* Join Meeting with Room ID */}
        <div className="flex flex-col items-center space-y-4 p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold text-foreground">
            Join Meeting
          </h2>
          <p className="text-muted-foreground text-center">
            Enter Room ID to join
          </p>
          <Input
            className="w-full p-3 rounded-md border border-foreground"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button
            className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600"
            onClick={joinRoom}
          >
            Join Room
          </Button>
        </div>

        {/* Scheduled Meetings */}
        <div className="flex flex-col items-center space-y-4 p-6 border border-border rounded-lg bg-card">
          <h2 className="text-xl font-semibold text-foreground">
            Scheduled Meetings
          </h2>
          <p className="text-muted-foreground text-center">
            Your upcoming meetings
          </p>
          <div className="w-full space-y-2">
            {scheduledMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex justify-between items-center p-2 bg-muted rounded"
              >
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {meeting.time}
                  </p>
                </div>
                <Button
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
                  onClick={() => navigate(`/room/${meeting.id}`)}
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
