import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { relaysAtom } from '@stores/relays';

import { dateToUnix } from '@utils/getDate';

import RepostIcon from '@assets/icons/repost';
import RepostedIcon from '@assets/icons/reposted';

import { useAtom, useAtomValue } from 'jotai';
import { getEventHash, signEvent } from 'nostr-tools';
import { memo, useContext, useEffect, useState } from 'react';

export const NoteRepost = memo(function NoteRepost({
  count,
  eventID,
  eventPubkey,
  repostEvent,
}: {
  count: number;
  eventID: string;
  eventPubkey: string;
  repostEvent: string;
}) {
  const pool: any = useContext(RelayContext);

  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);

  const [isReact, setIsReact] = useState(false);
  const [repost, setRepost] = useState(0);

  const handleRepost = (e: any) => {
    e.stopPropagation();

    const event: any = {
      content: JSON.stringify(repostEvent),
      kind: 6,
      tags: [
        ['e', eventID],
        ['p', eventPubkey],
      ],
      created_at: dateToUnix(),
      pubkey: activeAccount.id,
    };
    event.id = getEventHash(event);
    event.sig = signEvent(event, activeAccount.privkey);
    // publish event to all relays
    pool.publish(event, relays);
    // update state to change icon to filled heart
    setIsReact(true);
    // update counter
    setRepost(repost + 1);
  };

  useEffect(() => {
    setRepost(count);
  }, [count]);

  return (
    <button onClick={(e) => handleRepost(e)} className="group flex w-16 items-center gap-1 text-sm text-zinc-500">
      <div className="rounded-md p-1 group-hover:bg-zinc-800">
        {isReact ? (
          <RepostedIcon className="h-5 w-5 text-green-500" />
        ) : (
          <RepostIcon className="h-5 w-5 text-zinc-500" />
        )}
      </div>
      <span>{repost}</span>
    </button>
  );
});
