import {
  AndroidConfig,
  ConfigPlugin,
  withAndroidManifest,
  withAppBuildGradle,
  withInfoPlist,
  withPodfile,
  withXcodeProject,
  withDangerousMod,
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

  /**
   * 自定义通知铃声的铃声文件路径，注意，是在你项目文件的路径，例如：assets/music/notification.mp3
   * 假设文件名为notification.mp3，则会分别创建android/app/src/main/res/raw/notification.mp3和ios/notification.mp3
   */
  notificationSoundSourcePaths?: string[];

  /**
   * 额外的第三方推送配置文件路径映射
   * key: 源文件路径（相对于项目根目录）
   * value: 目标文件路径（相对于android/目录），只接受"/"和"/app/"
   * 例如: { "assets/google-services.json": "/app" }
   */
  extraAndroidThirdPartyPushConfigFiles?: Record<string, string>;
  /**
   * iOS额外推送配置文件路径列表。会放在ios/
   */
  extraIOSThirdPartyPushConfigFiles?: string[];
};

/// 安卓推送插件以及其依赖版本关系：https://help.aliyun.com/document_detail/434659.html?spm=a2c4g.11186623.0.0.64182bef1tJ1wl#topic-1996989
const withAliyunPush: ConfigPlugin<ConfigPluginProps> = (config, props) => {
  // 配置安卓
  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    // 添加通知铃声配置
    // if (props.notificationSoundSourcePaths?.length) {
    //   props.notificationSoundSourcePaths.forEach((sourcePath) => {
    //     const path = require("path");
    //     const sourceFullPath = path.join(
    //       config.modRequest.projectRoot,
    //       sourcePath
    //     );
    //     const fileName = path.basename(sourcePath);
    //     const targetDir = path.join(
    //       config.modRequest.projectRoot,
    //       "android/app/src/main/res/raw"
    //     );
    //     const targetPath = path.join(targetDir, fileName);

    //     AndroidConfig.Manifest.addMetaDataItemToMainApplication(
    //       mainApplication,
    //       "AndroidPushNotificationSoundPath",
    //       sourceFullPath
    //     );
    //   });
    // }

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
          ],
        },
        {
          action: [
            {
              $: {
                "android:name": "com.alibaba.sdk.android.push.RECEIVE",
              },
            },
          ],
        },
        {
          action: [
            {
              $: {
                "android:name": "com.alibaba.push2.action.NOTIFICATION_REMOVED",
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

  /// 配置安卓铃声，根据配置，把文件从/assets/xxx复制到android/app/src/main/res/raw/xxx
  config = withDangerousMod(config, [
    "android",
    async (config) => {
      if (props.notificationSoundSourcePaths?.length) {
        const fs = require("fs");
        const path = require("path");

        await Promise.all(
          props.notificationSoundSourcePaths.map(async (sourcePath) => {
            const sourceFullPath = path.join(
              config.modRequest.projectRoot,
              sourcePath
            );
            const fileName = path.basename(sourcePath);
            const targetDir = path.join(
              config.modRequest.projectRoot,
              "android/app/src/main/res/raw"
            );
            const targetPath = path.join(targetDir, fileName);

            // 确保目标目录存在
            if (!fs.existsSync(targetDir)) {
              fs.mkdirSync(targetDir, { recursive: true });
            }

            // 复制文件
            if (fs.existsSync(sourceFullPath)) {
              await fs.promises.copyFile(sourceFullPath, targetPath);
              console.log(
                `Copied sound file from ${sourceFullPath} to ${targetPath}`
              );
            } else {
              console.warn(
                `Warning: Sound file not found at ${sourceFullPath}`
              );
            }
          })
        );
      }
      return config;
    },
  ]);

  // 配置iOS铃声文件
  config = withDangerousMod(config, [
    "ios",
    async (config) => {
      if (props.notificationSoundSourcePaths?.length) {
        const fs = require("fs");
        const path = require("path");
        
        // 尝试获取包名 - 从项目根目录的package.json
        let packageName = "";
        try {
          const packageJsonPath = path.join(config.modRequest.projectRoot, "package.json");
          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
            packageName = packageJson.name;
            // 移除特殊字符
            packageName = packageName.replace(/[^a-zA-Z0-9]/g, "");
          }
        } catch (error) {
          console.warn("无法读取package.json文件:", error);
        }
        
        // 如果无法从package.json获取，尝试从app.json获取
        if (!packageName) {
          try {
            const appJsonPath = path.join(config.modRequest.projectRoot, "app.json");
            if (fs.existsSync(appJsonPath)) {
              const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
              packageName = appJson.expo?.name || appJson.name;
              if (packageName) {
                // 移除特殊字符
                packageName = packageName.replace(/[^a-zA-Z0-9]/g, "");
              }
            }
          } catch (error) {
            console.warn("无法读取app.json文件:", error);
          }
        }
        
        // 如果仍然无法获取包名，尝试从ios目录结构推断
        if (!packageName) {
          try {
            const iosDir = path.join(config.modRequest.projectRoot, "ios");
            if (fs.existsSync(iosDir)) {
              const entries = fs.readdirSync(iosDir, { withFileTypes: true });
              // 查找第一个不是Pods且是目录的条目
              const appDir = entries.find((entry: any) => 
                entry.isDirectory() && 
                entry.name !== "Pods" && 
                entry.name !== "build" &&
                !entry.name.endsWith(".xcworkspace") &&
                !entry.name.endsWith(".xcodeproj")
              );
              if (appDir) {
                packageName = appDir.name;
              }
            }
          } catch (error) {
            console.warn("无法从iOS目录结构推断包名:", error);
          }
        }
        
        // 如果无法获取包名，使用默认目录
        const iosDir = path.join(config.modRequest.projectRoot, "ios");
        const targetDir = packageName ? path.join(iosDir, packageName) : iosDir;
        
        // 确保目标目录存在
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        
        // 复制所有铃声文件
        await Promise.all(
          props.notificationSoundSourcePaths.map(async (sourcePath) => {
            const sourceFullPath = path.join(
              config.modRequest.projectRoot,
              sourcePath
            );
            const fileName = path.basename(sourcePath);
            const targetPath = path.join(targetDir, fileName);
            
            // 复制文件
            if (fs.existsSync(sourceFullPath)) {
              await fs.promises.copyFile(sourceFullPath, targetPath);
              console.log(
                `Copied sound file from ${sourceFullPath} to ${targetPath}`
              );
            } else {
              console.warn(
                `Warning: Sound file not found at ${sourceFullPath}`
              );
            }
          })
        );
      }
      return config;
    },
  ]);
  
    // 将铃声文件添加到Xcode项目中
  config = withXcodeProject(config, (config) => {
    if (props.notificationSoundSourcePaths?.length) {
      const path = require("path");
      const fs = require("fs");
      
      try {
        // 获取主目标
        const project = config.modResults;
        const mainGroup = project.getFirstProject().firstProject.mainGroup;
        const mainTargetUuid = project.getFirstTarget().uuid;
        
        // 添加每个铃声文件到项目中
        props.notificationSoundSourcePaths.forEach((sourcePath) => {
          const fileName = path.basename(sourcePath);
          
          try {
            // 获取文件的完整路径
            const iosDir = path.join(config.modRequest.projectRoot, "ios");
            const filePath = path.join(iosDir, fileName);
            
            // 检查文件是否存在
            if (!fs.existsSync(filePath)) {
              console.warn(`Warning: Sound file not found at ${filePath}`);
              return;
            }
            
            // 使用更可靠的方式添加资源文件
            // 首先创建文件引用
            const fileOptions = {
              lastKnownFileType: 'audio.wav', // 根据文件类型调整
              name: fileName,
              path: fileName,
              sourceTree: '<group>'
            };
            
            // 添加文件到项目的资源构建阶段
            const file = project.addFile(fileName, mainGroup, fileOptions);
            if (file) {
              // 将文件添加到目标的构建阶段
              project.addToPbxBuildFileSection(file);
              project.addToPbxResourcesBuildPhase(file);
              
              console.log(`Successfully added ${fileName} to Xcode project`);
            } else {
              console.warn(`Failed to add ${fileName} to Xcode project`);
            }
          } catch (error) {
            console.error(`Error adding ${fileName} to Xcode project:`, error);
          }
        });
      } catch (error) {
        console.error("Error in Xcode project modification:", error);
      }
    }
    
    return config;
  });
  

  // 按需配置安卓三方推送依赖
  // config = withAppBuildGradle(config, (config) => {
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

  //   return config;
  // });

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
