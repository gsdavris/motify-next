type TeamSectionProps = {
  section: {
    title?: string | null;
    description?: string | null;
    team?: string | null;
  };
};

export function TeamSection({ section }: TeamSectionProps) {
  let parsedTeam: Array<{
    name?: string | null;
    role?: string | null;
  }> = [];

  if (section.team) {
    try {
      parsedTeam = JSON.parse(section.team) as typeof parsedTeam;
    } catch {
      parsedTeam = [];
    }
  }

  const members = parsedTeam
    .map((member) => {
      const name = member.name || "";
      const initial = name
        .split(" ")
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return {
        name,
        role: member.role || "",
        initial,
      };
    })
    .filter((member) => member.name || member.role);

  if (!members.length) return null;

  const columnsClass =
    members.length <= 2
      ? "grid-cols-2"
      : members.length === 3
      ? "grid-cols-3"
      : "grid-cols-2 md:grid-cols-4";

  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {section.title || ""}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {section.description || ""}
          </p>
        </div>

        <div className={`grid ${columnsClass} gap-6 max-w-4xl mx-auto`}>
          {members.map((member) => (
            <div key={member.name} className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-card border border-border/50 flex items-center justify-center mb-4">
                <span className="text-2xl font-display font-bold text-primary">
                  {member.initial}
                </span>
              </div>
              <h3 className="font-display font-semibold">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
