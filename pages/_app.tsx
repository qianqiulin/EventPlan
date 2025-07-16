import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useCart } from "../context/useCart";
import { AuthProvider } from "../lib/AuthContext"; 
import { SnackbarProvider } from "notistack";
import TopBar from "../components/TopBar";

type EventType = {
  event_id: number;
  name: string;
  date: string;
  image: string;
  price_min: number;
  price_max: number;
  start_time: string;
  end_time: string;
  venue: string;
  info: string;
};


export default function App({ Component, pageProps }: AppProps) {
  const Cart = useCart();

  return (
    <SnackbarProvider>
    <AuthProvider>
      <TopBar/>

      <Component {...pageProps} Cart={Cart} />
    
    </AuthProvider>
    </SnackbarProvider>
    // can use the enqueueSnackbar function globally to show notifications
  );
}