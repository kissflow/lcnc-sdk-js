import { useState, useEffect, useRef } from "react";
import { Plus, X, Check } from "lucide-react";

export function ChecklistField({
  field,
  value,
  onChange,
  onBlur,
  error,
  disabled = false
}) {
  const [items, setItems] = useState(Array.isArray(value) ? value : []);
  const [progress, setProgress] = useState(null);
  const [addingItem, setAddingItem] = useState(false);
  const [editingValue, setEditingValue] = useState("");
  const inputRef = useRef(null);

  const readOnly = disabled || field.ReadOnly;
  // default both to true when not explicitly configured (mirrors host defaults)
  const canCreate = field.CanCreate !== false && !readOnly;
  const canDelete = field.CanDelete !== false && !readOnly;

  useEffect(() => {
    const synced = Array.isArray(value) ? value : [];
    setItems(synced);
    recalcProgress(synced);
  }, [value]);

  useEffect(() => {
    recalcProgress(items);
  }, [items]);

  useEffect(() => {
    if (addingItem) inputRef.current?.focus();
  }, [addingItem]);

  const recalcProgress = (list) => {
    if (!list || list.length === 0) {
      setProgress(null);
      return;
    }
    const checked = list.filter((i) => i.selected).length;
    setProgress((checked / list.length) * 100);
  };

  const commit = (updated) => {
    setItems(updated);
    onChange(updated.length ? updated : null);
    onBlur(updated.length ? updated : null);
  };

  const handleToggle = (itemValue) => {
    const updated = items.map((item) =>
      item.value === itemValue ? { ...item, selected: !item.selected } : item
    );
    commit(updated);
  };

  const handleDelete = (itemValue) => {
    commit(items.filter((item) => item.value !== itemValue));
  };

  const saveNewItem = (text) => {
    if (!text.trim()) return;
    const updated = [...items, { selected: false, value: text.trim() }];
    setItems(updated);
    onChange(updated);
    onBlur(updated);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Escape") {
      setAddingItem(false);
      setEditingValue("");
      e.stopPropagation();
      e.preventDefault();
    } else if (e.key === "Enter" && e.target.value.trim().length > 0) {
      saveNewItem(e.target.value);
      // keep input open for rapid multi-item entry, clear value
      setEditingValue("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleInputBlur = (e) => {
    const text = e.target.value;
    if (text.trim().length > 0) saveNewItem(text);
    setAddingItem(false);
    setEditingValue("");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground">
        {field.Name}
        {field.Required && <span className="text-destructive ml-1">*</span>}
      </label>

      <div className="border border-input rounded-lg p-3 space-y-2">
        {/* Progress bar — only when there are items */}
        {progress !== null && (
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                readOnly ? "bg-muted-foreground" : "bg-primary/100"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Item list */}
        {items.length > 0 ? (
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.value} className="group flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => !readOnly && handleToggle(item.value)}
                  disabled={readOnly}
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 ${
                    item.selected
                      ? "bg-primary/100 border-ring text-primary-foreground"
                      : `border-input bg-background ${readOnly ? "" : "hover:border-ring"}`
                  } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                  aria-label={item.selected ? "Uncheck item" : "Check item"}
                >
                  {item.selected && <Check className="w-2.5 h-2.5" />}
                </button>
                <span
                  className={`flex-1 text-sm transition-colors ${
                    item.selected
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.value}
                </span>
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.value)}
                    className="p-0.5 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all cursor-pointer"
                    aria-label="Remove item"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !addingItem && (
            <p className="text-sm text-muted-foreground">No items</p>
          )
        )}

        {/* Add item input */}
        {addingItem && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-input shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onBlur={handleInputBlur}
              placeholder="Type and press Enter…"
              className="flex-1 text-sm bg-transparent border-b border-input focus:border-ring focus:outline-none py-0.5 placeholder-muted-foreground"
            />
          </div>
        )}

        {/* Add new item button */}
        {canCreate && (
          <button
            type="button"
            onClick={() => setAddingItem(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Add new item
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive font-medium flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18.101 12.93a1 1 0 00-1.414-1.414L10 15.586 7.707 13.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8.5-8.5z"
              clipRule="evenodd"
            />
          </svg>
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
