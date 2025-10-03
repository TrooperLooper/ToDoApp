import { useEffect, useState, useRef } from "react";
import { TaskRow } from "./TaskRow";
import type { Task, Priority, FilterStatus } from "./types";
import Weather from "./weather";
import { FilterIcon } from "./FilterIcon";
import headerImg from "../assets/headerimg.png";
import { FaSearch } from "react-icons/fa";

const initialTasks: Task[] = [];

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("low");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [searchText, setSearchText] = useState("");
  const [sortByPriority, setSortByPriority] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    const taskToToggle = tasks.find((task) => task.id === id);
    const newStatus = taskToToggle?.status === "pending" ? "done" : "pending";

    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );

    // Add a visually hidden announcement for screen readers
    const announcement = document.createElement("div");
    announcement.className = "sr-only";
    announcement.setAttribute("aria-live", "polite");
    announcement.textContent = `Task ${taskToToggle?.text} marked as ${newStatus}`;
    document.body.appendChild(announcement);

    // Reader will read the announcement, then remove it after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Delete Task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Start Editing
  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setNewTask(task.text);
  };

  // Update Task
  const updateTask = (id: number, text: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, text } : task)));
    setEditingId(null);
    setNewTask("");
  };

  // Filtered & Searched Tasks
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "pending") return task.status === "pending";
      if (filter === "done") return task.status === "done";
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(searchText.toLowerCase())
    );

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const displayedTasks = sortByPriority
    ? [...filteredTasks].sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      )
    : filteredTasks;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#e0f0ec] py-4 sm:py-8 md:py-16">
      <div className="w-[90%] sm:w-[85%] md:w-[80%] max-w-xl bg-[#a6ccbf] rounded-2xl p-4 sm:p-6 md:p-8 flex justify-center items-center">
        <div className="w-full max-w-lg border-2 border-black p-3 sm:p-4 md:p-6">
          <h1 className="sr-only">Today's 2DO Task Manager</h1>
          <img
            src={headerImg}
            alt="Today's 2DO - Task Manager Header"
            className="mx-auto mt-1 mb-4 sm:mb-8 w-56 sm:w-72"
          />
          <div className="flex justify-between items-center mb-1 px-2">
            <h2 className="text-xs font-semibold text-black">
              What should we do today?
            </h2>
            <h2 className="text-xs font-semibold text-black mr-19">Priority</h2>
          </div>
          <div className="flex w-full mb-4 items-center">
            <div className="flex bg-[#f5f7ed] rounded-lg shadow-inner items-center px-2 py-1 flex-1 relative">
              <input
                className="min-w-0 max-w-[220px] p-2 rounded-l text-black placeholder-gray-400 border-none focus:outline-none bg-transparent"
                placeholder="To do..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <div className="flex-1" />

              <div
                className="relative flex items-center"
                ref={dropdownRef}
                role="combobox"
                aria-expanded={isPriorityOpen}
                aria-controls="priority-listbox"
                aria-haspopup="listbox"
              >
                <div
                  className="p-2 pr-8 rounded text-transparent focus:text-black"
                  style={{ minWidth: "70px" }}
                  id="priority-value"
                  aria-label={`Selected priority: ${newPriority}`}
                >
                  {newPriority.charAt(0).toUpperCase() + newPriority.slice(1)}
                </div>

                <span
                  className="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center"
                  onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault(); // Prevents page scroll on space
                      setIsPriorityOpen(!isPriorityOpen);
                    }
                  }}
                  tabIndex={0}
                  aria-label="Open priority select"
                  role="button"
                >
                  <svg
                    width="12"
                    height="8"
                    viewBox="0 0 12 8"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="2" />
                  </svg>
                </span>

                {isPriorityOpen && (
                  <div
                    className="absolute top-full right-0 mt-1 bg-white shadow-lg rounded z-20 w-24"
                    role="listbox"
                    id="priority-listbox"
                    aria-labelledby="priority-value"
                  >
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setNewPriority("high");
                        setIsPriorityOpen(false);
                      }}
                      role="option"
                      aria-selected={newPriority === "high"}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setNewPriority("high");
                          setIsPriorityOpen(false);
                        }
                      }}
                    >
                      High
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setNewPriority("medium");
                        setIsPriorityOpen(false);
                      }}
                      role="option"
                      aria-selected={newPriority === "medium"}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setNewPriority("medium");
                          setIsPriorityOpen(false);
                        }
                      }}
                    >
                      Medium
                    </div>
                    <div
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setNewPriority("low");
                        setIsPriorityOpen(false);
                      }}
                      role="option"
                      aria-selected={newPriority === "low"}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setNewPriority("low");
                          setIsPriorityOpen(false);
                        }
                      }}
                    >
                      Low
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              className="bg-[#70938b] text-white text-lg px-4 h-full rounded-md ml-3"
              onClick={addTask}
              style={{ minHeight: "44px" }}
              aria-label="Add new task"
            >
              ADD
            </button>
          </div>
          <div className="flex flex-wrap xs:flex-nowrap items-center w-full mb-1 h-10 sm:h-12">
            <div className="flex space-x-1">
              <button
                className={`px-1 sm:px-2 py-1 rounded text-xs ${
                  filter === "all" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("all")}
                aria-pressed={filter === "all"}
                aria-label="Show all tasks"
              >
                All
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "pending" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("pending")}
                aria-pressed={filter === "pending"}
                aria-label="Show pending tasks"
              >
                Pending
              </button>
              <button
                className={`px-2 py-1 rounded text-xs ${
                  filter === "done" ? "bg-[#d8e0d2]" : ""
                }`}
                onClick={() => setFilter("done")}
                aria-pressed={filter === "done"}
                aria-label="Show completed tasks"
              >
                Done
              </button>
            </div>
            <div className="flex-1"></div>
            <div className="flex items-center ml-auto">
              {showSearch && (
                <input
                  className="p-1 text-xs rounded bg-[#dae4d3] border-none focus:outline-none transition-all duration-200 mr-1"
                  style={{ width: 180 }}
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  aria-label="Search tasks"
                  // Safe keyboard enhancement
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchText("");
                    }
                  }}
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
              <FilterIcon
                className={`w-5 h-5 sm:w-6 sm:h-6 ml-1 mr-1 sm:mr-3 text-[#273532]`}
                onClick={() => setSortByPriority((prev) => !prev)}
                aria-label={
                  sortByPriority
                    ? "Disable priority sorting"
                    : "Enable priority sorting"
                }
                aria-pressed={sortByPriority}
              />
            </div>
          </div>
          <div className="w-full space-y-2 mb-15">
            {displayedTasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onUpdate={updateTask}
                editingId={editingId}
                setEditingId={setEditingId}
              />
            ))}
          </div>

          <div className="my-4 sm:my-6 mx-1 sm:mx-2">
            <hr className="border-dotted border-t-2 border-gray-400" />
          </div>

          {/* Weather Component */}
          <div className="mt-4 w-full flex justify-center">
            <Weather />
          </div>

          {/* Screen reader announcement and no tasks message */}
          <div className="sr-only" aria-live="polite">
            {displayedTasks.length} tasks displayed.
            {filter !== "all" && ` Filtered by ${filter} status.`}
            {sortByPriority && " Sorted by priority."}
            {searchText && " Filtered by search text."}
          </div>
          {displayedTasks.length === 0 && (searchText || filter !== "all") && (
            <div className="text-center py-4">
              <p>No tasks match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
