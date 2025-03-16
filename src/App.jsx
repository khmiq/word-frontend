import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
const API_URL = "https://word-backend-inky.vercel.app";

const App = () => {
  const [words, setWords] = useState([]);
  const [newWord, setNewWord] = useState("");
  const [highlightedWordId, setHighlightedWordId] = useState(null);
  const [editingWord, setEditingWord] = useState(null);
  const [deletingWord, setDeletingWord] = useState(null);
  const wordRefs = useRef({});

  useEffect(() => {
    axios
      .get(`${API_URL}/words`)
      .then((res) => setWords(res.data))
      .catch((err) => console.error("Error fetching words:", err));
  }, []);

 

  const handleAddWord = async () => {
    const trimmedWord = newWord.trim();
    if (!trimmedWord) return;
  
    const existingWord = words.find((word) => word.text === trimmedWord);
    if (existingWord) {
      toast.error("This word already exists");
  
      setTimeout(() => {
        wordRefs.current[existingWord._id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedWordId(existingWord._id);
        setTimeout(() => setHighlightedWordId(null), 1000);
      }, 500);
      return;
    }
  
    try {
     
      const response = await axios.post(`${API_URL}/words`, { text: trimmedWord });
  
      
      setWords((prevWords) => [...prevWords, response.data.word]);
  
      
      toast.success("Word added successfully");
  
      
      setNewWord("");
  
      
      setTimeout(() => {
        wordRefs.current[response.data.word._id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedWordId(response.data.word._id);
        setTimeout(() => setHighlightedWordId(null), 1000);
      }, 500);
  
    } catch (error) {
      toast.error("Failed to add word");
    }
  };
  

  const handleEditWord = async () => {
    if (!editingWord.text.trim()) return;
    

    try {
      await axios.patch(`${API_URL}/words/${editingWord._id}`, { word: editingWord.text });
      setWords(words.map((word) => (word._id === editingWord._id ? { ...word, text: editingWord.text } : word)));
      toast.success("Word updated successfully");
      setEditingWord(null);
    } catch (error) {
      toast.error("Failed to update word");
    }
  };

  const handleDeleteWord = async () => {
    try {
      await axios.delete(`${API_URL}/words/${deletingWord._id}`);
      setWords(words.filter((word) => word._id !== deletingWord._id));
      toast.success("Word deleted successfully");
      setDeletingWord(null);
    } catch (error) {
      toast.error("Failed to delete word");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Toaster />
      <div className="w-full">
        <h1 className="text-2xl font-bold mb-4 text-center text-navy-700">Word Manager</h1>

        {/* Add Word Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddWord()}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-slate-900 outline-none"
            placeholder="Enter a new word..."
          />
          <button
            onClick={handleAddWord}
            className="bg-slate-900 text-white px-4 py-2 rounded-md hover:bg-navy-700 transition outline-none"
          >
            Add
          </button>
        </div>

        {/* Word List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {words.map((word, index) => (
            <div
              key={word._id}
              ref={(el) => (wordRefs.current[word._id] = el)}
              className={`p-4 border rounded-lg text-center bg-white shadow-md relative transition 
                transform hover:scale-105 hover:bg-gray-50 flex justify-between items-center
                ${highlightedWordId === word._id ? "bg-yellow-300" : ""}`}
            >
              {index + 1}. {word.text}

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingWord(word)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => setDeletingWord(word)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingWord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-bold mb-2">Edit Word</h2>
            <input
              type="text"
              value={editingWord.text}
              onChange={(e) => setEditingWord({ ...editingWord, text: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-slate-900"
            />
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setEditingWord(null)} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button onClick={handleEditWord} className="px-4 py-2 bg-blue-600 text-white rounded-md">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingWord && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md">
            <h2 className="text-lg font-bold mb-2">Delete Word</h2>
            <p>Are you sure you want to delete "{deletingWord.text}"?</p>
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() => setDeletingWord(null)} className="px-4 py-2 bg-gray-300 rounded-md">
                Cancel
              </button>
              <button onClick={handleDeleteWord} className="px-4 py-2 bg-red-600 text-white rounded-md">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
