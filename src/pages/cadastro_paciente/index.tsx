import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import '../../styles.css';
// import { RegisterPatient } from '../../api/routesPacientes';
import CheckboxListInput from '../../components/checkbox_list';
import CheckboxGroup from '../../components/checkbox_group';
import { personalBackground, listOptions, yesNoOptions, specificListMedicines } from '../../list-option/options';
import { useNavigate } from 'react-router-dom';
import { salvarNoLocalStorage, saveUnicData } from '../../utils/saveLocalStorage';
import { ValidarCPF } from '../../utils/validations';

export function RegistrationPatient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [cpf, setCpf] = useState('');
  const [selectedOptionSleep, setSelectedOptionSleep] = useState<string>('');
  const [selectedOptionVision, setSelectedOptionVision] = useState<string>('');
  const [selectedOptionHearing, setSelectedOptionHearing] = useState<string>('');
  const [selectedOptionAlcoholic, setSelectedOptionAlcoholic] = useState<string>('');
  const [selectedOptionSmoker, setSelectedOptionSmoker] = useState<string>('');
  const [medicines, setMedicines] = useState<string>('');
  const [specificMedicines, setSpecificMedicines] = useState<string>('');
  const [physicalActivity, setPhysicalActivity] = useState<string>('');
  const [fallHistory, setFallHistory] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  
  const handlesetsetFallHistorychange = (e: string) => setFallHistory(e);
  const handlesetPhysicalActivitychange = (e: string) => setPhysicalActivity(e);
  const handleSpecificMedicineschange = (e: string) => setSpecificMedicines(e);
  const handleSelectionChangeAlcoholic = (e: string) => setSelectedOptionAlcoholic(e);
  const handleSelectionChangeSmoker = (e: string) => setSelectedOptionSmoker(e);
  const handleSelectionChangeHearing = (e: string) => setSelectedOptionHearing(e);
  const handleSelectionChangeVision = (e: string) => setSelectedOptionVision(e);
  const handleSelectionChangeSleep = (e: string) => setSelectedOptionSleep(e);
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    selectedOption: '',
    selectedOptions: [] as string[],});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prevData => {
        // Para checkboxes, atualizamos o array selectedOptions
        const newValues = checked
          ? [...prevData.selectedOptions, value]
          : prevData.selectedOptions.filter(v => v !== value);
        
        return {
          ...prevData,
          selectedOptions: newValues,
        };
      });
    } else {
      // Para outros inputs (text, select, etc.)
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (birthdate) {
      setAge(calculateAge(birthdate).toString());
    } else {
      setAge('');
    }
  }, [birthdate]);

  const calculateAge = (birthdate: string): number => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Todos esses dados tem que estar na tabela
    const data = {
      name,
      email,
      phone,
      birthdate,
      age,
      height,
      cpf,
      weight,
      sleep: selectedOptionSleep,
      vision: selectedOptionVision,
      hearing: selectedOptionHearing,
      alcoholic: selectedOptionAlcoholic,
      smoker: selectedOptionSmoker,
      medicines,
      specificMedicines: specificMedicines ? specificMedicines.split(',') : [],
      physicalActivity,
      fallHistory,
      reason,
      location
    };    
    console.log(data);
    try {
      
    //  await  RegisterPatient({data});
      salvarNoLocalStorage('user', data);
      salvarNoLocalStorage('patient_registration', data);
      saveUnicData("phoneUser", data.phone);
     
     alert('Formulário enviado com sucesso!');
    handleReset();
    navigate('/laudo-sarcopenia');
    } catch (error) {
      console.error('Erro ao enviar o formulário:', error);
      alert('Erro ao enviar o formulário. Tente novamente.');
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setBirthdate('');
    setAge('');
    setHeight('');
    setWeight('');
    setCpf('');
    setSelectedOptionSleep('');
    setSelectedOptionVision('');
    setSelectedOptionHearing('');
    setSelectedOptionAlcoholic('');
    setSelectedOptionSmoker('');
    setMedicines('');
    setSpecificMedicines('');
    setPhysicalActivity('');
    setFallHistory('');
    setReason('');
    setLocation('');
    localStorage.removeItem('userFormData');
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Form
        onSubmit={handleSubmit}
        className="w-100 w-md-75 p-4 p-md-5 bg-white shadow-lg rounded border border-0 form-container"
      >
        <h2 className="text-center mb-4 text-primary">Cadastro de Paciente</h2>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label className="form-label">Nome:</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite o nome completo"
                required
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label className="form-label">E-mail:</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                required
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="phone">
            <Form.Label className="form-label">Telefone (WhatsApp):</Form.Label>
            <Form.Control
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex: 11991234567"
              required
              className="input-field"
              isInvalid={phone !== '' && !/^\d{11}$/.test(phone)}
            />
            <Form.Control.Feedback type="invalid">
              Informe um número de WhatsApp válido com DDD (ex: 11991234567)
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

          <Col md={6}>
            <Form.Group controlId="birthdate">
              <Form.Label className="form-label">Data de Nascimento:</Form.Label>
              <Form.Control
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                placeholder="dd/mm/aaaa"
                required
                className="input-field"
                isInvalid={!!birthdate && new Date(birthdate) > new Date()}
              />
              <Form.Control.Feedback type="invalid">
                A data de nascimento não pode ser no futuro.
              </Form.Control.Feedback>
            </Form.Group>
          </Col>


        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="age">
              <Form.Label className="form-label">Idade:</Form.Label>
              <Form.Control
                type="text"
                value={age}
                readOnly
                placeholder="Idade calculada automaticamente"
                className="input-field"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="height">
              <Form.Label className="form-label">Altura (cm):</Form.Label>
              <Form.Control
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Altura em cm"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group controlId="weight">
              <Form.Label className="form-label">Peso (kg):</Form.Label>
              <Form.Control
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Peso em kg"
                className="input-field"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="cpf">
            <Form.Label className="form-label">CPF:</Form.Label>
            <Form.Control
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
              placeholder="Digite o CPF"
              className="input-field"
              isInvalid={cpf !== '' && !ValidarCPF(cpf)}
            />
            <Form.Control.Feedback type="invalid">
              CPF inválido. Verifique e tente novamente.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        </Row>

      <CheckboxGroup 
          label="Antecedentes Pessoais"
          name="selectedOptions"
          values={formData.selectedOptions}
          onChange={handleChange}
          options={personalBackground}
          inline
        />

        <CheckboxListInput
         label="Sono"
         name="myRadioGroupSleep"
         options={listOptions}
         selectedValue={selectedOptionSleep}
         onChange={handleSelectionChangeSleep}
        />

      <CheckboxListInput
         label="Visão"
         name="myRadioGroupVision"
         options={listOptions}
         selectedValue={selectedOptionVision}
         onChange={handleSelectionChangeVision}
        />

        <CheckboxListInput
         label="Audição"
         name="myRadioGroupHearing"
         options={listOptions}
         selectedValue={selectedOptionHearing}
         onChange={handleSelectionChangeHearing}
        /> 

        <CheckboxListInput
         label="Fumante"
         name="myRadioGroupSmoker"
         options={yesNoOptions}
         selectedValue={selectedOptionSmoker}
         onChange={handleSelectionChangeSmoker}
        />

         <CheckboxListInput
         label="Etilista"
         name="myRadioGroupAlcoholic"
         options={yesNoOptions}
         selectedValue={selectedOptionAlcoholic}
         onChange={handleSelectionChangeAlcoholic}
        />

        <div>
        <h4 className="form-label">Medicamentos</h4>
          <Form.Group controlId="medicines">
              <Form.Label className="form-label">Medicamentos em uso:</Form.Label>
              <Form.Control
                type="text"
                value={medicines}
                onChange={(e) => setMedicines(e.target.value)}
                placeholder="Liste os medicamentos em uso"
                required
                className="input-field"
              />
            </Form.Group>

            <CheckboxListInput
                label="Medicamentos especificos separe por ,"
                name="specificMedicines"
                options={specificListMedicines}
                selectedValue={specificMedicines}
                onChange={handleSpecificMedicineschange}
              />
        </div>

        <div>
        <h5>Você pratica algum tipo de atividade física?
        </h5>
            <CheckboxListInput
                label="Atividade Física"
                name="physicalActivity"
                options={yesNoOptions}
                selectedValue={physicalActivity}
                onChange={handlesetPhysicalActivitychange}
              />
        </div>

        <div>
        <h5>Sofreu alguma queda nos últimos 12 meses?
        </h5>
            <CheckboxListInput
                label="Histórico de Quedas?"
                name="physicalActivityQ"
                options={yesNoOptions}
                selectedValue={fallHistory}
                onChange={handlesetsetFallHistorychange}
              />
        </div>

        <Form.Group controlId="medicines">
              <Form.Label className="form-label">Motivo:              </Form.Label>
              <Form.Control
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Liste os medicamentos em uso"
                required
                className="input-field"
              />
            </Form.Group>

            <Form.Group controlId="location">
              <Form.Label className="form-label">Local:</Form.Label>
              <Form.Control
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Informe o local"
                required
                className="input-field"
              />
            </Form.Group>

        <div className="d-flex justify-content-between mt-3">
          <Button type="submit" variant="primary" className="w-48 custom-btn">
            Enviar
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            variant="outline-secondary"
            className="w-48 custom-btn-reset"
          >
            Redefinir
          </Button>
        </div>
      </Form>
    </Container>
  );
}