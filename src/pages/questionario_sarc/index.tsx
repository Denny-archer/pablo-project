import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import CheckboxGroup from '../../components/checkbox_group';
import { InterfaceRegistration } from '../../types';
import { exportarSarcFParaPDF } from '../../utils/exportarPdfSarc';

interface Question {
  label: string;
  name: string;
  options: {
    value: string;
    label: string;
  }[];
}

const questions: Question[] = [
  {
    label: 'Qual a dificuldade que tem para levantar e carregar 4,5kg?',
    name: 'forca',
    options: [
      { value: '0', label: 'Nenhuma' },
      { value: '1', label: 'Alguma' },
      { value: '2', label: 'Muita ou impossível' },
    ],
  },
  {
    label: 'Qual a dificuldade que tem para atravessar uma sala?',
    name: 'apoio',
    options: [
      { value: '0', label: 'Nenhuma' },
      { value: '1', label: 'Alguma' },
      { value: '2', label: 'Muita, com apoio ou impossível' },
    ],
  },
  {
    label: 'Qual a dificuldade que tem para se levantar de uma cadeira ou de uma cama?',
    name: 'levantar',
    options: [
      { value: '0', label: 'Nenhuma' },
      { value: '1', label: 'Alguma' },
      { value: '2', label: 'Muita ou impossível sem ajuda' },
    ],
  },
  {
    label: 'Qual a dificuldade que tem para subir um lance de 10 degraus?',
    name: 'escadas',
    options: [
      { value: '0', label: 'Nenhuma' },
      { value: '1', label: 'Alguma' },
      { value: '2', label: 'Muita ou impossível' },
    ],
  },
  {
    label: 'Quantas vezes caiu no último ano?',
    name: 'quedas',
    options: [
      { value: '0', label: 'Nenhuma' },
      { value: '1', label: '1 a 3 quedas' },
      { value: '2', label: '4 quedas ou mais' },
    ],
  },
];

export const SarcFForm: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const savedResult = localStorage.getItem('sarcFResult');
    if (savedResult) {
      setResult(savedResult);
    }
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const total = Object.values(formData).reduce((sum, val) => sum + parseInt(val), 0);
    const predicao = total >= 4 ? 'Sim' : 'Não';

    const resultData = {
      respostas: formData,
      pontuacao: total,
      predicao,
    };

    localStorage.setItem('sarcFResult', JSON.stringify(resultData, null, 2));
    setResult(JSON.stringify(resultData, null, 2));
    alert('Resultado salvo com sucesso!');
  };

  const patientRegistratioStorage = localStorage.getItem('user');
  let patientData = {} as InterfaceRegistration;
  if (patientRegistratioStorage) {
    patientData = JSON.parse(patientRegistratioStorage).data;
    console.log('patientData', patientData);
  }


  return (
    <Container className="my-4">
      <h1>SARC-F - Ferramenta de Rastreamento do Risco de Sarcopenia</h1>
      <form>
        {questions.map((q) => (
          <CheckboxGroup
            key={q.name}
            label={q.label}
            name={q.name}
            values={[formData[q.name] || '']}
            onChange={handleCheckboxChange}
            options={q.options}
          />
        ))}
        <Button variant="primary" type="button" onClick={handleSubmit}>
          Enviar
        </Button>
      </form>

      {result && (() => {
        const parsed = JSON.parse(result);
        return (
          <>
          <div>
            <h5 className="mb-3 text-secondary">Informações do Paciente</h5>
          <ul className="mb-4">
            <li><strong>Nome:</strong> {patientData.name}</li>
            <li><strong>Email:</strong> {patientData.email}</li>
            <li><strong>Telefone:</strong> {patientData.phone}</li>
            <li><strong>Data de Nascimento:</strong> {patientData.birthdate}</li>
            <li><strong>Idade:</strong> {patientData.age}</li>
            <li><strong>Altura:</strong> {patientData.height} cm</li>
            <li><strong>Peso:</strong> {patientData.weight} kg</li>
            <li><strong>CPF:</strong> {patientData.cpf}</li>
            <li><strong>Qualidade do Sono:</strong> {patientData.sleep}</li>
            <li><strong>Visão:</strong> {patientData.vision}</li>
            <li><strong>Audição:</strong> {patientData.hearing}</li>
            <li><strong>Alcoolismo:</strong> {patientData.alcoholic}</li>
            <li><strong>Fumante:</strong> {patientData.smoker}</li>
            <li><strong>Medicamentos:</strong> {patientData.medicines}</li>
            <li><strong>Medicamentos Específicos:</strong> {
              Array.isArray(patientData.specificMedicines)
                ? patientData.specificMedicines.join(', ')
                : patientData.specificMedicines
            }</li>
            <li><strong>Atividade Física:</strong> {patientData.physicalActivity}</li>
            <li><strong>Histórico de Quedas:</strong> {patientData.fallHistory}</li>
            <li><strong>Motivo da Avaliação:</strong> {patientData.reason}</li>
            <li><strong>Local da Avaliação:</strong> {patientData.location}</li>
          </ul>
          </div>
          <div className="mt-4">
            <h4>Resultado Salvo:</h4>
            <p><strong>Pontuação Total:</strong> {parsed.pontuacao}</p>
            <p><strong>Predição de Sarcopenia:</strong> {parsed.predicao}</p>
            <h5>Respostas:</h5>
            <ul>
              {Object.entries(parsed.respostas).map(([key, value]) => {
                const question = questions.find((q) => q.name === key);
                const optionLabel = question?.options.find((opt) => opt.value === value)?.label;
                return (
                  <li key={key}>
                    <strong>{question?.label}</strong><br />
                    Resposta: {optionLabel}
                  </li>
                );
              })}
            </ul>
          </div>
          <Button
              className="mt-3"
              variant="secondary"
              type="button"
              onClick={() => {
                if (result) {
                  const parsed = JSON.parse(result);
                  exportarSarcFParaPDF(patientData, parsed, questions);
                }
              }}
            >
              Exportar para PDF
          </Button>
          </>
        );
      })()}
    </Container>
  );
};
