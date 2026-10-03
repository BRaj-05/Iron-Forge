"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Circle, Plus, Sparkles, Target, Trash2, Trophy } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/FormField";
import { apiRoutes } from "@/config/api-routes";
import { apiRequest, jsonRequest } from "@/modules/customer/api";
import { experienceSlides } from "@/lib/experience-media";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type Task = { id: string; title: string; description?: string; completed: boolean; priority: Priority; xpEarned?: number };

const priorityMeta: Record<Priority, { label: string; xp: number; tone: string }> = {
  LOW: { label: "Low", xp: 5, tone: "low" },
  MEDIUM: { label: "Medium", xp: 10, tone: "medium" },
  HIGH: { label: "High", xp: 20, tone: "high" },
  CRITICAL: { label: "Critical", xp: 40, tone: "critical" },
};

export default function CustomerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const loadTasks = useCallback(async () => {
    try {
      setTasks(await apiRequest<Task[]>(apiRoutes.customer.tasks));
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  async function createTask() {
    if (!title.trim()) return;
    try {
      await jsonRequest(apiRoutes.customer.tasks, "POST", { title, priority });
      setTitle("");
      toast.success("Task added.");
      await loadTasks();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not add task.");
    }
  }

  async function completeTask(task: Task) {
    try {
      await jsonRequest(apiRoutes.customer.tasks, "PATCH", { id: task.id, completed: true });
      await loadTasks();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not update task.");
    }
  }

  async function removeTask(task: Task) {
    try {
      await apiRequest(apiRoutes.customer.tasks, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id }),
      });
      await loadTasks();
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : "Could not delete task.");
    }
  }

  const completed = tasks.filter((task) => task.completed).length;
  const earnedXp = useMemo(
    () => tasks.reduce((sum, task) => sum + (task.completed ? task.xpEarned || priorityMeta[task.priority].xp : 0), 0),
    [tasks],
  );
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="task-command-page">
      <section
        className="task-command-hero"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(8,9,12,.95), rgba(8,9,12,.72) 62%, rgba(8,9,12,.34)), url(" +
            experienceSlides[3].image +
            ")",
        }}
      >
        <div>
          <p className="if-kicker">Daily commitments</p>
          <h1>Turn small wins into momentum.</h1>
          <p>Keep today focused. Pick a few actions, finish them, and let XP reflect the work.</p>
        </div>
        <div className="task-command-score">
          <span>Today</span>
          <strong>{progress}%</strong>
          <small>{completed} of {tasks.length} complete</small>
          <div className="task-command-progress"><span style={{ width: progress + "%" }} /></div>
        </div>
      </section>

      <section className="task-command-grid">
        <article className="task-create-card">
          <div className="task-card-heading">
            <span><Plus size={18} /></span>
            <div>
              <p className="if-kicker">Add focus</p>
              <h2>What will you finish?</h2>
            </div>
          </div>

          <div className="task-form-modern">
            <Input
              label="Task title"
              placeholder="Example: 20 minute incline walk"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Enter") void createTask(); }}
            />
            <Select
              label="Priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
            >
              <option value="LOW">Low · 5 XP</option>
              <option value="MEDIUM">Medium · 10 XP</option>
              <option value="HIGH">High · 20 XP</option>
              <option value="CRITICAL">Critical · 40 XP</option>
            </Select>
            <Button onClick={() => void createTask()} disabled={!title.trim()}>
              Add task
            </Button>
          </div>
        </article>

        <article className="task-insight-card">
          <div className="task-insight-icon"><Trophy size={22} /></div>
          <span>XP earned today</span>
          <strong>{earnedXp}</strong>
          <p>{tasks.length ? "Complete what matters before adding more." : "Your first task can be small."}</p>
          <div className="task-insight-mini">
            <Target size={16} />
            <span>{tasks.length - completed} still open</span>
          </div>
        </article>
      </section>

      <section className="task-board">
        <div className="task-board-head">
          <div>
            <p className="if-kicker">Today&apos;s board</p>
            <h2>Your commitments</h2>
          </div>
          <span>{tasks.length} tasks</span>
        </div>

        <div className="task-modern-list">
          {loading ? (
            <div className="task-loading-card" />
          ) : tasks.length ? (
            tasks.map((task) => {
              const meta = priorityMeta[task.priority];
              return (
                <article className={"task-modern-item " + (task.completed ? "is-complete" : "")} key={task.id}>
                  <button
                    className="task-modern-check"
                    onClick={() => !task.completed && void completeTask(task)}
                    aria-label={"Complete " + task.title}
                  >
                    {task.completed ? <Check size={18} /> : <Circle size={18} />}
                  </button>
                  <div className="task-modern-copy">
                    <div>
                      <strong>{task.title}</strong>
                      <span className={"task-priority tone-" + meta.tone}>{meta.label}</span>
                    </div>
                    <small>{task.completed ? "+" + (task.xpEarned || meta.xp) + " XP earned" : meta.xp + " XP available"}</small>
                  </div>
                  <button
                    className="task-modern-delete"
                    onClick={() => void removeTask(task)}
                    aria-label={"Delete " + task.title}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              );
            })
          ) : (
            <div className="task-empty-modern">
              <Sparkles size={26} />
              <h3>Nothing on the board yet.</h3>
              <p>Add one useful action above and keep the day intentionally small.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
