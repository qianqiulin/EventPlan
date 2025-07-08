import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useCart } from "./context/useCart";

export default function App({ Component, pageProps }: AppProps) {
  const Cart=useCart()
  return <Component {...pageProps} Cart={Cart}/>;
}
