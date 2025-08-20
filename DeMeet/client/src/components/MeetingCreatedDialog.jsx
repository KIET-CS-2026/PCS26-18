import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Copy,
  Check,
  Calendar,
  Users,
  Globe,
  Lock,
  Video,
  Share,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function MeetingCreatedDialog({ open, onOpenChange, meeting }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (!meeting) return null;

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(meeting.roomId);
      setCopied(true);
      toast.success("Room ID copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy Room ID");
    }
  };

  const copyMeetingLink = async () => {
    const meetingLink = `${window.location.origin}/room/${meeting.roomId}`;
    try {
      await navigator.clipboard.writeText(meetingLink);
      toast.success("Meeting link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy meeting link");
    }
  };

  const shareMeeting = async () => {
    const meetingLink = `${window.location.origin}/room/${meeting.roomId}`;
    const shareData = {
      title: `Join "${meeting.title}" meeting`,
      text: `You're invited to join "${meeting.title}" meeting`,
      url: meetingLink,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error.name !== 'AbortError') {
          copyMeetingLink();
        }
      }
    } else {
      copyMeetingLink();
    }
  };

  const joinNow = () => {
    onOpenChange(false);
    navigate(`/room/${meeting.roomId}`);
  };

  const formatDateTime = (dateString) => {
    return format(new Date(dateString), "MMM dd, yyyy 'at' hh:mm a");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Meeting Created Successfully!
          </DialogTitle>
          <DialogDescription>
            Your meeting has been created and is ready to use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meeting Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-lg">{meeting.title}</h3>
            
            <div className="flex gap-2">
              <Badge className={meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                {meeting.status}
              </Badge>
              <Badge variant="outline">
                {meeting.type === "solana" ? "Solana" : "Web2"}
              </Badge>
              {meeting.isPublic ? (
                <Badge variant="outline" className="text-green-600">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(meeting.scheduledStartTime)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Max {meeting.maxParticipants} participants</span>
              </div>
            </div>
          </div>

          {/* Room ID */}
          <div className="space-y-2">
            <Label htmlFor="roomId" className="text-sm font-medium">
              Room ID
            </Label>
            <div className="flex gap-2">
              <Input
                id="roomId"
                value={meeting.roomId}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyRoomId}
                className={copied ? "text-green-600" : ""}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Share this Room ID with participants to let them join the meeting
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button onClick={joinNow} className="w-full">
              <Video className="h-4 w-4 mr-2" />
              Join Meeting Now
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={copyMeetingLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" onClick={shareMeeting}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            You can find this meeting in your "My Meetings" tab
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
