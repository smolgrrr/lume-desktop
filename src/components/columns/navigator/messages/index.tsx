import { MessageList } from '@components/columns/navigator/messages/list';

import { activeAccountAtom } from '@stores/account';

import { getAllFollowsByID } from '@utils/storage';

import * as Collapsible from '@radix-ui/react-collapsible';
import { TriangleUpIcon } from '@radix-ui/react-icons';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

export default function Messages() {
  const [open, setOpen] = useState(true);
  const [follows, setFollows] = useState([]);
  const [activeAccount] = useAtom(activeAccountAtom);

  useEffect(() => {
    getAllFollowsByID(activeAccount.id)
      .then((res: any) => setFollows(res))
      .catch(console.error);
  }, [activeAccount.id]);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen} className="h-full shrink-0">
      <div className="flex h-full flex-col gap-1 px-2 pb-8">
        <Collapsible.Trigger className="flex cursor-pointer items-center gap-2 py-1 px-2">
          <div
            className={`inline-flex h-6 w-6 transform items-center justify-center transition-transform duration-150 ease-in-out ${
              open ? 'rotate-180' : ''
            }`}
          >
            <TriangleUpIcon className="h-4 w-4 text-zinc-500" />
          </div>
          <h3 className="bg-gradient-to-r from-red-300 via-pink-100 to-blue-300 bg-clip-text text-xs font-bold uppercase tracking-wide text-transparent">
            Chats
          </h3>
        </Collapsible.Trigger>
        <Collapsible.Content className="h-full">
          <MessageList data={follows} />
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
