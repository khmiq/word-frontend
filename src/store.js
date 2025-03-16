import { create } from "zustand";
import axios from "axios";

const useStore = create((set) => ({
  words: JSON.parse(localStorage.getItem("words")) || [],

  fetchWords: async () => {
    const { data } = await axios.get("http://localhost:5000/words");
    set({ words: data });
    localStorage.setItem("words", JSON.stringify(data));
  },

  addWord: async (text) => {
    try {
      const { data } = await axios.post("http://localhost:5000/words", { text });
      set((state) => ({ words: [...state.words, data] }));
      localStorage.setItem("words", JSON.stringify([...JSON.parse(localStorage.getItem("words")), data]));
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message, word: error.response?.data?.word };
    }
  },

  updateWord: async (id, text) => {
    const { data } = await axios.put(`http://localhost:5000/words/${id}`, { text });
    set((state) => ({ words: state.words.map((w) => (w._id === id ? data : w)) }));
    localStorage.setItem("words", JSON.stringify([...JSON.parse(localStorage.getItem("words"))]));
  },

  deleteWord: async (id) => {
    await axios.delete(`http://localhost:5000/words/${id}`);
    set((state) => ({ words: state.words.filter((w) => w._id !== id) }));
    localStorage.setItem("words", JSON.stringify([...JSON.parse(localStorage.getItem("words"))]));
  },
}));

export default useStore;
 