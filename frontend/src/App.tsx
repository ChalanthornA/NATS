import React, { useState, useEffect } from 'react';
import { connect, createInbox, Empty, JSONCodec, StringCodec } from "nats.ws";
import './App.css';
import ReactLoading from 'react-loading';
import { AnyMxRecord } from 'dns';
import { maxHeaderSize } from 'http';

const sc = StringCodec();
const jc = JSONCodec();

function App() {

  const [nc, setConnection] = useState<any>(undefined);
  const [js, setJetstream] = useState<any>(undefined);
  const [nameValue, setName] = useState("");
  const [ageValue, setAge] = useState("");
  const [isLoad, setLoad] = useState(false);
  const [sta, setSta] = useState<any>(null);

  const [catFace, setCatFace] = useState("OwO")


  useEffect(() => {
    if(nc === undefined) {
      connect({servers: ['ws://127.0.0.1:9090']})
        .then((nc) => {
          setConnection(nc);
          setJetstream(nc.jetstream());
        })
        .catch((err) => {
          console.error(err);
        })
    }
  })

  function sleep(time: any){
      return new Promise((resolve)=>setTimeout(resolve,time)
    )
  }

  const state = nc ? "Connected" : "Not Connected";

  async function Meow() {
    setCatFace("- w -");
    nc.publish("prac.cat", sc.encode("meow"));
    await sleep(150);
    setCatFace("OwO");
  };

  async function InfoSubmit() {
    setLoad(true);
    const subInbox = createInbox();
    const sub = nc.subscribe(subInbox, {
      callback: (err: any, msg: any) => {
        if (err) {
          console.log(err.message);
        }
        else {
          alert(sc.decode(msg.data));
        }
      },
      max: 1,
    })
    const pub = await js.publish("prac.info", jc.encode({name: nameValue, age: ageValue, reply: subInbox}));
    for await (const m of sub) {
      console.log("subscription closed: ", sc.decode(m.data));
      sub.close;
    }
    setLoad(false);
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
        <button className="SubmitButton" onClick={() => {InfoSubmit()}}>Submit</button>
        <div className="Loading">
          <div className="LaodIcon">{isLoad && (<ReactLoading type="bubbles" color="black" height="50px" width="50px" />)}</div>
        </div>
        <div className="MeowButton">
          <button className="Meow" onClick={() => {Meow()}}>MEOW ({catFace})</button>
        </div>
      </div>
  );
}

export default App;
