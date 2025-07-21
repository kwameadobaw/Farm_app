# Farm Visit Management System

A modern web application for managing farm visits, built with Flask, HTML, CSS, and JavaScript.

## Features

- **Farm Visit Form**: Capture comprehensive details about farm visits
  - Farmer information
  - Visit details
  - Observations (crops, livestock, issues)
  - Recommendations
  - Follow-up planning

- **Admin Dashboard**: Manage and review all farm visits
  - Search and filter functionality
  - Detailed view of each visit
  - PDF download option for reports
  - Secure login protection

- **Troubleshooting Guide**: Easily resolve common issues
  - Interactive troubleshooting page
  - Clear instructions for configuration

## Prerequisites

Before running this application, you need to install:

1. Python 3.7 or higher

## Installation

1. Clone this repository or download the source code

2. Create a virtual environment (recommended):
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install the required packages:
   ```
   pip install -r requirements.txt
   ```



## Running the Application

1. Start the Flask development server:
   ```
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

3. To access the admin dashboard, go to:
   ```
   http://127.0.0.1:5000/admin
   ```

## Project Structure

```
farm_app/
├── app.py                    # Main Flask application
├── farm_visits.json          # Database file (auto-generated)
├── requirements.txt          # Python dependencies
├── static/
│   ├── css/
│   │   ├── styles.css        # Styles for the form page
│   │   └── admin.css         # Styles for the admin page
│   ├── js/
│   │   ├── script.js         # JavaScript for the form page
│   │   └── admin.js          # JavaScript for the admin page
│   └── uploads/              # Directory for uploaded photos
└── templates/
    ├── admin.html            # Admin dashboard template
    ├── index.html            # Farm visit form template
    ├── login.html            # Admin login template
    ├── pdf_template.html     # Template for PDF generation
    └── troubleshoot.html     # Troubleshooting guide
```

## Customization

You can customize the application by:

- Modifying the CSS files to change the appearance
- Adding or removing fields in the form templates
- Extending the Flask routes in app.py for additional functionality

## Troubleshooting

### PDF Generation Issues

If you encounter errors when trying to download PDFs, follow these steps:

1. **Verify WeasyPrint Installation**:
   - Ensure WeasyPrint is properly installed in your Python environment
   - Run: `pip install WeasyPrint==59.0` to reinstall if needed

2. **Check for Missing Dependencies**:
   - WeasyPrint requires some system libraries that might need to be installed
   - Windows: Make sure you have the Microsoft Visual C++ Redistributable installed
   - Linux: Install required libraries with `apt-get install build-essential python3-dev python3-pip python3-setuptools python3-wheel python3-cffi libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info`
   - macOS: Install dependencies with `brew install cairo pango gdk-pixbuf libffi`

3. **Restart the Application**:
   - After making any changes, restart the Flask server

### Admin Access

Default login credentials:
- Username: `admin`
- Password: `farmapp123`

## License

This project is licensed under the MIT License - see the LICENSE file for details.