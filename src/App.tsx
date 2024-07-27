import React, { useState } from "react";
import { slugify } from "./utils";
import VtexLogo from "./VtexLogo";
import { useUrlState } from "./useUrlState";
import "./index.css";

const App = () => {
  const [inputs, setInputs] = useUrlState([""]);
  const [output, setOutput] = useState("");

  const handleInputChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newInputs = [...inputs];
      newInputs[index] = e.target.value;
      setInputs(newInputs);
      updateOutput(newInputs);
    };

  const addInputField = () => {
    setInputs([...inputs, ""]);
  };

  const removeInputField = (index: number) => () => {
    const newInputs = inputs.filter((_, i) => i !== index);
    setInputs(newInputs);
    updateOutput(newInputs);
  };

  const updateOutput = (inputs: string[]) => {
    const slugifiedStrings = inputs.map((input) => slugify(input));
    setOutput(slugifiedStrings.length ? `/${slugifiedStrings.join("/")}` : "");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard!");
  };

  return (
    <main>
      <header>
        <VtexLogo className="logo" />
        <h1>URL Slug Builder</h1>
      </header>
      <section>
        <div className="input-container">
          {inputs.map((input, index) => (
            <div key={index} className="input-row">
              <input
                type="text"
                value={input}
                onChange={handleInputChange(index)}
                placeholder="Add a category, collection, or product title"
                className="input-field"
              />
              {Boolean(input) && (
                <button
                  onClick={removeInputField(index)}
                  className="square-button"
                  aria-label="Remove"
                >
                  &#10006;
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addInputField} className="full-width" disabled={!inputs[inputs.length - 1]}>
          + Add another
        </button>
      </section>
      <section>
        <div className={`output ${Boolean(output) ? "" : "placeholder"}`}>
          {output}
        </div>
        <button
          onClick={copyToClipboard}
          disabled={!output}
          className="full-width"
        >
          Copy to Clipboard
        </button>
      </section>
    </main>
  );
};

export default App;
