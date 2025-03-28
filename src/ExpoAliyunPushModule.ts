import { NativeModule, requireNativeModule } from "expo";

import {
  AliyunPushLogLevel,
  AliyunTagTarget,
  AndroidNotificationChannel,
  ExpoAliyunPushModuleEvents,
  IOSNotificationForegroundOptions,
  XiaomiInternationalPushRegion,
} from "./ExpoAliyunPush.types";

declare class ExpoAliyunPushModule extends NativeModule<ExpoAliyunPushModuleEvents> {
  /**
   * 初始化阿里云推送。
   */
  initAliyunPush(): Promise<void>;
  /**
   * 初始化三方推送。安卓平台需要调用。
   */
  initThirdPush(): Promise<void>;
  /**
   * 初始化成功后，获取设备号。
   */
  getDeviceId(): Promise<string>;

  /**
   * 设置阿里云推送的日志级别。
   * @param logLevel 日志级别。
   */
  setAliyunLogLevel(logLevel: AliyunPushLogLevel): Promise<string>;

  /**
   * 创建安卓推送通道。
   * @param channelInfo 安卓推送通道信息。
   */
  createAndroidNotificationChannel(
    channelInfo: AndroidNotificationChannel
  ): Promise<void>;

  /**
   * 绑定账号。
   * @param account 账号。
   */
  bindAccount(account: string): Promise<string>;
  /**
   * 解绑账号。
   */
  unbindAccount(): Promise<string>;
  /**
   * 绑定设备。
   * @param deviceId 设备号。
   */
  bindPhoneNumber(phoneNumber: string): Promise<string>;
  /**
   * 解绑设备。
   */
  unbindPhoneNumber(): Promise<string>;
  /**
   * 为目标设备绑定别名和标签。
   * @param target 目标设备类型。
   * @param tags 标签列表。
   * @param alias 别名。当设备类型为别名时有效。
   */
  bindTag(
    target: AliyunTagTarget,
    tags: string[],
    alias: string | undefined | null
  ): Promise<string>;
  /**
   * 为目标设备解绑别名和标签。
   * @param target 目标设备类型。
   * @param tags 标签列表。
   * @param alias 别名。当设备类型为别名时有效。
   */
  unbindTag(
    target: AliyunTagTarget,
    tags: string[],
    alias: string | undefined | null
  ): Promise<string>;
  /**
   * 查询当前设备已绑定的标签。
   * @param target 目标设备类型。
   */
  listTags(target: AliyunTagTarget): Promise<string>;
  /**
   * 为当前设备添加别名。
   * @param alias 别名。
   */
  addAlias(alias: string): Promise<string>;
  /**
   * 为当前设备移除别名。
   * @param alias 别名。
   */
  removeAlias(alias: string): Promise<string>;
  /**
   * 查询当前设备已绑定的别名。
   */
  listAlias(): Promise<string>;
  /**
   * 设置应用程序角标数量。
   * @param number 角标数量。
   */
  setBadgeNumber(number: number): Promise<string>;
  /**
   * 当iOS在前台收到推送通知的时候，设置通知显示选项。
   * @param options 通知显示选项。
   */
  setIOSForegroundNotificationOptions(
    options: IOSNotificationForegroundOptions[]
  ): Promise<void>;
  /**
   * 获取推送通知权限。
   */
  getNotificationPermissionStatus(): Promise<NotificationPermission>;
  /**
   * 跳转到系统推送通知设置页面。
   */
  jumpToNotificationSettings(): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoAliyunPushModule>("ExpoAliyunPush");
