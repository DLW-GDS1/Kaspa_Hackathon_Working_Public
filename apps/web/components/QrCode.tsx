"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
export function QrCode({ text }: { text: string }) { const [dataUrl,setDataUrl]=useState<string|null>(null); useEffect(()=>{ let mounted=true; QRCode.toDataURL(text,{margin:1,width:220}).then((url)=>mounted&&setDataUrl(url)).catch(()=>mounted&&setDataUrl(null)); return ()=>{mounted=false;}; },[text]); if(!dataUrl) return <div className="h-[220px] w-[220px] rounded-xl border bg-neutral-50" />; return <img src={dataUrl} alt="QR code" className="h-[220px] w-[220px] rounded-xl border" />; }
