import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import AddLiquidity from './components/AddLiquidity';
import Stake from "./components/Stake";
import Faucet from "./components/Faucet";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Counter from "./contracts/Counter.sol/Counter.json";
import "./App.css";

const counterAddress = "0xeF72D27921E4bdf482dCACeD13e2FA22C6d82168"
console.log(counterAddress, "Counter ABI: ", Counter.abi);

function App() {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const incrementCounter = async () => {
    await updateCounter(setIsLoading, setCount);
  };

  useEffect(() => {
    const fetchCount = async () => {
      const data = await readCounterValue(setCount);
      return data;
    };

    fetchCount().catch(console.error);
  }, []);

  // return (
  //   <Container maxWidth="sm">
  //     <Card sx={{ minWidth: 275, marginTop: 20 }}>
  //       <CardContent>
  //         <p>Count: {count}</p>
  //         <Button onClick={incrementCounter} variant="outlined" disabled={isLoading}>
  //           {isLoading ? "Loading..." : "+1"}
  //         </Button>
  //       </CardContent>
  //     </Card>
  //   </Container>
  // );
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/faucet">Faucet</Link>
          <Link to="/add-liquidity">Provide Liquidity</Link>
          <Link to="/stake">Stake Coconut Tokens</Link>
          
          {/* <Link to="/stake-mango">Stake Mango</Link>
          <Link to="/withdraw-peach">Withdraw Peach</Link>
          <Link to="/withdraw-mango">Withdraw Mango</Link> */}
          {/* <ConnectWallet /> */}
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/add-liquidity" element={<AddLiquidity />} />
          <Route path="/stake" element={<Stake />} />
          
          {/* <Route path="/stake-mango" component={StakeMango} />
          <Route path="/withdraw-peach" component={WithdrawPeach} />
          <Route path="/withdraw-mango" component={WithdrawMango} /> */}
        </Routes>
      </div>
    </Router>
  );
}

async function requestAccount() {
  await window.ethereum.request({ method: "eth_requestAccounts" });
}

async function updateCounter(setIsLoading, setCount) {
  if (typeof window.ethereum !== "undefined") {
    await requestAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(counterAddress, Counter.abi, signer);
    const transaction = await contract.increment();
    setIsLoading(true);
    await transaction.wait();
    setIsLoading(false);
    readCounterValue(setCount);
  }
}

async function readCounterValue(setCount) {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(counterAddress, Counter.abi, provider);
    try {
      const data = await contract.retrieve();
      setCount(parseInt(data.toString()));
    } catch (err) {
      console.error("Error: ", err);
      alert("Switch your MetaMask network to Polygon zkEVM Testnet and refresh this page!");
    }
  }
}

export default App;
