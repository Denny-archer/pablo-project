import * as XLSX from 'xlsx';
 import { saveAs } from 'file-saver';
 import { InterfaceRegistration } from '../types';
 
 export function exportarPacientesParaExcel(pacientes: InterfaceRegistration[]) {
   // Mapeia os dados para colunas organizadas
   const data = pacientes.map((paciente) => ({
    Nome: paciente.name,
    Email: paciente.email,
    Telefone: paciente.phone,
    Idade: paciente.age,
    Altura: paciente.height,
    Peso: paciente.weight,
    Sono: paciente.sleep,
    Visão: paciente.vision,
    Audição: paciente.hearing,
    Alcoólatra: paciente.alcoholic,
    Fumante: paciente.smoker,
    Medicamentos: paciente.medicines,
    'Medicamentos Específicos': Array.isArray(paciente.specificMedicines)
      ? paciente.specificMedicines.join(', ')
      : paciente.specificMedicines,
    'Atividade Física': paciente.physicalActivity,
    'Histórico de Quedas': paciente.fallHistory,
    Motivo: paciente.reason,
    Localização: paciente.location,
  }));
  
  
 
   const worksheet = XLSX.utils.json_to_sheet(data);
   const workbook = XLSX.utils.book_new();
 
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Pacientes');
 
   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
 
   saveAs(blob, 'pacientes.xlsx');
 }