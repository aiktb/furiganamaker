// Compile-time regression checks: invalid routes must remain TypeScript errors.
import { Link, linkOptions } from "@tanstack/react-router";

linkOptions({ to: "/" });
linkOptions({ to: "/welcome" });

// @ts-expect-error This path belongs to the other application, not this router.
linkOptions({ to: "/playground" });
// @ts-expect-error Misspelled paths must not be accepted as arbitrary strings.
export const invalidLink = <Link to="/missing-route" />;
