import * as React from 'react';

import { ExpoAliyunPushViewProps } from './ExpoAliyunPush.types';

export default function ExpoAliyunPushView(props: ExpoAliyunPushViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
