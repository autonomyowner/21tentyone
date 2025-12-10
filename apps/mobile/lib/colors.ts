export const colors = {
  matcha: {
    50: '#f0f7f1',
    100: '#dcedde',
    200: '#b9dbc0',
    300: '#8fc49a',
    400: '#68a67d',
    500: '#5a9470',
    600: '#4a7c5d',
    700: '#3d654c',
    800: '#33513f',
    900: '#2b4335',
  },
  cream: {
    50: '#fefdfb',
    100: '#fdf8f3',
    200: '#f8f0e5',
    300: '#f5ebe0',
    400: '#efe3d4',
    500: '#e8d9c5',
  },
  terra: {
    300: '#d4906a',
    400: '#c97d52',
    500: '#c45d2c',
    600: '#a84c23',
  },
  warm: {
    50: '#fefdfb',
    100: '#fdf8f3',
    200: '#f5f0eb',
    300: '#ebe5de',
    400: '#d9d0c5',
    500: '#c7bbac',
    600: '#a69889',
    700: '#857566',
    800: '#5a5347',
    900: '#2d3a2e',
  },
} as const;

export type ColorName = keyof typeof colors;
