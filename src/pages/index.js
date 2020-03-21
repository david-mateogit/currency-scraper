import React, { useEffect, useState } from "react";
import axios from "axios";

import styles from "./index.module.css";

import Form from "../components/form";

const Index = () => {
  const [status, setStatus] = useState("loading");
  const [currencies, setCurrencies] = useState(null);

  useEffect(() => {
    let canceled = false;
    if (status !== "loading") return;

    axios("/api/get-all-currencies").then(result => {
      console.log(result);
      if (canceled === true) return;

      if (result.status !== 200) {
        console.error("Error loading currencies!");
        console.error(result);
        return;
      }

      setCurrencies(result.data.currencies);
      setStatus("loaded");
    });

    return () => {
      canceled = true;
    };
  }, [status]);

  const reloadCurrencies = () => setStatus("loading");

  return (
    <main>
      <h1 className={styles.heading}>Currency Converter</h1>
      {currencies ? (
        <ul className={styles.todos}>
          {currencies.map(currency => (
            <li key={currency._id} className={styles.todo}>
              {currency.name === "USD" ? (
                <span role="img" aria-label="flag">
                  🇺🇸
                </span>
              ) : (
                ""
              )}{" "}
              {currency.name} - {currency.amount}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.loading}>loading currencies...</p>
      )}
      <Form reloadCurrencies={reloadCurrencies} />
    </main>
  );
};
export default Index;
