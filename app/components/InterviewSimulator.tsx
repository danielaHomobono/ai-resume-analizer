
import { useState } from "react";
import { usePuterStore } from "../lib/puter";

interface InterviewSimulatorProps {
  jobTitle: string;
  jobDescription: string;
  resumePath: string;
}

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const InterviewSimulator = ({ jobTitle, jobDescription, resumePath }: InterviewSimulatorProps) => {
  const { ai } = usePuterStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "Por favor, asegúrate de que el rol y la empresa estén definidos para comenzar la simulación de entrevista." }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    setIsLoading(true);
    const chatHistory = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));
    const prompt = [
      { role: "system", content: `Actúa como entrevistador para el siguiente puesto y currículum. Hazme una pregunta relevante para la vacante, espera mi respuesta y luego haz la siguiente pregunta. Después de 5 preguntas, dame un feedback sobre mis respuestas y cómo podría mejorar para la entrevista.\n\nPuesto: ${jobTitle}\nDescripción del puesto: ${jobDescription}\nResponde solo con la pregunta o el feedback final, según corresponda.` },
      ...chatHistory,
      { role: "user", content: userInput }
    ];
    try {
      const response = await ai.chat(prompt, { file: resumePath });
      setMessages([
        ...messages,
        { role: "user", content: userInput },
        { role: "assistant", content: response?.message?.content || "" }
      ]);
      setUserInput("");
    } catch (e) {
      setMessages([...messages, { role: "assistant", content: "Ocurrió un error. Intenta de nuevo." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="interview-simulator mt-8 rounded-3xl border-4 border-blue-400 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 relative overflow-hidden">
      <div className="absolute -top-6 -left-6 bg-blue-200 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
        <img src="/icons/info.svg" alt="Entrevista" className="w-10 h-10 opacity-80" />
      </div>
      <h3 className="font-extrabold text-2xl text-blue-700 mb-4 pl-16 drop-shadow-lg">Simulador de Entrevista</h3>
      <div className="chat-window mb-6 max-h-64 overflow-y-auto bg-white/70 rounded-xl p-4 border border-blue-100">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "assistant" ? "ai-msg text-blue-700 font-semibold mb-2" : msg.role === "user" ? "user-msg text-gray-800 mb-2" : "system-msg text-gray-500 italic mb-2"}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input
          className="flex-1 border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 bg-white shadow-sm"
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder={(!jobTitle || !jobDescription) ? "Primero define el rol y la empresa" : "Escribe tu respuesta..."}
          disabled={isLoading || !jobTitle || !jobDescription}
        />
        <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-50" onClick={sendMessage} disabled={isLoading || !userInput || !jobTitle || !jobDescription}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default InterviewSimulator;
