# NATS
NATS เป็นเครื่องมือที่ถูกสร้างขึ้นมาเพื่อใช้ในการสื่อสารแลกเปลี่ยนข้อมูลในรูปแบบของ message & queue ผ่าน server และมีความสามารถในการscaling

## Subject-Based Messaging
ในการส่งข้อมูลนั้นจะมี 2 ฝ่ายที่ติดต่อกัน คือ publisher(ฝ่ายส่งmessage) และ subscriber(ฝ่ายรับmessage) โดยทั้ง 2 ฝ่ายต้องกำหนดชื่อตัวแปร(subject)ประกาศออกไปยัง nats-server เพื่อใช้รับ-ส่ง message

ชื่อ subject จะต้องประกอบไปด้วยตัวอักษร a-z, A-Z, 0-9 ประกอบกันโดยที่ห้ามเว้นวรรค และจะมีตัวอักษรพิเศษก็คือ
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
ในรูปแบบนี้จะมีการจัดqueueที่จะมารับ message ของทาง subscriber ขึ้นมาเพื่อแบ่งงานให้ subscriber แต่ละตัวที่พร้อมทำงาน โดยเมื่อสร้าง subscriber ก็จะมีการกำหนดชื่อของ queue นั้นๆ ขึ้นมาเพื่อเป็นการระบุกลุ่มของ subscriber 

![Queue Group](/images/queue.png)

## JetStream
JetStream เป็นระบบที่ถูกสร้างขึ้นเพื่อช่วย nats-server ให้ง่ายต่อการ config มีความปลอดภัย และง่ายต่อการscaling

## JetStream Walkthrough
### Creating a Stream
เราจะสร้าง stream ขึ้นมาใหม่ด้วยการใช้คำสั่ง
`nats stream add <my_stream>` โดยที่ my_stream เป็นชื่อของ stream นี้สามารถเปลี่ยนได้ หลังจากนั้นก็จะขึ้นคำสั่งให้เราconfig

`? Subjects to consume <foo>` ประกาศ subject ภายใน stream นี้

`? Storage backend <file>` เลือกว่าจะเก็บข้อมูลที่ไหน (File, Memory)

`? Replication <1>` กำหนดจำนวนสำเนาของ message หนึ่งใน stream

`? Retention Policy <Limits>` ลักษณะการเก็บรักษา message ไว้ (Limits, Interest, Work Queue)

`? Discard Policy <Old>` ตั้งค่าว่าตอนที่ stream เก็บ message จนเต็มจะทำอย่างไร ถ้าหากว่าเป็น Old คือจะให้ลบ message เก่าทิ้ง แต่ถ้าเป็น New จะไม่รับ message ใหม่เข้ามา (Old, New)

`? Stream Messages Limit <-1>` กำหนดความจุของ stream ว่าเก็บ message ได้กี่ตัว โดยที่ -1 คือ unlimited

`? Per Subject Messages Limit <-1>` กำหนดความจุของ stream ต่อ subject หนึ่ง โดยที่ -1 คือ unlimited

`? Total Stream Size <10>` กำหนดขนาดความจุรวมของ message ทั้งหมดใน stream โดยมีหน่วยเป็น byte

`? Message TTL <-1>` กำหนดว่า message ที่ส่งเข้ามาใน stream มีอายุแค่ไหน โดยที่ -1 คือ unlimited

`? Max Message Size <-1>` กำหนดไซส์ของ message ที่ส่งเข้ามา โดยที่ -1 คือ unlimited

`? Message size limit <-1>` กำหนดขอบเขตไซส์ขนาดใหญ่สุดของ message ที่ส่งเข้ามา โดยที่ -1 คือ unlimited

`? Maximum message age limit <-1>` กำหนดว่า message ที่ส่งเข้ามาใน stream มีอายุแค่ไหน โดยที่ -1 คือ unlimited

`? Duplicate tracking time window <2m>` The window within which to track duplicate messages, expressed in nanoseconds.

### Creating a consumer
ใน Core NATS นั้น subscriber จะสามรถรับ message ได้เมื่อมีการประกาศ message หลังจากที่ subscriber เริ่มต้นทำงาน แต่ใน JetStream จะสร้าง consumer ซึ่งสามารถรับ message ทั้งหมดใน stream ได้ตั้งแต่ก่อนเพิ่ม consumer เข้ามา โดยคำสั่ง `nats consumer add` ใช้เพื่อสร้าง consumer และจะขึ้นคำสั่งให้เรา config

`? Consumer name <pull_consumer>` กำหนดชื่อของ consumer นี้

`? Delivery target (emty for PullConsumers)` กำหนดให้ consumer เป็นแบบ Push หรือ Pull

`? Start policy (all, new, last, subject, 1h, msg sequence)` กำหนดว่าเมื่อเพิ่ม consumer นี้เข้าไปใน stream แล้วจะมีผลต่อ message ตัวไหนบ้าง เช่น all คือทั้งหมด new คือเฉพาะ message ใหม่ เป็นต้น

`? Acknowledgement policy (Explicit, All)` กำหนด policy ของการส่ง message ระหว่าง stream และ subscriber ถ้าหากว่าเป็นแบบ Explicit ซึ่งเป็น default หมายความว่า ถ้ามีการส่ง message ก็จะต้องมีการตอบกลับว่าได้รับหรือไม่ ถ้าหากว่าไม่ตอบกลับก็จะทำการส่งใหม่ และถ้าเป็นแบบ All คือ ถ้ามีการส่ง message หลายๆตัว ให้ตอบว่าได้รับหรือไม่แค่ message ตัวสุดท้ายก็พอ

`? Replay policy (instant, original)` กำหนดการอ่าน message ใน stream ว่าจะให้อ่านในอัตราตามที่อ่านปกติหรือเร็วที่สุดที่จะเป็นไปได้

`? Filter Stream by subject (blank for all)` กำหนดชื่อ subject ที่จะให้ consumer นี้มีผลด้วย

`? Maximum Allowed Deliveries <-1>` กำหนดจำนวนของ message ที่สามารถส่งได้โดยไม่ต้องรอการตอบกลับว่าได้รับหรือไม่

`? Maximum Acknowledgements Pending <0>` กำหนดจำนวนสูงสุดของ message ที่ไม่ตอบกลับว่าได้รับหรือไม่

`? Deliver headers only without bodies (y/N)` กำหนดว่าส่ง message โดยที่มีแต่ headers ได้หรือไม่

`? Add a Retry Backoff Policy (y/N)` กำหนดว่จะใช้ Retry Backoff Policy หรือไม่

`? Select a Stream` เลือก stream สำหรับ consumer