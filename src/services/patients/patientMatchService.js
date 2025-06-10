// src/services/patients/patientMatchService.js (Versão de Análise)

/*
  AVISO IMPORTANTE:
  Esta lógica de correspondência de pacientes foi baseada em um modelo de dados
  antigo (com os campos 'numberOfTeeth' e 'hasActiveCavities').

  O modelo de dados atual do backend (em models/Patient.js) não possui mais
  esses campos. Em vez disso, ele usa uma estrutura mais detalhada com 'odontograma'.

  Para que esta funcionalidade volte a funcionar, será necessário:
  1.  Adaptar a lógica de 'calculateSimilarityScore' para ler e comparar
      os dados de dentro do objeto 'odontograma'.
  2.  Ou, alternativamente, criar um endpoint no backend que realize essa
      comparação de forma mais robusta, possivelmente usando o modelo de IA.

  O código abaixo está mantido como referência, mas não funcionará corretamente
  com a estrutura de dados atual.
*/

class PatientMatchService {
  // ATENÇÃO: Esta função usa campos que não existem mais no model Patient.js.
  static calculateSimilarityScore(patient1, patient2) {
    let score = 0;

    // O model usa 'nome', não 'name'.
    // A lógica para 'numberOfTeeth' e 'hasActiveCavities' precisa ser refeita
    // para usar os dados do 'odontograma'.

    /*
    const teethScore = calculateTeethSimilarity(patient1.numberOfTeeth, patient2.numberOfTeeth);
    score += teethScore * 0.4;

    const cariesScore = patient1.hasActiveCavities === patient2.hasActiveCavities ? 100 : 0;
    score += cariesScore * 0.3;
    */

    return score; // Retornando 0 para evitar erros.
  }

  static findPotentialMatches(
    unidentifiedPatient,
    identifiedPatients,
    threshold = 50
  ) {
    // Esta função depende de calculateSimilarityScore, portanto, também não funcionará
    // corretamente sem uma nova lógica de comparação.
    return []; // Retornando um array vazio por enquanto.
  }

  static async findAllMatches(patients) {
    // Esta é a função principal que seria chamada pela interface.
    // Ela também depende da lógica acima.
    return []; // Retornando um array vazio por enquanto.
  }
}

export default PatientMatchService;
