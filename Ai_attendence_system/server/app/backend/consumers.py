import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ClassroomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.classroom_id = self.scope['url_route']['kwargs']['classroom_id']
        self.room_group_name = f'classroom_{self.classroom_id}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def send_attendance_update(self, event):
        await self.send(text_data=json.dumps({
            'student_id': event['student_id'],
            
            'status': event['status'],
        }))
