const express = require('express')
const user = require('./models/user')
const cors = require('cors')
const app = express();
const enc = new TextEncoder();
const {ethers} = require('ethers');

function strToBin(str) {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

app.use(express.json());
app.use(cors());

const walletAbi = [
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "balances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  const walletBytecode = {
    "functionDebugData": {
      "@_21": {
        "entryPoint": null,
        "id": 21,
        "parameterSlots": 0,
        "returnSlots": 0
      }
    },
    "generatedSources": [],
    "linkReferences": {},
    "object": "608060405234801561000f575f80fd5b5061058b8061001d5f395ff3fe60806040526004361061003e575f3560e01c806312065fe01461004257806327e235e31461006c5780633ccfd60b146100a8578063d0e30db0146100be575b5f80fd5b34801561004d575f80fd5b506100566100c8565b6040516100639190610373565b60405180910390f35b348015610077575f80fd5b50610092600480360381019061008d91906103ea565b61010b565b60405161009f9190610373565b60405180910390f35b3480156100b3575f80fd5b506100bc61011f565b005b6100c6610277565b005b5f805f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2054905090565b5f602052805f5260405f205f915090505481565b5f805f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205490505f81116101a1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101989061046f565b60405180910390fd5b5f805f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055503373ffffffffffffffffffffffffffffffffffffffff166108fc8290811502906040515f60405180830381858888f19350505050158015610225573d5f803e3d5ffd5b503373ffffffffffffffffffffffffffffffffffffffff167f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a94243648260405161026c9190610373565b60405180910390a250565b5f34116102b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102b0906104d7565b60405180910390fd5b345f803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f8282546103049190610522565b925050819055503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040516103519190610373565b60405180910390a2565b5f819050919050565b61036d8161035b565b82525050565b5f6020820190506103865f830184610364565b92915050565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6103b982610390565b9050919050565b6103c9816103af565b81146103d3575f80fd5b50565b5f813590506103e4816103c0565b92915050565b5f602082840312156103ff576103fe61038c565b5b5f61040c848285016103d6565b91505092915050565b5f82825260208201905092915050565b7f496e73756666696369656e742062616c616e63650000000000000000000000005f82015250565b5f610459601483610415565b915061046482610425565b602082019050919050565b5f6020820190508181035f8301526104868161044d565b9050919050565b7f416d6f756e74206d7573742062652067726561746572207468616e20300000005f82015250565b5f6104c1601d83610415565b91506104cc8261048d565b602082019050919050565b5f6020820190508181035f8301526104ee816104b5565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61052c8261035b565b91506105378361035b565b925082820190508082111561054f5761054e6104f5565b5b9291505056fea26469706673582212208375dff281a62da36d5fd4909e90a6db7da808a96981dceb12ebf08228c068bb64736f6c63430008160033",
    "opcodes": "PUSH1 0x80 PUSH1 0x40 MSTORE CALLVALUE DUP1 ISZERO PUSH2 0xF JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH2 0x58B DUP1 PUSH2 0x1D PUSH0 CODECOPY PUSH0 RETURN INVALID PUSH1 0x80 PUSH1 0x40 MSTORE PUSH1 0x4 CALLDATASIZE LT PUSH2 0x3E JUMPI PUSH0 CALLDATALOAD PUSH1 0xE0 SHR DUP1 PUSH4 0x12065FE0 EQ PUSH2 0x42 JUMPI DUP1 PUSH4 0x27E235E3 EQ PUSH2 0x6C JUMPI DUP1 PUSH4 0x3CCFD60B EQ PUSH2 0xA8 JUMPI DUP1 PUSH4 0xD0E30DB0 EQ PUSH2 0xBE JUMPI JUMPDEST PUSH0 DUP1 REVERT JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x4D JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH2 0x56 PUSH2 0xC8 JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x63 SWAP2 SWAP1 PUSH2 0x373 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0x77 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH2 0x92 PUSH1 0x4 DUP1 CALLDATASIZE SUB DUP2 ADD SWAP1 PUSH2 0x8D SWAP2 SWAP1 PUSH2 0x3EA JUMP JUMPDEST PUSH2 0x10B JUMP JUMPDEST PUSH1 0x40 MLOAD PUSH2 0x9F SWAP2 SWAP1 PUSH2 0x373 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 RETURN JUMPDEST CALLVALUE DUP1 ISZERO PUSH2 0xB3 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP PUSH2 0xBC PUSH2 0x11F JUMP JUMPDEST STOP JUMPDEST PUSH2 0xC6 PUSH2 0x277 JUMP JUMPDEST STOP JUMPDEST PUSH0 DUP1 PUSH0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP SWAP1 JUMP JUMPDEST PUSH0 PUSH1 0x20 MSTORE DUP1 PUSH0 MSTORE PUSH1 0x40 PUSH0 KECCAK256 PUSH0 SWAP2 POP SWAP1 POP SLOAD DUP2 JUMP JUMPDEST PUSH0 DUP1 PUSH0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 SLOAD SWAP1 POP PUSH0 DUP2 GT PUSH2 0x1A1 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x198 SWAP1 PUSH2 0x46F JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST PUSH0 DUP1 PUSH0 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 DUP2 SWAP1 SSTORE POP CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH2 0x8FC DUP3 SWAP1 DUP2 ISZERO MUL SWAP1 PUSH1 0x40 MLOAD PUSH0 PUSH1 0x40 MLOAD DUP1 DUP4 SUB DUP2 DUP6 DUP9 DUP9 CALL SWAP4 POP POP POP POP ISZERO DUP1 ISZERO PUSH2 0x225 JUMPI RETURNDATASIZE PUSH0 DUP1 RETURNDATACOPY RETURNDATASIZE PUSH0 REVERT JUMPDEST POP CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0x884EDAD9CE6FA2440D8A54CC123490EB96D2768479D49FF9C7366125A9424364 DUP3 PUSH1 0x40 MLOAD PUSH2 0x26C SWAP2 SWAP1 PUSH2 0x373 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG2 POP JUMP JUMPDEST PUSH0 CALLVALUE GT PUSH2 0x2B9 JUMPI PUSH1 0x40 MLOAD PUSH32 0x8C379A000000000000000000000000000000000000000000000000000000000 DUP2 MSTORE PUSH1 0x4 ADD PUSH2 0x2B0 SWAP1 PUSH2 0x4D7 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 REVERT JUMPDEST CALLVALUE PUSH0 DUP1 CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND DUP2 MSTORE PUSH1 0x20 ADD SWAP1 DUP2 MSTORE PUSH1 0x20 ADD PUSH0 KECCAK256 PUSH0 DUP3 DUP3 SLOAD PUSH2 0x304 SWAP2 SWAP1 PUSH2 0x522 JUMP JUMPDEST SWAP3 POP POP DUP2 SWAP1 SSTORE POP CALLER PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF AND PUSH32 0xE1FFFCC4923D04B559F4D29A8BFC6CDA04EB5B0D3C460751C2402C5C5CC9109C CALLVALUE PUSH1 0x40 MLOAD PUSH2 0x351 SWAP2 SWAP1 PUSH2 0x373 JUMP JUMPDEST PUSH1 0x40 MLOAD DUP1 SWAP2 SUB SWAP1 LOG2 JUMP JUMPDEST PUSH0 DUP2 SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x36D DUP2 PUSH2 0x35B JUMP JUMPDEST DUP3 MSTORE POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP PUSH2 0x386 PUSH0 DUP4 ADD DUP5 PUSH2 0x364 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP1 REVERT JUMPDEST PUSH0 PUSH20 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF DUP3 AND SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH2 0x3B9 DUP3 PUSH2 0x390 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH2 0x3C9 DUP2 PUSH2 0x3AF JUMP JUMPDEST DUP2 EQ PUSH2 0x3D3 JUMPI PUSH0 DUP1 REVERT JUMPDEST POP JUMP JUMPDEST PUSH0 DUP2 CALLDATALOAD SWAP1 POP PUSH2 0x3E4 DUP2 PUSH2 0x3C0 JUMP JUMPDEST SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 DUP5 SUB SLT ISZERO PUSH2 0x3FF JUMPI PUSH2 0x3FE PUSH2 0x38C JUMP JUMPDEST JUMPDEST PUSH0 PUSH2 0x40C DUP5 DUP3 DUP6 ADD PUSH2 0x3D6 JUMP JUMPDEST SWAP2 POP POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH0 DUP3 DUP3 MSTORE PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP3 SWAP2 POP POP JUMP JUMPDEST PUSH32 0x496E73756666696369656E742062616C616E6365000000000000000000000000 PUSH0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH0 PUSH2 0x459 PUSH1 0x14 DUP4 PUSH2 0x415 JUMP JUMPDEST SWAP2 POP PUSH2 0x464 DUP3 PUSH2 0x425 JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH0 DUP4 ADD MSTORE PUSH2 0x486 DUP2 PUSH2 0x44D JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x416D6F756E74206D7573742062652067726561746572207468616E2030000000 PUSH0 DUP3 ADD MSTORE POP JUMP JUMPDEST PUSH0 PUSH2 0x4C1 PUSH1 0x1D DUP4 PUSH2 0x415 JUMP JUMPDEST SWAP2 POP PUSH2 0x4CC DUP3 PUSH2 0x48D JUMP JUMPDEST PUSH1 0x20 DUP3 ADD SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH0 PUSH1 0x20 DUP3 ADD SWAP1 POP DUP2 DUP2 SUB PUSH0 DUP4 ADD MSTORE PUSH2 0x4EE DUP2 PUSH2 0x4B5 JUMP JUMPDEST SWAP1 POP SWAP2 SWAP1 POP JUMP JUMPDEST PUSH32 0x4E487B7100000000000000000000000000000000000000000000000000000000 PUSH0 MSTORE PUSH1 0x11 PUSH1 0x4 MSTORE PUSH1 0x24 PUSH0 REVERT JUMPDEST PUSH0 PUSH2 0x52C DUP3 PUSH2 0x35B JUMP JUMPDEST SWAP2 POP PUSH2 0x537 DUP4 PUSH2 0x35B JUMP JUMPDEST SWAP3 POP DUP3 DUP3 ADD SWAP1 POP DUP1 DUP3 GT ISZERO PUSH2 0x54F JUMPI PUSH2 0x54E PUSH2 0x4F5 JUMP JUMPDEST JUMPDEST SWAP3 SWAP2 POP POP JUMP INVALID LOG2 PUSH5 0x6970667358 0x22 SLT KECCAK256 DUP4 PUSH22 0xDFF281A62DA36D5FD4909E90A6DB7DA808A96981DCEB SLT 0xEB CREATE DUP3 0x28 0xC0 PUSH9 0xBB64736F6C63430008 AND STOP CALLER ",
    "sourceMap": "61:859:0:-:0;;;262:56;;;;;;;;;;61:859;;;;;;"
  }

const deploy = async () => {
    

    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/"); 
    const privateKey = 'cad53aa8649deaaeb7b895f49f3a76623361707effc0e60ef8fce42612aba399'; 

    const wallet = new ethers.Wallet(privateKey, provider);
    const contractFactory = new ethers.ContractFactory(walletAbi, walletBytecode, wallet);
    const contract = await contractFactory.deploy();
    const newContractAddress = await contract.address;
    console.log("contract deployed");
    console.log(newContractAddress);
    return newContractAddress;   
    
}



app.post('/login', async (req, res) => {

    const {Name, AccountID, UpiID, RawID}=req.body;

    const RoundUpContractAddress=await deploy();

    console.log(Name);
    const usercreated = new user({Name, AccountID, UpiID, RawID,RoundUpContractAddress});
    console.log(req.body);
    let result = await usercreated.save();
    res.send(result);
})


app.post('/createpublickey', async (req, res) => {

    const publicKey = {
        // random, cryptographically secure, at least 16 bytes
        challenge: enc.encode('someRandomStringThatSHouldBeReLLYLoooong&Random'),
        // relying party
        rp: {
            id:'localhost',
            name: 'closedcred'
        },
        user: {
            id: enc.encode(req.body.address),
            name: req.body.name,
            displayName: req.body.name
        },
        authenticatorSelection: {
            userVerification: "preferred"
        },
        attestation: 'direct',
        pubKeyCredParams: [
            {
                type: "public-key", alg: -7 // "ES256" IANA COSE Algorithms registry
            }
        ]
    }

    console.log("Response send");
    res.send(publicKey);

})

app.post('/validateCreds', async (req, res) => {
    const accountAddress = req.body.address;
    const requiredsUser = await user.findOne({ AccountID:accountAddress });
    console.log(requiredsUser);
    const AUTH_CHALLENGE = 'someRandomString';
    console.log(requiredsUser.RawID)
    const publicKey = {
        // your domain
        rp: {
            name: 'closedcred',
            id:'localhost'
        },
        
        // random, cryptographically secure, at least 16 bytes
        challenge: enc.encode(AUTH_CHALLENGE),
        allowCredentials: [{
            id: strToBin(requiredsUser.RawID),
            type: 'public-key'
        }],
        authenticatorSelection: {
            userVerification: "preferred"
        },
        pubKeyCredParams: [
            {
                type: "public-key", alg: -7 // "ES256" IANA COSE Algorithms registry
            }
        ]
    };
    res.send(publicKey);
})

app.post('/auth', async (req, res) => {
    const AUTH_CHALLENGE = 'someRandomString';
    const dataFromClient = JSON.parse(atob(req.body.clientDataJSON));
    const retrievedChallenge = atob(dataFromClient.challenge);
    const retrievedOrigin = dataFromClient.origin;
    // At MINIMUM, your auth checksshould be:
    // 1. Check that the retrieved challenge matches the auth challenge you sent to the client, as we do trivially below
    // 2. Check that "retrievedOrigin" matches your domain - otherwise this might be a phish - not shown here
    console.log(retrievedChallenge);
    if (retrievedChallenge == AUTH_CHALLENGE) {
        console.log("Authorized");
        res.send({ Auth: 1 });
    } else {
        res.send({ Auth: 0 });
    }
})


app.post('/getUpiId',async(req,res)=>{

    let accountAddress=req.body.address;
    let requireduser=user.findOne({UpiID:UpiID});
    let respo=requireduser.AccountID

})

app.get('/getAddress/:upiID',async(req,res)=>{
    const requser=await user.findOne({UpiID:req.params.upiID});
    
    const address=requser.AccountID;
    console.log(requser);
    console.log(address);
    return res.send({address:address});
})


app.get('/getContractAdress/:PubKey',async(req,res)=>{

    const requser=await user.findOne({AccountID:req.params.PubKey});
    const address=requser.RoundUpContractAddress;
    console.log(requser);
    console.log(address);
    return res.send({address:address});
})

app.listen(5000)