import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Calendar,
  Clock,
  Users,
  Video,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Lock,
  Globe,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useMeetService } from "@/services/meet/hooks";
import useAuthStore from "@/store/authStore";

export function MeetingCard({ meeting, variant = "default", onUpdate }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { useJoinMeeting, useDeleteMeeting } = useMeetService();
  const { mutate: joinMeeting, isLoading: isJoining } = useJoinMeeting();
  const { mutate: deleteMeeting, isLoading: isDeleting } = useDeleteMeeting();

  const isCreator = meeting.creator._id === user?._id;
  const isScheduled = meeting.status === "scheduled";
  const isOngoing = meeting.status === "ongoing";
  const isPast = new Date(meeting.scheduledEndTime) < new Date() && meeting.status !== "ongoing";
  
  // Check if meeting was created recently (within last 5 minutes)
  const isNewlyCreated = new Date() - new Date(meeting.createdAt) < 5 * 60 * 1000;

  const getStatusColor = () => {
    switch (meeting.status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleJoinMeeting = () => {
    if (isScheduled || isOngoing) {
      joinMeeting(meeting.roomId, {
        onSuccess: () => {
          toast.success(`Successfully joined "${meeting.title}". Redirecting to meeting room...`);
          // Add a small delay to show the success message before navigating
          setTimeout(() => {
            navigate(`/room/${meeting.roomId}`);
          }, 1500);
        },
      });
    } else {
      navigate(`/room/${meeting.roomId}`);
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(meeting.roomId);
    toast.success("Room ID copied to clipboard");
  };

  const handleDeleteMeeting = () => {
    deleteMeeting(meeting.roomId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        if (onUpdate) onUpdate();
      },
    });
  };

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

  const formatDuration = () => {
    const start = new Date(meeting.scheduledStartTime);
    const end = new Date(meeting.scheduledEndTime);
    const diffHours = Math.round((end - start) / (1000 * 60 * 60));
    return `${diffHours}h`;
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">{meeting.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor()}>
                  {meeting.status}
                </Badge>
                <Badge variant="outline">
                  {meeting.type === "solana" ? "Solana" : "Web2"}
                </Badge>
                {isNewlyCreated && (
                  <Badge className="bg-green-100 text-green-800 animate-pulse">
                    New
                  </Badge>
                )}
                {meeting.isPublic ? (
                  <Globe className="h-4 w-4 text-green-600" title="Public meeting" />
                ) : (
                  <Lock className="h-4 w-4 text-orange-600" title="Private meeting" />
                )}
              </div>
            </div>
            
            {isCreator && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleCopyRoomId}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Room ID
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate(`/meeting/${meeting.roomId}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Meeting
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Meeting
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {meeting.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {meeting.description}
            </p>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDateTime(meeting.scheduledStartTime)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Duration: {formatDuration()}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {meeting.participants.length} / {meeting.maxParticipants} participants
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>Host: {meeting.creator.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Copy className="h-4 w-4" />
              <span className="font-mono text-xs">Room ID: {meeting.roomId.slice(0, 8)}...</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyRoomId}
                className="h-6 px-2 text-xs"
              >
                Copy
              </Button>
            </div>
          </div>

          {meeting.tags && meeting.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {meeting.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {meeting.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{meeting.tags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleJoinMeeting}
              disabled={isJoining || isPast}
              className="flex-1"
              variant={isOngoing ? "default" : "outline"}
            >
              {isJoining ? "Joining..." : isOngoing ? "Join Now" : "Join Meeting"}
            </Button>
            
            {!isCreator && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyRoomId}
                title="Copy Room ID"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{meeting.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMeeting}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
