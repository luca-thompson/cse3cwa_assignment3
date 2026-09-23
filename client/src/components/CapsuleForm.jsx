export default function CapsuleForm({ form, onFieldChange, onSubmit, editingId, onCancel }) {
  return (
    <>
      <h2>{editingId ? 'Edit capsule' : 'New capsule'}</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Project name</label>
          <input
            value={form.project_name}
            onChange={(e) => onFieldChange('project_name', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prompt title</label>
          <input
            value={form.prompt_title}
            onChange={(e) => onFieldChange('prompt_title', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prompt version</label>
          <input
            value={form.prompt_version}
            onChange={(e) => onFieldChange('prompt_version', e.target.value)}
          />
        </div>
        <div>
          <label>Prompt text</label>
          <textarea
            value={form.prompt_text}
            onChange={(e) => onFieldChange('prompt_text', e.target.value)}
            required
          />
        </div>
        <div>
          <label>Response summary</label>
          <textarea
            value={form.response_summary}
            onChange={(e) => onFieldChange('response_summary', e.target.value)}
          />
        </div>
        <div>
          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) => onFieldChange('category', e.target.value)}
          />
        </div>
        <div>
          <label>Usefulness</label>
          <input
            value={form.usefulness}
            onChange={(e) => onFieldChange('usefulness', e.target.value)}
          />
        </div>
        <div>
          <label>
            Reviewed
            <input
              type="checkbox"
              checked={form.reviewed}
              onChange={(e) => onFieldChange('reviewed', e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>
            Improved
            <input
              type="checkbox"
              checked={form.improved}
              onChange={(e) => onFieldChange('improved', e.target.checked)}
            />
          </label>
        </div>
        <div>
          <label>Screenshot URL</label>
          <input
            value={form.screenshot_url}
            onChange={(e) => onFieldChange('screenshot_url', e.target.value)}
          />
        </div>
        <div>
          <label>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => onFieldChange('notes', e.target.value)}
          />
        </div>

        <button type="submit">{editingId ? 'Save changes' : 'Create'}</button>
        {editingId && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </form>
    </>
  );
}
