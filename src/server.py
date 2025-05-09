from flask import Flask
from flask_socketio import SocketIO, emit
# import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return "WebSocket Server for Bus Booking"

@socketio.on('connect', namespace='/maintenance')
def handle_connect():
    print("Client connected to /maintenance")

@socketio.on('request_maintenance', namespace='/maintenance')
def handle_request(data):
    print("Client asked for maintenance status")

    emit('maintenance_alert', {
        'title': 'Scheduled Maintenance',
        'message': 'The bus booking system will be unavailable from 10 PM to 12 AM tonight.'
    })

# Optional: broadcast periodically
# def broadcast_maintenance():
#     while True:
#         socketio.emit('maintenance_alert', {
#             'title': 'Notice',
#             'message': 'Server will restart soon...'
#         }, namespace='/maintenance')
#         time.sleep(60)

if __name__ == '__main__':
    print("Starting WebSocket Server on http://localhost:5000 ...")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
