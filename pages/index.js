import Head from 'next/head'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";

export default function Home() {

  const [walletConnected, SetWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [ens , setENS] = useState("");
  const [address, setAddress] = useState("");

  const getProviderOrSigner = async(needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const {chainId} = await web3Provider.getNetwork();
    if(chainId !== 5){
      window.alert("Change the network to Goerli");
      throw new Error("Change the network to Goerli");
    }

    const signer = web3Provider.getSigner();
    const address = await signer.getAddress();
    await setENSOrAddress(address,web3Provider);
    return signer;
  }

  const connectWallet = async() => {
    try{
      if(!walletConnected){
        await getProviderOrSigner(true);
        SetWalletConnected(true);
      }
    }catch(err){
      console.error(err);
    }
  }

  const setENSOrAddress = async(address, web3Provider) => {
    var _ens = await web3Provider.lookupAddress(address);

    if(_ens){
      setENS(_ens);
    }else{
      setAddress(address);
    }
  }

  useEffect(() => {
    if(!walletConnected){
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disabledInjectedProvider: false
      })
      connectWallet();
    }
  }, [walletConnected])
  

  const renderButton = () => {
    if(!walletConnected){
      return(
        <button onClick={connectWallet} className={styles.button}>
          Connect Wallet
        </button>
      )
      }else{
        return(
          <div>Wallet Connected</div>
        )
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ENS dApp</title>
        <meta name="description" content="ENS-dApp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>
            Welcome to LearnWeb3 Punks {ens ? ens : address}!
          </h1>
          <div className={styles.description}>
            Its an NFT collection for LearnWeb3 Punks.
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./learnweb3punks.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by LearnWeb3 Punks
      </footer>
    </div>
  )
}
