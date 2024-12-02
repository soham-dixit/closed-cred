import React, { useState } from 'react';


export default function UniswapSubgraph() {

    const [poolsArray,setPoolsArray]=useState([]);
    
    const main=async()=>{
        const APIURL = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3'
    
    const tokensQuery = `
    query lavda {
        pools(orderBy: volumeUSD, orderDirection: desc, first: 10) {
          id
          token0 {
            id
            symbol
            totalSupply
            totalValueLocked
            name
          }
          token1 {
            id
            symbol
            name
            totalSupply
            volume
          }
          createdAtTimestamp
          liquidity
          liquidityProviderCount
          token1Price
          token0Price
          txCount
          volumeToken0
          volumeToken1
          volumeUSD
        }
      }
    `
    var options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: tokensQuery
        })
      }
    var response = await fetch(APIURL,options)
    //parsing the body text as JSON 
    var queryResult =  await response.json()
    console.log(queryResult.data);
setPoolsArray(queryResult.data.pools)}
    
  return (
    <div>
        {poolsArray.length!==0?<>{poolsArray.map((pool)=>{ return <div>{pool.token0.name}/{pool.token1.name} <div>volume0={pool.volumeToken0}</div> </div> })} </>:<p>asif</p>}
      <button onClick={main} >Click me</button>
    </div>
  )
}
