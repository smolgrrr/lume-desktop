export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen w-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">{children}</div>;
}
