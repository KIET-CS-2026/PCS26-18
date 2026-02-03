import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Plus, Trash2 } from "lucide-react";

export default function PollModal({
  isOpen,
  onClose,
  socket,
  roomId,
  activePoll,
  hasVoted,
  setHasVoted,
  myId,
}) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreatePoll = () => {
    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (question.trim() && validOptions.length >= 2) {
      socket.emit("create-poll", {
        roomId,
        question,
        options: validOptions,
        userId: myId,
      });
      onClose();
      // Reset form
      setQuestion("");
      setOptions(["", ""]);
    }
  };

  const handleVote = () => {
    if (selectedOption !== null) {
      socket.emit("submit-vote", { roomId, optionIndex: selectedOption });
      setHasVoted(true);
    }
  };

  const handleEndPoll = () => {
    socket.emit("end-poll", { roomId, userId: myId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activePoll ? "Active Poll" : "Create a Poll"}
            {activePoll?.ended && (
              <span className="text-red-500 ml-2">(Ended)</span>
            )}
          </DialogTitle>
        </DialogHeader>

        {!activePoll ? (
          // Creation Mode
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question..."
              />
            </div>
            <div className="grid gap-2">
              <Label>Options</Label>
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="w-full mt-2"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Option
              </Button>
            </div>
          </div>
        ) : (
          // Voting/Result Mode
          <div className="grid gap-4 py-4">
            <h3 className="font-semibold text-lg">{activePoll.question}</h3>

            {!hasVoted && !activePoll.ended ? (
              <RadioGroup
                value={selectedOption?.toString()}
                onValueChange={(val) => setSelectedOption(parseInt(val))}
              >
                {activePoll.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={index.toString()}
                      id={`option-${index}`}
                    />
                    <Label htmlFor={`option-${index}`}>{option.text}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                {activePoll.options.map((option, index) => {
                  const percentage =
                    activePoll.totalVotes > 0
                      ? Math.round((option.votes / activePoll.totalVotes) * 100)
                      : 0;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{option.text}</span>
                        <span>
                          {percentage}% ({option.votes} votes)
                        </span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  );
                })}
                <div className="text-center text-sm text-gray-500 mt-4">
                  Total Votes: {activePoll.totalVotes}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {!activePoll ? (
            <Button onClick={handleCreatePoll}>Launch Poll</Button>
          ) : !hasVoted && !activePoll.ended ? (
            <Button onClick={handleVote} disabled={selectedOption === null}>
              Vote
            </Button>
          ) : (
            <div className="flex gap-2">
              {activePoll.createdBy === myId && !activePoll.ended && (
                <Button variant="destructive" onClick={handleEndPoll}>
                  End Poll
                </Button>
              )}
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

PollModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  socket: PropTypes.object,
  roomId: PropTypes.string.isRequired,
  activePoll: PropTypes.object,
  hasVoted: PropTypes.bool.isRequired,
  setHasVoted: PropTypes.func.isRequired,
  myId: PropTypes.string,
};
