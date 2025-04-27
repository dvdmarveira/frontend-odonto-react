import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  User,
  LockKey,
  Eye,
  EyeSlash,
  Envelope,
  IdentificationCard,
} from "@phosphor-icons/react";
import peridentalLogo from "../assets/imgs/logo/peridentalLogo.svg";

const Register = () => {
  const { signUp } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("perito"); // Valores possíveis: perito, assistente
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      await signUp({ name, email, password, role });
      console.log("Registro bem-sucedido! Redirecionando para o login...");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Erro ao se inscrever");
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
          Cadastro OdontoLegal
        </h1>
        <p className="text-lg text-center text-gray_primary mb-10">
          Preencha seus dados para criar sua conta.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form className="w-full" onSubmit={handleSubmit}>
          {/* Campo de nome */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <IdentificationCard size={24} className="text-gray_primary" />
            </div>
            <input
              type="text"
              className="w-full py-4 pl-12 pr-4 text-gray-700 border border-[#d5d5d5] rounded-lg focus:outline-none focus:border-blue_secondary"
              placeholder="Nome completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Campo de email */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Envelope size={24} className="text-gray_primary" />
            </div>
            <input
              type="email"
              className="w-full py-4 pl-12 pr-4 text-gray-700 border border-[#d5d5d5] rounded-lg focus:outline-none focus:border-blue_secondary"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Campo de senha */}
          <div className="relative mb-6">
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

          {/* Campo de confirmação de senha */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <LockKey size={24} className="text-gray_primary" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full py-4 pl-12 pr-10 text-gray-700 border border-[#d5d5d5] rounded-lg focus:outline-none focus:border-blue_secondary"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray_primary hover:text-blue_primary focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeSlash size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Seleção de perfil */}
          <div className="relative mb-8">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full py-4 px-4 text-gray-700 border border-[#d5d5d5] rounded-lg focus:outline-none focus:border-blue_secondary appearance-none"
            >
              <option value="perito">Perito</option>
              <option value="assistente">Assistente</option>
            </select>
          </div>

          {/* Botão de registro */}
          <button
            type="submit"
            className="w-full py-4 text-white bg-red_secondary rounded-lg hover:bg-opacity-90 transition-colors mb-4"
          >
            Cadastrar
          </button>

          {/* Link para login */}
          <p className="text-center text-gray_primary">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-blue_primary hover:underline">
              Faça login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
