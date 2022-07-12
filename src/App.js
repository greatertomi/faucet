import React, { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import {loadContract} from "./utils/load-contract";

const App = () => {
  const [web3Api, setWeb3Api] = useState({ provider: null, web3: null, contract: null });
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      // With metamask we have access to window.ethereum & to window.web3
      // metamarsk injects a global API into website. This API will allow websites
      // to request users, accounts, read to blockchain, sign messages and transactions.
      try {
        let provider = null;
        if (window.ethereum) {
          provider = window.ethereum;
        } else if (window.web3) {
          provider = window.web3.currentProvider;
        } else if (!process.env.production) {
          provider = new Web3.providers.HttpProvider("http://localhost:7545");
        }

        setWeb3Api({
          web3: new Web3(provider),
          provider,
        });

      } catch (err) {
        console.error(err);
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const initiateContract = async () => {
      const contract = await loadContract("Faucet", web3Api.web3);
      console.log(contract)
      setWeb3Api({...web3Api, contract})
    }
    initiateContract();
  }, [web3Api, web3Api.web3])


  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account:</strong>
            </span>
            {account ? (
              <div>{account}</div>
            ) : (
              <button
                className="button is-small"
                onClick={() => {
                  console.log("Connecting");
                  web3Api.provider.request({ method: "eth_requestAccounts" });
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className="balance-view is-size-2">
            Current Balance: <strong>10</strong> ETH
          </div>
          <button className="button is-primary mr-2">Donate</button>
          <button className="button is-link">Withdraw</button>
        </div>
      </div>
    </>
  );
};

export default App;
