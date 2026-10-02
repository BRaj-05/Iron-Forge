"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Circle, Plus, Sparkles, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import PageHeading from "@/components/ui/PageHeading";
import { Input, Select } from "@/components/ui/FormField";
import { apiRoutes } from "@/config/api-routes";
import { apiRequest, jsonRequest } from "@/modules/customer/api";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type Task = { id: string; title: string; description?: string; completed: boolean; priority: Priority; xpEarned?: number };

export default function CustomerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");

  const loadTasks = useCallback(async () => {
    try { setTasks(await apiRequest<Task[]>(apiRoutes.customer.tasks)); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not load tasks."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void loadTasks(); }, [loadTasks]);

  async function createTask() {
    if (!title.trim()) return;
    try {
      await jsonRequest(apiRoutes.customer.tasks, "POST", { title, priority });
      setTitle(""); toast.success("Task added."); await loadTasks();
    } catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not add task."); }
  }
  async function completeTask(task: Task) {
    try { await jsonRequest(apiRoutes.customer.tasks, "PATCH", { id: task.id, completed: true }); await loadTasks(); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not update task."); }
  }
  async function removeTask(task: Task) {
    try { await apiRequest(apiRoutes.customer.tasks, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: task.id }) }); await loadTasks(); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : "Could not delete task."); }
  }

  const completed = tasks.filter((task) => task.completed).length;
  return <div className="dashboard-page compact-page">
    <PageHeading eyebrow="My gym" title="Daily tasks" description="Keep small commitments visible and earn XP when you finish them." />
    <section className="dashboard-main-grid">
      <Card className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>Add a task</h2><p>Choose one action you can finish today.</p></div><span className="panel-icon"><Plus size={18} /></span></div>
        <div className="daily-form-stack"><Input label="Task title" placeholder="Example: 20 minute incline walk" value={title} onChange={(event) => setTitle(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void createTask(); }} /><Select label="Priority" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option value="LOW">Low · 5 XP</option><option value="MEDIUM">Medium · 10 XP</option><option value="HIGH">High · 20 XP</option><option value="CRITICAL">Critical · 40 XP</option></Select><Button onClick={() => void createTask()} disabled={!title.trim()}>Add task</Button></div>
      </Card>
      <Card className="dashboard-panel">
        <div className="dashboard-panel-heading"><div><h2>Today’s progress</h2><p>{completed} of {tasks.length} tasks complete.</p></div><span className="panel-icon"><Sparkles size={18} /></span></div>
        <div className="dashboard-progress-track"><span style={{ width: tasks.length ? `${completed / tasks.length * 100}%` : "0%" }} /></div>
        <strong className="task-progress-number">{completed}/{tasks.length}</strong>
      </Card>
    </section>
    <Card className="dashboard-panel">
      <div className="dashboard-panel-heading"><div><h2>Your tasks</h2><p>Complete tasks when you actually finish the work.</p></div></div>
      <div className="task-list">{loading ? <div className="skeleton dashboard-card-skeleton" /> : tasks.length ? tasks.map((task) => <div className={`task-item ${task.completed ? "is-complete" : ""}`} key={task.id}><button className="task-check" onClick={() => !task.completed && void completeTask(task)} aria-label={`Complete ${task.title}`}>{task.completed ? <Check size={17} /> : <Circle size={17} />}</button><div><strong>{task.title}</strong><small>{task.priority} priority {task.xpEarned ? `· +${task.xpEarned} XP earned` : ""}</small></div><button className="task-delete" onClick={() => void removeTask(task)} aria-label={`Delete ${task.title}`}><Trash2 size={16} /></button></div>) : <div className="dashboard-empty"><Sparkles size={22} /><p>No tasks yet. Add one small goal above.</p></div>}</div>
    </Card>
  </div>;
}
