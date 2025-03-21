# expo-aliyun-push

React Native Expo 阿里云推送插件包。

# 安装

```shell
npx expo install expo-aliyun-push
```

## 配置

### Android

#### Maven以及Proguard规则
首先，你需要使用`expo-build-properties`插件包给你的主项目添加maven仓库地址，用以识别阿里云原生插件包。

```shell
npx expo install expo-build-properties
```

然后，在你的`app.json`中添加以下配置：

```json
...
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
...
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

#### 推送角标

华为、荣耀、VIVO三个厂商需要在清单文件中添加权限，本插件已经自动帮你做了。
然后角标部分由服务端下发，具体参考：[官方文档](https://help.aliyun.com/document_detail/2841265.html)。
插件提供了`setBadgeNumber`方法，供你手动修改角标。