package expo.modules.aliyunpush

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

/// 创建安卓推送通道所需全部参数
class ExpoAliyunPushChannelObject: Record {
    @Field
    val id: String = ""
    @Field
    val name: String = ""
    @Field
    val importance: String = ""
    @Field
    val description: String? = null
    @Field
    val group: String? = null
    @Field
    val allowBubbles: Boolean? = null
    @Field
    val enableLights: Boolean? = null
    @Field
    val lightColor: Int? = null
    @Field
    val showBadges: Boolean? = null
    @Field
    val enableVibration: Boolean? = null
    @Field
    val vibrationPattern: List<Long>? = null
    @Field
    val soundPath: String? = null
    @Field
    val soundUsage: Int? = null
    @Field
    val soundContentType: Int? = null
    @Field
    val soundFlag: Int? = null
}