import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadPacifico } from "@remotion/google-fonts/Pacifico";

// "Terra e ouro", the same palette as the Garimpo app.
export const colors = {
  background: "#f6f1e8",
  ink: "#2a2420",
  card: "#fffcf6",
  terra: "#8a4b2a",
  gold: "#a87a1f",
  goldBright: "#f2c14e",
};

export const scriptFont = loadPacifico("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

export const displayFont = loadFraunces("normal", {
  weights: ["800"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;

export const bodyFont = loadPlex("normal", {
  weights: ["700"],
  subsets: ["latin", "latin-ext"],
}).fontFamily;
