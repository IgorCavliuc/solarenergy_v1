import { Footer, Header } from "@/app/components";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import React from "react";

export default function MainLayout({ children }: any) {
  return (
    <div>
      <ToastContainer />
      <Head>
        <title>SolarEnergy</title>
        <meta property="og:title" content="My page title" key="title" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <Head>
        <meta property="og:title" content="My new title" key="title" />
      </Head>

      <main>
        <Header />
        {children} <Footer />
      </main>
    </div>
  );
}
