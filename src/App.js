import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import { loadContract } from "./utils/load-contract";

const App = () => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", (_) => window.location.reload());
    provider.on("chainChanged", (_) => window.location.reload());
  };

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

        setAccountListener(provider);
        const web3 = new Web3(provider);

        const contract = await loadContract("Faucet", web3);

        setWeb3Api({
          web3,
          provider,
          contract,
        });
      } catch (err) {
        console.error(err);
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;
      const balance = await web3.eth.getBalance(contract._address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api, shouldReload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    await contract.methods.addFunds().send({
      from: account,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3Api, account, reloadEffect]);

  const withdraw = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.methods.withdraw(withdrawAmount).send({
      from: account,
    });
    reloadEffect();
  }, [account, reloadEffect, web3Api]);

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
                  web3Api.provider.request({ method: "eth_requestAccounts" });
                }}
              >
                Connect Wallet
              </button>
            )}
          </div>
          <div className="balance-view is-size-2">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <button className="button is-primary mr-2" onClick={addFunds}>
            Donate 1 eth
          </button>
          <button className="button is-link" onClick={withdraw}>
            Withdraw
          </button>
        </div>
      </div>
    </>
  );
};

export default App;
