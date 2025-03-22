# expo-aliyun-push

React Native Expo 阿里云推送插件包。

# 安装

```shell
npx expo install expo-aliyun-push
```

# 配置

## Android

### Maven以及Proguard规则
首先，你需要使用`expo-build-properties`插件包给你的主项目添加maven仓库地址，用以识别阿里云原生插件包。

```shell
npx expo install expo-build-properties
```

然后，在你的`app.json`中添加以下配置：

```json
"plugins": [
    [
        "expo-build-properties",
        {
            "android": {
                "extraProguardRules": "",
                "extraMavenRepos": [
                    "https://maven.aliyun.com/nexus/content/repositories/releases/",
                    "https://developer.huawei.com/repo/"
                ]
            }
        }
    ]
]
```
`extraProguardRules`字段要写入以下内容：

```txt
# 阿里云推送
-keepclasseswithmembernames class ** {
    native <methods>;
}
-keepattributes Signature
-keep class sun.misc.Unsafe { *; }
-keep class com.taobao.** {*;}
-keep class com.alibaba.** {*;}
-keep class com.alipay.** {*;}
-keep class com.ut.** {*;}
-keep class com.ta.** {*;}
-keep class anet.**{*;}
-keep class anetwork.**{*;}
-keep class org.android.spdy.**{*;}
-keep class org.android.agoo.**{*;}
-keep class android.os.**{*;}
-keep class org.json.**{*;}
-dontwarn com.taobao.**
-dontwarn com.alibaba.**
-dontwarn com.alipay.**
-dontwarn anet.**
-dontwarn org.android.spdy.**
-dontwarn org.android.agoo.**
-dontwarn anetwork.**
-dontwarn com.ut.**
-dontwarn com.ta.**

# 小米通道
-keep class com.xiaomi.** {*;}
-dontwarn com.xiaomi.**

# 华为通道
-keep class com.huawei.** {*;}
-dontwarn com.huawei.**


# 荣耀通道
-ignorewarnings
-keepattributes *Annotation*
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes Signature
-keepattributes SourceFile,LineNumberTable
-keep class com.hihonor.push.**{*;}

# vivo通道
-keep class com.vivo.** {*;}
-dontwarn com.vivo.**

# OPPO通道
-keep public class * extends android.app.Service

# GCM/FCM通道
-keep class com.google.firebase.**{*;}
-dontwarn com.google.firebase.**

```

### 推送角标

华为、荣耀、VIVO三个厂商需要在清单文件中添加权限，本插件已经自动帮你做了。
然后角标部分由服务端下发，具体参考：[官方文档](https://help.aliyun.com/document_detail/2841265.html)。
插件提供了`setBadgeNumber`方法，供你手动修改角标。


## iOS

你要为你的应用启用推送通知能力。幸运的是，使用Expo之后，你不需要打开Xcode进行任何操作了。
你只需要在你的`app.json`中添加以下配置：
```json
    "ios": {
      "entitlements": {
        "aps-environment": "development"
      }
    }
```
这代表你的应用需要，或者说支持了推送权限的能力。

## 配置ID和Key

在你的`app.json`中添加以下配置：
```json
    "plugins": [
      [
        "expo-aliyun-push",
        {
          "androidAliyunAppKey": "",
          "androidAliyunAppSecret": "",
          "iosAliyunAppKey": "",
          "iosAliyunAppSecret": "",
          "xiaomiAppId": "",
          "xiaomiAppKey": "",
          "huaweiAppId": "",
          "honorAppId": "",
          "vivoAppId": "",
          "vivoAppKey": "",
          "oppoAppKey": "",
          "oppoAppSecret": "",
          "meizuAppId": "",
          "meizuAppKey": "",
          "fcmSendId": "",
          "fcmAppId": "",
          "fcmProjectId": "",
          "fcmApiKey": ""
        }
      ],
    ]
```
其中四个安卓和iOS的阿里云的Key和Secret是必填项，其余厂商的Key和ID可以不填或者传null，插件会根据你对应厂商字段是否有效来判断是否启用对应厂商的推送。

以上是所有的配置步骤，几乎全部都在`app.json`中完成，无需配置任何原生项目或者代码。

# 使用

本插件支持了几乎所有的阿里云Api，以下是Api定义：

```typescript

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
  ): Promise<string>;
  /**
   * 获取推送通知权限。
   */
  getNotificationPermissionStatus(): Promise<NotificationPermission>;
  /**
   * 跳转到系统推送通知设置页面。
   */
  jumpToNotificationSettings(): Promise<void>;
}

```

# 注意事项

- 本插件只支持Android和iOS平台。在Web平台，你依然可以正常调用所有Api，但是不会有任何效果。
- 阿里云推送需要先申请账号，包名需要和账号里面填的一致，不然会初始化失败！