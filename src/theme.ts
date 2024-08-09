import { Theme, ThemeVariable } from "@/rhu/theme.js";

type ThemeKeys = 
    "backgroundPrimary" |
    "foregroundPrimary"
    ;

export const theme = Theme<{ [k in ThemeKeys]: ThemeVariable }>(({ theme }) => {
    return {
        backgroundPrimary: theme`#000000`,
        foregroundPrimary: theme`#ffffff`
    };
});