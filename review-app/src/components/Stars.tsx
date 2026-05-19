import type { StarValue } from '../lib/types';

interface Props {
  value: StarValue;
  onChange?: (v: StarValue) => void;
  size?: 'sm' | 'lg';
  readOnly?: boolean;
}

export function Stars({ value, onChange, size = 'sm', readOnly = false }: Props) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        return (
          <button
            type="button"
            key={n}
            className={`star ${size === 'lg' ? 'lg' : ''} ${on ? 'is-on' : ''}`}
            onClick={() => {
              if (readOnly || !onChange) return;
              const next = (value === n ? n - 1 : n) as StarValue;
              onChange(next);
            }}
            aria-checked={on}
            role="radio"
            tabIndex={readOnly ? -1 : 0}
            disabled={readOnly}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
          >
            {on ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}
