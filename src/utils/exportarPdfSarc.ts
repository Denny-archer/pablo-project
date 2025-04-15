import jsPDF from 'jspdf';
import { InterfaceRegistration } from '../types';

interface SarcFResult {
  respostas: Record<string, string>;
  pontuacao: number;
  predicao: string;
}

interface Question {
  label: string;
  name: string;
  options: {
    value: string;
    label: string;
  }[];
}

export function exportarSarcFParaPDF(
  dados: InterfaceRegistration,
  resultado: SarcFResult,
  questions: Question[]
) {
  const pdf = new jsPDF();

  pdf.setFontSize(16);
  pdf.text('Avaliação SARC-F', 105, 20, { align: 'center' });

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
    `Medicamentos Específicos: ${Array.isArray(dados.specificMedicines) ? dados.specificMedicines.join(', ') : dados.specificMedicines}`,
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
  pdf.text('Resultado SARC-F:', 20, y); y += 10;

  pdf.setFontSize(12);
  pdf.text(`Pontuação Total: ${resultado.pontuacao}`, 20, y); y += 8;
  pdf.text(`Predição de Sarcopenia: ${resultado.predicao}`, 20, y); y += 10;

  pdf.setFontSize(14);
  pdf.text('Respostas:', 20, y); y += 10;

  pdf.setFontSize(12);
  Object.entries(resultado.respostas).forEach(([key, value]) => {
    const question = questions.find((q) => q.name === key);
    const label = question?.label || key;
    const optionLabel = question?.options.find((opt) => opt.value === value)?.label || value;
    const text = `${label} - ${optionLabel}`;
    
    const wrappedText = pdf.splitTextToSize(text, 170);
    pdf.text(wrappedText, 20, y);
    y += wrappedText.length * 8;
  });

  pdf.save('avaliacao-sarc-f.pdf');
}
