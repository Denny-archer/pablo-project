import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { FaHome, FaUserPlus, FaSignInAlt, FaUserFriends, FaClipboardList, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export function Header() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUser, setUser] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    console.log('loggedInUser', loggedInUser);
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  useEffect(() => {
    const userPatient = localStorage.getItem("user");
    if (userPatient) {
      setUser(true);
    } else {
      setUser(false);
    }
  })

  function handleLogout() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
    localStorage.removeItem("userFormData");
    setIsLoggedIn(false);
    navigate("/login");
  }

  function handleCleanUser() {
    localStorage.removeItem("user");
    localStorage.removeItem("dadosAvaliacao");
    localStorage.removeItem("sarcFResult")
    localStorage.removeItem("patient_registration")
    setIsLoggedIn(false);
    navigate("/");
  }

  
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow-sm">
  <Container>
    <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 text-info">
      🏥 SARCTesT
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-nav" />
    <Navbar.Collapse id="navbar-nav">
      <Nav className="ms-auto align-items-center gap-2 flex-column flex-lg-row">

        <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-1 text-white">
          <FaHome /> Home
        </Nav.Link>

        <Nav.Link as={Link} to="/cadastro-paciente" className="d-flex align-items-center gap-1 text-white">
          <FaUserPlus /> Cadastro
        </Nav.Link>

        {isUser && (
          <>
            <Nav.Link as={Link} to="/laudo-sarcopenia" className="d-flex align-items-center gap-1 text-white">
              <FaClipboardList /> Avaliação de Sarcopenia
            </Nav.Link>
            <Nav.Link as={Link} to="/sarc-form" className="d-flex align-items-center gap-1 text-white">
              <FaFileAlt /> SARC-FORM
            </Nav.Link>
            <Button
              variant="outline-danger"
              onClick={handleCleanUser}
              className="d-flex align-items-center gap-2 w-auto"
            >
              <FaSignOutAlt /> Limpar dados
            </Button>
          </>
        )}

        {
          !isLoggedIn && (
            <Nav.Item>
            <Nav.Link as={Link} to="/login" className="p-0">
              <Button variant="outline-info" className="d-flex align-items-center gap-2 w-100">
                <FaSignInAlt /> Login
              </Button>
            </Nav.Link>
          </Nav.Item>
          )
        }
     

        {isLoggedIn && (
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center gap-2">
            <Button
              variant="outline-danger"
              onClick={handleLogout}
              className="d-flex align-items-center gap-2 w-auto"
            >
              <FaSignOutAlt /> Sair
            </Button>
            <Nav.Link as={Link} to="/gestao-pacientes" className="d-flex align-items-center gap-1 text-white">
              <FaUserFriends /> Relatório
            </Nav.Link>
          </div>
        )}
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

  );
}
