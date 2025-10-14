export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
  "rules": {
    "at-rule-no-unknown": [true, {
      "ignoreAtRules": [
        "tailwind",
        "apply",
        "variants",
        "responsive",
        "screen"
      ]
    }]
  }
}