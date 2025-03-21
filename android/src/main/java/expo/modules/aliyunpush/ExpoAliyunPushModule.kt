package expo.modules.aliyunpush

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import com.alibaba.sdk.android.push.CloudPushService
import com.alibaba.sdk.android.push.CommonCallback
import com.alibaba.sdk.android.push.HonorRegister
import com.alibaba.sdk.android.push.huawei.HuaWeiRegister
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory
import com.alibaba.sdk.android.push.register.GcmRegister
import com.alibaba.sdk.android.push.register.MeizuRegister
import com.alibaba.sdk.android.push.register.MiPushRegister
import com.alibaba.sdk.android.push.register.OppoRegister
import com.alibaba.sdk.android.push.register.VivoRegister
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.net.URL

class ExpoAliyunPushModule : Module() {
    companion object {
        private var moduleInstance: ExpoAliyunPushModule? = null
        var showNotificationNow = true

        fun sendEventToJS(eventName: String, params: Map<String, Any?>) {
            moduleInstance?.sendEvent(eventName, params)
        }
    }

    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    @SuppressLint("WrongConstant")
    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ExpoAliyunPush')` in JavaScript.
        Name("ExpoAliyunPush")

        // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
        Constants(
            "PI" to Math.PI
        )

        // Defines event names that the module can send to JavaScript.
        Events(
            "onNotification",
            "onNotificationReceivedInApp",
            "onNotificationOpened",
            "onMessage",
            "onNotificationClickedWithNoAction",
            "onNotificationRemoved"
        )

        OnCreate {
            moduleInstance = this@ExpoAliyunPushModule
            // 根据阿里云官方文档，SDK初始化必须在Application onCreate中进行
            // https://help.aliyun.com/document_detail/434660.html
            PushServiceFactory.init(appContext.reactContext)
        }

        AsyncFunction("initAliyunPush") { promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.register(
                appContext.reactContext,
                object : CommonCallback {
                    override fun onSuccess(success: String) {
                        promise.resolve(success)
                    }

                    override fun onFailed(errorCode: String, errorMessage: String) {
                        promise.reject(errorCode, errorMessage, null)
                    }
                })
        }
        //       val applicationInfo = appContext?.reactContext?.packageManager?.getApplicationInfo(appContext?.reactContext?.packageName.toString(), PackageManager.GET_META_DATA)

        AsyncFunction("initThirdPush") { promise: Promise ->
            val application = appContext.reactContext?.applicationContext as android.app.Application
            val applicationInfo = appContext.reactContext?.packageManager?.getApplicationInfo(
                appContext.reactContext?.packageName.toString(),
                PackageManager.GET_META_DATA
            )
            val xiaoMiAppId = applicationInfo?.metaData?.getString("XIAOMI_PUSH_APP_ID")
            val xiaoMiAppKey = applicationInfo?.metaData?.getString("XIAOMI_PUSH_APP_KEY")
            if (xiaoMiAppId != null && xiaoMiAppKey != null) {
                MiPushRegister.register(application, xiaoMiAppId, xiaoMiAppKey)
            }

            val oppoAppKey = applicationInfo?.metaData?.getString("OPPO_PUSH_APP_KEY")
            val oppoAppSecret = applicationInfo?.metaData?.getString("OPPO_PUSH_APP_SECRET")
            if (oppoAppKey != null && oppoAppSecret != null) {
                OppoRegister.register(application, oppoAppKey, oppoAppSecret)
            }

            val meizuAppId = applicationInfo?.metaData?.getString("MEIZU_PUSH_APP_ID")
            val meizuAppKey = applicationInfo?.metaData?.getString("MEIZU_PUSH_APP_KEY")
            if (meizuAppId != null && meizuAppKey != null) {
                MeizuRegister.register(application, meizuAppId, meizuAppKey)
            }

            val fcmAppId = applicationInfo?.metaData?.getString("FIREBASE_PUSH_APP_ID")
            val fcmProjectId = applicationInfo?.metaData?.getString("FIREBASE_PUSH_PROJECT_ID")
            val fcmApiKey = applicationInfo?.metaData?.getString("FIREBASE_PUSH_API_KEY")
            val fcmSendId = applicationInfo?.metaData?.getString("FIREBASE_PUSH_SEND_ID")
            if (fcmSendId != null && fcmProjectId != null && fcmApiKey != null && fcmAppId != null) {
                GcmRegister.register(application, fcmSendId, fcmAppId, fcmProjectId, fcmApiKey)
            }


            HuaWeiRegister.register(application)
            HonorRegister.register(application)
            VivoRegister.register(application)
        }

        AsyncFunction("setAliyunLogLevel") { level: String ->
            val pushService = PushServiceFactory.getCloudPushService()
            when (level) {
                "off" -> {
                    pushService.setLogLevel(CloudPushService.LOG_OFF)
                }

                "error" -> {
                    pushService.setLogLevel(CloudPushService.LOG_ERROR)
                }

                "info" -> {
                    pushService.setLogLevel(CloudPushService.LOG_INFO)
                }

                "debug" -> {
                    pushService.setLogLevel(CloudPushService.LOG_DEBUG)
                }
            }
        }

        AsyncFunction("bindAccount") { account: String, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.bindAccount(account, object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("unbindAccount") { promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.unbindAccount(object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("bindPhoneNumber") { phone: String, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.bindPhoneNumber(phone, object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("unbindPhoneNumber") { promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.unbindPhoneNumber(object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("bindTag") { target: String, tags: Array<String>, alias: String?, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            var targetInt = CloudPushService.DEVICE_TARGET;
            when (target) {
                "device" -> {
                    targetInt = CloudPushService.DEVICE_TARGET;
                }

                "account" -> {
                    targetInt = CloudPushService.ACCOUNT_TARGET;
                }

                "alias" -> {
                    targetInt = CloudPushService.ALIAS_TARGET;
                }
            }
            pushService.bindTag(targetInt, tags, alias, object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("unbindTag") { target: String, tags: Array<String>, alias: String?, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            var targetInt = CloudPushService.DEVICE_TARGET;
            when (target) {
                "device" -> {
                    targetInt = CloudPushService.DEVICE_TARGET;
                }

                "account" -> {
                    targetInt = CloudPushService.ACCOUNT_TARGET;
                }

                "alias" -> {
                    targetInt = CloudPushService.ALIAS_TARGET;
                }
            }
            pushService.unbindTag(targetInt, tags, alias, object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("listTags") { target: String, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            var targetInt = CloudPushService.DEVICE_TARGET;
            when (target) {
                "device" -> {
                    targetInt = CloudPushService.DEVICE_TARGET;
                }

                "account" -> {
                    targetInt = CloudPushService.ACCOUNT_TARGET;
                }

                "alias" -> {
                    targetInt = CloudPushService.ALIAS_TARGET;
                }
            }
            pushService.listTags(targetInt, object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("addAlias") { alias: String, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.addAlias(alias, object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("removeAlias") { alias: String, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.removeAlias(alias, object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("listAlias") { promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            pushService.listAliases(object : CommonCallback {
                override fun onSuccess(p0: String?) {
                    promise.resolve(p0)
                }

                override fun onFailed(p0: String?, p1: String?) {
                    if (p0 != null) {
                        promise.reject(p0, p1, null)
                    }
                }
            })
        }

        AsyncFunction("setBadgeNumber") { badge: Int, promise: Promise ->
            val pushService = PushServiceFactory.getCloudPushService()
            val application = appContext.reactContext?.applicationContext as android.app.Application
            pushService.setBadgeNum(application, badge)
        }

        AsyncFunction("getDeviceId") {
            return@AsyncFunction PushServiceFactory.getCloudPushService().deviceId;
        }

        AsyncFunction("createAndroidNotificationChannel") { channelInfo: ExpoAliyunPushChannelObject, promise: Promise ->
            val application = appContext.reactContext?.applicationContext as android.app.Application
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val notificationManager =
                    application.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                var importanceIntValue = NotificationManager.IMPORTANCE_DEFAULT;
                // TODO: when报错因为Record定义的时候写的是常量，不影响使用
                when (channelInfo.importance) {
                    "none" -> {
                        importanceIntValue = NotificationManager.IMPORTANCE_NONE
                    }

                    "min" -> {
                        importanceIntValue = NotificationManager.IMPORTANCE_MIN
                    }

                    "low" -> {
                        importanceIntValue = NotificationManager.IMPORTANCE_LOW
                    }

                    "default" -> {
                        importanceIntValue = NotificationManager.IMPORTANCE_DEFAULT
                    }

                    "high" -> {
                        importanceIntValue = NotificationManager.IMPORTANCE_HIGH
                    }

                    "max" -> {
                        importanceIntValue = NotificationManager.IMPORTANCE_MAX
                    }
                }
                val channel =
                    NotificationChannel(channelInfo.id, channelInfo.name, importanceIntValue);
                if (channelInfo.group != null) {
                    channel.group = channelInfo.group
                }
                if (channelInfo.description != null) {
                    channel.description = channelInfo.description
                }
                if (channelInfo.allowBubbles == true && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    channel.setAllowBubbles(true)
                }
                if (channelInfo.enableLights == true) {
                    channel.enableLights(true)
                }
                if (channelInfo.lightColor != null) {
                    channel.lightColor = channelInfo.lightColor
                }
                if (channelInfo.showBadges == true) {
                    channel.setShowBadge(true)
                }
                if (channelInfo.enableVibration == true) {
                    channel.enableVibration(true)
                }
                if (channelInfo.vibrationPattern != null) {
                    channel.vibrationPattern = channelInfo.vibrationPattern.toLongArray()
                }
                if (!channelInfo.soundPath.isNullOrBlank()) {
                    val soundFile = File(channelInfo.soundPath)
                    if (soundFile.exists() && soundFile.isFile && soundFile.canRead()) {
                        val soundBuilder = AudioAttributes.Builder()
                        if (channelInfo.soundUsage != null) {
                            soundBuilder.setUsage(channelInfo.soundUsage)
                        }
                        if (channelInfo.soundContentType != null) {
                            soundBuilder.setContentType(channelInfo.soundContentType)
                        }
                        if (channelInfo.soundFlag != null) {
                            soundBuilder.setFlags(channelInfo.soundFlag)
                        }
                        channel.setSound(Uri.fromFile(soundFile), soundBuilder.build())
                    }
                }
                notificationManager.createNotificationChannel(channel)

            } else {
                promise.reject(
                    "-1",
                    "Android version is below Android O which is not support create channel",
                    null
                )
            }
        }

        AsyncFunction("setShowNotificationNow") { showNotification: Boolean ->
            showNotificationNow = showNotification
        }

        // Enables the module to be used as a native view. Definition components that are accepted as part of
        // the view definition: Prop, Events.
        View(ExpoAliyunPushView::class) {
            // Defines a setter for the `url` prop.
            Prop("url") { view: ExpoAliyunPushView, url: URL ->
                view.webView.loadUrl(url.toString())
            }
            // Defines an event that the view can send to JavaScript.
            Events("onLoad")
        }
    }
}
