import { RelayContext } from '@components/relaysProvider';
import { UserFollow } from '@components/user/follow';

import { relaysAtom } from '@stores/relays';

import destr from 'destr';
import { useAtomValue } from 'jotai';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useMemo, useState } from 'react';

export default function ProfileFollowers({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const relays: any = useAtomValue(relaysAtom);

  const [followers, setFollowers] = useState(null);
  const user = useMemo(() => new Author(pool, relays, id), [id, pool, relays]);

  useEffect(() => {
    user.followers((res) => setFollowers(destr(res.tags)), 0, 100);
  }, [user]);

  return (
    <div className="flex flex-col gap-3 px-3 py-5">
      {followers && followers.map((follower) => <UserFollow key={follower[1]} pubkey={follower[1]} />)}
    </div>
  );
}
