import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Temporarily disable socket connection since we're using Huddle01 iframe
    // The socket connection will be enabled when we need real-time features
    // outside of the meeting room (like notifications, live updates, etc.)
    
    /* 
    const connection = io("http://localhost:5000", {
      transports: ["websocket"],
    });
    setSocket(connection);

    connection.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      connection.close();
    };
    */
  }, []);

  SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
