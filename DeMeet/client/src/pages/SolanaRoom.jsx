import { useEffect, useState, lazy, Suspense } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import HuddleRoom from "../components/Room/HuddleRoom";
import { useTokenVerification } from "../components/TokenVerification";

const WalletMultiButton = lazy(() =>
  import("@solana/wallet-adapter-react-ui").then((module) => ({
    default: module.WalletMultiButton,
  }))
);

export default function SolanaRoom() {
  const { publicKey, connected } = useWallet();
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Replace local gating with token verification hook
  const { isVerified, tokenBalance, isLoading, error, verifyTokenOwnership } =
    useTokenVerification();

  const handleLeaveRoom = () => navigate("/dashboard");

  if (!connected || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
        <h1 className="text-foreground text-2xl mb-2">Verifying Access...</h1>
        <p className="text-muted-foreground">Checking your token ownership</p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-foreground text-2xl mb-4 text-center">Access Denied</h1>
        <p className="text-muted-foreground mb-4 text-center">{error || "Token verification failed"}</p>

        {connected && (
          <div className="mb-4 p-3 rounded bg-muted text-sm text-muted-foreground w-full max-w-sm">
            <div>
              Wallet: {publicKey?.toString().slice(0, 8)}...
              {publicKey?.toString().slice(-8)}
            </div>
            <div>Token balance: {tokenBalance}</div>
          </div>
        )}

        <div className="space-y-3 w-full max-w-sm">
          <Suspense fallback={<div>Loading wallet...</div>}>
            <WalletMultiButton className="w-full" />
          </Suspense>
          <Button onClick={verifyTokenOwnership} className="w-full bg-purple-500 hover:bg-purple-600">
            Retry Token Verification
          </Button>
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Access granted - show the meeting room
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-card border-b">
        <div>
          <h1 className="text-foreground text-xl font-semibold">Solana Token-Gated Room</h1>
          <p className="text-muted-foreground text-sm">Room ID: {roomId}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-500 text-sm">✅ Token Verified ({tokenBalance})</span>
          <Button onClick={handleLeaveRoom} variant="outline" size="sm">
            Leave Room
          </Button>
        </div>
      </div>

      <div className="flex-1 h-full">
        <HuddleRoom roomId={roomId} />
      </div>

      {/* Status indicator */}
      <div className="p-2 bg-muted text-center">
        <span className="text-sm text-muted-foreground">
          Connected as: {publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}
        </span>
      </div>
    </div>
  );
}
