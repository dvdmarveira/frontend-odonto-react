import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { User, LockKey, Eye, EyeSlash } from "@phosphor-icons/react";
import peridentalLogo from "../assets/imgs/logo/peridentalLogo.svg";

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Iniciando processo de login...");

    // Validação básica
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      console.log("Tentando fazer login com email:", email);
      await signIn(email, password);
      console.log("Login bem-sucedido!");
      console.log("Redirecionando para /dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro durante o login:", err);
      setError(err.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6 py-8 flex flex-col items-center">
        {/* Logo */}
        <div className="bg-blue_secondary w-24 h-24 rounded-full flex items-center justify-center mb-8">
          <img
            src={peridentalLogo}
            alt="Logo Peridental"
            className="w-18 h-18"
          />
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
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            className="w-full py-4 text-white bg-red_secondary rounded-lg hover:bg-opacity-90 transition-colors mb-4"
          >
            Entrar
          </button>

          {/* Link para registro */}
          <p className="text-center text-gray_primary">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-blue_primary hover:underline">
              Cadastre-se
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
