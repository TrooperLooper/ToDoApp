import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import type { Task } from "./types.tsx";

const priorityMap = {
  high: { num: 1, color: "bg-red-500" },
  medium: { num: 2, color: "bg-yellow-400" },
  low: { num: 3, color: "bg-green-500" },
};

type TaskRowProps = {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, text: string) => void;
  editingId: number | null;
};

export function TaskRow({
  task,
  onToggle,
  onEdit,
  onDelete,
  onUpdate,
  editingId,
}: TaskRowProps) {
  const [editText, setEditText] = useState(task.text);

  return (
    <div className="flex items-center bg-[#e0f0ec] rounded-lg px-4 py-2">
      <input
        type="checkbox"
        checked={task.status === "done"}
        onChange={() => onToggle(task.id)}
        className="mr-3 h-5 w-5 accent-blue-500"
      />
      {editingId === task.id ? (
        <input
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={() => onUpdate(task.id, editText)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onUpdate(task.id, editText);
            if (e.key === "Escape") onEdit({ id: null, text: "" });
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
      <button
        onClick={() => onEdit(task)}
        className="mx-2 text-gray-600 hover:text-blue-600"
        aria-label="Edit"
      >
        <FontAwesomeIcon icon={faPencilAlt} />
      </button>
      <button onClick={() => onDelete(task.id)} className="ml-2">
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
      <span
        className={`w-6 h-6 flex items-center justify-center rounded-full ml-2 text-white font-bold ${
          task.priority === "high"
            ? "bg-red-400"
            : task.priority === "medium"
            ? "bg-yellow-400"
            : "bg-green-400"
        }`}
      >
        {task.priority === "high"
          ? "1"
          : task.priority === "medium"
          ? "2"
          : "3"}
      </span>
    </div>
  );
}
