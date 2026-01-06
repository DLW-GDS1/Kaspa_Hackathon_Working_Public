"use client";
import { useEffect, useState } from "react";
import type { NetworkKey } from "../lib/network";
import { getStoredNetwork, setStoredNetwork } from "../lib/network";
export function NetworkToggle(){ const [network,setNetwork]=useState<NetworkKey>("testnet"); useEffect(()=>{setNetwork(getStoredNetwork());},[]); function toggle(){ const next:NetworkKey = network==="testnet"?"mainnet":"testnet"; setNetwork(next); setStoredNetwork(next); window.location.reload(); } return (<button type="button" onClick={toggle} className="rounded-xl border px-3 py-1.5 text-xs hover:bg-neutral-50" title="Toggle network (Testnet ↔ Mainnet)">Network: <span className="font-semibold">{network==="mainnet"?"Mainnet":"TN-10 Testnet"}</span></button>); }
