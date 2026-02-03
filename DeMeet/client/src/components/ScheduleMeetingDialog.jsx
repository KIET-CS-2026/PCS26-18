import { useState } from "react";
import { useMeetingService } from "@/services/meeting/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScheduleMeetingDialog() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState("60");
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { useScheduleMeeting, useGetAllUsers } = useMeetingService();
  const scheduleMutation = useScheduleMeeting();
  const { data: allUsers = [], isLoading: usersLoading } = useGetAllUsers();

  console.log(Array.isArray(allUsers), allUsers);

  const handleAddParticipant = (user) => {
    if (!selectedParticipants.find((p) => p.email === user.email)) {
      setSelectedParticipants([...selectedParticipants, user]);
    }
    setPopoverOpen(false);
  };

  const handleRemoveParticipant = (email) => {
    setSelectedParticipants(
      selectedParticipants.filter((p) => p.email !== email)
    );
  };

  const handleScheduleMeeting = async () => {
    if (!title || !scheduledTime || selectedParticipants.length === 0) {
      alert("Please fill in all required fields");
      return;
    }

    const participantEmails = selectedParticipants.map((p) => p.email);

    scheduleMutation.mutate(
      {
        title,
        description,
        participantEmails,
        scheduledTime: new Date(scheduledTime).toISOString(),
        duration: parseInt(duration),
      },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          setScheduledTime("");
          setDuration("60");
          setSelectedParticipants([]);
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 text-white hover:bg-blue-600 w-full">
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule a New Meeting</DialogTitle>
          <DialogDescription>
            Create a meeting and invite participants
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Meeting Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title *</Label>
            <Input
              id="title"
              placeholder="Enter meeting title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter meeting description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Scheduled Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Scheduled Time *</Label>
            <Input
              id="time"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <Label>Add Participants *</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                  disabled={usersLoading}
                >
                  {selectedParticipants.length === 0
                    ? "Select participants..."
                    : `${selectedParticipants.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                {usersLoading ? (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Loading participants...
                  </div>
                ) : (
                  <Command>
                    <CommandInput
                      placeholder="Search participants..."
                      value={search}
                      onValueChange={setSearch}
                    />

                    <CommandList>
                      {allUsers.length === 0 ? (
                        <CommandEmpty>No users found.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {allUsers.map((user) => (
                            <CommandItem
                              key={user._id}
                              value={user.email}
                              onSelect={() => handleAddParticipant(user)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedParticipants.some(
                                    (p) => p._id === user._id
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-gray-500">
                                  {user.email}
                                  {user.isGoogleUser && " • Google User"}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                )}
              </PopoverContent>
            </Popover>

            {/* Selected Participants Display */}
            {selectedParticipants.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Participants:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedParticipants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{participant.name}</span>
                      {participant.isGoogleUser && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                          Google
                        </span>
                      )}
                      <button
                        onClick={() =>
                          handleRemoveParticipant(participant.email)
                        }
                        className="ml-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleMeeting}
              disabled={scheduleMutation.isPending}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {scheduleMutation.isPending
                ? "Scheduling..."
                : "Schedule Meeting"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
