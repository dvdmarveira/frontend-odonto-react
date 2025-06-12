import { PDFDocument } from "pdf-lib";
import { toast } from "react-hot-toast";

export const addSignatureToPdf = async (pdfBlob, signatureImageBase64) => {
  try {
    const pdfDoc = await PDFDocument.load(await pdfBlob.arrayBuffer());

    // A imagem da assinatura precisa ser PNG ou JPG
    const isPng = signatureImageBase64.startsWith("data:image/png");
    const signatureImage = isPng
      ? await pdfDoc.embedPng(signatureImageBase64)
      : await pdfDoc.embedJpg(signatureImageBase64);

    // Adiciona a imagem na última página
    const lastPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    const { width, height } = lastPage.getSize();

    // Define o tamanho e a posição da assinatura
    const imageWidth = 150;
    const imageHeight =
      (signatureImage.height / signatureImage.width) * imageWidth;
    const padding = 50;

    lastPage.drawImage(signatureImage, {
      x: width - imageWidth - padding, // Canto inferior direito
      y: padding,
      width: imageWidth,
      height: imageHeight,
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  } catch (error) {
    console.error("Falha ao adicionar assinatura no PDF:", error);
    toast.error(
      "Não foi possível adicionar a assinatura. Verifique o formato da imagem."
    );
    return pdfBlob; // Retorna o PDF original em caso de erro
  }
};
