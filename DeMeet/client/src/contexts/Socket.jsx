import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connection = io("http://localhost:5000", {
      transports: ["websocket"],
    }); // Adjust if hosted
    // console.log("Socket connected", connection);
    setSocket(connection);

    connection.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      connection.close();
    };
  }, []);

  SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
