import './App.css'
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const moduleAddress =
  "0x610ea90387f24c61fa507060dfb272a901ef420411473ab344cc45d72904e3bb";
const moduleName = "RockPaperScissors_01";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const client = new Aptos(aptosConfig);

const GameWrapper1 = () => {
  return (
    <div className="">
      <div>Connect Icon</div>
      <div className="h-screen flex justify-center align-middle">
        <h1 className="text-4xl font-semibold my-auto">
          Please connect your wallet to continue
        </h1>
      </div>
    </div>
  );
};

const GameWrapper2 = ({gameState,toggleGameState, handleMove, userSelection, computerSelection, result} : {
  gameState: boolean,
  toggleGameState: ()=>void,
  handleMove: (move: string) => void,
  userSelection: string,
  result: string,
  computerSelection: string
})=>{
  return (
    <div className="h-screen flex justify-center align-middle">
      <div className="my-auto w-4/5">
      <div className="flex justify-center">
        <button onClick={toggleGameState} className="bg-green-500 mx-auto px-6 py-2 rounded-xl text-white my-2">{gameState ? "Stop Game" : "Start Game"}</button>
      </div>
      <div className=" p-5">
        <div className="flex gap-2">
          {/* Card Component */}
          <div className="bg-white w-1/2 rounded-2xl p-5">
            <div>
            <div className="bg-gray-300 mx-auto px-6 py-4 rounded-xl text-black font-semibold text-xl text-center my-2">Select Your Move</div>
            </div>
            <div className="flex gap-2">
              {
                userSelection ? <>
                  <button onClick={() => {handleMove("Clear")}} className="bg-red-300 mx-auto px-8 py-4 text-xl rounded-xl my-2">Clear</button>
                  <button className="bg-pink-600 mx-auto px-8 py-4 text-xl rounded-xl my-2">{userSelection}</button>
                </>  : 
                <> 
                  <button onClick={() => {handleMove("Rock")}} className="bg-orange-300 mx-auto px-8 py-4 text-xl rounded-xl my-2">Rock</button>
                  <button onClick={() => {handleMove("Paper")}} className="bg-orange-300 mx-auto px-8 py-4 text-xl rounded-xl my-2">Paper</button>
                  <button onClick={() => {handleMove("Scissors")}} className="bg-orange-300 mx-auto px-8 py-4 text-xl rounded-xl my-2">Scissors</button>
                </>
              }
            </div>
          </div>
          <div className="bg-white w-1/2 rounded-2xl p-5">
            <div>
            <div className="bg-gray-300 mx-auto px-6 py-4 rounded-xl text-black font-semibold text-xl text-center my-2">Computer Move</div>
            </div>
            <div className="flex gap-2">
              {
                computerSelection ? <>
                  <button className="bg-pink-600 mx-auto px-8 py-4 text-xl rounded-xl my-2">{computerSelection}</button>
                </>  : 
                <> 
                  <div className="text-xl font-bold mt-2">Take your turn first.</div>
                </>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="bg-green-500 w-3/5 mx-auto px-6 py-4 rounded-xl text-black font-semibold text-4xl text-center my-2">Game Results: {result || "-"}</div>
      </div>
      </div>
    </div>
  )
}

function App() {
  const { account, connected, signAndSubmitTransaction } = useWallet();

  const [gameState, setGameState] = useState(false); // reacttive frameform

  const [userSelection, setUserSelection] = useState("");
  const [computerSelection, setComputerSelection] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function toggleGameState(){
    setGameState(!gameState);

    const payload: InputTransactionData = {
      data: {
        function: `${moduleAddress}::${moduleName}::createGame`,
        functionArguments: []
      }
    }

    await handeTranstion(payload);
    setUserSelection("")
    setComputerSelection("")
    setResult("")
    // Call the blockchain function. 
  }

  async function handleMove(move: string){
    if (move === "Clear"){
      setUserSelection("")
      setComputerSelection("")
      setResult("")
    } else{
      const payload: InputTransactionData = {
        data: {
          function: `${moduleAddress}::${moduleName}::duel`,
          functionArguments: [move]
        } 
      }
      await handeTranstion(payload);
      setUserSelection(move)
    }
  }

  const handeTranstion = async(
    payload: InputTransactionData
  ) => {
    if (!account) return;
    setLoading(true);

    try{
      const tx = await signAndSubmitTransaction(payload);
      console.log(tx)

      const resultData = await client.getAccountResource({ 
        accountAddress: account?.address,
        resourceType: `${moduleAddress}::${moduleName}::DuelResult`
       });

       console.log(resultData)

       const duelResult = resultData.duel_result.toString();

       if (duelResult === "Win"){
        setResult("You win")
       } else if (duelResult === "Lose"){
        setResult("You lose")
       } else {
        setResult("Draw")
       }
       setComputerSelection(resultData.computer_selection.toString())
    } catch (error){
      console.log("Error", error)
    } finally{
      setLoading(false);
    }
  }

  return (
    <>
      <div className="w-full h-screen flex flex-col justify-center align-middle bg-neutral-100">
        {loading && <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center align-middle">
          <div className="bg-white p-5 rounded-xl">
            <div className="text-2xl font-semibold">Loading...</div>
          </div>
        </div>}
        <div className="absolute right-4 top-4 items-end">
            <WalletSelector />
        </div>
        {connected ? <GameWrapper2 computerSelection={computerSelection} result={result} handleMove={handleMove} userSelection={userSelection} gameState={gameState} toggleGameState={toggleGameState}/> : GameWrapper1()}
    </div>
    </>
  );
}

export default App;