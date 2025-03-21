import { NativeModule, requireNativeModule } from "expo";

import {
  AliyunPushLogLevel,
  AliyunTagTarget,
  ExpoAliyunPushModuleEvents,
  XiaomiInternationalPushRegion,
} from "./ExpoAliyunPush.types";

declare class ExpoAliyunPushModule extends NativeModule<ExpoAliyunPushModuleEvents> {
  /// 初始化阿里云推送
  initAliyunPush(): Promise<void>;
  /// 初始化三方推送
  initThirdPush(): Promise<void>;

  getDeviceId(): Promise<string>;

  setAliyunLogLevel(logLevel: AliyunPushLogLevel): Promise<string>;

  bindAccount(account: string): Promise<string>;
  unbindAccount(): Promise<string>;

  bindPhoneNumber(phoneNumber: string): Promise<string>;
  unbindPhoneNumber(): Promise<string>;

  bindTag(
    target: AliyunTagTarget,
    tags: string[],
    alias: string | undefined | null
  ): Promise<string>;
  unbindTag(
    target: AliyunTagTarget,
    tags: string[],
    alias: string | undefined | null
  ): Promise<string>;
  /// 查询当前设备已绑定的标签。
  listTags(target: AliyunTagTarget): Promise<string>;

  addAlias(alias: string): Promise<string>;
  removeAlias(alias: string): Promise<string>;
  listAlias(): Promise<string>;

  setBadgeNumber(number: number): Promise<string>;
  setShowNotificationNow(showNotification: boolean): Promise<string>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAliyunPushModule>("ExpoAliyunPush");
