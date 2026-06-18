import "./Card.css";

function Card({ title, value, description }) {
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      <h2 className="card-value">{value}</h2>
      <span className="card-description">
        {description}
      </span>
    </div>
  );
}

export default Card;