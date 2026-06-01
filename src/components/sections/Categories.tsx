import { CATEGORIES } from "@/lib/categories";

export function Categories() {
  return (
    <section id="categories" className="container-page py-20 md:py-28">
      <div className="max-w-2xl">
        <span className="eyebrow">Categories on Katalok</span>
        <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl">
          Every kind of beauty <span className="italic text-mocha">pro</span>
        </h2>
        <p className="mt-4 text-muted-foreground">
          From braids to lashes — if you do it, clients will find you for it.
        </p>
      </div>

      <ul className="mt-10 flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <li
            key={c}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-[var(--shadow-soft)] transition-colors hover:border-mocha/40 hover:bg-secondary"
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
