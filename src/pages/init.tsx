import BaseLayout from '@layouts/base';

import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { relaysAtom } from '@stores/relays';

import { dateToUnix, hoursAgo } from '@utils/getDate';
import { countTotalNotes, createCacheNote, getAllFollowsByID, getLastLoginTime } from '@utils/storage';
import { pubkeyArray } from '@utils/transform';

import LumeSymbol from '@assets/icons/Lume';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function Page() {
  const router = useRouter();
  const pool: any = useContext(RelayContext);

  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);

  const [done, setDone] = useState(false);
  const now = useRef(new Date());
  const unsubscribe = useRef(null);
  const timer = useRef(null);

  const fetchData = useCallback(
    (since) => {
      getAllFollowsByID(activeAccount.id).then((follows) => {
        unsubscribe.current = pool.subscribe(
          [
            {
              kinds: [1],
              authors: pubkeyArray(follows),
              since: dateToUnix(since),
              until: dateToUnix(now.current),
            },
          ],
          relays,
          (event) => {
            // insert event to local database
            createCacheNote(event);
          },
          undefined,
          () => {
            // wait for 8 seconds
            timer.current = setTimeout(() => setDone(true), 8000);
          },
          {
            unsubscribeOnEose: true,
          }
        );
      });
    },
    [activeAccount.id, pool, relays]
  );

  useEffect(() => {
    if (!done) {
      countTotalNotes().then((count) => {
        if (count.total === 0) {
          fetchData(hoursAgo(24, now.current));
        } else {
          getLastLoginTime().then((time) => {
            const parseDate = new Date(time.setting_value);
            fetchData(parseDate);
          });
        }
      });
    } else {
      router.push('/newsfeed/following');
    }

    return () => {
      unsubscribe.current;
      clearTimeout(timer.current);
    };
  }, [activeAccount.id, done, pool, relays, router, fetchData]);

  return (
    <div className="relative h-full overflow-hidden">
      {/* dragging area */}
      <div data-tauri-drag-region className="absolute top-0 left-0 z-20 h-16 w-full bg-transparent" />
      {/* end dragging area */}
      <div className="relative flex h-full flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <LumeSymbol className="h-16 w-16 text-black dark:text-white" />
          <div className="text-center">
            <h3 className="text-lg font-semibold leading-tight text-zinc-900 dark:text-zinc-100">Loading...</h3>
            <p className="font-medium text-zinc-300 dark:text-zinc-600">
              Keep calm as Lume fetches events... &#129305;
            </p>
          </div>
        </div>
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 transform">
          <svg
            className="h-5 w-5 animate-spin text-black dark:text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(
  page:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
) {
  return <BaseLayout>{page}</BaseLayout>;
};
