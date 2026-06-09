function Card({ title, value, description }) {
  return (
    <div className="card">
      <span className="card-title">{title}</span>
      <h2 className="card-value">{value}</h2>
      <p className="card-description">{description}</p>
    </div>
  );
}

export default Card;