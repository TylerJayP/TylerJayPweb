type ClassName = string | false | null | undefined;

/**
 * Joins class names, skipping any that are switched off, so conditional classes read as a list:
 * `classNames(styles.label, active && styles.active)`.
 */
export function classNames(...names: ClassName[]): string {
  return names.filter(Boolean).join(' ');
}
