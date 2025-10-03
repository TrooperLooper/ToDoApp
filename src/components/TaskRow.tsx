import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import type { Task } from "./types.tsx";

const priorityMap = {
  high: { num: 1, color: "#ea9099" },
  medium: { num: 2, color: "#e8c34a" },
  low: { num: 3, color: "#7cc08c" },
};

interface TaskRowProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void; // Add this line
}

export function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
  onUpdate,
  editingId,
  setEditingId, // Add this parameter
}: TaskRowProps) {
  const [editText, setEditText] = useState(task.text);

  return (
    <div className="flex items-center bg-[#d0e9e2] rounded-lg px-4 py-2">
      <input
        type="checkbox"
        checked={task.status === "done"}
        onChange={() => onToggle(task.id)}
        className="mr-3 h-4 w-4 border border-black rounded-none shadow-none appearance-none checked:bg-[#f5f7ed] checked:border-black checked:after:border-black"
        style={{
          backgroundColor: "#f5f7ed",
          backgroundImage:
            task.status === "done"
              ? "url(\"data:image/svg+xml,%3csvg viewBox='1 1 14 14' fill='black' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")"
              : "",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {editingId === task.id ? (
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => onUpdate(task.id, editText)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onUpdate(task.id, editText);
            if (e.key === "Escape") setEditingId(null);
          }}
          className="flex-1 p-2 border rounded focus:outline-none"
          autoFocus
        />
      ) : (
        <span
          className={`flex-1 ${
            task.status === "done" ? "line-through text-gray-500" : ""
          }`}
          onDoubleClick={() => onEdit(task)}
        >
          {task.text}
        </span>
      )}
      <button onClick={() => onEdit(task)} className="mx-2" aria-label="Edit">
        <FontAwesomeIcon icon={faPencilAlt} style={{ color: "#273532" }} />
      </button>
      <button onClick={() => onDelete(task.id)} className="ml-2">
        <FontAwesomeIcon icon={faTrashCan} style={{ color: "#273532" }} />
      </button>
      <span
        className="w-6 h-6 flex items-center justify-center rounded-full ml-2 text-white font-bold"
        style={{ backgroundColor: priorityMap[task.priority].color }}
      >
        {priorityMap[task.priority].num}
      </span>
    </div>
  );
}
