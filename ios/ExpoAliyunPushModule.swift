import ExpoModulesCore
import CloudPushSDK
import UserNotifications

public class ExpoAliyunPushModule: Module {
    static weak var moduleInstance: ExpoAliyunPushModule?
    static var notificationOptions: UNNotificationPresentationOptions = [.sound]
    let proxy = ExpoAliyunPushModuleDelegateProxy()
    
    
  // See https://docs.expo.dev/modules/module-api for more details about available components.
    
  public func definition() -> ModuleDefinition {
    Name("ExpoAliyunPush")
      OnCreate {
          Self.moduleInstance = self
      }

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants([
      "PI": Double.pi
    ])

    // Defines event names that the module can send to JavaScript.
      Events(
          "onNotification",
          "onNotificationReceivedInApp",
          "onNotificationOpened",
          "onMessage",
          "onNotificationClickedWithNoAction",
          "onNotificationRemoved"
      )
      
      AsyncFunction("initAliyunPush") { (promise: Promise) in
          if let appKey = Bundle.main.object(forInfoDictionaryKey: "ALIYUN_PUSH_APP_KEY") as? String, 
                let appSecret = Bundle.main.object(forInfoDictionaryKey: "ALIYUN_PUSH_APP_SECRET") as? String {
              CloudPushSDK.asyncInit(appKey, appSecret: appSecret) { result in
                  if let error = result?.error {
                      promise.reject(error)
                  } else {
                      promise.resolve(result?.data)
                  }
              }
              let notificationCenter = UNUserNotificationCenter.current()
              notificationCenter.getNotificationSettings { settings in
                  
              }
              notificationCenter.requestAuthorization(options: [.alert, .badge, .sound,]) { granted, error in
                  if granted {
                      DispatchQueue.main.async {
                          UIApplication.shared.registerForRemoteNotifications()
                      }
                  } else {
                      // TODO: 用户没有授权推送权限？
                  }
              }
              NotificationCenter.default.addObserver(proxy,
                                                     selector: #selector(proxy.onReceiveAliyunMessage),
                                                     name: NSNotification.Name("CCPDidReceiveMessageNotification"),
                                                     object: nil)
          } else {
              promise.reject("-1", "请在app.json正确配置iosAliyunAppKey和iosAliyunAppSecret")
          }
      }
      
      AsyncFunction("initThirdPush") {
          return true
      }
      
      AsyncFunction("getDeviceId") {
          return CloudPushSDK.getDeviceId()
      }
      
      AsyncFunction("setAliyunLogLevel") { (logLevel: String) in
          return true
      }
      
      AsyncFunction("bindAccount") { (account: String, promise: Promise) in
          CloudPushSDK.bindAccount(account) { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      AsyncFunction("unbindAccount") { (promise: Promise) in
          CloudPushSDK.unbindAccount { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      /// 阿里云iOS不支持绑定手机号
      AsyncFunction("bindPhoneNumber") { (account: String, promise: Promise) in
         return true
      }
      
      AsyncFunction("unbindPhoneNumber") { (promise: Promise) in
          return true
      }
      
      AsyncFunction("bindTag") { (target: String,
                                  tags: [String],
                                  alias: String?,
                                  promise: Promise) in
          //export type AliyunTagTarget = 'device' | 'account' | 'alias'
          // *    @param     target      目标类型，1：本设备  2：本设备绑定账号  3：别名
          let targetValue: Int32
          switch (target) {
          case "account":
              targetValue = 2
          case "alias":
              targetValue = 3
          default:
              targetValue = 1
          }
          CloudPushSDK.bindTag(targetValue, 
                               withTags: tags,
                               withAlias: alias) { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      AsyncFunction("unbindPhoneNumber") { (target: String,
                                            tags: [String],
                                            alias: String?,
                                            promise: Promise) in
          let targetValue: Int32
          switch (target) {
          case "account":
              targetValue = 2
          case "alias":
              targetValue = 3
          default:
              targetValue = 1
          }
          CloudPushSDK.unbindTag(targetValue,
                               withTags: tags,
                               withAlias: alias) { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      AsyncFunction("listTags") { (target: String,
                                            promise: Promise) in
          let targetValue: Int32
          switch (target) {
          case "account":
              targetValue = 2
          case "alias":
              targetValue = 3
          default:
              targetValue = 1
          }
          CloudPushSDK.listTags(targetValue) { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      
      AsyncFunction("addAlias") { (alias: String,
                                            promise: Promise) in
          
          CloudPushSDK.addAlias(alias) { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      
      AsyncFunction("removeAlias") { (alias: String,
                                            promise: Promise) in
          CloudPushSDK.removeAlias(alias) { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      AsyncFunction("listAlias") { (promise: Promise) in
          CloudPushSDK.listAliases { result in
              if let error = result?.error {
                  promise.reject(error)
              } else {
                  promise.resolve(result?.data)
              }
          }
      }
      
      
      AsyncFunction("setBadgeNumber") { (badgeNumber: Int) in
          DispatchQueue.main.async {
              if #available(iOS 16.0, *) {
                  UNUserNotificationCenter.current().setBadgeCount(badgeNumber)
              } else {
                  UIApplication.shared.applicationIconBadgeNumber = badgeNumber
              }
          }
      }
      
      AsyncFunction("setIOSForegroundNotificationOptions") { (optionList: [String]) in
          var options: UNNotificationPresentationOptions = []
          optionList.forEach { element in
              switch (element) {
              case "sound":
                  options.insert(.sound)
              case "badge":
                  options.insert(.badge)
              case "alert":
                  options.insert(.alert)
              case "list":
                  options.insert(.list)
              case "banner":
                  options.insert(.banner)
              default: break;
              }
          }
          Self.notificationOptions = options
      }
      
      
      AsyncFunction("getNotificationPermissionStatus") { (promise: Promise) in
          let center = UNUserNotificationCenter.current()
          center.getNotificationSettings { settings in
              switch settings.authorizationStatus {
              case .notDetermined:
                  promise.resolve("undetermined")
              case .denied:
                  promise.resolve("denied")
              case .authorized:
                  promise.resolve("granted")
              case .provisional:
                  promise.resolve("provisional")
              case .ephemeral:
                  promise.resolve("ephemeral")
              @unknown default:
                  promise.resolve("unknown")
              }
          }
      }
      
      AsyncFunction("jumpToNotificationSettings") {
          DispatchQueue.main.async {
              if let url = URL(string: UIApplication.openSettingsURLString) {
                  UIApplication.shared.open(url)
              }
          }
      }
      

    // Enables the module to be used as a native view. Definition components that are accepted as part of the
    // view definition: Prop, Events.
    View(ExpoAliyunPushView.self) {
      // Defines a setter for the `url` prop.
      Prop("url") { (view: ExpoAliyunPushView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }

      Events("onLoad")
    }
  }
}


class ExpoAliyunPushModuleDelegateProxy: NSObject, UNUserNotificationCenterDelegate {
    
    @objc func onReceiveAliyunMessage(_ note: Notification) {
        if let message = note.object as? CCPSysMessage {
            if let title = String(data: message.title, encoding: .utf8),
               let content = String(data: message.body, encoding: .utf8) {
                ExpoAliyunPushModule.moduleInstance?.sendEvent("onMessage", [
                    "title": title,
                    "content": content
                ])
            }
        }
    }
    
    func userNotificationCenter(_ center: UNUserNotificationCenter,
                                willPresent notification: UNNotification,
                                withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        ExpoAliyunPushModule.moduleInstance?.sendEvent("onNotificationReceivedInApp", 
                                                       ["ext": notification.request.content.userInfo,
                                                                                       "title": notification.request.content.title,
                                                                                       "summary": notification.request.content.body])
        completionHandler(ExpoAliyunPushModule.notificationOptions)
    }
}
