import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Container, Button, Card, Spinner, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion"; // <-- novo
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/home.css"; // <-- mantém seu CSS

export function Home() {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showWelcome) {
    return (
      <motion.div
        className="d-flex flex-column justify-content-center align-items-center vh-100 bg-gradient-pixeon text-white"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Bem-vindo ao SaRCTesT
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Carregando...
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Spinner animation="border" role="status" variant="light" />
        </motion.div>
      </motion.div>
    );
  } 

  return (
    <div className="home-container bg-gradient-pixeon text-white" style={{ minHeight: "100%", marginTop: 0, paddingTop: 0}}>
    <Container className="py-5">
      <Row className="align-items-center">
        {/* Coluna com texto explicativo */}
        <Col md={6} className="mb-4 mb-md-0">
          <h1 className="display-4 fw-bold">Bem-vindo ao Sistema SARCTest</h1>
          <p className="lead">
          Interface para avaliação de indicativo de sarcopenia em pessoas idosas
          Rastreie a saúde muscular de pessoas idosas.
          Realize avaliações e obtenha resultados de forma rápida e prática.
          </p>
        </Col>

        <Col md={6} className="d-flex justify-content-center">
      <Card className="home-card text-center shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <Card.Body className="border-bottom">
          <h2 className="mb-4 text-primary">Cadastre-se</h2>
          <Button
            variant="light"
            size="lg"
            className="btn-custom"
            onClick={() => navigate("/cadastro-paciente")}
          >
            Cadastrar Paciente
          </Button>
        </Card.Body>
        <Card.Body>
          <h2 className="mb-4 text-primary">Login</h2>
          <Button
            variant="light"
            size="lg"
            className="btn-custom"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Card.Body>
      </Card>
    </Col>
      </Row>
    </Container>
  </div>
  );
}
