import type { EducationCategory } from "../../types/education";

type CategoryListProps = {
  categories: EducationCategory[];
  activeCategory: string;
  allLabel: string;
  onSelect: (categoryId: string) => void;
};

function CategoryList({
  categories,
  activeCategory,
  allLabel,
  onSelect,
}: CategoryListProps) {
  return (
    <section className="mb-1">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          type="button"
          onClick={() => onSelect("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-200 ${
            activeCategory === "all"
              ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
              : "border-transparent bg-gray-200/50 text-gray-600 hover:bg-gray-200/80"
          }`}
        >
          {allLabel}
        </button>

        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-200 ${
                isActive
                  ? "text-white shadow-sm border-transparent"
                  : "border-transparent bg-gray-200/50 text-gray-600 hover:bg-gray-200/80"
              }`}
              style={
                isActive
                  ? { backgroundColor: category.color }
                  : undefined
              }
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryList;
