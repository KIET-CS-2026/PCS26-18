import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/contexts/Socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";
import { useParams } from "react-router-dom"; // Use React Router's useParams

import Player from "@/components/Room/Player";
import Bottom from "@/components/Room/Bottom";
import CopySection from "@/components/Room/CopySection";

const Room = () => {
  const socket = useSocket();
  const { roomId } = useParams(); // Access roomId from the URL
  const { peer, myId } = usePeer();
  const { stream, screenStream, startScreenShare, stopScreenShare } =
    useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId, peer);

  const [users, setUsers] = useState([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stopScreenShare();
      setIsScreenSharing(false);
      // Switch back to camera stream
      if (stream) {
        setPlayers((prev) => ({
          ...prev,
          [myId]: {
            url: stream,
            muted: playerHighlighted?.muted || true,
            playing: playerHighlighted?.playing || true,
          },
        }));
      }
    } else {
      const screenStream = await startScreenShare();
      if (screenStream) {
        setIsScreenSharing(true);
        setPlayers((prev) => ({
          ...prev,
          [myId]: {
            url: screenStream,
            muted: playerHighlighted?.muted || true,
            playing: true,
          },
        }));

        // Update other peers with the new screen stream
        Object.keys(users).forEach((userId) => {
          const call = peer.call(userId, screenStream);
          call.on("stream", (incomingStream) => {
            setPlayers((prev) => ({
              ...prev,
              [userId]: {
                url: incomingStream,
                muted: true,
                playing: true,
              },
            }));
          });
        });
      }
    }
  };

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser) => {
      console.log(`user connected in room with userId ${newUser}`);

      const call = peer.call(newUser, stream);

      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${newUser}`);
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newUser]: call,
        }));
      });
    };
    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, setPlayers, socket, stream]);

  useEffect(() => {
    if (!socket) return;
    const handleToggleAudio = (userId) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId) => {
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
    };
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [players, setPlayers, socket, users]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] bg-gray-800">
      <div className="absolute top-0 left-0 right-0 bottom-12 mx-auto">
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive
            isScreenShare={isScreenSharing}
          />
        )}
      </div>

      <div className="absolute top-20 right-5 flex flex-col overflow-y-auto space-y-4 max-h-[calc(100vh-12rem-100px)]">
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>

      <CopySection roomId={roomId} />

      <div className="absolute bottom-5 left-0 right-0 mx-auto flex justify-center space-x-6">
        <Bottom
          muted={playerHighlighted?.muted}
          playing={playerHighlighted?.playing}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          leaveRoom={leaveRoom}
          isScreenSharing={isScreenSharing}
          toggleScreenShare={toggleScreenShare}
        />
      </div>
    </div>
  );
};

export default Room;
