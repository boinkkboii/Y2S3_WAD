import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

DB = 'myprofile.sqlite'

def get_row_as_dict(row):
    return {
        'id': row[0],
        'name': row[1],
        'dob': row[2],
        'phone': row[3],
        'email': row[4],
        'profile_image': row[5],
    }

app = Flask(__name__)

# GET profile (assume only one profile)
@app.route('/api/profile', methods=['GET'])
def get_profile():
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('SELECT * FROM user_profile LIMIT 1')
    row = cursor.fetchone()
    db.close()

    if row:
        return jsonify(get_row_as_dict(row)), 200
    else:
        return jsonify(None), 200

# POST profile (create new)
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

    response = {
        'id': profile_id,
        'affected': db.total_changes,
    }

    db.close()
    return jsonify(response), 201

# PUT profile (update)
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
    response = {
        'id': profile_id,
        'affected': db.total_changes,
    }

    db.close()
    return jsonify(response), 200

# DELETE profile
@app.route('/api/profile/<int:profile_id>', methods=['DELETE'])
def delete_profile(profile_id):
    db = sqlite3.connect(DB)
    cursor = db.cursor()
    cursor.execute('DELETE FROM user_profile WHERE id = ?', (profile_id,))
    db.commit()

    response = {
        'id': profile_id,
        'affected': db.total_changes,
    }

    db.close()
    return jsonify(response), 200

# Run server
if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='Port to listen on')
    args = parser.parse_args()
    app.run(host='0.0.0.0', port=args.port)
