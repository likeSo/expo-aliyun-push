package expo.modules.aliyunpush

import android.content.Context
import com.alibaba.sdk.android.push.MessageReceiver
import com.alibaba.sdk.android.push.notification.CPushMessage

class ExpoAliyunPushMessageReceiver : MessageReceiver() {
    override fun onNotificationOpened(
        p0: Context?,
        title: String?,
        summary: String?,
        ext: String?
    ) {
        ExpoAliyunPushModule.sendEventToJS(
            "onNotificationOpened", mapOf(
                "title" to title,
                "summary" to summary,
                "ext" to ext
            )
        )
    }

    override fun onNotificationRemoved(p0: Context?, messageId: String?) {
        ExpoAliyunPushModule.sendEventToJS(
            "onNotificationRemoved", mapOf(
                "messageId" to messageId,
            )
        )
    }

    override fun onNotification(
        p0: Context?,
        title: String?,
        summary: String?,
        ext: MutableMap<String, String>?
    ) {
        ExpoAliyunPushModule.sendEventToJS(
            "onNotification", mapOf(
                "title" to title,
                "summary" to summary,
                "ext" to ext
            )
        )
    }

    override fun onMessage(p0: Context?, message: CPushMessage?) {
        ExpoAliyunPushModule.sendEventToJS(
            "onMessage", mapOf(
                "messageId" to message?.messageId,
                "appId" to message?.appId,
                "title" to message?.title,
                "content" to message?.content,
                "traceInfo" to message?.traceInfo
            )
        )
    }

    override fun onNotificationClickedWithNoAction(
        p0: Context?,
        title: String?,
        summary: String?,
        ext: String?
    ) {
        ExpoAliyunPushModule.sendEventToJS(
            "onNotificationClickedWithNoAction", mapOf(
                "title" to title,
                "summary" to summary,
                "ext" to ext
            )
        )
    }

    override fun onNotificationReceivedInApp(
        p0: Context?,
        title: String?,
        summary: String?,
        ext: MutableMap<String, String>?,
        openType: Int,
        openActivity: String?,
        openUrl: String?
    ) {
        ExpoAliyunPushModule.sendEventToJS(
            "onNotificationReceivedInApp", mapOf(
                "title" to title,
                "summary" to summary,
                "ext" to ext,
                "openType" to openType,
                "openActivity" to openActivity,
                "openUrl" to openUrl
            )
        )
    }


    override fun showNotificationNow(p0: Context?, p1: MutableMap<String, String>?): Boolean {
        return ExpoAliyunPushModule.showNotificationNow
    }
}