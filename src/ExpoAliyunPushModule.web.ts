import { registerWebModule, NativeModule } from 'expo';

import { ExpoAliyunPushModuleEvents } from './ExpoAliyunPush.types';

class ExpoAliyunPushModule extends NativeModule<ExpoAliyunPushModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoAliyunPushModule);
