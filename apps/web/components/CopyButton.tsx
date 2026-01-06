"use client";
import { useState } from "react";
export function CopyButton({ value }: { value: string }) { const [copied,setCopied]=useState(false); async function onCopy(){ await navigator.clipboard.writeText(value); setCopied(true); setTimeout(()=>setCopied(false),1200);} return <button type="button" onClick={onCopy} className="text-xs rounded-lg border px-2 py-1 hover:bg-neutral-50">{copied?"Copied":"Copy"}</button>; }
