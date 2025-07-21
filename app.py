from flask import Flask, render_template, request, redirect, url_for, jsonify, send_file, session, flash
import os
import json
import uuid
from datetime import datetime
import tempfile
from functools import wraps
import secrets
from weasyprint import HTML

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['JSON_FILE'] = 'farm_visits.json'
app.config['SECRET_KEY'] = secrets.token_hex(16)

# Default admin credentials - in production, use environment variables or a secure config
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'farmapp123'

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize JSON file if it doesn't exist
def initialize_json_file():
    if not os.path.exists(app.config['JSON_FILE']):
        with open(app.config['JSON_FILE'], 'w') as f:
            json.dump([], f)

# Load farm visits from JSON file
def load_farm_visits():
    initialize_json_file()
    with open(app.config['JSON_FILE'], 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

# Save farm visits to JSON file
def save_farm_visits(visits):
    with open(app.config['JSON_FILE'], 'w') as f:
        json.dump(visits, f, indent=4)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/troubleshoot')
def troubleshoot():
    return render_template('troubleshoot.html')

@app.route('/submit', methods=['POST'])
def submit():
    # Get form data
    form_data = request.form.to_dict()
    
    # Handle photo upload
    if 'photo' in request.files:
        photo = request.files['photo']
        if photo.filename != '':
            # Generate unique filename
            filename = str(uuid.uuid4()) + os.path.splitext(photo.filename)[1]
            photo_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            photo.save(photo_path)
            form_data['photo_path'] = photo_path
    
    # Add timestamp and unique ID
    form_data['timestamp'] = datetime.now().isoformat()
    form_data['id'] = str(uuid.uuid4())
    
    # Save to JSON file
    visits = load_farm_visits()
    visits.append(form_data)
    save_farm_visits(visits)
    
    return redirect(url_for('admin'))

# Login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['username'] == ADMIN_USERNAME and request.form['password'] == ADMIN_PASSWORD:
            session['logged_in'] = True
            flash('You were successfully logged in')
            return redirect(url_for('admin'))
        else:
            error = 'Invalid credentials. Please try again.'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect(url_for('index'))

@app.route('/admin')
@login_required
def admin():
    visits = load_farm_visits()
    return render_template('admin.html', visits=visits)

@app.route('/download/<visit_id>')
@login_required
def download_pdf(visit_id):
    visits = load_farm_visits()
    visit = next((v for v in visits if v.get('id') == visit_id), None)
    
    if not visit:
        return "Visit not found", 404
    
    # Generate HTML for PDF
    html = render_template('pdf_template.html', visit=visit)
    
    # Create PDF file
    pdf_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pdf')
    
    try:
        # Generate PDF using WeasyPrint
        HTML(string=html, base_url=request.url_root).write_pdf(pdf_file.name)
        return send_file(pdf_file.name, as_attachment=True, 
                         download_name=f"farm_visit_{visit_id}.pdf",
                         mimetype='application/pdf')
    except Exception as e:
        error_message = f"Error generating PDF: {str(e)}. "
        error_message += "Please check if WeasyPrint is installed correctly."
        return error_message, 500

@app.route('/api/visits')
@login_required
def api_visits():
    visits = load_farm_visits()
    visit_type = request.args.get('visit_type')
    
    if visit_type:
        visits = [v for v in visits if v.get('visit_type') == visit_type]
    
    return jsonify(visits)

if __name__ == '__main__':
    initialize_json_file()
    app.run(debug=True)