import React, { useState, useEffect } from 'react';
import { connect, createInbox, Empty, JSONCodec, StringCodec } from "nats.ws";
import './App.css';

const sc = StringCodec();
const jc = JSONCodec();

function App() {

  const [nc, setConnection] = useState<any>(undefined);
  const [nameValue, setName] = useState("");
  const [ageValue, setAge] = useState("");

  useState(() => {
    if(nc === undefined) {
      connect({servers: ['ws://127.0.0.1:9090']})
        .then((nc) => {
          setConnection(nc);
        })
        .catch((err) => {
          console.error(err);
        })
    }
  })
  
  const state = nc ? "Connected" : "Not Connected"

  function Meow() {
    nc.publish("cat", sc.encode("meow"));
  };

  function InfoSubmit() {
    nc.publish("info", jc.encode({name: nameValue, age: ageValue}));
  }
  
  return (
      <div className="App">
        <h1>{state}</h1>
        <div className="InputName">
          <input type="text" placeholder="Enter Name" value={nameValue} onChange={(e) => {setName(e.target.value)}}/>
        </div>
        <div className="InputAge">
          <input type="number" placeholder="Enter Age" value={ageValue} onChange={(e) => {setAge(e.target.value)}}/>
        </div>
        <button onClick={() => {InfoSubmit()}}>Submit</button>
        <div className="MeowButton">
          <button className="Meow" onClick={() => {Meow()}}>MEOW =w=</button>
        </div>
      </div>
  );
}

export default App;
