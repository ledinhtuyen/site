import "@styles/globals.css";
import "@styles/globals.scss";

import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "PromptHub",
  description: "Discover & Share AI Prompts",
};

const RootLayout = ({ children }) => (
  <html lang='en'>
    <body>
      <Provider>
        <div className='main'>
          <div className='gradient' />
        </div>

        <main className='app'>
          <ToastContainer />
          <Nav />
          {children}
        </main>
      </Provider>
    </body>
  </html>
);

export default RootLayout;
