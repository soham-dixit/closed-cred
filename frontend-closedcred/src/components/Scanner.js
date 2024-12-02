import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { CHAIN_NAMESPACES } from "@web3auth/base";
import { Web3Auth } from "@web3auth/modal";
// import CryptoConvert from "crypto-convert";
import convert from "./apnaCryptoConvert";

import URLParse from "url-parse";
import RPC from "../web3RPC";

const { ethers } = require("ethers");

function Scanner() {
  const [web3auth, setWeb3auth] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [UpiID, setUpiID] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [provider, setProvider] = useState(null);
  const [convertedValue, setConvertesValue] = useState("");
  const [convertInstance, setConvertInstance] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const clientId =
    "BMkKHE4n2KgzLWFXDmpCVIpWMggQ8Pe8_4pRkbm9aNafKnn0WRlb1zoy6JlOh2nN2Aw54jIAbFbsAUut3tuJr8w";

  function binToStr(bin) {
    return btoa(
      new Uint8Array(bin).reduce((s, byte) => s + String.fromCharCode(byte), "")
    );
  }

  const handleInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
    if (!isNaN(value)) {
      const converted = convert.INR.MATIC(parseFloat(value));
      setConvertesValue(`${converted}`);
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 10,
    });

    let isScanning = true;

    scanner.render(success, error);

    function success(result) {
      try {
        if (isScanning) {
          scanner.clear();
          const parsedUrl = new URLParse(result, true);
          const upiid = parsedUrl.query.pa;
          const name = parsedUrl.query.pn;
          setName(parsedUrl.query.pn);
          setUpiID(parsedUrl.query.pa);
          if (upiid == null) {
            alert("Scan valid QR");
          }
          setScanResult(result);
          console.log(upiid, name);
          isScanning = false;
        }
      } catch {
        alert("Scan valid QR");
      }
    }
    function error(err) {
      console.warn(err);
    }
  }, []);

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
    let pubKeyForValidation = await fetch(
      "http://localhost:5000/validateCreds",
      {
        method: "post",
        body: JSON.stringify({
          address: localStorage.getItem("publicAddress"),
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    pubKeyForValidation = await pubKeyForValidation.json();
    const challengeArray = Object.values(pubKeyForValidation.challenge);
    const allowCredentials = Object.values(
      pubKeyForValidation.allowCredentials[0].id
    );

    // Create an ArrayBuffer from the challengeArray
    const challengeBuffer = new Uint8Array(challengeArray).buffer;
    const allowCredentialsbuffer = new Uint8Array(allowCredentials).buffer;
    // let name = pubkey.user.name;
    const res = await navigator.credentials.get({
      publicKey: {
        challenge: challengeBuffer,
        allowCredentials: [
          {
            id: allowCredentialsbuffer,
            type: "public-key",
          },
        ],
        authenticatorSelection: {
          userVerification: "preferred",
        },
        attestation: "direct",
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7,
          },
          {
            type: "public-key",
            alg: -8,
          },
          {
            type: "public-key",
            alg: -36,
          },
          {
            type: "public-key",
            alg: -37,
          },
          {
            type: "public-key",
            alg: -38,
          },
          {
            type: "public-key",
            alg: -39,
          },
          {
            type: "public-key",
            alg: -257,
          },
          {
            type: "public-key",
            alg: -258,
          },
          {
            type: "public-key",
            alg: -259,
          },
        ],
      },
    });

    console.log(res);
    console.log("bkl");
    if (res) {
      const extractedData = {
        id: res.id,
        rawId: binToStr(res.rawId),
        clientDataJSON: binToStr(res.response.clientDataJSON),
      };

      let auth = await fetch("http://127.0.0.1:5000/auth", {
        method: "post",
        body: JSON.stringify(extractedData),
        headers: { "Content-Type": "application/json" },
      });

      auth = await auth.json();
      if (auth.Auth) {
        alert("Authinticated");
        return true;
      } else {
        alert("UnAuthinticated");
        return false;
      }
    } else {
      return false;
    }
  };

  // useEffect(() => {
  //   test();
  // }, [amount]);

  // const sendContractTransaction = async (amount,walletAddress) => {

  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   // const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/"); 
        
  //       await provider.send("eth_requestAccounts", []);
  //       const walletAbi = [
  //         {
  //           "inputs": [],
  //           "name": "deposit",
  //           "outputs": [],
  //           "stateMutability": "payable",
  //           "type": "function"
  //         },
  //         {
  //           "inputs": [],
  //           "stateMutability": "nonpayable",
  //           "type": "constructor"
  //         },
  //         {
  //           "anonymous": false,
  //           "inputs": [
  //             {
  //               "indexed": true,
  //               "internalType": "address",
  //               "name": "user",
  //               "type": "address"
  //             },
  //             {
  //               "indexed": false,
  //               "internalType": "uint256",
  //               "name": "amount",
  //               "type": "uint256"
  //             }
  //           ],
  //           "name": "Deposit",
  //           "type": "event"
  //         },
  //         {
  //           "inputs": [],
  //           "name": "withdraw",
  //           "outputs": [],
  //           "stateMutability": "nonpayable",
  //           "type": "function"
  //         },
  //         {
  //           "anonymous": false,
  //           "inputs": [
  //             {
  //               "indexed": true,
  //               "internalType": "address",
  //               "name": "user",
  //               "type": "address"
  //             },
  //             {
  //               "indexed": false,
  //               "internalType": "uint256",
  //               "name": "amount",
  //               "type": "uint256"
  //             }
  //           ],
  //           "name": "Withdraw",
  //           "type": "event"
  //         },
  //         {
  //           "inputs": [
  //             {
  //               "internalType": "address",
  //               "name": "",
  //               "type": "address"
  //             }
  //           ],
  //           "name": "balances",
  //           "outputs": [
  //             {
  //               "internalType": "uint256",
  //               "name": "",
  //               "type": "uint256"
  //             }
  //           ],
  //           "stateMutability": "view",
  //           "type": "function"
  //         },
  //         {
  //           "inputs": [],
  //           "name": "getBalance",
  //           "outputs": [
  //             {
  //               "internalType": "uint256",
  //               "name": "",
  //               "type": "uint256"
  //             }
  //           ],
  //           "stateMutability": "view",
  //           "type": "function"
  //         }
  //       ]
        
  //       const signer = provider.getSigner();
  //       const contract = new ethers.Contract(walletAddress, walletAbi, signer);

  //       const sendEthAmount = convert.INR.ETH(parseFloat(amount));
  //       console.log("sent amount must be in wei: ")
  //       console.log(ethers.utils.formatUnits(sendEthAmount,0)); 
  //       await contract.deposit({value: ethers.utils.formatUnits(sendEthAmount,0)});
  //       console.log("Money saved");
  // };

  const sendDepositTransaction = async(address,amount) =>{
    
    const rpc = new RPC(provider);

    const sendEthAmount = convert.INR.ETH(parseFloat(amount));
    console.log(sendEthAmount)
    const receipt = await rpc.depositTransaction(address,sendEthAmount);
    
    console.log(receipt);
    console.log("Money saved"); 

  }
  
  const pay = async () => {
    console.log("amt");
    console.log(amount);
    let savedAmount = Math.abs(10 - (amount % 10));

    const pubKey=localStorage.getItem("publicAddress");

    let contractAddress = await fetch(`http://127.0.0.1:5000/getContractAdress/${pubKey}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    contractAddress = await contractAddress.json();

    let address = await fetch(`http://127.0.0.1:5000/getAddress/${UpiID}`, {
      method: "get",
      headers: { "Content-Type": "application/json" },
    });
    address = await address.json();
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const rpc = new RPC(provider);
    const validation = validateCreds();
    if (validation) {
      const receipt1 = await rpc.sendTransaction(
        String(convertedValue),
        address.address
      );
      console.log(contractAddress.address)
      console.log(receipt1);
      // sendContractTransaction(savedAmount,contractAddress.address);
      sendDepositTransaction(contractAddress.address,savedAmount)
    } else {
      alert("Authentication Failed");
    }
  };

  // function handleManualSerialNumberChange(event) {
  //   setManualSerialNumber(event.target.value);
  // }

  return (
    <div className="App">
      {
      /* <div>
        <p>start</p>
            <div>
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter a number"
              />
              <p>{convertedValue}</p>
            </div>
        <p>end</p>
      </div> */}
      <h1>QR Scanning Code</h1>
      {/* <button onClick={pay}>Pay</button> */}
      {scanResult ? (
        <div>
          <p>
            Success: <a href={scanResult}>{scanResult}</a>
          </p>
          <p>{UpiID}</p>
          <p>start</p>
          <div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter a number"
            />
            <p>{convertedValue}</p>
          </div>
          <p>end</p>
          <button onClick={pay}>Pay</button>
        </div>
      ) : (
        <div>
          <div id="reader"></div>
        </div>
      )}
      
    </div>
  );
}

export default Scanner;
