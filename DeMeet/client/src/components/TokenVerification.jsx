import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
// Remove static import of web3.js
// import { Connection, PublicKey } from "@solana/web3.js";
import { GATED_TOKEN_MINT, SOLANA_RPC_ENDPOINT, MIN_TOKEN_AMOUNT } from "../utils/constants";

export const useTokenVerification = () => {
  const { publicKey, connected } = useWallet();
  const [isVerified, setIsVerified] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyTokenOwnership = async () => {
    if (!connected || !publicKey) {
      setError("Wallet not connected");
      setIsVerified(false);
      return false;
    }

    setIsLoading(true);
    setError("");

    try {
      // Dynamic import to prevent Vite optimize issues
      const { Connection, PublicKey } = await import("@solana/web3.js");
      const connection = new Connection(SOLANA_RPC_ENDPOINT);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(GATED_TOKEN_MINT),
      });

      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setTokenBalance(balance);
        const verified = balance >= MIN_TOKEN_AMOUNT;
        setIsVerified(verified);
        if (!verified) setError(`Insufficient tokens. Required: ${MIN_TOKEN_AMOUNT}, You have: ${balance}`);
        return verified;
      } else {
        setError("Required token not found in wallet");
        setIsVerified(false);
        return false;
      }
    } catch (err) {
      console.error("Token verification error:", err);
      setError("Failed to verify token ownership");
      setIsVerified(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (connected && publicKey) verifyTokenOwnership();
  }, [connected, publicKey]);

  return { isVerified, tokenBalance, isLoading, error, verifyTokenOwnership };
};
