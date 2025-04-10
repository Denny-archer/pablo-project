import { useEffect, useState } from 'react';
import {
  Container,
  Button,
  Table,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { InterfaceRegistration } from '../../types';
import './PatientManagement.css';
import { exportarPacientesParaExcel } from '../../utils/exportarExcel';

export function PatientManagement() {
  const [pacientes, setPacientes] = useState<InterfaceRegistration[]>([]);
  const navigate = useNavigate();

  console.log('pacientes', pacientes);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = localStorage.getItem('table_management');
        let patientData: InterfaceRegistration[] = [];
      
        if (data) {
          const parsed = JSON.parse(data).data;
      
          // Se for um objeto único, transforma em array
          patientData = Array.isArray(parsed) ? parsed : [parsed];
        }
      
        console.log('patientData', patientData);
        setPacientes(patientData);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchData();
  }, []);


  const handleDelete = (phone: string) => {
    const updatedPatients = pacientes.filter(p => p.phone !== phone);
    setPacientes(updatedPatients);
  
    // Atualiza o localStorage
    localStorage.setItem('table_management', JSON.stringify({ data: updatedPatients }));
  };
  
  return (
    <Container className="mt-4">
      <header className="text-center mb-4">
        <h1>Gestão de Pacientes</h1>
      </header>
      <main style={{ maxHeight: "500px", overflowY: "auto" }}>
        <Table responsive bordered hover className="mt-4 text-center align-middle" >
          <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
            <th>#</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Idade</th>
            <th>Altura</th>
            <th>Peso</th>
            <th>Sono</th>
            <th>Visão</th>
            <th>Audição</th>
            <th>Alcoólatra</th>
            <th>Fumante</th>
            <th>Medicamentos</th>
            <th>Medicamentos Específicos</th>
            <th>Atividade Física</th>
            <th>Histórico de Quedas</th>
            <th>Motivo</th>
            <th>Localização</th>
            <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((paciente, index) => (
              <tr key={paciente.phone}>
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1
                  }}
                >
                  {index + 1}
                </td>
                <td>{paciente.name}</td>
                <td>{paciente.email}</td>
                <td>{paciente.phone}</td>
                <td>{paciente.age}</td>
                <td>{paciente.height}</td>
                <td>{paciente.weight}</td>
                <td>{paciente.sleep}</td>
                <td>{paciente.vision}</td>
                <td>{paciente.hearing}</td>
                <td>{paciente.alcoholic}</td>
                <td>{paciente.smoker}</td>
                <td>{paciente.medicines}</td>
                <td>{paciente.specificMedicines}</td>
                <td>{paciente.physicalActivity}</td>
                <td>{paciente.fallHistory}</td>
                <td>{paciente.reason}</td>
                <td>{paciente.location}</td>
                <td>
                  <Button variant="danger" size="sm" className="me-2" onClick={() => handleDelete(paciente.phone!)}
                  >
                    Excluir
                  </Button>
                  <Button variant="warning" size="sm">
                    Editar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </main>
      <section id="add-patient" className="mb-4 text-center">
        <Button
          variant="dark"
          id="add-patient-btn"
          onClick={() => navigate('/cadastro-paciente')}
        >
          ➕ Cadastrar Paciente
        </Button>
      </section>
      <section className="text-center">
        <Button
          variant="dark"
          onClick={() => exportarPacientesParaExcel(pacientes)}
        >
          Exportar para excel
        </Button>
      </section>
    </Container>
  );
}
