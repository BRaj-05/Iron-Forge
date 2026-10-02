import type {
  CSSProperties,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { theme } from "@/lib/theme";

type BaseProps = {
  label: string;
  hint?: string;
  style?: CSSProperties;
};

const fieldShell: CSSProperties = {
  display: "grid",
  gap: 7,
  minWidth: 0,
};

const labelStyle: CSSProperties = {
  color: theme.textPrimary,
  fontSize: 12,
  fontWeight: 900,
};

const controlStyle: CSSProperties = {
  width: "100%",
  minHeight: 46,
  borderRadius: 10,
  border: `1px solid ${theme.border}`,
  background: "rgba(255,255,255,0.045)",
  color: theme.textPrimary,
  padding: "11px 13px",
  fontWeight: 800,
};

const hintStyle: CSSProperties = {
  color: theme.textSecondary,
  fontSize: 12,
};

function FieldShell({ label, hint, style, children }: BaseProps & { children: ReactNode }) {
  return (
    <label style={{ ...fieldShell, ...style }}>
      <span style={labelStyle}>{label}</span>
      {children}
      {hint && <small style={hintStyle}>{hint}</small>}
    </label>
  );
}

export function Input({ label, hint, style, ...props }: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} hint={hint} style={style}>
      <input {...props} style={controlStyle} />
    </FieldShell>
  );
}

export function SearchField({ style, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        minWidth: 0,
        border: "none",
        background: "transparent",
        color: theme.textPrimary,
        padding: "0 12px",
        fontWeight: 850,
        ...style,
      }}
    />
  );
}

export function Textarea({ label, hint, style, ...props }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell label={label} hint={hint} style={style}>
      <textarea
        {...props}
        style={{ ...controlStyle, minHeight: 96, resize: "vertical" }}
      />
    </FieldShell>
  );
}

export function Select({ label, hint, style, children, ...props }: BaseProps & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell label={label} hint={hint} style={style}>
      <select {...props} style={controlStyle}>
        {children}
      </select>
    </FieldShell>
  );
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: InputHTMLAttributes<HTMLInputElement>["onChange"] }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, color: theme.textSecondary, fontWeight: 850 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: 16, height: 16, accentColor: theme.accent }}
      />
      <span>{label}</span>
    </label>
  );
}
