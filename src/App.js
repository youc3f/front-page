import React , {useState} from "react";

import './index.css';  // Make sure this is imported into your App.js

function App(){
    const [code, setCode] = useState('');
    const [result,setResult] = useState({});

    const checkSyntax = async () => {
        try {
            const response = await fetch ('http://localhost:5000/validate',{
            
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify({code}),
        });
        const data = await response.json();
        setResult(data);


    }catch(error){
        setResult({valid:false , message : 'Error validating code'});
    }
};
return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Java Syntax Checker</h1>
        <textarea
        className="w-full max-w-lg h-40 p-2 border border-gray-300 rounded mb-4"
        placeholder="Write your Java code here..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={checkSyntax}
      >
        Check Syntax
      </button>
      {result && result.valid !== undefined && (
        <div
          className={`mt-4 p-4 rounded ${
            result.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {result.message}
        </div>

      )}
      { 
      result.valid &&(
        <div className="mt-4 p-4 rounded bg-gray-300 text-gray-900">
          <p className="text-lg">Loc Instruction : {result.instruction} </p>
          <p className="text-lg">Loc Commentaire : {result.comment} </p>
          <p className="text-lg">Loc Empty Lines : {result.empty_lines} </p>
          <p className="text-lg">Loc Physique : {result.physique} </p>
        </div>
      )

      }
    </div>
)
}
export default App;
