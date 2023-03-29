import { UserExtend } from '@components/user/extend';

import { nip04 } from 'nostr-tools';
import { memo, useEffect, useMemo, useState } from 'react';

const Message = ({ data, pubkey, privkey }: { data: any; pubkey: string; privkey: string }) => {
  const [content, setContent] = useState('');
  const sender = useMemo(() => {
    const pTag = data.tags.find(([k, v]) => k === 'p' && v && v !== '')[1];
    if (pTag === pubkey) {
      return data.pubkey;
    } else {
      return pTag;
    }
  }, [data.pubkey, data.tags, pubkey]);

  useEffect(() => {
    const decrypt = async () => {
      const result = await nip04.decrypt(privkey, sender, data.content);
      setContent(result);
    };

    decrypt().catch(console.error);
  }, [data.content, privkey, sender]);

  return (
    <div className="relative z-10 flex h-min min-h-min w-full select-text flex-col px-3 py-5 hover:bg-black/20">
      <div className="relative z-10 flex flex-col">
        <UserExtend pubkey={data.pubkey} time={data.created_at} />
        <div className="-mt-5 pl-[52px]">
          <div className="flex flex-col gap-2">
            <div className="prose prose-zinc max-w-none break-words text-[15px] leading-tight dark:prose-invert prose-p:m-0 prose-p:text-[15px] prose-p:leading-tight prose-a:font-normal prose-a:text-fuchsia-500 prose-a:no-underline prose-img:m-0 prose-video:m-0">
              {content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Message);
