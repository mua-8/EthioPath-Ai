# Database Setup Instructions

To fix the errors in the chat, you **must** manually create the necessary tables in your Supabase project. The AI cannot do this for you automatically because it requires administrative access to your database.

### Steps to Follow:

1.  **Open your Supabase Dashboard**: Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your project.
2.  **Open the SQL Editor**: Click on the **SQL Editor** icon in the left-hand navigation bar (it looks like `>_`).
3.  **Create a New Query**: Click the **+ New query** button at the top.
4.  **Copy the SQL Code**: Open the file [002_create_chat_tables.sql](file:///c:/Users/muazm/Desktop/b_piuMlhUrg6U/scripts/002_create_chat_tables.sql) in this project and copy all the text inside it.
5.  **Paste and Run**:
    *   Paste the code into the SQL Editor in your browser.
    *   Click the **Run** button at the bottom right.
6.  **Refresh your App**: Once you see "Success" in Supabase, go back to your local app and refresh the page.

### Why this is necessary:
Supabase is a secure database. Your app needs specific "tables" to store chat history and "security rules" (RLS) to ensure you only see your own chats. These must be created once in the dashboard before the feature can work.

If you see an error saying "Could not find table", it means this step was skipped.
