interface SpecItem {
  amount: string;
  ingredient: string;
}

interface SpecEditorProps {
  items: SpecItem[];
  onChange: (items: SpecItem[]) => void;
}

export default function SpecEditor({ items, onChange }: SpecEditorProps) {
  function addItem() {
    onChange([...items, { amount: "", ingredient: "" }]);
  }

  function updateItem(index: number, field: keyof SpecItem, value: string) {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
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
      <span>Spec (Recipe)</span>
      <div className="admin-dynamic-list">
        {items.map((item, i) => (
          <div key={i} className="admin-spec-row">
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
              value={item.amount}
              onChange={(e) => updateItem(i, "amount", e.target.value)}
              placeholder="2 oz"
              className="admin-spec-amount"
            />
            <input
              type="text"
              value={item.ingredient}
              onChange={(e) => updateItem(i, "ingredient", e.target.value)}
              placeholder="Bourbon"
              className="admin-spec-ingredient"
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
          + Add ingredient
        </button>
      </div>
    </div>
  );
}
