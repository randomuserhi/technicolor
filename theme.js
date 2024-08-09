import { Theme } from "@/rhu/theme.js";
export const theme = Theme(({ theme }) => {
    return {
        backgroundPrimary: theme `#000000`,
        foregroundPrimary: theme `#ffffff`
    };
});
