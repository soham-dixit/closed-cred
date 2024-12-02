import React from 'react'
import { useState, useEffect } from 'react';
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import RPC from "../web3RPC";
import { useNavigate } from 'react-router-dom';
import base64url, { Base64Url } from 'base64url';

export default function Upiform() {

  const [web3auth, setWeb3auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [chainId, setChainId] = useState("");
  const [userData, setUserData] = useState({});
  const [UpiID, setUpiID] = useState("");
  const navigate = useNavigate();

  const clientId =
    "BMkKHE4n2KgzLWFXDmpCVIpWMggQ8Pe8_4pRkbm9aNafKnn0WRlb1zoy6JlOh2nN2Aw54jIAbFbsAUut3tuJr8w";

  function strToBin(str) {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0));
  }

  function binToStr(bin) {
    return btoa(new Uint8Array(bin).reduce(
      (s, byte) => s + String.fromCharCode(byte), ''
    ));
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
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const validateCreds = async () => {
    let pubKeyForValidation = await fetch('http://localhost:5000/validateCreds', {
      method: "post",
      body: JSON.stringify({ address: localStorage.getItem('publicAddress') }),
      headers: { 'Content-Type': 'application/json' }
    });
    pubKeyForValidation = await pubKeyForValidation.json();
    const challengeArray = Object.values(pubKeyForValidation.challenge);
    const allowCredentials = Object.values(pubKeyForValidation.allowCredentials[0].id);

    // Create an ArrayBuffer from the challengeArray
    const challengeBuffer = new Uint8Array(challengeArray).buffer;
    const allowCredentialsbuffer = new Uint8Array(allowCredentials).buffer;
    // let name = pubkey.user.name;
    const res = await navigator.credentials.get({
      publicKey: {
        challenge: challengeBuffer,
        allowCredentials: [{
          id: allowCredentialsbuffer, type: "public-key"
        }],
        authenticatorSelection: {
          userVerification: "preferred"
        },
        attestation: "direct",
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7
          },
          {
            type: "public-key",
            alg: -8
          },
          {
            type: "public-key",
            alg: -36
          },
          {
            type: "public-key",
            alg: -37
          },
          {
            type: "public-key",
            alg: -38
          },
          {
            type: "public-key",
            alg: -39
          },
          {
            type: "public-key",
            alg: -257
          },
          {
            type: "public-key",
            alg: -258
          },
          {
            type: "public-key",
            alg: -259
          }]
      }
    })

    console.log(res);
    console.log('bkl');
    if (res) {
      const extractedData = {
        id: res.id,
        rawId: binToStr(res.rawId),
        clientDataJSON: binToStr(res.response.clientDataJSON)
      }

      let auth = await fetch('http://127.0.0.1:5000/auth', {
        method: "post",
        body: JSON.stringify(extractedData),
        headers: { 'Content-Type': 'application/json' }
      });

      auth = await auth.json();
      if (auth.Auth) {
        alert("Authinticated");
      }
      else {
        alert("UnAuthinticated");
      }

    }
    else {
      alert("Unauthorized");
    }
  }

  const sendata = async (UpiID) => {
    const user = await web3auth.getUserInfo();
    setUserData(user);
    const Name = userData.name;

    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log(provider)
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    setAddress(address);

    let AccountID = address;
    localStorage.setItem("publicAddress", AccountID);
    console.log(address);

    let pubkey = await fetch("http://localhost:5000/createpublickey", {
      method: "post",
      body: JSON.stringify({ address: AccountID, name: user.name }),
      headers: { 'Content-Type': 'application/json' }
    });
    const enc = new TextEncoder();
    // pubkey=enc.encode(pubkey);

    pubkey = await pubkey.json();

    // pubkey=strToBin(pubkey)
    // pubkey=preregToBuffer(pubkey);
    console.log(pubkey.user.name);
    // Convert the challengeObject into an array of numbers
    const challengeArray = Object.values(pubkey.challenge);
    const id = Object.values(pubkey.user.id);

    // Create an ArrayBuffer from the challengeArray
    const challengeBuffer = new Uint8Array(challengeArray).buffer;
    const idbuffer = new Uint8Array(id).buffer;
    let name = pubkey.user.name;

    const res = await navigator.credentials.create({
      publicKey: {
        challenge: challengeBuffer,
        rp: {
          name: "ClsedCred"
        },

        user: {
          name: name,
          displayName: name,
          id: idbuffer
        },
        authenticatorSelection: {
          userVerification: "preferred"
        },
        attestation: "direct",
        // pubKeyCredParams: [
        //   {
        //     type: "public-key",
        //     alg: 'ES256'
        //   }
        // ]
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7
          },
          {
            type: "public-key",
            alg: -8
          },
          {
            type: "public-key",
            alg: -36
          },
          {
            type: "public-key",
            alg: -37
          },
          {
            type: "public-key",
            alg: -38
          },
          {
            type: "public-key",
            alg: -39
          },
          {
            type: "public-key",
            alg: -257
          },
          {
            type: "public-key",
            alg: -258
          },
          {
            type: "public-key",
            alg: -259
          }]

      }
    })

    console.log(res);
    

    localStorage.setItem('rawId', binToStr(res.rawId));
    let RawID = localStorage.getItem('rawId');
    // let RawID=69;
    console.log(RawID);
    let result2 = await fetch("http://localhost:5000/login", {
      method: "post",
      body: JSON.stringify({ Name, AccountID, UpiID, RawID }),
      headers: { 'Content-Type': 'application/json' }
    });
    result2 = await result2.json();
    console.log(result2);
    localStorage.removeItem('rawId');
    alert("UPI ID submitted successfully");
  };
  const logout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.logout();
    setProvider(web3authProvider);
    setBalance("");
    setAddress("");
    setUserData({});
    setChainId("");
    localStorage.removeItem('user');
    navigate('/')
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    console.log(provider)
    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    setAddress(address);
    console.log(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    setBalance(balance);
    console.log(balance);
  };

  return (
    <div>
      <input onChange={(e) => { setUpiID(e.target.value); }} />
      <button onClick={() => { sendata(UpiID); }}> Submit</button>
      <button onClick={logout}>LogOut</button>
      <button onClick={validateCreds}>validate</button>
      <button onClick={getAccounts}>account</button>
      <button onClick={getBalance}>Get balance</button>
    </div>
  )
}
