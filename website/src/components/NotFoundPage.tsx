import { Link } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-prose flex-col items-center justify-center px-6 py-32 text-center">
      <i className="i-mdi-alert-outline size-20 text-sky-500" aria-hidden="true" />
      <h1 className="mt-8 mb-8 font-bold text-4xl">Oops!</h1>
      <Link
        to="/"
        className="font-medium text-slate-200 underline underline-offset-2 hover:text-sky-400"
      >
        Go back to the Home Page
      </Link>
      <p className="mt-5 text-slate-300">Sorry, an unexpected error has occurred.</p>
      <p className="mt-5 text-slate-300 italic">Not Found</p>
    </div>
  );
}
