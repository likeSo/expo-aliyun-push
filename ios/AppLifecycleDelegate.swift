//
//  AppLifecycleDelegate.swift
//  ExpoAliyunPush
//
//  Created by Aron on 2025/3/21.
//

import ExpoModulesCore
import CloudPushSDK


public class AppLifecycleDelegate: ExpoAppDelegateSubscriber {
    
    public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        CloudPushSDK.sendNotificationAck(launchOptions)
        if let userInfo = launchOptions?[.remoteNotification] as? [AnyHashable: Any] {
            ExpoAliyunPushModule.moduleInstance?.sendEvent("onNotificationOpened", ["ext": userInfo])
        }
        return true
    }

    public func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        CloudPushSDK.registerDevice(deviceToken) { result in
            if result?.success == true {
                // 没有结果就是最好的结果
            } else {
#if DEBUG
                print("iOS上报阿里云设备号失败，原因是：\(String(describing: result?.description))")
#endif
            }
        }
    }
    
    public func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
#if DEBUG
        print("iOS注册APNs服务失败，原因是：\(String(describing: error))")
#endif
    }
    
    public func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
        CloudPushSDK.sendNotificationAck(userInfo)
        
        ExpoAliyunPushModule.moduleInstance?.sendEvent("onNotificationOpened", ["ext": userInfo])
        completionHandler(.noData)
    }
}
