import { useState, useRef, useEffect } from "react";
import { TaskRow } from "./TaskRow";
import type { Task, Priority } from "./Types";
import Weather from "./weather";
import { FilterIcon } from "./FilterIcon";
const headerImg = "/headerimg.png";
import { FaSearch } from "react-icons/fa";

const initialTasks: Task[] = [
  // Example tasks or fetch from storage/api
];

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("low");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [searchText, setSearchText] = useState("");
  const [sortByPriority, setSortByPriority] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        console.error("Failed to load tasks from localStorage");
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add Task
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        priority: newPriority,
        status: "pending",
      },
    ]);
    setNewTask("");
    setNewPriority("low");
  };

  // Toggle Complete
  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, status: task.status === "pending" ? "done" : "pending" }
          : task,
      ),
    );
  };

  // Delete Task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Start Editing
  const handleEdit = (task: Task) => {
    setEditingId(task.id);
  };

  // Update Task
  const updateTask = (id: number, text: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
    setEditingId(null);
  };

  // Filtered & Searched Tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "pending") return task.status === "pending";
      if (filter === "done") return task.status === "done";
      return true; // "all"
    })
    .filter((task) =>
      task.text.toLowerCase().includes(searchText.toLowerCase()),
    );

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const displayedTasks = sortByPriority
    ? [...filteredTasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
      )
    : filteredTasks;

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#e0f0ec] py-6 sm:py-10 px-4 gap-6 sm:gap-10">
      {/* Outer card with darker green */}
      <div className="w-full max-w-sm sm:max-w-md bg-[#a6ccbf] rounded-2xl p-4 sm:p-6 flex flex-col flex-1 min-h-0">
        {/* Main card with black border and no color */}
        <div className="w-full border-2 border-black p-4 sm:p-5 flex flex-col flex-1 min-h-0">
          {/* Header image now inside the card */}
          <img
            src={headerImg}
            alt="Today's 2DO Header"
            className="mx-auto mt-1 mb-6 sm:mb-7 w-40 sm:w-56"
          />
          {/* Labels above the bar */}
          <div className="flex justify-between items-center mb-2 sm:mb-3 px-2">
            <span className="text-xs sm:text-sm font-semibold text-black">
              What should we do today?
            </span>
            <span className="text-xs sm:text-sm font-semibold text-black">
              Priority
            </span>
          </div>
          {/* Add Task Bar (input + select) */}
          <div className="flex flex-col sm:flex-row w-full mb-3 sm:mb-4 items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex bg-[#f5f7ed] rounded-lg shadow-inner items-center px-2 py-1 flex-1 relative">
              <input
                className="min-w-0 flex-1 p-2 rounded-l #fcf6ee text-xs sm:text-sm text-black placeholder-gray-400 border-none focus:outline-none bg-transparent"
                placeholder="To do..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <div className="flex-1" />
              {/* Priority select button with background */}
              <div className="relative flex items-center bg-black/10 rounded px-2 py-1 ml-1 gap-1.5">
                <span className="text-xs sm:text-sm font-semibold text-black min-w-fit">
                  {newPriority === "low"
                    ? "Low"
                    : newPriority === "medium"
                      ? "Med"
                      : "High"}
                </span>
                <select
                  ref={selectRef}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Priority)}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                  className="pointer-events-none flex-shrink-0"
                >
                  <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <button
              className="bg-[#70938b] text-white text-sm sm:text-base px-6 sm:px-4 py-2 sm:py-3 rounded-md min-h-[44px] w-full sm:w-auto sm:h-full"
              onClick={addTask}
            >
              ADD
            </button>
          </div>
          {/* Tabs and Search Row */}
          <div className="flex items-center w-full mb-2 sm:mb-3 h-10 sm:h-12 gap-1 sm:gap-2">
            {/* Filter Buttons */}
            <div className="flex gap-1 sm:gap-2">
              <button
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
                  filter === "all" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
                  filter === "pending" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded text-xs sm:text-sm ${
                  filter === "done" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("done")}
              >
                Done
              </button>
            </div>
            {/* Spacer to push search and filter icon to the right */}
            <div className="flex-1"></div>
            {/* Search Input + Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {showSearch && (
                <input
                  className="p-1 sm:p-2 text-xs sm:text-sm rounded bg-[#d8e0d2] border-none focus:outline-none transition-all duration-200 w-20 sm:w-32"
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              )}
              <button
                className="p-1 cursor-pointer"
                onClick={() => setShowSearch((prev) => !prev)}
                aria-label="Toggle search"
              >
                <FaSearch
                  className="text-[#273532]"
                  style={{ width: "16px", height: "16px" }}
                />
              </button>
            </div>
            {/* Filter Icon aligned right and centered */}
            <div className="flex items-center h-full ml-1 sm:ml-2 mr-2 sm:mr-4">
              <FilterIcon
                className="w-5 h-5 sm:w-6 sm:h-6"
                onClick={() => setSortByPriority((prev) => !prev)}
              />
            </div>
          </div>
          {/* Task List */}
          <div className="w-full space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-1 overflow-y-auto">
            {displayedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onUpdate={updateTask}
                editingId={editingId}
              />
            ))}
          </div>

          {/* Dotted line separator */}
          <div className="my-4 sm:my-6 mx-1 mt-auto">
            <hr className="border-dotted border-t-2 border-gray-400" />
          </div>

          {/* Weather Widget */}
          <div className="mt-3 sm:mt-4 w-full flex justify-center pb-2">
            <Weather />
          </div>
        </div>
      </div>
    </div>
  );
}
