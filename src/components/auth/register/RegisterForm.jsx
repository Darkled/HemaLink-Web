import { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import AuthContext from "../../../services/authContext/AuthContext.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const { setModalView, register } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const res = await register(name, email, password);
    if (res.ok) {
      setSuccess("Registration successful. You may now sign in.");
      setTimeout(() => setModalView("login"), 1200);
    } else {
      setError(res.message || "Registration failed");
    }
  };

  return (
    <div>
      <h5 className="mb-3">Register</h5>
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-2" controlId="formName">
          <Form.Control
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <div className="d-grid mb-2">
          <Button type="submit" variant="primary">
            Create Account
          </Button>
        </div>
        <div className="text-center">
          <a href="#" onClick={(e) => { e.preventDefault(); setModalView('login'); }}>Back to login</a>
        </div>
      </Form>
    </div>
  );
};

export default Register;
