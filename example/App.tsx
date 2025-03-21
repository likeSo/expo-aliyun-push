import { useEvent } from "expo";
import ExpoAliyunPush, { ExpoAliyunPushView } from "expo-aliyun-push";
import { useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function App() {
  const onChangePayload = useEvent(ExpoAliyunPush, "onNotification");
  const [deviceId, setDeviceId] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Group name="Constants">
          <Text>{ExpoAliyunPush.PI}</Text>
        </Group>
        <Group name="Functions">
          <Text>初始化阿里云SDK，包括三方插件</Text>
          <Button
            title="初始化"
            onPress={async () => {
              console.log(1111111);
              try {
                const result = await ExpoAliyunPush.initAliyunPush();
                const result2 = await ExpoAliyunPush.initThirdPush();
                Alert.alert(
                  "初始化",
                  JSON.stringify(result) + JSON.stringify(result2)
                );
              } catch (e) {
                Alert.alert("初始化", JSON.stringify(e));
              }
            }}
          />
        </Group>
        <Group name="Async functions">
          <Button
            title="获取设备号"
            onPress={async () => {
              console.log(22222);
              try {
                const result = await ExpoAliyunPush.getDeviceId();
                setDeviceId(result);
              } catch (e) {
                Alert.alert("获取设备号", JSON.stringify(e));
              }
            }}
          />
          <Text>{deviceId}</Text>
          <Button
            title="绑定设备号"
            onPress={async () => {
              try {
                const result = await ExpoAliyunPush.bindAccount("11111");
                Alert.alert("绑定设备号", JSON.stringify(result));
              } catch (e) {
                Alert.alert("绑定设备号", JSON.stringify(e));
              }
            }}
          />

          <Button
            title="创建消息通道"
            onPress={async () => {
              try {
                const result =
                  await ExpoAliyunPush.createAndroidNotificationChannel({
                    id: "11111",
                    name: "My channel",
                    description: "A channel to categorize your notifications",
                    importance: 'high'
                  });
                Alert.alert("创建通道", JSON.stringify(result));
              } catch (e) {
                Alert.alert("创建通道", JSON.stringify(e));
              }
            }}
          />
        </Group>
        <Group name="Events">
          <Text>{onChangePayload?.title}</Text>
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  view: {
    flex: 1,
    height: 200,
  },
};
