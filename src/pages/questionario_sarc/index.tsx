import React, { useState, useEffect } from 'react';
import { Button, Container, Alert, Card, Row, Col } from 'react-bootstrap';
import CheckboxGroup from '../../components/checkbox_group';
import { InterfaceRegistration } from '../../types';
import { exportarSarcFParaPDF } from '../../utils/exportarPdfSarc';
import { salvarNoLocalStorage } from '../../utils/saveLocalStorage';

interface Question {
  label: string;
  name: string;
  options: {
    value: string;
    label: string;
    score: number; // Added score value for each option
  }[];
}

interface ResultData {
  respostas: Record<string, string>;
  pontuacao: number;
  predicao: string;
  date: string;
}

const questions: Question[] = [
  {
    label: 'Qual a dificuldade que tem para levantar e carregar 4,5kg?',
    name: 'forca',
    options: [
      { value: 'nenhuma', label: 'Nenhuma', score: 0 },
      { value: 'alguma', label: 'Alguma', score: 1 },
      { value: 'muita_ou_impossivel', label: 'Muita ou impossível', score: 2 },
    ],
  },
  {
    label: 'Qual a dificuldade que tem para atravessar uma sala?',
    name: 'apoio',
    options: [
      { value: 'nenhuma', label: 'Nenhuma', score: 0 },
      { value: 'alguma', label: 'Alguma', score: 1 },
      { value: 'muita_com_apoio_ou_impossivel', label: 'Muita, com apoio ou impossível', score: 2 },
    ],
  },
  {
    label: 'Qual a dificuldade que tem para se levantar de uma cadeira ou de uma cama?',
    name: 'levantar',
    options: [
      { value: 'nenhuma', label: 'Nenhuma', score: 0 },
      { value: 'alguma', label: 'Alguma', score: 1 },
      { value: 'muita_ou_impossivel_sem_ajuda', label: 'Muita ou impossível sem ajuda', score: 2 },
    ],
  },
  {
    label: 'Qual a dificuldade que tem para subir um lance de 10 degraus?',
    name: 'escadas',
    options: [
      { value: 'nenhuma', label: 'Nenhuma', score: 0 },
      { value: 'alguma', label: 'Alguma', score: 1 },
      { value: 'muita_ou_impossivel', label: 'Muita ou impossível', score: 2 },
    ],
  },
  {
    label: 'Quantas vezes caiu no último ano?',
    name: 'quedas',
    options: [
      { value: 'nenhuma', label: 'Nenhuma', score: 0 },
      { value: 'uma_a_tres', label: '1 a 3 quedas', score: 1 },
      { value: 'quatro_ou_mais', label: '4 quedas ou mais', score: 2 },
    ],
  },
];

export const SarcFForm: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ResultData | null>(null);
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(true);

  // Load patient data and saved result
  const [patientData, setPatientData] = useState<InterfaceRegistration>({} as InterfaceRegistration);

  useEffect(() => {
    const patientRegistrationStorage = localStorage.getItem('user');
    if (patientRegistrationStorage) {
      try {
        const data = JSON.parse(patientRegistrationStorage).data;
        setPatientData(data);
      } catch (error) {
        console.error('Error parsing patient data:', error);
      }
    }

    const savedResult = localStorage.getItem('sarcFResult');
    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult));
      setFormData(JSON.parse(savedResult).respostas);
      console.log('Loaded saved result:', JSON.parse(savedResult));
      } catch (error) {
        console.error('Error parsing saved result:', error);
      }
    }
  }, []);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateScore = (): number => {
    return Object.entries(formData).reduce((total, [name, value]) => {
      const question = questions.find(q => q.name === name);
      const option = question?.options.find(opt => opt.value === value);
      return total + (option?.score || 0);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unanswered = questions.filter(q => !formData[q.name]);
    if (unanswered.length > 0) {
      setAllQuestionsAnswered(false);
      return;
    }
    setAllQuestionsAnswered(true);

    const totalScore = calculateScore();
    const predicao = totalScore >= 4 ? 'Sim' : 'Não';

    const resultData: ResultData = {
      respostas: formData,
      pontuacao: totalScore,
      predicao,
      date: new Date().toLocaleDateString(),
    };

    salvarNoLocalStorage('sarcFResult', resultData);
    setResult(resultData);
  };

  const handleFinalizarTeste = () => {
    setFormData({});
    setResult(null);
    localStorage.removeItem('sarcFResult'); // Remove o item específico do localStorage
  };

  const renderPatientInfo = () => (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3 text-secondary">Informações do Paciente</h5>
        <Row>
          <Col md={6}>
            <p><strong>Nome:</strong> {patientData.name || 'Não informado'}</p>
            <p><strong>Idade:</strong> {patientData.age || 'Não informado'}</p>
            <p><strong>Altura:</strong> {patientData.height ? `${patientData.height} cm` : 'Não informado'}</p>
            <p><strong>Peso:</strong> {patientData.weight ? `${patientData.weight} kg` : 'Não informado'}</p>
          </Col>
          <Col md={6}>
            <p><strong>Telefone:</strong> {patientData.phone || 'Não informado'}</p>
            <p><strong>Email:</strong> {patientData.email || 'Não informado'}</p>
            <p><strong>Data de Nascimento:</strong> {patientData.birthdate || 'Não informado'}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );

  const renderResult = () => {
    if (!result) return null;

    return (
      <Card className="mt-4">
        <Card.Body>
          <h4 className="text-center mb-4">Resultado da Avaliação SARC-F</h4>
          
          <Alert variant={result.pontuacao >= 4 ? 'danger' : 'success'}>
            <h5 className="alert-heading">
              {result.pontuacao >= 4 ? 'Risco de Sarcopenia Detectado' : 'Risco de Sarcopenia Não Detectado'}
            </h5>
            <hr />
            <p className="mb-0">
              <strong>Pontuação Total:</strong> {result.pontuacao} (≥4 indica risco de sarcopenia)
            </p>
          </Alert>

          <h5 className="mt-4">Detalhes das Respostas:</h5>
          <ul className="list-unstyled">
            {questions.map((question) => {
              const answer = result.respostas?.[question.name] ?? '';
              const option = question.options.find(opt => opt.value === answer);
              return (
                <li key={question.name} className="mb-3">
                  <strong>{question.label}</strong>
                  <div className="ms-3">
                    <span className="d-block">Resposta: {option?.label}</span>
                    <span className="text-muted">Pontos: {option?.score}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button
              variant="primary"
              onClick={() => exportarSarcFParaPDF(patientData, result, questions)}
            >
              Exportar para PDF
            </Button>
            <Button
    variant="primary"
    onClick={handleFinalizarTeste}
  >
    Finalizar Teste
  </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };
  console.log("QUESTIONS:", questions)

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">SARC-F - Ferramenta de Rastreamento do Risco de Sarcopenia</h1>
      
      {renderPatientInfo()}

      <Card>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            {!allQuestionsAnswered && (
              <Alert variant="danger" className="mb-4">
                Por favor, responda todas as questões antes de enviar.
              </Alert>
            )}

{Array.isArray(questions) &&
  questions
    .filter((q) => q && q.name && q.options) // evita q indefinido ou incompleto
    .map((q) => (
      <div key={q.name} className="mb-4">
        <CheckboxGroup
          label={q.label}
          name={q.name}
          values={[formData?.[q.name] ?? '']}
          onChange={handleCheckboxChange}
          options={q.options}
        />
      </div>
    ))}


            <div className="d-grid">
              <Button variant="primary" type="submit" size="lg">
                Calcular Risco de Sarcopenia
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {renderResult()}
    </Container>
  );
};


