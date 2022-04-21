import React, { useState, useEffect } from 'react';
import { connect, createInbox, Empty, JSONCodec, StringCodec } from "nats.ws";
import './App.css';

const sc = StringCodec();

function App() {

  const [nc, setConnection] = useState<any>(undefined);

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
  
  const state = nc ? "connected" : "not connected"

  function Meow() {
    nc.publish("cat", sc.encode("meow"));
  };

  useEffect(() => {
  
  },[])
  
  return (
      <div className="App">
        <div>
          {state}
        </div>
        <div className="InputName">
          <input type="text" placeholder="Enter Name"/>
          <button>Submit</button>
        </div>
        <div className="">
          <button className="CountButton" onClick={() => {Meow()}}>MEOW</button>
        </div>
      </div>
  );
}

export default App;
