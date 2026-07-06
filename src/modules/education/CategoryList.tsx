import type { EducationCategory } from "../../types/education";

type CategoryListProps = {
  categories: EducationCategory[];
  activeCategory: string;
  allLabel: string;
  title: string;
  onSelect: (categoryId: string) => void;
};

function CategoryList({
  categories,
  activeCategory,
  allLabel,
  title,
  onSelect,
}: CategoryListProps) {
  return (
    <section>
      <h2 className="mb-3 mt-5 text-[18px] font-extrabold text-black">{title}</h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onSelect("all")}
          className={`shrink-0 rounded-[6px] border-2 px-3 py-2 text-[13px] font-extrabold transition-colors ${
            activeCategory === "all"
              ? "border-[var(--color-primary)] bg-[#e8f6ee] text-[#0c6f35]"
              : "border-transparent bg-white text-gray-800"
          }`}
        >
          {allLabel}
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            className={`shrink-0 rounded-[6px] border-2 bg-white px-3 py-2 text-[13px] font-extrabold text-gray-800 transition-colors ${
              activeCategory === category.id ? "bg-[#e8f6ee] text-[#0c6f35]" : ""
            }`}
            style={{ borderColor: activeCategory === category.id ? category.color : "transparent" }}
          >
            {category.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryList;
