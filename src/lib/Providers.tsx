"use client"
import * as React from "react";

// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import UserProvider from "@/context/user.provider";
import { store } from "@/redux/store";



export default function Providers({ children}:{ children: React.ReactNode } ) {
  // 2. Wrap NextUIProvider at the root of your app
  return (
      <UserProvider>
    <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
      <NextUIProvider>
          <Toaster position="top-center" richColors />
        <NextThemesProvider  attribute="class" defaultTheme="dark">
          {children}
        </NextThemesProvider>
      </NextUIProvider>
    {/* </PersistGate> */}
  </Provider>
       </UserProvider>
  );
}