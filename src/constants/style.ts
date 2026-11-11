export type ThemeColours = {
  primary_bg: string;
  secondary_bg: string;
  card_bg: string;
  input_bg: string;
  border_1: string;
  border_2: string;
  accent_1: string;
  accent_2: string;
  heading: string;
  text_primary: string;
  text_secondary: string;
  text_placeholder: string;
  modal_bg: string;
  drag_handle: string;
  shadow: string;
  isDark: boolean;
};

export const lightColours: ThemeColours = {
  primary_bg: "#F9F9F6",
  secondary_bg: "#FFFFFF",
  card_bg: "#FFFFFF",
  input_bg: "#FFFFFF",
  border_1: "#EDF0FE",
  border_2: "#726E83",
  accent_1: "#949FF1",
  accent_2: "#D7C7F7",
  heading: "#8B889E",
  text_primary: "#5A5869",
  text_secondary: "#8B889E",
  text_placeholder: "#BEBDCE",
  modal_bg: "#FFFFFF",
  drag_handle: "#E5E5E5",
  shadow: "#000000",
  isDark: false,
};

export const darkColours: ThemeColours = {
  primary_bg: "#121216",
  secondary_bg: "#1E1E24",
  card_bg: "#1E1E24",
  input_bg: "#282834",
  border_1: "#2D2D3A",
  border_2: "#58566A",
  accent_1: "#949FF1",
  accent_2: "#4D466D",
  heading: "#B8B5CB",
  text_primary: "#F0EFEF",
  text_secondary: "#9E9BB2",
  text_placeholder: "#6C6A7C",
  modal_bg: "#1E1E24",
  drag_handle: "#3A3A48",
  shadow: "#000000",
  isDark: true,
};

// Default export for backward compatibility
export const colours = lightColours;

export const mapColours = {
  background: "#F1F3F5",
  landuse: "#cedbce",
  water: "#cbd6ee",
  building: "#c7cceb",
  road_minor: "#FFFFFF",
  road_major: "#D1D5DB",
};
