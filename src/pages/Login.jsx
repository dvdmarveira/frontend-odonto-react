import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LockKey, Eye, EyeSlash } from "@phosphor-icons/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica
    if (!username || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    // Simulação de login - em produção seria uma chamada para API
    if (username === "admin" && password === "admin") {
      localStorage.setItem("user", JSON.stringify({ username, role: "admin" }));
      navigate("/dashboard");
    } else {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 flex flex-col items-center">
        {/* Logo */}
        <div className="bg-blue_secondary w-24 h-24 rounded-full flex items-center justify-center mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-14 h-14 text-white"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M7 8c0-2.761 2.239-5 5-5s5 2.239 5 5c0 3.418-2.239 10-5 10S7 11.418 7 8Z"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M12.5 3.5c2.642.298 4.5 2.239 4.5 4.5 0 3.418-2.239 10-5 10-.335 0-.67-.037-.995-.112"
            />
            <circle
              cx="16"
              cy="12"
              r="3"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m18.5 14.5 1 1"
            />
          </svg>
        </div>

        {/* Título e subtítulo */}
        <h1 className="text-3xl font-bold text-center text-[#232323] mb-2">
          Seja bem-vindo ao OdontoLegal!
        </h1>
        <p className="text-lg text-center text-gray_primary mb-10">
          Na aba abaixo, preencha seus dados.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Campo de usuário */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <User size={24} className="text-gray_primary" />
            </div>
            <input
              type="text"
              className="w-full py-4 pl-12 pr-4 text-gray-700 border border-[#d5d5d5] rounded-lg focus:outline-none focus:border-blue_secondary"
              placeholder="Nome do usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Campo de senha */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <LockKey size={24} className="text-gray_primary" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full py-4 pl-12 pr-10 text-gray-700 border border-[#d5d5d5] rounded-lg focus:outline-none focus:border-blue_secondary"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray_primary hover:text-blue_primary focus:outline-none"
              >
                {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botão de login */}
          <button
            type="submit"
            className="w-full py-4 text-white bg-red_secondary rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
