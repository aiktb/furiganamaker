// Compile-time regression checks: invalid routes must remain TypeScript errors.
import { Link, linkOptions } from "@tanstack/react-router";
import { getOptionsUrl } from "../../src/optionsUrl";

linkOptions({ to: "/" });
linkOptions({ to: "/playground" });
linkOptions({ to: "/kanji-filter" });
linkOptions({ to: "/selector" });
linkOptions({ to: "/changelog" });

// @ts-expect-error This path belongs to the other application, not this router.
linkOptions({ to: "/welcome" });
// @ts-expect-error Misspelled paths must not be accepted as arbitrary strings.
export const invalidLink = <Link to="/missing-route" />;

getOptionsUrl("/playground");
// @ts-expect-error Cross-entrypoint links must also reference real options routes.
getOptionsUrl("/missing-route");
