import React, { useState } from 'react';
import { signMessage } from '@wagmi/core';
import {recoverMessageAddress} from "viem";

interface Props {
  wagmiConfig: any
}

type HexString = `0x${string}`;

const SignMessage: React.FC<Props> = (props: Props) => {

  const {wagmiConfig} = props;

  const signingMessage = 'Please sign this message to confirm your identity.';

  const [signature, setSignature] = useState<HexString | null>(null);
  const [recoveredAddress, setRecoveredAddress] = useState<HexString | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signMessage(wagmiConfig, { message: signingMessage});
      console.log(result)
      setSignature(result!);
    } catch (err) {
      setError('Error signing message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverAccount = async () => {
    console.log(signingMessage)
    console.log(signature)
    if (signature !== null ){
      const address = await recoverMessageAddress({message: signingMessage, signature })
      setRecoveredAddress(address);
      console.log({address})
    }
  }

  return (
    <div>
      <button onClick={handleSignMessage} disabled={isLoading} className="border rounded px-2 py-1">
        {isLoading ? 'Signing...' : 'Sign Message'}
      </button>
      {error && <div>{error}</div>}
      {signature && <div>Signature: {signature}</div>}
      {
        signature &&
        <button onClick={handleRecoverAccount}  className="border rounded px-2 py-1">
          Recover Address
        </button>
      }
      {recoveredAddress &&
          <p>Recovered Address: {recoveredAddress}</p>
      }
    </div>
  );
};

export default SignMessage;

