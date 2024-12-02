const express = require('express')
const user = require('./models/user')
const cors = require('cors')
const app = express();
const enc = new TextEncoder();

function strToBin(str) {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

app.use(express.json());
app.use(cors());
app.post('/login', async (req, res) => {
    const usercreated = new user(req.body);
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

app.listen(5000)