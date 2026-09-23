import { useEffect, useState } from 'react';
import CapsuleForm from '../components/CapsuleForm';
import CapsuleList from '../components/CapsuleList';

const EMPTY_FORM = {
  project_name: '',
  prompt_title: '',
  prompt_version: '',
  prompt_text: '',
  response_summary: '',
  category: '',
  usefulness: '',
  reviewed: false,
  improved: false,
  screenshot_url: '',
  notes: '',
};

export default function Dashboard() {
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null); // null = creating, else id being edited

  useEffect(() => {
    loadCapsules();
  }, []);

  async function loadCapsules() {
    const res = await fetch('/api/capsules', { credentials: 'include' });

    if (res.status == 401) {
      window.location.href = '/login';
      return;
    }

    const data = await res.json();

    if (!res.ok || !Array.isArray(data)) {
      console.error('Failed to load capsules:', data);
      setCapsules([]);
      setLoading(false);
      return;
    }

    setCapsules(data);
    setLoading(false);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function startEdit(capsule) {
    setEditingId(capsule.id);
    setForm({
      project_name: capsule.project_name || '',
      prompt_title: capsule.prompt_title || '',
      prompt_version: capsule.prompt_version || '',
      prompt_text: capsule.prompt_text || '',
      response_summary: capsule.response_summary || '',
      category: capsule.category || '',
      usefulness: capsule.usefulness || '',
      reviewed: !!capsule.reviewed,
      improved: !!capsule.improved,
      screenshot_url: capsule.screenshot_url || '',
      notes: capsule.notes || '',
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const url = editingId ? `/api/capsules/${editingId}` : '/api/capsules';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.status == 401) {
      window.location.href = '/login';
      return;
    }

    cancelEdit();
    loadCapsules();
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/capsules/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (res.status == 401) {
      window.location.href = '/login';
      return;
    }

    loadCapsules();
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>

      <CapsuleForm
        form={form}
        onFieldChange={updateField}
        onSubmit={handleSubmit}
        editingId={editingId}
        onCancel={cancelEdit}
      />

      <CapsuleList
        capsules={capsules}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
