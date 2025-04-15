/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from 'jspdf';

export interface AvaliacaoData {
  sexo?: string | 'não informado';
  forcaPreensao?: number | null;
  tug?: number | null;
  anguloDeFase?: number | null;
  sentarLevantar?: number | null;
  panturrilha?: number | null;
  laudo?: string | 'não informado';
  name?: string | 'não informado';
  email?: string | 'não informado';
  phone?: string | 'não informado';
  birthdate?: string | 'não informado';
  age?: number | null;
  height?: number | null;
  weight?: number | null;
  cpf?: string | 'não informado';
  sleep?: string | 'não informado';
  vision?: string | 'não informado';
  hearing?: string | 'não informado';
  alcoholic?: string | 'não informado';
  smoker?: string | 'não informado';
  medicines?: string | 'não informado';
  specificMedicines?: string | string[] | 'não informado';
  physicalActivity?: string | 'não informado';
  fallHistory?: string | 'não informado';
  reason?: string | 'não informado';
  location?: string | 'não informado';
}



export function exportarAvaliacaoParaPDF(dados: AvaliacaoData) {
  const pdf = new jsPDF();
  let y = 20; // Posição vertical inicial

  // --- Função para adicionar texto com controle de quebra de página ---
  const addText = (text: string | string[], x: number, lineHeight = 7, options?: any) => {
    const lines = Array.isArray(text) ? text : [text];
    
    lines.forEach(line => {
      if (y > 280) { // Se atingir o final da página
        pdf.addPage(); // Adiciona nova página
        y = 20; // Reinicia a posição Y
      }
      pdf.text(line, x, y, options);
      y += lineHeight;
    });
  };

  // --- 1. Cabeçalho ---
  pdf.setFontSize(16);
  addText('Avaliação de Sarcopenia', 105, 10, { align: 'center' });

  // --- 2. Informações do Paciente ---
  pdf.setFontSize(14);
  addText('Informações do Paciente:', 20, 10);
  
  pdf.setFontSize(12);
  const pacienteInfo = [
    `Nome: ${dados.name || 'Não informado'}`,
    `Email: ${dados.email || 'Não informado'}`,
    `Telefone: ${dados.phone || 'Não informado'}`,
    `Data de Nascimento: ${dados.birthdate || 'Não informado'}`,
    `Idade: ${dados.age || 'Não informado'}`,
    `Altura: ${dados.height || 'Não informado'} cm`,
    `Peso: ${dados.weight || 'Não informado'} kg`,
    `CPF: ${dados.cpf || 'Não informado'}`,
    `Qualidade do Sono: ${dados.sleep || 'Não informado'}`,
    `Visão: ${dados.vision || 'Não informado'}`,
    `Audição: ${dados.hearing || 'Não informado'}`,
    `Alcoolismo: ${dados.alcoholic || 'Não informado'}`,
    `Fumante: ${dados.smoker || 'Não informado'}`,
    `Medicamentos: ${dados.medicines || 'Não informado'}`,
    `Medicamentos Específicos: ${Array.isArray(dados.specificMedicines) ? dados.specificMedicines.join(', ') : dados.specificMedicines || 'Não informado'}`,
    `Atividade Física: ${dados.physicalActivity || 'Não informado'}`,
    `Histórico de Quedas: ${dados.fallHistory || 'Não informado'}`,
    `Motivo da Avaliação: ${dados.reason || 'Não informado'}`,
    `Local da Avaliação: ${dados.location || 'Não informado'}`
  ];
  addText(pacienteInfo, 20);

  // --- 3. Resultados da Avaliação ---
  pdf.setFontSize(14);
  addText('Resultados da Avaliação:', 20, 10);
  
  pdf.setFontSize(12);
  const resultados = [
    `Sexo: ${dados.sexo || 'Não informado'}`,
    `Força de Preensão: ${dados.forcaPreensao !== undefined ? dados.forcaPreensao + ' kgf' : 'Não avaliado'}`,
    `TUG: ${dados.tug !== undefined ? dados.tug + ' s' : 'Não avaliado'}`,
    `Ângulo de Fase: ${dados.anguloDeFase !== undefined ? dados.anguloDeFase + '°' : 'Não avaliado'}`,
    `Sentar e Levantar: ${dados.sentarLevantar !== undefined ? dados.sentarLevantar + ' s' : 'Não avaliado'}`,
    `Panturrilha: ${dados.panturrilha !== undefined ? dados.panturrilha + ' cm' : 'Não avaliado'}`
  ];
  addText(resultados, 20);

  // --- 4. Laudo (se existir) ---
  if (dados.laudo) {
    pdf.setFontSize(14);
    addText('Conclusão:', 20, 10);
    
    pdf.setFontSize(12);
    const laudoLines = pdf.splitTextToSize(dados.laudo, 170);
    addText(laudoLines, 20);
  }

  // --- 5. Referências ---
  pdf.setFontSize(12);
  addText('Referências:', 20, 10);
  
  pdf.setFontSize(10);
  pdf.setTextColor(80, 80, 80); // Cor cinza
  const referencias = [
    '1. CRUZ-JENTOFT, Alfonso J. et al. Sarcopenia: revised European consensus on definition and diagnosis.',
    '   Age and Ageing, v. 48, n. 1, p. 16-31, 2019. doi:10.1093/ageing/afy169.',
    '2. ZHANG, Jian et al. The Diagnostic Accuracy and Cutoff Value of Phase Angle for Screening Sarcopenia:',
    '   A Systematic Review and Meta-Analysis. Journal of the American Medical Directors Association,',
    '   v. 25, n. 2, p. 105283, 2024. doi:10.1016/j.jamda.2023.105283.'
  ];
  addText(referencias, 22);

  // --- Salvar PDF ---
  pdf.save(`avaliacao_${dados.name || 'paciente'}.pdf`);
}