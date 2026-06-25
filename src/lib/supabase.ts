import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://sdgsqrcqdnoujsdfwpqk.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImIzZDA3NThlLWVmYTYtNDYyYS05Njc5LWM5OWRiZDY1NGVhNiJ9.eyJwcm9qZWN0SWQiOiJzZGdzcXJjcWRub3Vqc2Rmd3BxayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgxMzg2OTcwLCJleHAiOjIwOTY3NDY5NzAsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.QCFA1i3u7h2gHBYv8UJdbdkr4A-blmLKaueptOXHKPA';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };