#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
#include <SoftwareSerial.h>

SoftwareSerial mySerial(D1, D2); 

#define DEBUG

SocketIOClient client;
const char* ssid = "realme C3i";
const char* password = "01012000";

char host[] = "192.168.43.172"; 
int port = 3000;
 
extern String RID;
extern String Rname;
extern String Rcontent;
 
//Một số biến dùng cho việc tạo một task
//unsigned long previousMillis = 0;
//long interval = 1000;

String s = "";

void setup(){
    Serial.begin(9600);
    mySerial.begin(9600);
    
    delay(10);
 
    Serial.print("Ket noi vao mang ");
    Serial.println(ssid);
    
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
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

 
    if (client.connected()) {
        client.send("connection", "message", "Connected !!!!");
    }
}
 
void loop(){
   if(mySerial.available()){
      char c = mySerial.read();
      s += c;
      if(c == '#') {
        client.send("colors", "colors", s);
      }
  
      s = "";
    }
    
    //tạo một task cứ sau "interval" giây thì chạy lệnh:
    //    if (millis() - previousMillis > interval) {
    //        previousMillis = millis();
    // 
    //        client.send("atime", "message", "Hai ML");
    //        client.sendJSON("colors", ChuoiSendJson);
    //    }

     if (client.monitor()) {
        if (RID == "arduno-stop" && Rname == "stop"){
          mySerial.println(String(Rcontent));
          delay(100);
        }
      }
 
    //Kết nối lại!
    if (!client.connected()) {
      client.reconnect(host, port);
    }
}