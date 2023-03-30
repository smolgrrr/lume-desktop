import { NoteComment } from '@components/note/meta/comment';
import { NoteReaction } from '@components/note/meta/reaction';
import { NoteRepost } from '@components/note/meta/repost';
import { RelayContext } from '@components/relaysProvider';

import { relaysAtom } from '@stores/relays';

import { createCacheCommentNote } from '@utils/storage';

import { useAtomValue } from 'jotai';
import { useContext, useEffect, useState } from 'react';

export default function NoteMetadata({
  eventID,
  eventPubkey,
  eventContent,
  eventTime,
  event,
}: {
  eventID: string;
  eventPubkey: string;
  event: string;
  eventTime: any;
  eventContent: any;
}) {
  const pool: any = useContext(RelayContext);
  const relays = useAtomValue(relaysAtom);

  const [likes, setLikes] = useState(0);
  const [reposts, setReposts] = useState(0);
  const [comments, setComments] = useState(0);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          '#e': [eventID],
          since: parseInt(eventTime),
          kinds: [1, 6, 7],
          limit: 50,
        },
      ],
      relays,
      (event: any) => {
        switch (event.kind) {
          case 1:
            // update state
            setComments((comments) => (comments += 1));
            // save comment to database
            createCacheCommentNote(event, eventID);
            break;
          case 6:
            // update state
            setReposts((reposts) => (reposts += 1));
            break;
          case 7:
            if (event.content === '🤙' || event.content === '+') {
              setLikes((likes) => (likes += 1));
            }
            break;
          default:
            break;
        }
      },
      1000,
      undefined,
      {
        unsubscribeOnEose: true,
      }
    );

    return () => {
      unsubscribe;
    };
  }, [eventID, eventTime, pool, relays]);

  return (
    <div className="relative z-10 -ml-1 flex items-center gap-8">
      <NoteComment
        count={comments}
        eventID={eventID}
        eventPubkey={eventPubkey}
        eventContent={eventContent}
        eventTime={eventTime}
      />
      <NoteRepost count={reposts} repostEvent={event} eventID={eventID} eventPubkey={eventPubkey} />
      <NoteReaction count={likes} eventID={eventID} eventPubkey={eventPubkey} />
    </div>
  );
}
