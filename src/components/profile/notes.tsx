import { NoteBase } from '@components/note/base';
import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { useAtomValue } from 'jotai';
import { Author } from 'nostr-relaypool';
import { useContext, useEffect, useMemo, useState } from 'react';

export default function ProfileNotes({ id }: { id: string }) {
  const pool: any = useContext(RelayContext);
  const relays: any = useAtomValue(relaysAtom);

  const [data, setData] = useState([]);
  const user = useMemo(() => new Author(pool, relays, id), [id, pool, relays]);

  useEffect(() => {
    user.text((res) => setData((data) => [...data, res]), 100, 0);
  }, [user]);

  return (
    <div className="flex flex-col">
      {data
        .sort((a, b) => b.created_at - a.created_at)
        .map((item) => (
          <div key={item.id}>
            <NoteBase event={item} />
          </div>
        ))}
    </div>
  );
}
