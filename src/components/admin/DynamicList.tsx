interface DynamicListProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function DynamicList({ label, items, onChange, placeholder = "Add item…" }: DynamicListProps) {
  function addItem() {
    onChange([...items, ""]);
  }

  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function moveItem(index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      <div className="admin-dynamic-list">
        {items.map((item, i) => (
          <div key={i} className="admin-dynamic-item">
            <div className="admin-dynamic-arrows">
              <button
                type="button"
                onClick={() => moveItem(i, -1)}
                disabled={i === 0}
                className="admin-arrow-btn"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(i, 1)}
                disabled={i === items.length - 1}
                className="admin-arrow-btn"
                title="Move down"
              >
                ↓
              </button>
            </div>
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
            />
            <button
              type="button"
              className="admin-remove-btn"
              onClick={() => removeItem(i)}
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="admin-add-btn" onClick={addItem}>
          + Add {label.replace(/s$/, "").toLowerCase()}
        </button>
      </div>
    </div>
  );
}
