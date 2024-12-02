import React from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "../web3RPC";
import { useState,useEffect } from 'react';
import convert from "./apnaCryptoConvert";

export default function MicroInvestment() {
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [withdrawAmount,setWithdrawamount]=useState(0);
  const [contractBalance,setContractbalance]=useState(0);
  const clientId =
    "BMkKHE4n2KgzLWFXDmpCVIpWMggQ8Pe8_4pRkbm9aNafKnn0WRlb1zoy6JlOh2nN2Aw54jIAbFbsAUut3tuJr8w";

    const sendGetContractBalance = async()=>{
        if (!provider) {
            console.log("provider not initialized yet");
            return;
          }
          const pubKey=localStorage.getItem("publicAddress");

          let contractAddress = await fetch(`http://127.0.0.1:5000/getContractAdress/${pubKey}`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
          });
          contractAddress = await contractAddress.json();
      const rpc = await new RPC(provider);
      const balance = await rpc.getContractBalance(contractAddress.address);
      console.log(balance);
      setContractbalance(balance)
    }

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13881",
            rpcTarget: "https://rpc-mumbai.maticvigil.com/",
          },

        });
        setWeb3auth(web3auth);
        await web3auth.initModal();
        setProvider(web3auth.provider);
        console.log(provider);

        const pubKey=localStorage.getItem("publicAddress");

          let contractAddress = await fetch(`http://127.0.0.1:5000/getContractAdress/${pubKey}`, {
            method: "get",
            headers: { "Content-Type": "application/json" },
          });
          contractAddress = await contractAddress.json();
        const rpc = await new RPC(web3auth.provider);
        const balance = await rpc.getContractBalance(contractAddress.address);
      console.log(balance);
      setContractbalance(balance)
      } catch (error) {
        console.error(error);
      }
    };
    init();
    sendGetContractBalance();
  }, []);

 

  const sendWithdrawTransaction=async()=>{
    if (!provider) {
        console.log("provider not initialized yet");
        return;
      }
    const pubKey=localStorage.getItem("publicAddress");

    let contractAddress = await fetch(`http://127.0.0.1:5000/getContractAdress/${pubKey}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    contractAddress = await contractAddress.json();

    const rpc = new RPC(provider);
    const receipt = await rpc.withdrawTransaction(contractAddress.address);
    console.log(receipt);
  }

  return (
    <div>
        {/* <input type='text' onChange={(e)=>setWithdrawamount(e.target.value)}/> */}
        <div>Saved amount =</div>{convert.MATIC.INR(parseFloat(contractBalance))}
        <br></br>
        <button onClick={sendWithdrawTransaction}>Withdraw</button>
      
    </div>
  )
}
