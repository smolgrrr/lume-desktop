import BaseLayout from '@layouts/base';
import WithSidebarLayout from '@layouts/withSidebar';

import FormChat from '@components/form/chat';
import Message from '@components/messages/message';
import { RelayContext } from '@components/relaysProvider';

import { activeAccountAtom } from '@stores/account';
import { relaysAtom } from '@stores/relays';

import { useAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useContext,
  useEffect,
  useState,
} from 'react';

export default function Page() {
  const router = useRouter();
  const id: any = router.query.id || '';

  const pool: any = useContext(RelayContext);

  const relays = useAtomValue(relaysAtom);
  const [activeAccount] = useAtom(activeAccountAtom);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = pool.subscribe(
      [
        {
          kinds: [4],
          authors: [id],
          '#p': activeAccount.id,
        },
        {
          kinds: [4],
          authors: [activeAccount.id],
          '#p': id,
        },
      ],
      relays,
      (event: any) => {
        setMessages((messages) => [event, ...messages]);
      }
    );

    return () => {
      unsubscribe;
    };
  }, [activeAccount.id, id, pool, relays]);

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="h-full flex-1 overflow-y-auto">
        {messages
          .sort((a, b) => a.created_at - b.created_at)
          .map((message, index) => (
            <Message key={index} data={message} pubkey={activeAccount.id} privkey={activeAccount.privkey} />
          ))}
      </div>
      <div className="shrink-0 p-3">
        <FormChat />
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
  return (
    <BaseLayout>
      <WithSidebarLayout>{page}</WithSidebarLayout>
    </BaseLayout>
  );
};
