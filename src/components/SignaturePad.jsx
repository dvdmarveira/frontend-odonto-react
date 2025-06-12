import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Upload, Trash } from "@phosphor-icons/react";

const SignaturePad = () => {
  const [signaturePreview, setSignaturePreview] = useState(null);

  useEffect(() => {
    const savedSignature = localStorage.getItem("userSignature");
    if (savedSignature) {
      setSignaturePreview(savedSignature);
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        localStorage.setItem("userSignature", base64String);
        setSignaturePreview(base64String);
        toast.success("Assinatura salva localmente!");
      };
      reader.readAsDataURL(file);
    } else {
      toast.error("Por favor, selecione um arquivo de imagem (.png ou .jpg)");
    }
  };

  const handleRemoveSignature = () => {
    localStorage.removeItem("userSignature");
    setSignaturePreview(null);
    toast.success("Assinatura removida.");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Minha Assinatura</h2>
      <p className="text-gray-600 mb-6">
        Faça o upload de uma imagem da sua assinatura. Ela será adicionada aos
        laudos que você gerar neste navegador. Recomendamos uma imagem com fundo
        transparente (.png).
      </p>

      {signaturePreview ? (
        <div className="text-center">
          <p className="font-medium mb-2">Assinatura Atual:</p>
          <img
            src={signaturePreview}
            alt="Pré-visualização da assinatura"
            className="border rounded-md p-2 max-w-xs mx-auto bg-gray-50"
          />
          <button
            onClick={handleRemoveSignature}
            className="mt-4 bg-red_secondary text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto hover:bg-opacity-80"
          >
            <Trash size={20} />
            Remover Assinatura
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
          <label
            htmlFor="signature-upload"
            className="cursor-pointer text-center"
          >
            <Upload size={48} className="text-blue_dark mx-auto mb-2" />
            <span className="font-semibold text-blue_dark">
              Clique para enviar
            </span>
            <p className="text-xs text-gray-500 mt-1">PNG ou JPG</p>
          </label>
          <input
            id="signature-upload"
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
