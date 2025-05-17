import { useState } from "react";
import { motion } from "motion/react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-500">
        <motion.div
          className="w-10 h-10 bg-red-500 rounded-md"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        Hello world!
      </h1>
    </>
  );
}

export default App;
