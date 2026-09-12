"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { theme } from "@/lib/theme";

type TodoPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type TodoFilter = "ALL" | "PENDING" | "COMPLETED" | "MISSED";

interface Todo {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  deadline?: string | null;
  important?: boolean;
}

interface TodoForm {
  title: string;
  description: string;
  priority: TodoPriority;
  deadline: string;
  important: boolean;
}

const emptyForm: TodoForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  deadline: "",
  important: false,
};

const filters: TodoFilter[] = ["ALL", "PENDING", "COMPLETED", "MISSED"];
const priorities: TodoPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const xpMap: Record<TodoPriority, number> = {
  LOW: 5,
  MEDIUM: 10,
  HIGH: 20,
  CRITICAL: 40,
};

const priorityColor: Record<TodoPriority, string> = {
  LOW: theme.green,
  MEDIUM: theme.gold,
  HIGH: theme.accent,
  CRITICAL: theme.danger,
};

function getTodoStatus(todo: Todo): Exclude<TodoFilter, "ALL"> {
  if (todo.completed) return "COMPLETED";
  if (todo.deadline) {
    const deadline = new Date(todo.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!Number.isNaN(deadline.getTime()) && deadline < today) {
      return "MISSED";
    }
  }

  return "PENDING";
}

function formatDeadline(deadline?: string | null) {
  if (!deadline) return "No deadline";

  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return deadline;

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function deadlineToInputValue(deadline?: string | null) {
  return deadline ? deadline.split("T")[0] : "";
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("ALL");
  const [form, setForm] = useState<TodoForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function fetchTodos() {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not load missions.");
        return;
      }

      setTodos(data);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTodos = useMemo(() => {
    if (filter === "ALL") return todos;
    return todos.filter((todo) => getTodoStatus(todo) === filter);
  }, [filter, todos]);

  const totalXP = useMemo(
    () =>
      todos
        .filter((todo) => todo.completed)
        .reduce((sum, todo) => sum + xpMap[todo.priority], 0),
    [todos],
  );

  async function handleSubmit() {
    const title = form.title.trim();
    if (!title || submitting) return;

    const payload = {
      ...form,
      title,
      description: form.description.trim(),
      deadline: form.deadline || undefined,
    };

    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        const res = await fetch("/api/todos", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Could not update mission.");
          return;
        }

        setTodos((prev) =>
          prev.map((todo) =>
            todo._id === editingId ? { ...todo, ...payload } : todo,
          ),
        );
      } else {
        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Could not add mission.");
          return;
        }

        setTodos((prev) => [data, ...prev]);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  async function markComplete(todo: Todo) {
    if (todo.completed) return;

    setError("");

    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todo._id, completed: true }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not complete mission.");
        return;
      }

      setTodos((prev) =>
        prev.map((item) =>
          item._id === todo._id ? { ...item, completed: true } : item,
        ),
      );
      setXpPopup(xpMap[todo.priority]);
      setTimeout(() => setXpPopup(null), 1800);
    } catch {
      setError("Could not reach the server.");
    }
  }

  function editTodo(todo: Todo) {
    setForm({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      deadline: deadlineToInputValue(todo.deadline),
      important: Boolean(todo.important),
    });
    setEditingId(todo._id);
    setShowForm(true);
  }

  async function deleteTodo(id: string) {
    setError("");

    try {
      const res = await fetch("/api/todos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not delete mission.");
        return;
      }

      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch {
      setError("Could not reach the server.");
    }
  }

  return (
    <div style={{ padding: 32 }}>
      <AnimatePresence>
        {xpPopup !== null && (
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 28,
              right: 28,
              zIndex: 50,
              background: theme.green,
              color: "#03140a",
              padding: "12px 20px",
              borderRadius: 12,
              fontWeight: 800,
              boxShadow: "0 20px 50px rgba(34,197,94,0.35)",
            }}
          >
            +{xpPopup} XP
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <p
            style={{
              color: theme.accent,
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: 3,
            }}
          >
            WORKOUT LOG
          </p>
          <h1
            style={{
              color: theme.textPrimary,
              fontSize: 48,
              letterSpacing: 2,
              lineHeight: 1,
            }}
          >
            TODAY&apos;S MISSIONS
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              color: theme.gold,
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            TOTAL XP: {totalXP}
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setShowForm((prev) => !prev);
              if (!showForm) {
                setEditingId(null);
                setForm(emptyForm);
              }
            }}
            style={{
              background: theme.gradient,
              border: "none",
              borderRadius: 10,
              padding: "12px 20px",
              color: "#fff",
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: 1,
              cursor: "pointer",
            }}
          >
            {showForm ? "CLOSE" : "+ ADD TASK"}
          </motion.button>
        </div>
      </div>

      {error && (
        <div
          style={{
            color: theme.danger,
            background: `${theme.danger}12`,
            border: `1px solid ${theme.danger}35`,
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <input
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="Mission title"
                style={inputStyle}
              />
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Mission description"
                style={{ ...inputStyle, minHeight: 46 }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto auto",
                gap: 12,
                alignItems: "center",
              }}
            >
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    priority: event.target.value as TodoPriority,
                  }))
                }
                style={inputStyle}
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={form.deadline}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, deadline: event.target.value }))
                }
                style={inputStyle}
              />

              <label
                style={{
                  color: theme.textSecondary,
                  fontSize: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.important}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      important: event.target.checked,
                    }))
                  }
                />
                Important
              </label>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  background: theme.gradientGreen,
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 18px",
                  color: "#fff",
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.65 : 1,
                }}
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            style={{
              padding: "7px 16px",
              borderRadius: 99,
              border:
                filter === item
                  ? `1px solid ${theme.accent}`
                  : `1px solid ${theme.border}`,
              background: filter === item ? `${theme.accent}20` : "transparent",
              color: filter === item ? theme.accent : theme.textSecondary,
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: 1,
              cursor: "pointer",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loading ? (
          <div style={emptyState}>Loading missions...</div>
        ) : filteredTodos.length === 0 ? (
          <div style={emptyState}>No missions in this filter.</div>
        ) : (
          filteredTodos.map((todo, index) => {
            const status = getTodoStatus(todo);
            const color = priorityColor[todo.priority];

            return (
              <motion.div
                key={todo._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ x: 4 }}
                style={{
                  background: theme.surface,
                  border: `1px solid ${
                    status === "COMPLETED" ? `${theme.green}40` : theme.border
                  }`,
                  borderRadius: 12,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  opacity: status === "MISSED" ? 0.65 : 1,
                }}
              >
                <button
                  onClick={() => markComplete(todo)}
                  disabled={todo.completed}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    flexShrink: 0,
                    border: `2px solid ${
                      status === "COMPLETED" ? theme.green : theme.border
                    }`,
                    background:
                      status === "COMPLETED" ? `${theme.green}20` : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: todo.completed ? "default" : "pointer",
                    color: theme.green,
                  }}
                >
                  {status === "COMPLETED" ? "✓" : ""}
                </button>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color:
                        status === "COMPLETED"
                          ? theme.textMuted
                          : theme.textPrimary,
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration:
                        status === "COMPLETED" ? "line-through" : "none",
                      marginBottom: 6,
                    }}
                  >
                    {todo.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: 99,
                        fontSize: 10,
                        fontFamily: "'Space Mono', monospace",
                        background: `${color}20`,
                        color,
                        border: `1px solid ${color}40`,
                      }}
                    >
                      {todo.priority}
                    </span>
                    <span style={{ color: theme.textMuted, fontSize: 11 }}>
                      Due {formatDeadline(todo.deadline)}
                    </span>
                    {todo.important && (
                      <span style={{ color: theme.accent, fontSize: 11 }}>
                        Important
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ textAlign: "right", marginRight: 8 }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: 99,
                        fontSize: 10,
                        fontFamily: "'Space Mono', monospace",
                        background:
                          status === "COMPLETED"
                            ? `${theme.green}15`
                            : status === "MISSED"
                              ? `${theme.danger}15`
                              : `${theme.gold}15`,
                        color:
                          status === "COMPLETED"
                            ? theme.green
                            : status === "MISSED"
                              ? theme.danger
                              : theme.gold,
                      }}
                    >
                      {status}
                    </span>
                    <p
                      style={{
                        color: theme.gold,
                        fontSize: 11,
                        fontFamily: "'Space Mono', monospace",
                        marginTop: 6,
                      }}
                    >
                      +{xpMap[todo.priority]} XP
                    </p>
                  </div>

                  <button onClick={() => editTodo(todo)} style={iconButton}>
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo._id)} style={dangerButton}>
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 10,
  border: `1px solid ${theme.border}`,
  background: theme.surfaceAlt,
  color: theme.textPrimary,
  outline: "none",
};

const emptyState: React.CSSProperties = {
  padding: 24,
  borderRadius: 12,
  border: `1px dashed ${theme.border}`,
  color: theme.textSecondary,
  textAlign: "center",
};

const iconButton: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: `1px solid ${theme.border}`,
  background: "transparent",
  color: theme.textSecondary,
  cursor: "pointer",
};

const dangerButton: React.CSSProperties = {
  ...iconButton,
  color: theme.danger,
  border: `1px solid ${theme.danger}40`,
};
