"use client"
import * as React from "react";

// 1. import `NextUIProvider` component
import {NextUIProvider} from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
// import store from "@/redux/store";
// import { PersistGate } from "redux-persist/integration/react";
// import { persistor, store } from "@/redux/store";
import { store } from "@/redux/store";
import UserProvider from "@/context/user.provider";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export default function Providers({ children, themeProps }: ProvidersProps) {
  // 2. Wrap NextUIProvider at the root of your app
  return (
    <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
      <UserProvider>
      <NextUIProvider>
        <NextThemesProvider {...themeProps}>
          <Toaster position="top-center" richColors />
          {children}
        </NextThemesProvider>
      </NextUIProvider>
      </UserProvider>
    {/* </PersistGate> */}
  </Provider>
  );
}