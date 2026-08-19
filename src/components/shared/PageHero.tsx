interface PageHeroProps {
  title: string
  subtitle: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <>
      <h1 className="text-foreground mb-4 text-3xl font-semibold sm:mb-2">
        {title}
      </h1>
      <p className="text-muted-foreground mb-6 text-sm">{subtitle}</p>
    </>
  )
}
