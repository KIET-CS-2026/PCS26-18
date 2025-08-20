import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useMeetService } from "@/services/meet/hooks";
import { MeetingCreatedDialog } from "./MeetingCreatedDialog";

export function CreateMeetingModal({ trigger, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdMeeting, setCreatedMeeting] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "web2",
    isPublic: true,
    isLocked: false,
    maxParticipants: 20,
    scheduledStartTime: "",
    scheduledEndTime: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const { useCreateMeeting } = useMeetService();
  const { mutate: createMeeting, isLoading } = useCreateMeeting();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Set default times if not provided
    const now = new Date();
    const startTime = formData.scheduledStartTime || now.toISOString();
    const endTime = formData.scheduledEndTime || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const meetingData = {
      ...formData,
      scheduledStartTime: startTime,
      scheduledEndTime: endTime,
    };

    createMeeting(meetingData, {
      onSuccess: (response) => {
        setOpen(false);
        const meeting = response.data.data.meeting;
        setCreatedMeeting(meeting);
        setShowSuccessDialog(true);
        
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        // Don't navigate to room - show success dialog instead
      },
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "web2",
      isPublic: true,
      isLocked: false,
      maxParticipants: 20,
      scheduledStartTime: "",
      scheduledEndTime: "",
      tags: [],
    });
    setNewTag("");
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    setCreatedMeeting(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Meeting</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Meeting Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter meeting title"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this meeting is about"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Meeting Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web2">Web2 Meeting</SelectItem>
                    <SelectItem value="solana">Solana Gated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maxParticipants">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  max="100"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange("maxParticipants", parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  value={formData.scheduledStartTime}
                  onChange={(e) => handleInputChange("scheduledStartTime", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  value={formData.scheduledEndTime}
                  onChange={(e) => handleInputChange("scheduledEndTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isPublic">Public Meeting</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to discover and join this meeting
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isLocked">Locked Meeting</Label>
                  <p className="text-sm text-muted-foreground">
                    Require permission to join
                  </p>
                </div>
                <Switch
                  id="isLocked"
                  checked={formData.isLocked}
                  onCheckedChange={(checked) => handleInputChange("isLocked", checked)}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" variant="outline" size="icon" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? "Creating..." : "Create Meeting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    <MeetingCreatedDialog
      open={showSuccessDialog}
      onOpenChange={handleSuccessDialogClose}
      meeting={createdMeeting}
    />
  </>
  );
}
