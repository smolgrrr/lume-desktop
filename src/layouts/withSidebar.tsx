import AppHeader from '@components/appHeader';
import AccountColumn from '@components/columns/account';
import NavigatorColumn from '@components/columns/navigator';

export default function WithSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full flex-col">
      <div
        data-tauri-drag-region
        className="relative h-11 shrink-0 border-b border-zinc-100 bg-white dark:border-zinc-900 dark:bg-zinc-950"
      >
        <AppHeader />
      </div>
      <div className="relative flex min-h-0 w-full flex-1">
        <div className="relative w-[68px] shrink-0 border-r border-zinc-900">
          <div className="absolute left-0 top-0 h-12 w-full" />
          <AccountColumn />
        </div>
        <div className="grid w-full grid-cols-4 xl:grid-cols-5">
          <div className="scrollbar-hide col-span-1 overflow-y-auto overflow-x-hidden border-r border-zinc-900">
            <NavigatorColumn />
          </div>
          <div className="col-span-3 m-3 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20 xl:col-span-2 xl:mr-1.5">
            <div className="h-full w-full rounded-lg">{children}</div>
          </div>
          <div className="col-span-3 m-3 hidden overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 shadow-input shadow-black/20 xl:col-span-2 xl:ml-1.5 xl:flex">
            <div className="flex h-full w-full items-center justify-center">
              <p className="select-text p-8 text-center text-zinc-400">
                This feature hasn&apos;t implemented yet, so resize Lume to the initial size for a better experience.
                I&apos;m sorry for this inconvenience, and I swear I will add it soon 😁
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
