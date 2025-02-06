import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom"; // React Router
import { useSocket } from "@/contexts/Socket";
import Peer from "peerjs";

const usePeer = () => {
  const { roomId } = useParams(); // Get roomId from URL
  const socket = useSocket();
  const [peer, setPeer] = useState(null);
  const [myId, setMyId] = useState("");
  const isPeerSet = useRef(false);

  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return;
    isPeerSet.current = true;

    const myPeer = new Peer();
    setPeer(myPeer);

    myPeer.on("open", (id) => {
      console.log(`Your peer ID is ${id}`);
      setMyId(id);
      socket?.emit("join-room", roomId, id);
    });
  }, [roomId, socket]);

  return { peer, myId };
};

export default usePeer;
