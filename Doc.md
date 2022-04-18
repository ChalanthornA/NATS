# NATS
NATS เป็นเครื่องมือที่ถูกสร้างขึ้นมาเพื่อใช้ในการสื่อสารแลกเปลี่ยนข้อมูลในรูปแบบของ message & queue ผ่าน server และมีความสามารถในการปรับขนาด

## Subject-Based Messaging
ในการส่งข้อมูลนั้นจะมี 2 ฝ่ายที่ติดต่อกัน คือ publisher(ฝ่ายส่งmessage) และ subscriber(ฝ่ายรับmessage) โดยทั้ง 2 ฝ่ายต้องกำหนดชื่อตัวแปร(subject)ประกาศออกไปยัง nats-server เพื่อใช้รับ-ส่ง message

subject จะต้องตั้งชื่อประกอบไปด้วยตัวอักษร a-z, A-Z, 0-9 ประกอบกันโดยที่ห้ามเว้นวรรค และจะมีตัวอักษรพิเศษก็คือ
- . ใช้เพื่อแบ่งกลุ่มของ subject เช่น time.us.east
- \* ใช้เพื่อแทนคำอะไรก็ได้ที่อยู่ระหว่าง. เช่น time.\*.east = time.east.us
- \> ใช้เพื่อชื่อทั้งหมดที่อยู่หลังเครื่องหมายนี้ เช่น time.\> = time.east.us

## Publish-Subcrib
การทำงานของ NATS ระหว่าง publisher-subscriber มีโมเดลการสื่อสารเป็นแบบ one-to-many โดยทาง publisher จะส่ง message ไปกับ subject และจะมี subscriber ที่พร้อมทำงานและมี subject ตรงกับที่ publisher ส่งมารับ message ไป

![Publish-Subcrib](/images/publisher_subscriber.png)

## Request-Reply
เป็นการสื่อสารกันอีกรูปแบบหนึ่งที่มีการโต้ตอบกันระหว่าง publisher-subscriber โดยที่เมื่อทางpublisherทำการส่ง message(request) ทาง subscriber จะมีการตอบกลับ(reply)ไปที่ทาง publisher เช่นกัน

![Request-Reply](/images/request_reply.png)

## Queue Group
ในรูปแบบนี้จะมีการจัดคิวที่จะมารับ message ของทาง subscriber ขึ้นมาเพื่อแบ่งงานให้ subscriber แต่ละตัวที่พร้อมทำงาน โดยเมื่อสร้าง subscriber ก็จะมีการกำหนดชื่อของ queue นั้นๆ ขึ้นมาเพื่อเป็นการระบุกลุ่มของ subscriber 

![Queue Group](/images/queue.png)