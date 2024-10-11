"use client"
import * as React from "react";

// 1. import `NextUIProvider` component
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { persistor, store } from "../redux/store";

function Providers({ children }: { children: React.ReactNode }) {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    // <NextUIProvider>
    //   <NextThemesProvider attribute="class" defaultTheme="dark">
    //     {children}
    //   </NextThemesProvider>
    // </NextUIProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="dark">
            <Toaster position="top-center" richColors />
            {children}
          </NextThemesProvider>
        </NextUIProvider>
      </PersistGate>
    </Provider>
  );
}
export default Providers;
