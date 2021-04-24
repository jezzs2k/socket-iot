#include <ESP8266WiFi.h>
#include <SocketIOClient.h>
#include <SoftwareSerial.h>

SoftwareSerial mySerial(D1, D2); 

unsigned long t1 = 0, t2 = 0;
String s = "";
unsigned long data = 0, datas = 0;
int redBoxs = 0;
int blueBoxs = 0;
int yellowBoxs = 0;
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
unsigned long previousMillis = 0;
long interval = 1000;

String ChuoiSendJson = "{\"Red\":\"" + String(redBoxs) + "\"," +
                     "\"Green\":\"" + String(blueBoxs) + "\"," +
                     "\"Yellow\":\"" + String(yellowBoxs) +  "\"}";

 
void setup()
{
    Serial.begin(57600);

    mySerial.begin(57600);
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
 
void loop()
{
   if(mySerial.available())
    {
      char c = mySerial.read();
      s += c;
      if(c == '\n')
      {
        if (s.toInt() / 1000000 == 1)
        {
          data = s.toInt();
          if(datas != data)
          {
            datas = data;
            redBoxs = datas % 100;
            datas = datas / 100;  
            blueBoxs = datas % 100;
            datas = datas / 100;
            yellowBoxs = datas % 100;
          }
        }
      }
      s = "";
    }
    
    //tạo một task cứ sau "interval" giây thì chạy lệnh:
    if (millis() - previousMillis > interval) {
        //lệnh:
        previousMillis = millis();
 
        client.send("atime", "message", "Hai ML");
        client.sendJSON("colors", ChuoiSendJson);
    }
 
    if (client.monitor()) {
        Serial.println(RID);
    }

     if (client.monitor()) {
        Serial.println(RID);
        if (RID == "arduno-stop" && Rname == "stop")
        {
          Serial.print("Il est ");
          Serial.println(Rcontent);
          mySerial.println(String(Rcontent));
          delay(100);
        }
      }
 
    //Kết nối lại!
    if (!client.connected()) {
      client.reconnect(host, port);
    }
}