import { blue } from "~/theme/colors/blue";
import { cyan } from "~/theme/colors/cyan";
import { sky } from "~/theme/colors/sky";
import { indigo } from "~/theme/colors/indigo";
import { iris } from "~/theme/colors/iris";
import { brown } from "~/theme/colors/brown";
import { orange } from "~/theme/colors/orange";
import { yellow } from "~/theme/colors/yellow";
import { jade } from "~/theme/colors/jade";
import { mint } from "~/theme/colors/mint";
import { lime } from "~/theme/colors/lime";
import { grass } from "~/theme/colors/grass";
import { violet } from "~/theme/colors/violet";
import { plum } from "~/theme/colors/plum";
import { crimson } from "~/theme/colors/crimson";
import { ruby } from "~/theme/colors/ruby";
import { tomato } from "~/theme/colors/tomato";
import { pink } from "~/theme/colors/pink";
import { purple } from "~/theme/colors/purple";
import { teal } from "~/theme/colors/teal";
import { green } from "~/theme/colors/green";
import { red } from "~/theme/colors/red";
import { mauve } from "~/theme/colors/mauve";
import { amber } from "~/theme/colors/amber";
import { animationStyles } from "~/theme/animation-styles";
import { zIndex } from "~/theme/tokens/z-index";
import { shadows } from "~/theme/tokens/shadows";
import { durations } from "~/theme/tokens/durations";
import { colors } from "~/theme/tokens/colors";
import { textStyles } from "~/theme/text-styles";
import { layerStyles } from "~/theme/layer-styles";
import { keyframes } from "~/theme/keyframes";
import { globalCss } from "~/theme/global-css";
import { conditions } from "~/theme/conditions";
import { slotRecipes, recipes } from "~/theme/recipes";
import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  jsxFramework: 'react',

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      animationStyles: animationStyles,
      recipes: recipes,
      slotRecipes: slotRecipes,
      keyframes: keyframes,
      layerStyles: layerStyles,
      textStyles: textStyles,

      tokens: {
        colors: colors,
        durations: durations,
        zIndex: zIndex
      },

      semanticTokens: {
        colors: {
          fg: {
            default: {
              value: {
                _light: "{colors.gray.12}",
                _dark: "{colors.gray.12}"
              }
            },

            muted: {
              value: {
                _light: "{colors.gray.11}",
                _dark: "{colors.gray.11}"
              }
            },

            subtle: {
              value: {
                _light: "{colors.gray.10}",
                _dark: "{colors.gray.10}"
              }
            }
          },

          border: {
            value: {
              _light: "{colors.gray.4}",
              _dark: "{colors.gray.4}"
            }
          },

          error: {
            value: {
              _light: "{colors.red.9}",
              _dark: "{colors.red.9}"
            }
          },

          amber: amber,
          gray: mauve,
          red: red,
          green: green,
          teal: teal,
          purple: purple,
          pink: pink,
          tomato: tomato,
          ruby: ruby,
          crimson: crimson,
          plum: plum,
          violet: violet,
          grass: grass,
          lime: lime,
          mint: mint,
          jade: jade,
          yellow: yellow,
          orange: orange,
          brown: brown,
          iris: iris,
          indigo: indigo,
          sky: sky,
          cyan: cyan,
          blue: blue
        },

        shadows: shadows,

        radii: {
          l1: {
            value: "{radii.xs}"
          },

          l2: {
            value: "{radii.sm}"
          },

          l3: {
            value: "{radii.md}"
          }
        }
      }
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  plugins: [
    {
      name: 'Remove Panda Preset Colors',
      hooks: {
        'preset:resolved': ({ utils, preset, name }) =>
          name === '@pandacss/preset-panda'
            ? utils.omit(preset, ['theme.tokens.colors', 'theme.semanticTokens.colors'])
            : preset,
      },
    },
  ],

  globalCss: globalCss,
  staticCss: {
    recipes: '*',
    css: [
      {
        properties: {
          colorPalette: ['*'],
        },
      },
    ],
  },
  conditions: conditions
});