/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetPhoneUser } from "./getPhoneUser";

export function salvarNoLocalStorage(chave: string, data: object) {
  try {
    const phone = GetPhoneUser();

    const dadosComPhone = phone ? { ...data, phone } : data;

    const dadosFormatados = JSON.stringify({ data: dadosComPhone });
    localStorage.setItem(chave, dadosFormatados);
    
    saveTable();
  } catch (erro) {
    console.error('Erro ao salvar no localStorage:', erro);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function saveUnicData(chave: string, unicData: any) {
  localStorage.setItem(chave, unicData);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function saveTable() {
  try {
    const sarcopeniaData = localStorage.getItem('sarcFResult');
    const avaliacaoData = localStorage.getItem('dadosAvaliacao');
    const registrationData = localStorage.getItem('patient_registration');

    const dadosExistentes = localStorage.getItem('user_table');
    const listaUnificada: any[] = dadosExistentes ? JSON.parse(dadosExistentes) : [];

    const adicionarDados = (phone: string, name: string, tipo: string, novoValor: any) => {
      const usuarioExistente = listaUnificada.find((p) => p.phone === phone);

      if (usuarioExistente) {
        if (tipo === 'registro') {
          usuarioExistente.registro = novoValor;
        } else {
          if (!usuarioExistente[tipo]) usuarioExistente[tipo] = [];
          usuarioExistente[tipo].push(novoValor); 
        }
      } else {
        listaUnificada.push({
          phone,
          name: name || 'Não informado',
          registro: tipo === 'registro' ? novoValor : null,
          avaliacoes: tipo === 'avaliacoes' ? [novoValor] : [],
          sarcopenia: tipo === 'sarcopenia' ? [novoValor] : [],
        });
      }
    };

    if (sarcopeniaData) {
      const { data } = JSON.parse(sarcopeniaData);
      if (data?.phone) {
        adicionarDados(data.phone, data.name, 'sarcopenia', data);
      }
    }

    if (avaliacaoData) {
      const { data } = JSON.parse(avaliacaoData);
      if (data?.phone) {
        adicionarDados(data.phone, data.name, 'avaliacoes', data);
      }
    }

    if (registrationData) {
      const { data } = JSON.parse(registrationData);
      if (data?.phone) {
        adicionarDados(data.phone, data.name, 'registro', data);
      }
    }

    localStorage.setItem('user_table', JSON.stringify(listaUnificada));
    console.log('Dados salvos na user_table:', listaUnificada);
  } catch (erro) {
    console.error('Erro ao atualizar a user_table:', erro);
  }
}

