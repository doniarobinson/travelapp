type CardProps = {
  name: string;
  address: string;
  rating: string;
};

export default function Card({ name, address, rating }: CardProps) {
  return (
    <div className="container">
      <div className="left">
        {name}
        {address}
      </div>
      <div className="right">{rating}</div>
    </div>
  );
}
