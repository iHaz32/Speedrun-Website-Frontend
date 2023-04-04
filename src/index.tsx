import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

/*
<span className="flex flex-col gap-5 text-blue-600 hover:text-blue-300 font-medium underline underline-offset-1 text-[8px] sm:text-sm mt-2">
                    {speedruns.map((el) => (
                      <a href={`/speedrun/${el._id}`}>{el.name}</a>
                    ))}
                  </span>
*/
