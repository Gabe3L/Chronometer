
# Chronomail

Chronomail is a Google Apps Script that classifies emails based on estimated task completion time.

---

## Features

- Processes your most recent Gmail threads (default: 10).
- Uses NLP to predict how long an email-related task will take.
- Automatically labels the email with a time estimate:
  - `<1m` – Takes less than 1 minute
  - `5m` – Takes about 5 minutes
  - `15m` – Takes about 15 minutes
  - `30m` – Takes about 30 minutes
  - `1h<` – Takes more than 1 hour
- Skips already processed threads to avoid duplication.
- Manual reset function to reprocess threads.

---

## Requirements

- A Google Account
- A Hugging Face API Key (Create one at [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))

---

## Setup Instructions

### 1. Create a New Google Apps Script

1. Go to [https://script.google.com](https://script.google.com) and create a new project.
2. Replace the contents of the default file with the code from the `main.gs` file.
3. Save the project and name it `Chronomail`.

---

### 2. Set the Hugging Face API Key

1. In the Apps Script editor, click on `Project Settings` (⚙️ icon in the left sidebar).
2. Scroll down to **Script Properties**, and click on `+ Add script property`.
3. Use the following key-value pair:

   | Key                   | Value               |
   |-----------------------|---------------------|
   | `HUGGINGFACE_API_KEY` | `your_api_key_here` |

---

### 3. Authorize Permissions

- Run the `main()` function manually the first time to trigger the authorization flow.
- Accept the required permissions to allow access to Gmail and external APIs.

---

### 4. Set a Trigger

To automate label application:

1. In the Apps Script editor, go to `Triggers` (clock icon).
2. Click **+ Add Trigger**.
3. Set:
   - **Function to run**: `main`
   - **Event source**: `Time-driven`
   - **Type of time-based trigger**: `Minutes Timer - Every Minute`

---

## Author

### Gabe Lynch

Website: https://www.gabelynch.com \
GitHub: https://github.com/Gabe3L \
Email: contact@gabelynch.com

# License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) in the root of this project for more details.
