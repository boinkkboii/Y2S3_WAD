import sqlite3
from flask import Flask, jsonify, request, abort
from flask_socketio import SocketIO, emit
from argparse import ArgumentParser
from flask_cors import CORS

DB = 'myprofile.sqlite'

app = Flask(__name__)
CORS(app)  # Enable CORS so frontend can connect
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSocket support

def get_row_as_dict(row):
    return {
        'id': row[0],
        'name': row[1],
        'dob': row[2],
        'phone': row[3],
        'email': row[4],
        'profile_image': row[5],
    }

# --- REST API routes ---

@app.route('/api/profile', methods=['GET'])
def get_profile():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user_profile LIMIT 1')
    row = cursor.fetchone()
    db.close()
    return jsonify(get_row_as_dict(row)) if row else jsonify(None), 200

@app.route('/api/profile', methods=['POST'])
def create_profile():
    if not request.json:
        abort(400)
    new_profile = (
        request.json['name'],
        request.json['dob'],
        request.json['phone'],
        request.json['email'],
        request.json['profile_image'],
    )
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('''
        INSERT INTO user_profile (name, dob, phone, email, profile_image)
        VALUES (?, ?, ?, ?, ?)
    ''', new_profile)
    profile_id = cursor.lastrowid
    db.commit()
    db.close()
    return jsonify({'id': profile_id, 'affected': db.total_changes}), 201

@app.route('/api/profile/<int:profile_id>', methods=['PUT'])
def update_profile(profile_id):
    if not request.json or 'id' not in request.json:
        abort(400)
    if int(request.json['id']) != profile_id:
        abort(400)
    updated_profile = (
        request.json['name'],
        request.json['dob'],
        request.json['phone'],
        request.json['email'],
        request.json['profile_image'],
        profile_id,
    )
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('''
        UPDATE user_profile SET
            name = ?, dob = ?, phone = ?, email = ?, profile_image = ?
        WHERE id = ?
    ''', updated_profile)
    db.commit()
    db.close()
    return jsonify({'id': profile_id, 'affected': db.total_changes}), 200

@app.route('/api/profile/<int:profile_id>', methods=['DELETE'])
def delete_profile(profile_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('DELETE FROM user_profile WHERE id = ?', (profile_id,))
    db.commit()
    db.close()
    return jsonify({'id': profile_id, 'affected': db.total_changes}), 200


# Socket IO
@app.route('/')
def index():
    return 'Hello, World!'

@socketio.on('send_location')
def handle_location(data):
    print('Location received:', data)
    # Emit real-time updates to clients
    emit('location_update', data, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000)

# --- Run server ---
if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='Port to listen on')
    args = parser.parse_args()
    socketio.run(app, host='0.0.0.0', port=args.port)
