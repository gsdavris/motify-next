type ProcessSectionProps = {
  section: {
    title?: string | null;
    description?: string | null;
    steps?: string | null;
  };
};

export function ProcessSection({ section }: ProcessSectionProps) {
  let parsedSteps: Array<{
    step?: string | null;
    title?: string | null;
    description?: string | null;
  }> = [];

  if (section.steps) {
    try {
      parsedSteps = JSON.parse(section.steps) as typeof parsedSteps;
    } catch {
      parsedSteps = [];
    }
  }

  const steps = parsedSteps
    .map((item) => ({
      step: item.step || "",
      title: item.title || "",
      description: item.description || "",
    }))
    .filter((item) => item.step || item.title || item.description);

  if (!steps.length) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            {section.title || ""}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {section.description || ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <span className="text-5xl font-display font-bold text-primary/20">
                {item.step}
              </span>
              <h3 className="text-xl font-display font-semibold mt-4 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
