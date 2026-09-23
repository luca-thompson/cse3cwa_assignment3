export default function CapsuleList({ capsules, onEdit, onDelete }) {
  return (
    <>
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
            <button onClick={() => onEdit(c)}>Edit</button>
            <button onClick={() => onDelete(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
}
