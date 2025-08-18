import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variable warnings
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      
      // Disable any type warnings
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable missing dependency warnings for useEffect
      "react-hooks/exhaustive-deps": "off",
      
      // Disable unescaped entities warnings
      "react/no-unescaped-entities": "off",
      
      // Disable children as props warning
      "react/no-children-prop": "off",
      
      // Disable img element warnings (can be addressed later)
      "@next/next/no-img-element": "off",
      
      // Disable rules of hooks warnings
      "react-hooks/rules-of-hooks": "warn", // Keep as warning, not error
      
      // Disable missing dependency warnings for useCallback
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

export default eslintConfig;
