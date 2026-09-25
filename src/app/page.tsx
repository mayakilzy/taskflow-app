"use client";
import { useState, useEffect } from "react";

type Priority = "high" | "medium" | "low";
type Task = { id: string; text: string; priority: Priority; done: boolean };
type Filter = "all" | Priority;

const priorityColors: Record<Priority, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const saved = localStorage.getItem("taskflow");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("taskflow", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: input.trim(), priority, done: false }]);
    setInput("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    return t.priority === filter;
  });

  const sortedTasks = [...filtered].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-emerald-400">✦</span> TaskFlow
          </h1>
          <p className="text-sm text-zinc-500 mt-1">Priority-based · Dark mode · LocalStorage</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Add a task..."
              className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="rounded-lg bg-zinc-800 border border-zinc-700 px-2 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button onClick={addTask} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors">Add</button>
          </div>
          <div className="flex gap-1">
            {(["all", "high", "medium", "low"] as Filter[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1 text-xs font-medium capitalize transition-colors ${filter === f ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}
              >{f}</button>
            ))}
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {sortedTasks.length === 0 ? (
              <p className="text-center text-sm text-zinc-600 py-8">No tasks yet. Add one above!</p>
            ) : (
              sortedTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg bg-zinc-800/50 px-3 py-2 group">
                  <button onClick={() => toggleTask(task.id)}
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${task.done ? "bg-emerald-500 border-emerald-500" : "border-zinc-600 hover:border-emerald-500"}`}
                  >{task.done && <span className="text-xs text-white">✓</span>}</button>
                  <span className={`h-2 w-2 rounded-full ${priorityColors[task.priority]}`} />
                  <span className={`flex-1 text-sm ${task.done ? "line-through text-zinc-600" : "text-zinc-200"}`}>{task.text}</span>
                  <span className="text-[9px] font-mono uppercase text-zinc-500">{task.priority}</span>
                  <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">✕</button>
                </div>
              ))
            )}
          </div>
          {tasks.length > 0 && (
            <div className="flex items-center justify-between pt-2 text-xs text-zinc-500">
              <span>{tasks.filter((t) => !t.done).length} active</span>
              <span>{tasks.length} total</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}