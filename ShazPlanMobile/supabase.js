import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hagebiyevldlsofqptkf.supabase.co";
const supabaseKey = "sb_publishable_8f591fnQPXMYrb51NKo5aQ_0nnsKYto";

export const supabase = createClient(supabaseUrl, supabaseKey);