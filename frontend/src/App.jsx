import { useState, useEffect, useRef } from "react";
import SearchForm from "./components/SearchForm/SearchForm";
import Results from "./components/Results/Results";
import './App.css'

function App() {
    const [resultData, setResultData] = useState(null);
    const resultsRef = useRef(null);

    useEffect(() => {
        if (resultData && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [resultData]);

    return (
        <div>
            <h1 >LyricLens</h1>
            <SearchForm onResults={setResultData} />
            <div ref={resultsRef} >
                <Results data={resultData} />
            </div>
        </div>
    );
}

export default App
