const Rating = ({ value = 0 }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <span key={star} className={star <= Math.round(value) ? "text-amber-500" : "text-stone-300"}>
          ?
        </span>
      ))}
      <span className="ml-1 text-sm text-stone-500">{value.toFixed(1)}</span>
    </div>
  );
};

export default Rating;
