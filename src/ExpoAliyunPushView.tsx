import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoAliyunPushViewProps } from './ExpoAliyunPush.types';

const NativeView: React.ComponentType<ExpoAliyunPushViewProps> =
  requireNativeView('ExpoAliyunPush');

export default function ExpoAliyunPushView(props: ExpoAliyunPushViewProps) {
  return <NativeView {...props} />;
}
