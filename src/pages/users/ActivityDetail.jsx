import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MagnifyingGlassPlus, X } from "@phosphor-icons/react";
import SearchBar from "../../components/SearchBar";

const ActivityDetail = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // const [newComment, setNewComment] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Simulando carregamento de dados da API
    setTimeout(() => {
      const mockActivity = {
        id: activityId,
        type: "Fotografias intraorais e radiografias odontológicas",
        dateTime: "16/09/2025, 10:34:45",
        patientName: "Juliana Maria Gonçalves",
        patientGender: "F",
        location:
          "Clínica Odontológica Smilier, Rua Peixoto Melo, N°34, CEP: 60415-198",
        recordNumber: "3875648280",
        registeredBy: "Sheila Lins",
        description:
          "Foram solicitadas radiografias periapicais das áreas afetadas pelo motivo e extensão da cárie e possível envolvimento da polpa dentária. A radiografia revelou lesões de cárie em estágio moderado, sem comprometimento da dentina, mas com sinais claros de infecção pulpar.",
        images: [
          {
            id: 1,
            src: "/src/assets/imgs/photos/arcadainferior.svg",
            alt: "Área Dentária Inferior",
            caption: "Área Dentária Inferior",
          },
          {
            id: 2,
            src: "/src/assets/imgs/photos/arcadacompleta.svg",
            alt: "Área Dentária Completa",
            caption: "Área Dentária Completa",
          },
          {
            id: 3,
            src: "/src/assets/imgs/photos/incisivoslateraisinferiores.svg",
            alt: "Incisivos Laterais Inferiores",
            caption: "Incisivos Laterais Inferiores",
          },
        ],
        comments: [
          {
            id: 1,
            author: "Dr. fulano de tal",
            text: "comentarios bla bla bla bla bla",
          },
          {
            id: 2,
            author: "Perito tal",
            text: "comentarios bla bla bla bla bla",
          },
        ],
      };

      setActivity(mockActivity);
      setIsLoading(false);
    }, 1000);
  }, [activityId]);

  const handleClose = () => {
    navigate(-1); // Volta para a página anterior
  };

  // const handleAddComment = () => {
  //   if (!newComment.trim()) return;

  //   const newCommentObj = {
  //     id: activity.comments.length + 1,
  //     author: "Usuário atual",
  //     text: newComment,
  //   };

  //   setActivity({
  //     ...activity,
  //     comments: [...activity.comments, newCommentObj],
  //   });

  //   setNewComment("");
  // };

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">Carregando detalhes da atividade...</div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Search Bar */}
      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Activity Detail Card */}
      <div className="bg-blue_dark rounded-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-red_secondary hover:text-red_secondary"
        >
          <X size={24} weight="bold" />
        </button>

        {/* Header Information */}
        <div className="mb-6 border-b border-gray-300 pb-4">
          <h3 className="text-base text-white">
            <span className="font-bold">Atividade:</span> {activity.type}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-1 text-white text-base">
            <p>
              <span className="font-bold">Data e hora de abertura:</span>{" "}
              {activity.dateTime}
            </p>
            <p>
              <span className="font-bold">Paciente:</span>{" "}
              {activity.patientName}
            </p>
            <p>
              <span className="font-bold">Sexo:</span> {activity.patientGender}
            </p>
            <p>
              <span className="font-bold">Local de registro:</span>{" "}
              {activity.location}
            </p>
            <p>
              <span className="font-bold">N.° de prontuário:</span>{" "}
              {activity.recordNumber}
            </p>
            <p>
              <span className="font-bold">Registrado por:</span>{" "}
              {activity.registeredBy}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 text-center text-white">
            Fotografias intraorais e radiografias odontológicas.
          </h3>

          <p className="text-center text-white mb-8">{activity.description}</p>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {activity.images.map((image) => (
              <div key={image.id} className="text-center text-white font-">
                <div
                  className="relative bg-black"
                  style={{
                    width: "240px",
                    height: "240px",
                    display: "inline-block",
                    overflow: "hidden",
                    borderRadius: "20px",
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22120%22%20height%3D%22120%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_18e30c084b1%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_18e30c084b1%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%23eee%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2243.5%22%20y%3D%2265.5%22%3E120x120%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                    }}
                  />
                  <div
                    className="absolute bottom-2 right-2 bg-white p-1 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => openImageModal(image)}
                  >
                    <MagnifyingGlassPlus size={16} className="text-black" />
                  </div>
                </div>
                <p className="mt-2 font-medium text-center">{image.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-2 right-2 bg-white p-1 rounded-full"
              onClick={closeModal}
            >
              <X size={24} weight="bold" className="text-black" />
            </button>
            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-nowrap px-4 py-2 rounded">
              {selectedImage.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetail;
