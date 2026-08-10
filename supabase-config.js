const SUPABASE_URL = "https://xndjwvebzglaoyjnwafd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_bqYHgOeZ6PTGkDqffY9vjw_YIN6bisb";

const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase connected:", supabase);
