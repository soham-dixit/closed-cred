import React, { useEffect, useState } from "react";

import { Transak } from "@transak/transak-sdk";

export default function TransakWidget() {
    const [success,setsuccess]=useState(false);
    const [orderData,setorderData]=useState({})
  useEffect(() => {
    const walletAddress=localStorage.getItem('publicAddress');
    const transakConfig = {
      apiKey: "9b4e0655-329a-4799-8b0d-fa7484e9efd8",
      environment:
        Transak.ENVIRONMENTS.STAGING, 
      exchangeScreenTitle: 'Closed Cred', 
      walletAddress: walletAddress, 
      defaultFiatAmount: 3210, 
      defaultFiatCurrency: 'INR', 
      defaultCryptoCurrency: 'MATIC',
      // countryCode: 'IN', 
      defaultNetwork: 'polygon', 
      // paymentMethod: 'inr_upi', 
    };
    const transak = new Transak(transakConfig);

    transak.init();

    Transak.on("*", (data) => {
      console.log(data);
    });

    Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
      console.log("Transak SDK closed!");
    });

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_CREATED, (orderData) => {
      console.log(orderData);
    });

    Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      setorderData(orderData);
      setsuccess(true);
      transak.close();
    });

  }, []);
  return <div>
    {success?<><h1>Trasaction Done Successfully</h1>
    </>:null}
  </div>;
}
