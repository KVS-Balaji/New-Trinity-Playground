import { diffWords } from "diff";
import { useState, useRef, useEffect } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Tooltip, Tour } from "antd";
import "semantic-ui-css/semantic.min.css";
import { Dropdown } from "semantic-ui-react";
import "./App.css";
import pfp from "./assets/pfp.png";

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
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [queryBox, setQueryBox] = useState(false);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: "Sidebar",
      description: "Click here to open the sidebar",
      placement: "right",
      target: () => ref1.current,
    },
    {
      title: "Query",
      description: "Choose the type of query to run",
      target: () => ref2.current,
    },
    {
      title: "LLM Endpoint",
      description: "Choose the  LLM endpoint for your query",
      target: () => ref3.current,
    },
    {
      title: "Comparing Model",
      description: "Choose the model to compare with",
      target: () => ref4.current,
    },
    {
      title: "Run",
      description: "Click here to run the model",
      target: () => ref5.current,
    },
  ];

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleChange = (e) => {
    setTqtext(e.target.value);
    setCqtext(e.target.value);
  };

  const handleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  function handleRun() {
    populateDiv();
    setQueryBox(true);
  }

  function populateDiv() {
    const complete_arr = diffWords(originalText, processedText, {
      ignoreCase: true,
    });

    const displayElement = document.getElementById("displayArea");
    if (displayElement) {
      displayElement.innerHTML = "";
    }
    console.log(complete_arr);

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
                placeholder="Try sample queries"
                fluid
                selection
                options={query_options}
                className="dropdown"
                name="query_type"
              />
            </div>
            <div className="dropdown-div" ref={ref3}>
              <label htmlFor="query_type">LLM Endpoint:</label>
              <Dropdown
                placeholder="LLM Endpoint"
                fluid
                selection
                options={llm_options}
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
                className="dropdown"
                name="query_type"
              />
            </div>
          </div>
          <div id="login">
            <div id="profile">
              <img src={pfp} alt="Profile Picture" />
              <p>Username</p>
            </div>
          </div>
        </div>
        <div id="sidebar-toggle" onClick={handleSidebar} ref={ref1}>
          {sidebarToggle ? <FaAngleLeft /> : <FaAngleRight ref={ref1} />}
        </div>
      </div>
      <div
        className={`maincontent ${sidebarToggle ? "halfscreen" : "fullscreen"}`}
      >
        <div id="run-button" ref={ref5}>
          <button onClick={handleRun}>Run</button>
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
      <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
    </div>
  );
}

export default App;
