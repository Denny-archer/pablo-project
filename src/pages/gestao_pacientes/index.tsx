/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Container, Table, Button, Badge, Alert } from 'react-bootstrap';

import { exportarPacientesParaExcel } from '../../utils/exportarExcel';

interface Paciente {
  phone: string;
  name?: string;
  registro?: any;
  avaliacoes?: any[];
  sarcopenia?: any[];
}

export function PatientManagement() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [showAlert, setShowAlert] = useState<boolean>(false);

  useEffect(() => {
    const data = localStorage.getItem('user_table');
    if (data) {
      setPacientes(JSON.parse(data));
    }
  }, []);

  const toggleRow = (phone: string) => {
    setExpandedRow(expandedRow === phone ? null : phone);
  };

  const handleDelete = (phone: string) => {
    if (window.confirm(`Tem certeza que deseja excluir permanentemente este paciente?`)) {
      const updatedPacientes = pacientes.filter(p => p.phone !== phone);
      setPacientes(updatedPacientes);
      localStorage.setItem('user_table', JSON.stringify(updatedPacientes));
      setAlertMessage('Paciente excluído com sucesso');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const handleExport = () => {
    const pacientesComRegistro = pacientes
      .filter(paciente => paciente.registro)
      .map(paciente => paciente.registro);
    
    if (pacientesComRegistro.length === 0) {
      setAlertMessage('Nenhum paciente com registro completo para exportar');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    
    exportarPacientesParaExcel(pacientesComRegistro);
  };

  

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Relatório Completo de Pacientes</h2>
        <Button 
          variant="success" 
          onClick={handleExport}
        >
          <i className="bi bi-file-excel me-2"></i> Exportar Excel
        </Button>
        
      </div>

      
      
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible className="mt-3">
          {alertMessage}
        </Alert>
      )}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Paciente</th>
            <th>Contato</th>
            <th>Idade</th>
            <th>Avaliações</th>
            <th>Testes Sarcopenia</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pacientes.map((paciente, index) => (
            <>
              <tr key={paciente.phone}>
                <td>{index + 1}</td>
                <td>
                  {paciente.registro?.name || paciente.name || 'Não informado'}
                </td>
                <td>
                  <div>Tel: {paciente.phone}</div>
                  {paciente.registro?.email && <div>Email: {paciente.registro.email}</div>}
                </td>
                <td>{paciente.registro?.age || '-'}</td>
                <td>
                  <Badge bg={paciente.avaliacoes?.length ? 'primary' : 'secondary'}>
                    {paciente.avaliacoes?.length || 0}
                  </Badge>
                </td>
                <td>
                  <Badge bg={paciente.sarcopenia?.length ? 'primary' : 'secondary'}>
                    {paciente.sarcopenia?.length || 0}
                  </Badge>
                </td>
                <td>
                  <Button
                    size="sm"
                    variant={expandedRow === paciente.phone ? 'secondary' : 'primary'}
                    onClick={() => toggleRow(paciente.phone)}
                  >
                    {expandedRow === paciente.phone ? 'Ocultar' : 'Detalhes'}
                  </Button>

                  <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(paciente.phone)}
                  className="ms-2"
                >
                  <i className="bi bi-trash"></i> Excluir
                </Button>
                </td>
              </tr>
              
              {expandedRow === paciente.phone && (
                <tr>
                  <td colSpan={7} className="p-0">
                    <div className="p-3 bg-light">
                      {/* Dados de Registro */}
                      <h5 className="mb-3">Informações Cadastrais</h5>
                      {paciente.registro ? (
                        <div className="row">
                          {Object.entries(paciente.registro).map(([key, value]) => (
                            <div key={key} className="col-md-4 mb-2">
                              <strong>{formatLabel(key)}:</strong> {formatValue(value)}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-muted">Nenhum dado cadastral disponível</div>
                      )}
                      
                      {/* Avaliações Físicas */}
                      <h5 className="mt-4 mb-3">Avaliações Sarcopenia</h5>
                      {paciente.avaliacoes?.length ? (
                        <Table striped bordered size="sm" className="mt-2">
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Força Preensão</th>
                              <th>TUG (s)</th>
                              <th>Ângulo de Fase</th>
                              <th>Sentar-Levantar</th>
                              <th>Panturrilha</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paciente.avaliacoes.map((avaliacao, idx) => (
                              <tr key={idx}>
                                <td>{avaliacao.date || '-'}</td>
                                <td>{avaliacao.forcaPreensao}</td>
                                <td>{avaliacao.tug}</td>
                                <td>{avaliacao.anguloDeFase}</td>
                                <td>{avaliacao.sentarLevantar}</td>
                                <td>{avaliacao.panturrilha}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="text-muted">Nenhuma avaliação física registrada</div>
                      )}
                      
                      {/* Testes de Sarcopenia */}
                      <h5 className="mt-4 mb-3">Testes de Sarcopenia</h5>
                      {paciente.sarcopenia?.length ? (
                        <Table striped bordered size="sm" className="mt-2">
                          <thead>
                            <tr>
                              <th>Data</th>
                              <th>Pontuação</th>
                              <th>Resultado</th>
                              <th>Força</th>
                              <th>Apoio</th>
                              <th>Levantar</th>
                              <th>Escadas</th>
                              <th>Quedas</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paciente.sarcopenia.map((teste, idx) => (
                              <tr key={idx}>
                                <td>{teste.date}</td>
                                <td>{teste.pontuacao}</td>
                                <td>{teste.predicao}</td>
                                <td>{teste.respostas.forca}</td>
                                <td>{teste.respostas.apoio}</td>
                                <td>{teste.respostas.levantar}</td>
                                <td>{teste.respostas.escadas}</td>
                                <td>{teste.respostas.quedas}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      ) : (
                        <div className="text-muted">Nenhum teste de sarcopenia registrado</div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

// Funções auxiliares
function formatLabel(key: string): string {
  const labels: Record<string, string> = {
    name: 'Nome',
    email: 'Email',
    birthdate: 'Data Nasc.',
    age: 'Idade',
    height: 'Altura',
    weight: 'Peso',
    cpf: 'CPF',
    sleep: 'Sono',
    vision: 'Visão',
    hearing: 'Audição',
    alcoholic: 'Alcoólatra',
    smoker: 'Fumante',
    medicines: 'Medicamentos',
    specificMedicines: 'Med. Específicos',
    physicalActivity: 'Atividade Física',
    fallHistory: 'Histórico Quedas',
    reason: 'Motivo',
    location: 'Localização'
  };
  return labels[key] || key;
}

function formatValue(value: any): string {
  if (Array.isArray(value)) return value.join(', ');
  if (value === null || value === undefined) return '-';
  return String(value);
}

