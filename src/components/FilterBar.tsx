import { FilterIcon } from "./FilterIcon";
import type { FilterStatus } from "./types";

export type Status = "all" | "pending" | "done";

export type FilterBarProps = {
  filter: FilterStatus;
  setFilter: React.Dispatch<React.SetStateAction<FilterStatus>>;
  onSortClick: () => void;
  sorted: boolean;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
};

export function FilterBar({
  setFilter,
  onSortClick,
  sorted,
  setShowSearch,
}: FilterBarProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter("all")}
          className="px-2 py-1 rounded bg-gray-200"
        >
          All
        </button>
        <button
          onClick={() => setFilter("pending")}
          className="px-2 py-1 rounded bg-yellow-200"
        >
          Pending
        </button>
        <button
          onClick={() => setFilter("done")}
          className="px-2 py-1 rounded bg-green-200"
        >
          Completed
        </button>
      </div>
      <div className="flex items-center">
        <FilterIcon
          className={`w-8 h-8 hover:opacity-60 transition-opacity cursor-pointer ${
            sorted ? "opacity-60" : ""
          }`}
          onClick={onSortClick}
        />
        <button
          type="button"
          className="ml-2 text-gray-600 hover:text-blue-500"
          onClick={() => setShowSearch((any) => !any)}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>
  );
}
