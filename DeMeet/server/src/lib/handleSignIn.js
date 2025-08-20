import base58 from "bs58";
import axios from "axios";

class SigninMessage {
  constructor({ domain, publicKey, expTime, statement }) {
    this.domain = domain;
    this.publicKey = publicKey;
    this.expTime = expTime;
    this.statement = statement;
  }
  prepare() {
    return `${this.statement}\n\n${this.domain}\n\nExpires on ${this.expTime}`;
  }
}

export const handleSignIn = async (roomId, displayName, signMessage, publicKey) => {
  const exp = Date.now() + 1000 * 60 * 5;
  const msg = new SigninMessage({
    domain: window.location.host,
    publicKey: publicKey.toBase58(),
    expTime: new Date(exp).toISOString(),
    statement: "Please Sign In to verify wallet",
  });

  const data = new TextEncoder().encode(msg.prepare());
  const sig = await signMessage(data);
  const serializedSignature = base58.encode(sig);

  const res = await axios.post(`${import.meta.env.VITE_API_BASE}/get-access-token`, {
    displayName,
    roomId,
    address: publicKey.toBase58(),
    expirationTime: exp,
    domain: window.location.host,
    signature: serializedSignature,
  });

  return res.data.token;
};
