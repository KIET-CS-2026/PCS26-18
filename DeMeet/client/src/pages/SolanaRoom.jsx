import { useEffect, lazy, Suspense } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRoom } from "@huddle01/react/hooks";
import { useParams } from "react-router-dom";
import { handleSignIn } from "../../../server/src/lib/handleSignIn";

const WalletMultiButton = lazy(() =>
  import("@solana/wallet-adapter-react-ui").then((module) => ({
    default: module.WalletMultiButton,
  }))
);

export default function SolanaRoom() {
  const wallet = useWallet();
  const { joinRoom, state } = useRoom();
  const { roomId } = useParams();
  const displayName = "Guest";

  useEffect(() => {
    const handleWallet = async () => {
      const token = await handleSignIn(
        roomId,
        displayName,
        wallet.signMessage,
        wallet.publicKey
      );
      if (token) {
        await joinRoom({
          token,
          roomId: roomId,
        });
      }
    };

    if (wallet.connected && state === "idle") {
      handleWallet();
    }
  }, [wallet.connected, state, roomId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-foreground text-2xl mb-4">Solana Token-Gated Room</h1>
      <p className="text-muted-foreground mb-4">Room ID: {roomId}</p>
      <Suspense fallback={<div>Loading wallet...</div>}>
        <WalletMultiButton />
      </Suspense>
      {wallet.connected && (
        <p className="text-green-500 mt-4">Wallet connected! Joining room...</p>
      )}
    </div>
  );
}
