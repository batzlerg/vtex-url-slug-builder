import React, { useState, useEffect } from "react";
import { slugify } from "./utils";

// Main App component
function App() {
  const [inputs, setInputs] = useState<string[]>([""]);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Read initial state from the URL hash
    const handleHashChange = () => {
      const hash = decodeURI(window.location.hash.substring(1));
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
    // Update URL hash when inputs state changes
    const newHash = `/${inputs.filter((slug) => slug !== "").join("/")}`;
    window.location.hash = newHash;
  }, [inputs]);

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleRemoveInput = (indexToRemove: number) => {
    const newInputs = [...inputs];
    newInputs.splice(indexToRemove, 1);
    if (newInputs.length > 0) {
      setInputs(newInputs);
    } else {
      setInputs([""]);
    }
  };

  const copyToClipboard = (text: string) => {
    console.log(`copied "${text}"`);
    navigator.clipboard.writeText(text).then(
      () => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      },
      (err) => {
        console.error(err);
      },
    );
  };

  const concatUrl = inputs
    .map(slugify)
    .filter((slug) => slug !== "")
    .join("/");

  return (
    <div style={{ width: "100%" }}>
      <h1>VTEX URL Slug Builder</h1>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "45%" }}>Category</th>
            <th style={{ width: "50%" }}>Slug</th>
            <th style={{ width: "5%" }}></th>
          </tr>
        </thead>
        <tbody>
          {inputs.map((input, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={inputs[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              </td>
              <td>{slugify(inputs[index] || "")}</td>
              {inputs[index] !== "" && (
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveInput(index)}
                >
                  ❌
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <button
          onClick={() => setInputs([...inputs, ""])}
          disabled={inputs[inputs.length - 1] === ""}
        >
          + Add Segment
        </button>
      </div>
      <hr />
      <div style={{ marginTop: "10px" }}>
        <h2>Concatenated URL</h2>
        <pre>{concatUrl ? `/${concatUrl}` : "--"}</pre>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={() => copyToClipboard(`/${concatUrl}`)}
            disabled={concatUrl == ""}
          >
            {isCopied ? "Copied!" : "Copy to Clipboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
