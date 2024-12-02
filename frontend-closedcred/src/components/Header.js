import { Fragment, useState,useEffect } from 'react'

import { Link } from 'react-router-dom';

import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { useNavigate } from 'react-router-dom';



function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const navigate=useNavigate();

  const clientId =
  "BMkKHE4n2KgzLWFXDmpCVIpWMggQ8Pe8_4pRkbm9aNafKnn0WRlb1zoy6JlOh2nN2Aw54jIAbFbsAUut3tuJr8w";
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
    
    const login = async () => {
      if (!web3auth) {
        console.log("web3auth not initialized yet");
        return;
      }
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      localStorage.setItem('user',JSON.stringify(provider));
      // getAccounts();
      // setLoginwindow(false);
      navigate('/upiform');
  
    };

  return (
    <div>
      <button onClick={login}>Login</button>
    </div>
  )
}
