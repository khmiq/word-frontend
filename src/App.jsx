import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const App = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");

  
  useEffect(() => {
    axios
      .get("http://localhost:5000/words")
      .then((res) => setWords(res.data))
      .catch((err) => console.error("Error fetching words:", err));
  }, []);

  
  const handleAddWord = async () => {
    const trimmedWord = newWord.trim();
    if (!trimmedWord) return;

    
    const existingWordIndex = words.findIndex((word) => word.text === trimmedWord);

    if (existingWordIndex !== -1) {
      toast.error("This word has already been created");

      
      setTimeout(() => {
        const wordElement = document.getElementById(`word-${existingWordIndex}`);
        if (wordElement) {
          wordElement.scrollIntoView({ behavior: "smooth", block: "center" });
          wordElement.classList.add("bg-yellow-300", "transition-all", "duration-500");

         
          setTimeout(() => {
            wordElement.classList.remove("bg-yellow-300");
          }, 2000);
        }
      }, 500);

      return;
    }

   
    try {
      const response = await axios.post("http://localhost:5000/words", { text: trimmedWord });

      
      setWords([...words, response.data]);

      toast.success("Word created successfully");
      setNewWord("");
    } catch (error) {
      console.error("Error saving word:", error);
      toast.error("Failed to save word.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Toaster />
      <div className=" w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-navy-700">
          Word Manager
        </h1>

        
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-slate-900 "
            placeholder="Enter a new word..."
          />
          <button
            onClick={handleAddWord}
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-navy-700 outline-none transition"
          >
            Add
          </button>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {words.map((word, index) => (
            <div
              key={word._id} 
              id={`word-${index}`}
              className="p-4 border rounded-lg text-center bg-white shadow-md transition-all duration-300 hover:bg-gray-200"
            >
              {index + 1}. {word.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
