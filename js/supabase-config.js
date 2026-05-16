const SUPABASE_URL = 'https://qkvwsepwnsqpcvlfziao.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdndzZXB3bnNxcGN2bGZ6aWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNDIyNzQsImV4cCI6MjA5MzgxODI3NH0.GrGE-XiPDANFXf-_mAMkI3PpdFyiVXzbXJKDXyyIAFU';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
