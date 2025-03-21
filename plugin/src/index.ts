import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withAppBuildGradle,
  withInfoPlist,
  withPodfile,
} from "expo/config-plugins";

/// 本插件所支持的所有app.json配置
type ConfigPluginProps = {
  androidAliyunAppKey: string;
  androidAliyunAppSecret: string;

  iosAliyunAppKey: string;
  iosAliyunAppSecret: string;

  /// 小米
  xiaomiAppId?: string;
  xiaomiAppKey?: string;

  /// 华为
  huaweiAppId?: string;

  /// 荣耀
  honorAppId?: string;

  /// vivo
  vivoAppId?: string;
  vivoAppKey?: string;

  /// oppo
  oppoAppKey?: string;
  oppoAppSecret?: string;

  /// 魅族
  meizuAppId?: string;
  meizuAppKey?: string;

  /// Firebase
  fcmSendId?: string;
  fcmAppId?: string;
  fcmProjectId?: string;
  fcmApiKey?: string;
};

/// 安卓推送插件以及其依赖版本关系：https://help.aliyun.com/document_detail/434659.html?spm=a2c4g.11186623.0.0.64182bef1tJ1wl#topic-1996989
const withAliyunPush: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  // 配置安卓
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "com.alibaba.app.appkey",
      props.androidAliyunAppKey
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "com.alibaba.app.appsecret",
      props.androidAliyunAppSecret
    );
    // 写入小米字段
    if (props.xiaomiAppId && props.xiaomiAppKey) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "XIAOMI_PUSH_APP_ID",
        props.xiaomiAppId
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "XIAOMI_PUSH_APP_KEY",
        props.xiaomiAppKey
      );
      // AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      //   mainApplication,
      //   "XIAOMI_PUSH_INTERNATIONAL",
      //   props.xiaomiInternational ? "1" : "0"
      // );
    }

    if (props.oppoAppKey && props.oppoAppSecret) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "OPPO_PUSH_APP_KEY",
        props.oppoAppKey
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "OPPO_PUSH_APP_SECRET",
        props.oppoAppSecret
      );
    }

    if (props.huaweiAppId) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.huawei.hms.client.appid",
        props.huaweiAppId
      );
    }

    if (props.honorAppId) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.hihonor.push.app_id",
        props.honorAppId
      );
    }

    if (props.vivoAppId && props.vivoAppKey) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.vivo.push.app_id",
        props.vivoAppId
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "com.vivo.push.api_key",
        props.vivoAppKey
      );
    }

    // 添加魅族依赖
    if (props.meizuAppId && props.meizuAppKey) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "MEIZU_PUSH_APP_ID",
        props.meizuAppId
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "MEIZU_PUSH_APP_KEY",
        props.meizuAppKey
      );
    }

    if (
      props.fcmAppId &&
      props.fcmProjectId &&
      props.fcmApiKey &&
      props.fcmSendId
    ) {
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_APP_ID",
        props.fcmAppId
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_PROJECT_ID",
        props.fcmProjectId
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_API_KEY",
        props.fcmApiKey
      );
      AndroidConfig.Manifest.addMetaDataItemToMainApplication(
        mainApplication,
        "FIREBASE_PUSH_SEND_ID",
        props.fcmSendId
      );
    }

    // config.modResults.manifest.application[0].receiver
    mainApplication.receiver = mainApplication.receiver || [];
    mainApplication.receiver.push({
      $: {
        "android:name": "expo.modules.aliyunpush.ExpoAliyunPushMessageReceiver",
        "android:exported": "false",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "com.alibaba.push2.action.NOTIFICATION_OPENED",
              },
            },
            {
              $: {
                "android:name": "com.alibaba.push2.action.NOTIFICATION_REMOVED",
              },
            },
            {
              $: {
                "android:name": "com.alibaba.sdk.android.push.RECEIVE",
              },
            },
          ],
        },
      ],
    });

    if (!config.modResults.manifest["uses-permission"]) {
      config.modResults.manifest["uses-permission"] = [];
    }
    config.modResults.manifest["uses-permission"].push(
      {
        $: {
          "android:name":
            "com.hihonor.android.launcher.permission.CHANGE_BADGE",
        },
      },
      {
        $: {
          "android:name": "com.huawei.android.launcher.permission.CHANGE_BADGE",
        },
      },
      {
        $: {
          "android:name": "com.vivo.notification.permission.BADGE_ICON",
        },
      }
    );

    return config;
  });

  // 按需配置安卓三方推送依赖
  config = withAppBuildGradle(config, (config) => {
    // config.modResults.contents = addDependency(
    //   config.modResults.contents,
    //   "com.aliyun.ams:alicloud-android-third-push:3.9.2"
    // );
    // 添加小米依赖
    // if (props.xiaomiAppId && props.xiaomiAppKey) {
    //   const isInternationalUser = props.xiaomiInternational == true;
    //   if (isInternationalUser) {
    //     config.modResults.contents = addDependency(
    //       config.modResults.contents,
    //       "com.aliyun.ams:alicloud-android-third-push-xiaomi:3.8.8-intel"
    //     );
    //   } else {
    //     config.modResults.contents = addDependency(
    //       config.modResults.contents,
    //       "com.aliyun.ams:alicloud-android-third-push-xiaomi:3.9.2"
    //     );
    //   }
    // }
    // // 添加华为依赖
    // if (props.huaweiAppId) {
    //   config.modResults.contents = addDependency(
    //     config.modResults.contents,
    //     "com.aliyun.ams:alicloud-android-third-push-huawei:3.9.2"
    //   );
    //   config.modResults.contents = addDependency(
    //     config.modResults.contents,
    //     "com.huawei.hms:push:6.12.0.300"
    //   );
    // }
    // 添加荣耀依赖
    // if (props.honorAppId) {
    //   //com.aliyun.ams:alicloud-android-third-push-honor

    //   config.modResults.contents = addDependency(
    //     config.modResults.contents,
    //     "com.aliyun.ams:alicloud-android-third-push-honor:3.9.2"
    //   );
    // }
    // // 添加vivo依赖
    // if (props.vivoAppId && props.vivoAppKey) {
    //   config.modResults.contents = addDependency(
    //     config.modResults.contents,
    //     "com.aliyun.ams:alicloud-android-third-push-vivo:3.9.2"
    //   );
    // }

    // 添加oppo依赖
    // if (props.oppoAppKey && props.oppoAppSecret) {
    //   config.modResults.contents = addDependency(
    //     config.modResults.contents,
    //     "com.aliyun.ams:alicloud-android-third-push-oppo:3.9.2"
    //   );
    // }

    // 添加魅族依赖
    // if (props.meizuAppId && props.meizuAppKey) {
    //   config.modResults.contents = addDependency(
    //     config.modResults.contents,
    //     "com.aliyun.ams:alicloud-android-third-push-meizu:3.9.2"
    //   );
    // }

    // if (
    //   props.fcmAppId &&
    //   props.fcmProjectId &&
    //   props.fcmApiKey &&
    //   props.fcmSendId
    // ) {
    //   config.modResults.contents = addDependency(
    //     config.modResults.contents,
    //     "com.aliyun.ams:alicloud-android-third-push-fcm:3.9.2"
    //   );
    // }

    return config;
  });

  /// 配置iOS
  config = withInfoPlist(config, (config) => {
    config.modResults["ALIYUN_PUSH_APP_KEY"] = props.iosAliyunAppKey;
    config.modResults["ALIYUN_PUSH_APP_SECRET"] = props.iosAliyunAppSecret;
    return config;
  });

  config = withPodfile(config, (config) => {
    const additionalPodSpecs =
      "source 'https://github.com/CocoaPods/Specs.git'\nsource 'https://github.com/aliyun/aliyun-specs.git'\n";
    config.modResults.contents =
      additionalPodSpecs + config.modResults.contents;
    return config;
  });

  return config;
};

export default withAliyunPush;

/**
 * 向build.gradle中动态添加依赖
 * @param buildGradleContents build.gradle文件内容
 * @param dependency 新的依赖
 * @returns 修改后的build.gradle文件内容
 */
function addDependency(buildGradleContents: string, dependency: string) {
  const dependencyLine = `    implementation '${dependency}'`;

  // 如果依赖已经存在，先删除已存在的依赖行，然后重新添加
  if (buildGradleContents.includes(dependencyLine)) {
    buildGradleContents = buildGradleContents.replace(
      dependencyLine + "\n",
      ""
    );
    buildGradleContents = buildGradleContents.replace(dependencyLine, "");
  }

  const dependenciesBlockRegex = /dependencies\s*{([^}]*)}/;
  const match = buildGradleContents.match(dependenciesBlockRegex);

  if (!match) {
    return buildGradleContents + `\ndependencies {\n${dependencyLine}\n}`;
  }

  // 在 dependencies 块的开头插入新的依赖
  const updatedBuildGradle = buildGradleContents.replace(
    dependenciesBlockRegex,
    (match, depsContent) => {
      return `dependencies {\n${dependencyLine}${depsContent}}`;
    }
  );

  return updatedBuildGradle;
}
