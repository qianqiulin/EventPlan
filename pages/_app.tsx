import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useCart } from "./context/useCart";
import useSession from "./context/useSession";

export default function App({ Component, pageProps }: AppProps) {
  const Cart=useCart()
  const Session=useSession()
  return <Component {...pageProps} Cart={Cart} Session={Session}/>;
}
