import React, { useState } from 'react';
import { Web3Auth } from "@web3auth/modal";

export default function Compound() {
    const [amount,setAmount]=useState(0);
    const [provider, setProvider] = useState(null);

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
          } catch (error) {
            console.error(error);
          }
        };
    
        init();
      }, []);

  return (
    <div>
      <input onChange={(e)=>setAmount(e.target.value)}></input>
    </div>
  )
}
