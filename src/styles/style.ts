import { theme, extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  ...theme,
  fonts: {
    body: `'Roboto', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: "gray.100",
      },
    },
  },
});

export { customTheme };
