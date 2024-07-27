import { useState, useEffect } from "react";

export const useUrlState = (initialState: string[]) => {
  const [inputs, setInputs] = useState<string[]>(initialState);

  useEffect(() => {
    // read initial state from the URL hash
    const handleHashChange = () => {
      const hash = decodeURIComponent(window.location.hash.substring(1));
      const segments = hash.split("/").filter((segment) => segment !== "");
      if (segments && segments.some((s) => ![undefined, ""].includes(s))) {
        setInputs(segments);
      }
    };

    // handle base case of data already in the URL
    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    // update URL hash when inputs state changes
    const newHash = `/${inputs.filter((slug) => slug !== "").map(encodeURIComponent).join("/")}`;
    window.location.hash = newHash;
  }, [inputs]);

  return [inputs, setInputs] as const;
};
