type CardProps = {
  name: string;
  vicinity: string;
  rating: string;
};

export default function Card({ name, vicinity, rating }: CardProps) {
  return (
    <div className="cardContainer">
      <div className="left">
        <h3>{name}</h3>
        <p>{vicinity}</p>
      </div>
      <div className="right">
        <h3>{rating}</h3>
      </div>
    </div>
  );
}
