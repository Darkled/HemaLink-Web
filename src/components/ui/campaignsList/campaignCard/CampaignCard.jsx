import { Card, Button, Badge, Modal, Form } from "react-bootstrap";
import React, { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilCalendar, cilLocationPin, cilDrop } from "@coreui/icons";
import "./campaignCard.css";

const CampaignCard = ({
  id,
  entityName,
  bloodType,
  date,
  location,
  units,
  status,
}) => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState({});

  const openModal = () => setShow(true);
  const closeModal = () => {
    setShow(false);
    setEmail("");
    setFullName("");
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Email is invalid";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    alert("Thanks! You've been signed up to donate. (Demo)");
    closeModal();
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "success";
      case "Urgent":
        return "danger";
      case "Completed":
        return "info";
      default:
        return "secondary";
    }
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      "O+": "danger",
      "O-": "danger",
      "A+": "primary",
      "A-": "primary",
      "B+": "success",
      "B-": "success",
      "AB+": "warning",
      "AB-": "warning",
    };
    return colors[bloodType] || "dark";
  };

  const getBaiduMapUrl = (lng, lat, title, content) => {
    const params = new URLSearchParams({
      lng,
      lat,
      title,
      content,
      output: "html",
    });
    return `https://api.map.baidu.com/lbsapi/getpoint/index.html?${params.toString()}`;
  };

  return (
    <Card
      key={id}
      className="d-flex flex-column campaign-card"
    >
      <Card.Body className="d-flex flex-column flex-grow-1">
        <Card.Header className="bg-transparent border-0 p-0 m-0 d-flex justify-content-between align-items-center">
          <Card.Title>{entityName}</Card.Title>
          <Badge className="bloodtype-font" bg={getBloodTypeColor(bloodType)}>
            {bloodType}
          </Badge>
        </Card.Header>
        <Card.Subtitle className={`mb-4 text-${getStatusColor(status)}`}>
          {status}
        </Card.Subtitle>
        <div className="mb-3">
          <div className="d-flex align-items-center gap-2">
            <CIcon icon={cilCalendar} className="nav-icon" />
            {date}
          </div>
          <div className="d-flex align-items-center gap-2">
            <CIcon icon={cilLocationPin} className="nav-icon" />
            {location}
          </div>
          <div className="d-flex align-items-center gap-2">
            <CIcon icon={cilDrop} className="nav-icon" />
            {units}
          </div>
        </div>
        {!(window.localStorage.getItem("hemalink-auth") && JSON.parse(window.localStorage.getItem("hemalink-auth")).role === "Admin") && (
          <div className="d-flex justify-content-end mt-auto">
            <Button
              variant="outline-primary"
              size="sm"
              className="details-btn"
              onClick={openModal}
            >
              I Want to Donate
            </Button>
          </div>
        )}
      </Card.Body>

      <Modal show={show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Donate — {entityName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <strong>Location:</strong> {location}
          </div>
          <iframe
            title="baidu-map"
            src={getBaiduMapUrl(116.404, 39.915, entityName, location)}
            style={{ width: "100%", height: 200, border: 0 }}
            allowFullScreen
          />

          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-2" controlId="fullName">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                isInvalid={!!errors.fullName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end mt-3">
              <Button variant="secondary" onClick={closeModal} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Sign Up
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default CampaignCard;
