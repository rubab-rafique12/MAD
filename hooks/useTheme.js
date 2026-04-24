import { useApp } from '../context/AppContext';
import palette from '../theme/Colors';

export function useTheme() {
  const { theme } = useApp();
  const colors = palette[theme] || palette.light;
  const isDark = theme === 'dark';
  return { colors, isDark, theme };
}
