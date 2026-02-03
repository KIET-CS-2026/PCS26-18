import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { useMeetService } from "@/services/meet/hooks";
import { useMeetingService } from "@/services/meeting/hooks";
import { ScheduleMeetingDialog } from "@/components/ScheduleMeetingDialog";
import useAuthStore from "@/store/authStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { useCreateSolanaRoom } = useMeetService();
  const { useGetMyMeetings } = useMeetingService();
  const { user: currentUser } = useAuthStore();

  const { mutate: createSolana, isLoading: isCreatingSolana } =
    useCreateSolanaRoom();

  const { data: meetingsData } = useGetMyMeetings(currentPage, 3);

  const meetings = meetingsData?.meetings || [];
  const pagination = meetingsData?.pagination || {};

  const createWeb2Meeting = () => {
    const roomId = uuidv4();
    navigate(`/room/${roomId}`);
  };

  const createSolanaMeeting = () => {
    createSolana();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const upcomingMeetings = meetings.filter(
    (meeting) => new Date(meeting.scheduledTime) > new Date()
  );

  return (
    <div className="w-full flex flex-col gap-6 p-6 bg-background">
      {/* Top Section - Action Cards */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Create Web2 Meeting */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Create Web2 Meeting</CardTitle>
              <CardDescription className="text-xs">
                Instant meeting
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button
                className="w-full bg-blue-500 text-white text-sm h-8 hover:bg-blue-600"
                onClick={createWeb2Meeting}
              >
                Create
              </Button>
            </CardContent>
          </Card>

          {/* Create Solana Meeting */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Solana Gated</CardTitle>
              <CardDescription className="text-xs">For wallets</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Button
                className="w-full bg-purple-500 text-white text-sm h-8 hover:bg-purple-600"
                onClick={createSolanaMeeting}
                disabled={isCreatingSolana}
              >
                {isCreatingSolana ? "..." : "Create"}
              </Button>
            </CardContent>
          </Card>

          {/* Schedule Meeting */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Schedule</CardTitle>
              <CardDescription className="text-xs">
                Plan meeting
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <ScheduleMeetingDialog compact />
            </CardContent>
          </Card>

          {/* Join Meeting */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
              <CardTitle className="text-base">Join Room</CardTitle>
              <CardDescription className="text-xs">
                Enter Room ID
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Input
                className="h-8 text-xs mb-2"
                placeholder="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <Button
                className="w-full bg-green-500 text-white text-xs h-7 hover:bg-green-600"
                onClick={() => {
                  if (roomId) navigate(`/room/${roomId}`);
                  else alert("Enter room ID");
                }}
              >
                Join
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Meetings Section */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Upcoming Meetings</h2>
          {upcomingMeetings.length > 0 && (
            <Badge variant="secondary">{pagination.totalMeetings}</Badge>
          )}
        </div>

        {pagination.totalMeetings === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground text-sm">
              No upcoming meetings scheduled
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
              {upcomingMeetings.length > 0 ? (
                upcomingMeetings.map((meeting) => (
                  <Card
                    key={meeting._id}
                    className="hover:shadow-md transition-shadow flex flex-col"
                  >
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm truncate">
                            {meeting.title}
                          </CardTitle>
                          <CardDescription className="text-xs line-clamp-1">
                            {meeting.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs whitespace-nowrap flex-shrink-0 px-1.5 py-0"
                        >
                          {meeting.isGoogleCalendarEvent ? "GCal" : "Meet"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-2 flex-1 flex flex-col">
                      {/* Meeting Details */}
                      <div className="space-y-1 text-xs mb-2">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {formatDate(meeting.scheduledTime)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{meeting.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="h-3 w-3 flex-shrink-0" />
                          <span>
                            {meeting.participants.length} participant
                            {meeting.participants.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      {/* Participants - Compact */}
                      <div className="border-t pt-2 mb-2 flex-1">
                        <p className="text-xs font-medium mb-1">
                          Participants:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {meeting.participants
                            .slice(0, 2)
                            .map((participant) => (
                              <Badge
                                key={participant._id || participant.email}
                                variant="secondary"
                                className="text-xs px-1.5 py-0 h-5"
                              >
                                {participant.userId?._id === currentUser?._id
                                  ? "You"
                                  : participant.userId?.name || "Unknown"}
                              </Badge>
                            ))}
                          {meeting.participants.length > 2 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0 h-5"
                            >
                              +{meeting.participants.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full bg-green-500 text-white hover:bg-green-600 h-7 text-xs"
                        onClick={() => navigate(`/room/${meeting.roomId}`)}
                      >
                        Join
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-muted-foreground text-sm">
                  No upcoming meetings to display
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, currentPage + 1)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
