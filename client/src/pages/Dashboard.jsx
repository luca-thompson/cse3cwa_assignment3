import { useEffect, useState } from 'react';

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
    console.log(data)
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

      <h2>{editingId ? 'Edit capsule' : 'New capsule'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project name</label>
          <input
            value={form.project_name}
            onChange={(e) => updateField('project_name', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prompt title</label>
          <input
            value={form.prompt_title}
            onChange={(e) => updateField('prompt_title', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prompt version</label>
          <input
            value={form.prompt_version}
            onChange={(e) => updateField('prompt_version', e.target.value)}
          />
        </div>
        <div>
          <label>Prompt text</label>
          <textarea
            value={form.prompt_text}
            onChange={(e) => updateField('prompt_text', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Response summary</label>
          <textarea
            value={form.response_summary}
            onChange={(e) => updateField('response_summary', e.target.value)}
          />
        </div>
        <div>
          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) => updateField('category', e.target.value)}
          />
        </div>
        <div>
          <label>Usefulness</label>
          <input
            value={form.usefulness}
            onChange={(e) => updateField('usefulness', e.target.value)}
          />
        </div>
        <div>
          <label>
            Reviewed
            <input
              type="checkbox"
              checked={form.reviewed}
              onChange={(e) => updateField('reviewed', e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>
            Improved
            <input
              type="checkbox"
              checked={form.improved}
              onChange={(e) => updateField('improved', e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>Screenshot URL</label>
          <input
            value={form.screenshot_url}
            onChange={(e) => updateField('screenshot_url', e.target.value)}
          />
        </div>
        <div>
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
          />
        </div>

        <button type="submit">{editingId ? 'Save changes' : 'Create'}</button>
        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Your capsules</h2>
      {capsules.length == 0 && <p>No capsules yet.</p>}
      <ul>
        {capsules.map((c) => (
          <li key={c.id}>
            <strong>{c.prompt_title}</strong> ({c.project_name}, {c.prompt_version})
            <p>{c.prompt_text}</p>
            <p>Category: {c.category} | Usefulness: {c.usefulness}</p>
            <p>Reviewed: {c.reviewed ? 'Yes' : 'No'} | Improved: {c.improved ? 'Yes' : 'No'}</p>
            {c.notes && <p>Notes: {c.notes}</p>}
            <button onClick={() => startEdit(c)}>Edit</button>
            <button onClick={() => handleDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
