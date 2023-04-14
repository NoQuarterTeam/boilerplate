import { colors } from "./colors";
import { type Config } from "tailwindcss";
export { colors };
declare const _default: {
    content: any[];
    theme: {
        extend: {
            spacing: {
                full: string;
            };
            borderRadius: {
                xs: string;
            };
            colors: {
                primary: {
                    '50': "#fdf2f8";
                    '100': "#fce7f3";
                    '200': "#fbcfe8";
                    '300': "#f9a8d4";
                    '400': "#f472b6";
                    '500': "#ec4899";
                    '600': "#db2777";
                    '700': "#be185d";
                    '800': "#9d174d";
                    '900': "#831843";
                    '950': "#500724";
                };
                gray: {
                    50: string;
                    75: string;
                    100: string;
                    200: string;
                    300: string;
                    400: string;
                    500: string;
                    600: string;
                    700: string;
                    800: string;
                    900: string;
                    950: string;
                };
            };
        };
    };
    plugins: {
        handler: import("tailwindcss/types/config").PluginCreator;
        config?: Partial<Config>;
    }[];
};
export default _default;
//# sourceMappingURL=index.d.ts.map