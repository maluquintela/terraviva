import React from "react";
import { Link } from "react-router-dom";
import "./mainButton.css";

export default function MainButton({ to, icon: Icon, label, state }) {
  return (
    <Link to={to} state={state} className="main-button">
      <span className="main-button__icon">
        <Icon size={24} strokeWidth={1.6} />
      </span>
      <span className="main-button__label">{label}</span>
    </Link>
  );
}

