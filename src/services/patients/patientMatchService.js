// Função para calcular a similaridade entre dois números de dentes
const calculateTeethSimilarity = (teeth1, teeth2) => {
  if (teeth1 === teeth2) return 100;
  const diff = Math.abs(teeth1 - teeth2);

  // Se a diferença for maior que 4 dentes, considera muito diferente
  if (diff > 4) return 0;

  // Calcula a similaridade baseada na diferença
  // Cada dente diferente reduz 25% da similaridade
  return Math.max(0, 100 - diff * 25);
};

class PatientMatchService {
  // Calcula a pontuação de similaridade entre dois pacientes
  static calculateSimilarityScore(patient1, patient2) {
    let score = 0;
    let criteriaCount = 0;

    // 1. Comparação do número de dentes (40% do peso total)
    if (patient1.numberOfTeeth && patient2.numberOfTeeth) {
      const teethScore = calculateTeethSimilarity(
        patient1.numberOfTeeth,
        patient2.numberOfTeeth
      );
      score += teethScore * 0.4;
      criteriaCount++;
    }

    // 2. Comparação do status de cáries (30% do peso total)
    if (
      patient1.hasActiveCavities !== undefined &&
      patient2.hasActiveCavities !== undefined
    ) {
      const cariesScore =
        patient1.hasActiveCavities === patient2.hasActiveCavities ? 100 : 0;
      score += cariesScore * 0.3;
      criteriaCount++;
    }

    // 3. Status de identificação (30% do peso total)
    const identificationScore = !patient1.name && patient2.name ? 100 : 0;
    score += identificationScore * 0.3;
    criteriaCount++;

    // Se não houver critérios suficientes para comparação, retorna 0
    if (criteriaCount === 0) return 0;

    // Retorna a pontuação final arredondada
    return Math.round(score);
  }

  // Encontra possíveis correspondências para um paciente não identificado
  static findPotentialMatches(
    unidentifiedPatient,
    identifiedPatients,
    threshold = 50
  ) {
    if (!unidentifiedPatient || !identifiedPatients) return [];

    const matches = identifiedPatients.map((identifiedPatient) => ({
      patient: identifiedPatient,
      similarityScore: this.calculateSimilarityScore(
        unidentifiedPatient,
        identifiedPatient
      ),
      comparisonDetails: {
        teeth: {
          unidentified: unidentifiedPatient.numberOfTeeth,
          identified: identifiedPatient.numberOfTeeth,
          matches:
            unidentifiedPatient.numberOfTeeth ===
            identifiedPatient.numberOfTeeth,
        },
        caries: {
          unidentified: unidentifiedPatient.hasActiveCavities,
          identified: identifiedPatient.hasActiveCavities,
          matches:
            unidentifiedPatient.hasActiveCavities ===
            identifiedPatient.hasActiveCavities,
        },
      },
    }));

    // Filtra e ordena as correspondências por pontuação
    return matches
      .filter((match) => match.similarityScore >= threshold)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }

  // Busca correspondências para todos os pacientes não identificados
  static async findAllMatches(patients) {
    // Filtra pacientes não identificados e identificados
    const unidentifiedPatients = patients.filter((p) => !p.name);
    const identifiedPatients = patients.filter((p) => p.name);

    // Para cada paciente não identificado, busca correspondências
    const allMatches = unidentifiedPatients.map((unidentifiedPatient) => ({
      unidentifiedPatient,
      matches: this.findPotentialMatches(
        unidentifiedPatient,
        identifiedPatients
      ),
    }));

    // Retorna apenas os resultados que têm correspondências
    return allMatches.filter((result) => result.matches.length > 0);
  }
}

export default PatientMatchService;
