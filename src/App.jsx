import { diffWords } from "diff";
import { useState, useRef } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "semantic-ui-css/semantic.min.css";
import { Dropdown } from "semantic-ui-react";
import "./App.css";

const query_options = [
  {
    key: "For Engineering Team",
    text: "For Engineering Team",
    value: "For Engineering Team",
  },
  {
    key: "For Purchasing Department",
    text: "For Purchasing Department",
    value: "For Purchasing Department",
  },
  {
    key: "For Customer Success Team",
    text: "For Customer Success Team",
    value: "For Customer Success Team",
  },
  {
    key: "For HR Team",
    text: "For HR Team",
    value: "For HR Team",
  },
  {
    key: "Input my custom queries",
    text: "Input my custom queries",
    value: "Input my custom queries",
  },
];
const llm_options = [
  { key: "GPT4", text: "GPT4", value: "GPT4" },
  {
    key: "More to come",
    text: "More to come",
    value: "mtc",
  },
];
const model_options = [
  { key: "Presidio", text: "Presidio", value: "Presidio" },
  { key: "GPT4", text: "GPT4", value: "GPT4" },
  {
    key: "More to come",
    text: "More to come",
    value: "mtc",
  },
];

function App() {
  const [tqtext, setTqtext] = useState(
    "The government of Portland, Oregon is based on a city commission government system. Elected officials include the mayor, commissioners, and a city auditor. The mayor and commissioners (members of City Council) are responsible for legislative policy and oversee the various bureaus that oversee the day-to-day operation of the city. Portland began using a commission form of government in 1913 following a public vote on May 3 of that year. Each elected official serves a four-year term, without term limits. Each city council member is elected at-large. In 2022, Portland residents approved a ballot measure to replace the commission form of government with a 12-member council elected in four districts using single transferable vote, with a professional city manager appointed by a directly-elected mayor, with the first elections to be held in 2024."
  );
  const [cqtext, setCqtext] = useState(tqtext);
  const [sidebarToggle, setSidebarToggle] = useState(true);
  const [queryBox, setQueryBox] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const dropdownRef = useRef(null);
  const [spin, setSpin] = useState(false);
  const [runEnable, setRunEnable] = useState(true);
  const [clearEnable, setClearEnable] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState("");

  const handleChange = (e) => {
    setTqtext(e.target.value);
    setCqtext(e.target.value);
    setSelectedQuery("Input my custom queries");
  };

  const handleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  function handleRun() {
    populateDiv();
    setQueryBox(true);
    setSpin(true);
    setRunEnable(false);
    setTimeout(() => {
      setRunEnable(true);
      setSpin(false);
    }, 100);
    setClearEnable(true);
  }

  function handleClear() {
    setQueryBox(false);
    setClearEnable(false);
    if (dropdownRef.current) {
      dropdownRef.current.clearValue();
    }
  }

  function populateDiv() {
    const complete_arr = diffWords(originalText, processedText, {
      ignoreCase: true,
    });

    const displayElement = document.getElementById("displayArea");
    if (displayElement) {
      displayElement.innerHTML = "";
    }

    for (let i = 0; i < complete_arr.length; i++) {
      if (complete_arr[i].value.match("^\\[")) {
        const phrase = complete_arr[i - 1].value;
        const Tooltip = document.createElement("Tooltip");
        Tooltip.setAttribute("placement", "top");
        Tooltip.setAttribute("title", "test");

        const span = document.createElement("span");
        span.className = "highlight";
        span.textContent = phrase;

        Tooltip.appendChild(span);
        displayElement.appendChild(Tooltip);
      } else if (
        i < complete_arr.length - 1 &&
        !complete_arr[i].value.match("^\\[") &&
        complete_arr[i + 1].value.match("^\\[")
      ) {
        continue;
      } else {
        const textNode = document.createTextNode(complete_arr[i].value);
        displayElement.appendChild(textNode);
      }
    }
  }

  const originalText =
    "The government of Portland, Oregon is based on a city commission government system. Elected officials include the mayor, commissioners, and a city auditor. The mayor and commissioners (members of City Council) are responsible for legislative policy and oversee the various bureaus that oversee the day-to-day operation of the city. Portland began using a commission form of government in 1913 following a public vote on May 3 of that year. Each elected official serves a four-year term, without term limits. Each city council member is elected at-large. In 2022, Portland residents approved a ballot measure to replace the commission form of government with a 12-member council elected in four districts using single transferable vote, with a professional city manager appointed by a directly-elected mayor, with the first elections to be held in 2024.";
  const processedText =
    "The government of Portland, Oregon is based on a [GOVERNANCE1]. Elected officials include the mayor, commissioners, and a city auditor. The mayor and commissioners (members of City Council) are responsible for legislative policy and oversee the various bureaus that oversee the day-to-day operation of the city. Portland began using a commission form of government in [YEAR_OF_COMMISSION_FORM1] following a public vote on May 3 of that year. Each elected official serves a [TERM_LENGTH1]. Each city council member is [CITY_COUNCIL_MEMBERS1]. In 2022, Portland residents approved a ballot measure to replace the commission form of government with a 12-member council elected in four districts using single transferable vote, with a professional city manager appointed by a directly-elected mayor, with the first elections to be held in [FIRST_ELECTIONS1].";

  return (
    <div id="playground">
      <div
        className={`sidebar ${sidebarToggle ? "show-sidebar" : "hide-sidebar"}`}
      >
        <div id="sidebar-content">
          <div id="dropdown">
            <div className="dropdown-div" ref={ref2}>
              <label htmlFor="query_type">Query Type:</label>
              <Dropdown
                ref={dropdownRef}
                placeholder="Try sample queries"
                fluid
                selection
                options={query_options}
                className="dropdown"
                name="query_type"
                value={selectedQuery}
                onChange={(data) => setSelectedQuery(data.value)}
              />
            </div>
            <div className="dropdown-div" ref={ref3}>
              <label htmlFor="query_type">LLM Endpoint:</label>
              <Dropdown
                placeholder="LLM Endpoint"
                fluid
                selection
                options={llm_options}
                defaultValue={"GPT4"}
                disabled={true}
                className="dropdown"
                name="query_type"
              />
            </div>
            <div className="dropdown-div" ref={ref4}>
              <label htmlFor="query_type">Comparing Model:</label>
              <Dropdown
                placeholder="Compare Models"
                fluid
                selection
                options={model_options}
                defaultValue={"Presidio"}
                className="dropdown"
                name="query_type"
              />
            </div>
          </div>
        </div>
        <div id="sidebar-toggle" onClick={handleSidebar}>
          {sidebarToggle ? (
            <div ref={ref1}>
              <FaAngleLeft />
            </div>
          ) : (
            <FaAngleRight />
          )}
        </div>
      </div>
      <div
        className={`maincontent ${sidebarToggle ? "halfscreen" : "fullscreen"}`}
      >
        <div id="run-button" ref={ref5}>
          <button
            disabled={!runEnable}
            onClick={clearEnable ? handleClear : handleRun}
          >
            {spin ? (
              <Spin
                indicator={
                  <LoadingOutlined
                    style={{
                      fontSize: 25,
                      color: "white",
                    }}
                  />
                }
                spinning={spin}
              />
            ) : (
              <p>{clearEnable ? "Clear" : "Run"}</p>
            )}
          </button>
        </div>
        <div id="trinity-div">
          <div id="trinity-model">
            <div className="model-name">
              <p>TrinityGPT</p>
            </div>
            <div className="query">
              <p>Query</p>
              <div
                id="displayArea"
                className={`${queryBox ? "" : "hidemodified"}`}
              ></div>
              <textarea
                name="query-textarea"
                className={`qta ${queryBox ? "hidetext" : ""}`}
                id="tqta"
                value={tqtext}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="response">
              <p>Response</p>
              <textarea name="response-textarea" className="rta" readOnly />
            </div>
          </div>
          <div id="trinity-summary" className="summary-div">
            <p>Summarization:</p>
          </div>
        </div>
        <div id="compared-div">
          <div id="compared-model">
            <div className="model-name">
              <p>Compare Model</p>
            </div>
            <div className="query">
              <p>Query</p>
              <textarea
                name="query-textarea"
                className="qta"
                id="cqta"
                value={cqtext}
                readOnly
              ></textarea>
            </div>
            <div className="response">
              <p>Response</p>
              <textarea
                name="response-textarea"
                className="rta"
                readOnly
              ></textarea>
            </div>
          </div>
          <div id="compared-model-summary" className="summary-div">
            <p>Summarization:</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
