import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Address, formatEther, maxUint256, parseEther } from "viem";
import { useWriteContract, useReadContract, useAccount } from 'wagmi'
import { waitForTransactionReceipt } from "@wagmi/core";
import  abi  from '../public/abi.json'

import SignMessage from "./components/SignMessage"

interface Props {
  wagmiConfig: any
}

function App(props: Props) {

  const {wagmiConfig} = props;

  const [currentlyStoredMessage, setCurrentlyStoredMessage] = useState<String>(""); 

  const { data: currentMessage, refetch: refetchMessage } = useReadContract({
    address: "0x294be545b23433E59dcc06C4cD41d369B533881E",
    abi,
    functionName: 'message',
    args: [],
  });

  const {data: hash, writeContractAsync} = useWriteContract();

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get('message') as string;
    console.log(message)
    await writeContractAsync({
      address: '0x294be545b23433E59dcc06C4cD41d369B533881E',
      abi,
      functionName: 'updateMessage',
      args: [message]
    })

    if (hash) {
      await waitForTransactionReceipt(wagmiConfig, { confirmations: 2, hash: hash as Address });
    }

    setTimeout(() => {
      refetchMessage();
      setCurrentlyStoredMessage(String(currentMessage))
    }, 30000);
  }

  useEffect(() => {
    if (currentMessage) {
      setCurrentlyStoredMessage(String(currentMessage))
    }
  }, [currentMessage])

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-2 bg-white border-b">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold"> Template App </h1>
        </div>
        <div className="flex items-center space-x-4">
          <ConnectButton/>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-7xl mt-8">
        <form onSubmit={submitHandler}>
          <input name="message" placeholder="Message to store..." required className="border p-1 mr-2 rounded"/>
          <button type="submit" className="px-4 py-1 bg-blue-600 text-white rounded">Store</button>
        </form>

        {hash && <div>Transaction Hash: {hash}</div>}

        <br/> <hr/> <br/>
        <p>
          <strong> Message: </strong> 
          {currentlyStoredMessage}
        </p>

        <SignMessage wagmiConfig={wagmiConfig}/>
      </main>
    </>
  )
}

export default App
