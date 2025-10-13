import { supabase } from "./config.js";

export const supabaseService = {
  userId: null,

  // =======================
  // AUTHENTICATION METHODS
  // =======================
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    this.userId = data.user.id;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    this.userId = null;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (data?.user) {
      this.userId = data.user.id;
      return data.user;
    }
    return null;
  },

  // =======================
  // DATABASE METHODS
  // =======================

  // ✅ Create record with priority support
  async create(tableName, data) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    // Automatically include default values
    const record = {
      ...data,
      user_id: this.userId,
      completed: data.completed ?? false,
      priority: data.priority ?? "Normal", // ✅ Add default priority support
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data: result, error } = await supabase
      .from(tableName)
      .insert(record)
      .select();

    if (error) throw error;
    return result[0];
  },

  // ✅ Get all records
  async getAll(tableName, orderByField = "created_at", direction = "asc") {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("user_id", this.userId)
      .order(orderByField, { ascending: direction === "asc" });

    if (error) throw error;
    return data;
  },

  // ✅ Get record by ID
  async getById(tableName, id) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .eq("user_id", this.userId)
      .single();

    if (error) throw error;
    return data;
  },

  // ✅ Update record (priority included automatically)
  async update(tableName, id, updates) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updates,
        updated_at: new Date(),
        // Optional safeguard: if priority missing, keep old one or default
        priority:
          updates.priority ?? updates.priority === ""
            ? "Normal"
            : updates.priority,
      })
      .eq("id", id)
      .eq("user_id", this.userId)
      .select();

    if (error) throw error;
    return data[0];
  },

  // ✅ Delete record
  async delete(tableName, id) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);

    if (error) throw error;
    return true;
  },

  // ✅ Query with filters
  async query(
    tableName,
    conditions = [],
    orderByField = "created_at",
    direction = "asc"
  ) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    let query = supabase.from(tableName).select("*").eq("user_id", this.userId);

    conditions.forEach((c) => {
      query = query.filter(c.field, c.operator, c.value);
    });

    query = query.order(orderByField, { ascending: direction === "asc" });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // =======================
  // STORAGE METHODS
  // =======================
  async uploadFile(bucketName, filePath, file) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(`${this.userId}/${filePath}`, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) throw error;
    return data;
  },

  async downloadFile(bucketName, filePath) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { data, error } = await supabase.storage
      .from("private-bucket")
      .upload(`user-${user.id}/${file.name}`, file);

    if (error) throw error;
    return data;
  },

  async getFileUrl(bucketName, filePath) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(`${this.userId}/${filePath}`);

    return data.publicUrl;
  },

  async deleteFile(bucketName, filePath) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([`${this.userId}/${filePath}`]);

    if (error) throw error;
    return true;
  },

  // =======================
  // SIGNED URL GENERATION
  // =======================
  async getSignedFileUrl(bucketName, filePath, expiresInSeconds = 3600) {
    if (!this.userId) throw new Error("userId not set on supabaseService");

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(`${this.userId}/${filePath}`, expiresInSeconds);

    if (error) throw error;
    return data.signedUrl;
  },

  // =======================
  // REALTIME SUBSCRIPTIONS
  // =======================
  subscribeToChanges(tableName, callback) {
    return supabase
      .channel(`public:${tableName}:user_id=eq.${this.userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: tableName,
          filter: `user_id=eq.${this.userId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  },
};

export default supabaseService;
