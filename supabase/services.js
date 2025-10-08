import { supabase } from './config.js';

export const supabaseService = {
  userId: null,

  // Authentication methods
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
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

  // Database methods
  async create(tableName, data) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { data: result, error } = await supabase
      .from(tableName)
      .insert({
        ...data,
        user_id: this.userId,
        completed: false, // default for dashboard items
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select();
    
    if (error) throw error;
    return result[0];
  },

  async getAll(tableName, orderByField = 'created_at', direction = 'asc') {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', this.userId)
      .order(orderByField, { ascending: direction === 'asc' });
    
    if (error) throw error;
    return data;
  },

  async getById(tableName, id) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .eq('user_id', this.userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(tableName, id, updates) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .eq('id', id)
      .eq('user_id', this.userId)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async delete(tableName, id) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    return true;
  },

  async query(tableName, conditions = [], orderByField = 'created_at', direction = 'asc') {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    let query = supabase
      .from(tableName)
      .select('*')
      .eq('user_id', this.userId);
    
    conditions.forEach(c => {
      query = query.filter(c.field, c.operator, c.value);
    });
    
    query = query.order(orderByField, { ascending: direction === 'asc' });
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Storage methods
  async uploadFile(bucketName, filePath, file) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(`${this.userId}/${filePath}`, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    return data;
  },

  async downloadFile(bucketName, filePath) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .download(`${this.userId}/${filePath}`);
    
    if (error) throw error;
    return data;
  },

  async getFileUrl(bucketName, filePath) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { data } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(`${this.userId}/${filePath}`);
    
    return data.publicUrl;
  },

  async deleteFile(bucketName, filePath) {
    if (!this.userId) throw new Error("userId not set on supabaseService");
    
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([`${this.userId}/${filePath}`]);
    
    if (error) throw error;
    return true;
  },

  // Realtime subscriptions
  subscribeToChanges(tableName, callback) {
    return supabase
      .channel(`public:${tableName}:user_id=eq.${this.userId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: tableName,
        filter: `user_id=eq.${this.userId}`
      }, payload => {
        callback(payload);
      })
      .subscribe();
  }
};

export default supabaseService;