#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
//#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <SerialCommand.h>

extern "C" {
  #include "user_interface.h"  
}

const byte RX = D1;
const byte TX = D2;

SoftwareSerial mySerial = SoftwareSerial(RX, TX, false);
SerialCommand sCmd(mySerial);

String inputString = "";
bool stringComplete = false;
String inputString1 = "";
bool stringComplete1 = false;

#define DEBUG

SocketIOClient client;
const char* ssid = "realme C3i";          //Tên mạng Wifi mà Socket server của bạn đang kết nối
const char* password = "01012000";  //Pass mạng wifi ahihi, anh em rãnh thì share pass cho mình với.
 
char host[] = "192.168.43.172";  //Địa chỉ IP dịch vụ, hãy thay đổi nó theo địa chỉ IP Socket server của bạn.
int port = 3484;                  //Cổng dịch vụ socket server do chúng ta tạo!
 
//từ khóa extern: dùng để #include các biến toàn cục ở một số thư viện khác. Trong thư viện SocketIOClient có hai biến toàn cục
// mà chúng ta cần quan tâm đó là
// RID: Tên hàm (tên sự kiện
// Rfull: Danh sách biến (được đóng gói lại là chuối JSON)
extern String RID;
//extern String Rfull;
extern String Rfull;
 
 
//Một số biến dùng cho việc tạo một task
unsigned long previousMillis = 0;
long interval = 1000;

String ChuoiSendJson = "{\"Do\":\"" + String(1) + "\"," +
                     "\"XANH\":\"" + String(2) + "\"," +
                     "\"VANG\":\"" + String(3) +  "\"}";

 
void setup()
{
    //Bật baudrate ở mức 115200 để giao tiếp với máy tính qua Serial
    Serial.begin(57600);
//    ​mySerial.begin(57600);
    mySerial.begin(57600);
    delay(10);
 
    //Việc đầu tiên cần làm là kết nối vào mạng Wifi
    Serial.print("Ket noi vao mang ");
    Serial.println(ssid);
 
    //Kết nối vào mạng Wifi
    WiFi.begin(ssid, password);
 
    //Chờ đến khi đã được kết nối
    while (WiFi.status() != WL_CONNECTED) { //Thoát ra khỏi vòng 
        delay(500);
        Serial.print('.');
    }
 
    Serial.println();
    Serial.println(F("Da ket noi WiFi"));
    Serial.println(F("Di chi IP cua ESP8266 (Socket Client ESP8266): "));
    Serial.println(WiFi.localIP());
 
    if (!client.connect(host, port)) {
        Serial.println(F("Ket noi den socket server that bai!"));
        return;
    }

 
    //Khi đã kết nối thành công
    if (client.connected()) {
        //Thì gửi sự kiện ("connection") đến Socket server ahihi.
        client.send("connection", "message", "Connected !!!!");
    }

    sCmd.addDefaultHandler(defaultCommand);
    Serial.println("Dan san sang nhan JSON Hai Ngu Nay");

    //Arduno send json ​root.printTo(mySerial); 
}
 
void loop()
{
    //tạo một task cứ sau "interval" giây thì chạy lệnh:
    if (millis() - previousMillis > interval) {
        //lệnh:
        previousMillis = millis();
 
        //gửi sự kiện "atime" là một JSON chứa tham số message có nội dung là Time please?
        client.send("atime", "message", "Hai ML");
        client.sendJSON("colors", ChuoiSendJson);
    }
 
    //Khi bắt được bất kỳ sự kiện nào thì chúng ta có hai tham số:
    //  +RID: Tên sự kiện
    //  +RFull: Danh sách tham số được nén thành chuỗi JSON!
    if (client.monitor()) {
        Serial.println(RID);
//        Serial.println(Rfull);
    }
 
    //Kết nối lại!
    if (!client.connected()) {
      client.reconnect(host, port);
    }
}

void defaultCommand(String command){
  char *json = sCmd.next();
  //send json to socket server

  //in ra Serial montitor de debugger
  //    Serial.print(command);
  Serial.print(json);
}