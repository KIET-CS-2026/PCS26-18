import { useEffect, useState, lazy, Suspense } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import HuddleRoom from "../components/Room/HuddleRoom";

const WalletMultiButton = lazy(() =>
  import("@solana/wallet-adapter-react-ui").then((module) => ({
    default: module.WalletMultiButton,
  }))
);

export default function SolanaRoom() {
  const { publicKey, connected } = useWallet();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [accessStatus, setAccessStatus] = useState("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    if (connected && publicKey) {
      // Simplified access check - just check if wallet is connected
      setAccessStatus("allowed");
    } else {
      setAccessStatus("denied");
      setError("Please connect your wallet to access this room");
    }
  }, [connected, publicKey]);

  const handleLeaveRoom = () => {
    navigate("/dashboard");
  };

  if (accessStatus === "checking") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <h1 className="text-foreground text-2xl mb-2">Verifying Access...</h1>
        <p className="text-muted-foreground">Checking your wallet connection</p>
      </div>
    );
  }

  if (accessStatus === "denied") {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-foreground text-2xl mb-4 text-center">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-6 text-center">{error}</p>

        <div className="space-y-4 w-full">
          <Suspense fallback={<div>Loading wallet...</div>}>
            <WalletMultiButton className="w-full" />
          </Suspense>

          <Button
            onClick={() => navigate("/dashboard")}
            variant="outline"
            className="w-full"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Access granted - show the meeting room
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-card border-b shrink-0">
        <div>
          <h1 className="text-foreground text-xl font-semibold">
            Solana Token-Gated Room
          </h1>
          <p className="text-muted-foreground text-sm">Room ID: {roomId}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-500 text-sm">✅ Wallet Connected</span>
          <Button onClick={handleLeaveRoom} variant="outline" size="sm">
            Leave Room
          </Button>
        </div>
      </div>

      {/* Expanded meeting container */}
      <div className="flex-1 min-h-0 w-full overflow-hidden bg-gray-800">
        <HuddleRoom roomId={roomId} />
      </div>

      {/* Status indicator */}
      <div className="p-2 bg-muted text-center shrink-0">
        <span className="text-sm text-muted-foreground">
          Connected as: {publicKey?.toString().slice(0, 8)}...
          {publicKey?.toString().slice(-8)}
        </span>
      </div>
    </div>
  );
}
