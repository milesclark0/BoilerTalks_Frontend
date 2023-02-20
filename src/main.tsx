import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";
import { AuthProvider } from "./context/context";

const queryClient = new QueryClient();


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
    {/* <ReactQueryDevtools /> */}
  </QueryClientProvider>
);
