import jsPDF from 'jspdf';

export interface AvaliacaoData {
  sexo?: string;
  forcaPreensao?: number;
  tug?: number;
  anguloDeFase?: number;
  sentarLevantar?: number;
  panturrilha?: number;
  laudo?: string;
  name?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  age?: number;
  height?: number;
  weight?: number;
  cpf?: string;
  sleep?: string;
  vision?: string;
  hearing?: string;
  alcoholic?: string;
  smoker?: string;
  medicines?: string;
  specificMedicines?: string | string[];
  physicalActivity?: string;
  fallHistory?: string;
  reason?: string;
  location?: string;
}

export function exportarAvaliacaoParaPDF(dados: AvaliacaoData) {
  const pdf = new jsPDF();

  pdf.setFontSize(16);
  pdf.text('Avaliação de Sarcopenia', 105, 20, { align: 'center' });

  pdf.setFontSize(14);
  let y = 30;
  pdf.text('Informações do Paciente:', 20, y); y += 10;

  pdf.setFontSize(12);
  const pacienteInfo = [
    `Nome: ${dados.name}`,
    `Email: ${dados.email}`,
    `Telefone: ${dados.phone}`,
    `Data de Nascimento: ${dados.birthdate}`,
    `Idade: ${dados.age}`,
    `Altura: ${dados.height} cm`,
    `Peso: ${dados.weight} kg`,
    `CPF: ${dados.cpf}`,
    `Qualidade do Sono: ${dados.sleep}`,
    `Visão: ${dados.vision}`,
    `Audição: ${dados.hearing}`,
    `Alcoolismo: ${dados.alcoholic}`,
    `Fumante: ${dados.smoker}`,
    `Medicamentos: ${dados.medicines}`,
    `Medicamentos Específicos: ${dados.specificMedicines}`,
    `Atividade Física: ${dados.physicalActivity}`,
    `Histórico de Quedas: ${dados.fallHistory}`,
    `Motivo da Avaliação: ${dados.reason}`,
    `Local da Avaliação: ${dados.location}`
  ];

  pacienteInfo.forEach((line) => {
    pdf.text(line, 20, y);
    y += 8;
  });

  y += 5;
  pdf.setFontSize(14);
  pdf.text('Resultados da Avaliação:', 20, y); y += 10;

  pdf.setFontSize(12);
  pdf.text(`Sexo: ${dados.sexo}`, 20, y); y += 10;
  if (dados.forcaPreensao !== undefined) pdf.text(`Força de Preensão: ${dados.forcaPreensao} kgf`, 20, y), y += 10;
  if (dados.tug !== undefined) pdf.text(`TUG: ${dados.tug} s`, 20, y), y += 10;
  if (dados.anguloDeFase !== undefined) pdf.text(`Ângulo de Fase: ${dados.anguloDeFase}°`, 20, y), y += 10;
  if (dados.sentarLevantar !== undefined) pdf.text(`Sentar e Levantar: ${dados.sentarLevantar} s`, 20, y), y += 10;
  if (dados.panturrilha !== undefined) pdf.text(`Panturrilha: ${dados.panturrilha} cm`, 20, y), y += 10;

  if (dados.laudo) {
    y += 10;
    pdf.setFontSize(14);
    pdf.text('Laudo:', 20, y); y += 10;

    pdf.setFontSize(12);
    const laudoLines = pdf.splitTextToSize(dados.laudo, 170);
    pdf.text(laudoLines, 20, y);
  }

  pdf.save('avaliacao-sarcopenia.pdf');
}

