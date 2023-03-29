import { RelayContext } from '@components/relaysProvider';
import { UserFollow } from '@components/user/follow';

import { relaysAtom } from '@stores/relays';

import { useAtomValue } from 'jotai';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useMemo, useState } from 'react';

export default function ProfileFollows({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const relays: any = useAtomValue(relaysAtom);

  const [follows, setFollows] = useState(null);
  const user = useMemo(() => new Author(pool, relays, id), [id, pool, relays]);

  useEffect(() => {
    user.follows((res) => setFollows(res), 0);
  }, [user]);

  return (
    <div className="flex flex-col gap-3 px-3 py-5">
      {follows && follows.map((follow) => <UserFollow key={follow.pubkey} pubkey={follow.pubkey} />)}
    </div>
  );
}
