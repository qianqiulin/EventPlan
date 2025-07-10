import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useCart } from "./context/useCart";
import { AuthProvider } from "../lib/AuthContext"; 
import { SnackbarProvider } from "notistack";
import TopBar from "../pages/topbar"; 


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