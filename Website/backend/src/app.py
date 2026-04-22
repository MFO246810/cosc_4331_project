from flask import Flask, request, jsonify, session
import json
import os

app = Flask(__name__)

app.secret_key = "class-demo-secret-key" 

DATA_FILE = "users.json"

def init_storage():
    """Creates the JSON file with the default test user if it doesn't exist."""
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w") as f:
            # Storing as { "username": "password" } for ultimate simplicity
            json.dump({"test": "test"}, f, indent=4)

# Run initialization before the app starts handling requests
init_storage()

@app.route("/login", methods=["POST"])
def login():
    """Reads the JSON file to authenticate the user."""
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password required"}), 400

    # Open and read the "database"
    with open(DATA_FILE, "r") as f:
        users = json.load(f)

    # Check if the user exists and the password matches
    if username in users and users[username] == password:
        # Establish the active session
        session["username"] = username
        return jsonify({"message": "Login successful!"}), 200
    
    return jsonify({"error": "Invalid username or password"}), 401


@app.route("/logout", methods=["POST"])
def logout():
    """Clears the active session."""
    session.pop("username", None)
    return jsonify({"message": "Logged out successfully"}), 200


@app.route("/dashboard", methods=["GET"])
def dashboard():
    """A protected route that requires an active session."""
    # Check if the user is currently logged in
    if "username" not in session:
        return jsonify({"error": "Unauthorized. Please log in."}), 401
    
    current_user = session["username"]
    return jsonify({
        "status": "Active Session",
        "message": f"Welcome to the demo dashboard, {current_user}!"
    }), 200

if __name__ == "__main__":
    # Run the server on port 5000
    app.run(debug=True, port=5000)