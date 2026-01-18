type ProjectCardMediaProps = {
  title: string;
  gradient: string;
  image?: string;
  aspectClass: string;
};

export function ProjectCardMedia({
  title,
  gradient,
  image,
  aspectClass,
}: ProjectCardMediaProps) {
  return (
    <div
      className={`${aspectClass} flex items-center justify-center relative overflow-hidden ${
        image ? "bg-center bg-cover" : "bg-linear-to-br"
      } ${image ? "" : gradient}`}
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      {image ? (
        <div className={`absolute inset-0 bg-linear-to-br ${gradient} opacity-70`} />
      ) : null}
      <span className="relative z-10 font-display text-4xl font-bold text-foreground/15">
        {title}
      </span>
      <div className="absolute inset-0 bg-linear-to-t from-card/70 to-transparent" />
    </div>
  );
}
