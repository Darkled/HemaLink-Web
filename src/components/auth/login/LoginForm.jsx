import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import AuthContext from "../../../services/authContext/AuthContext.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login, setModalView } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(username, password);
    if (res.ok) {
      navigate("/");
    } else {
      setError(res.message || "Invalid credentials");
    }
  };

  return (
    <div>
      <h5 className="mb-3">Sign In</h5>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-2" controlId="formUser">
          <Form.Control
            type="text"
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

        <div className="d-flex justify-content-between align-items-center mb-3">
          <a href="#" onClick={(e) => { e.preventDefault(); setModalView('register'); }}>Register</a>
        </div>

        <div className="d-grid">
          <Button type="submit" variant="danger">
            Sign In
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
