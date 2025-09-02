import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const updateSearchCount = async (searchTerm, anime) => {
    try {
        // Checks if searchTerm already exists
        const { data: existing, error: selectError } = await supabase
            .from('searches')
            .select('*')
            .eq('searchTerm', searchTerm)
            .limit(1)
            .single();

        if (selectError && selectError.code !== 'PGRST116') throw selectError;

        if (existing) {
            // Increment count
            const { error: updateError } = await supabase
                .from('searches')
                .update({ count: existing.count + 1 })
                .eq('id', existing.id);

            if (updateError) throw updateError;
        } else {
            const { error: insertError } = await supabase
                .from('searches')
                .insert([{
                    searchTerm,
                    count: 1,
                    animeId: anime.id,
                    posterImage: anime.attributes.posterImage?.original || ''
                }]);

            if (insertError) throw insertError;
        }
    } catch (error) {
        console.error('Supabase error:', error);
    }
};

export const getTrendingAnime = async () => {
    try {
        const { data, error } = await supabase
            .from('searches')
            .select('*')
            .order('count', { ascending: false }) // sort by count descending
            .limit(5); // get top 5

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Supabase error:', error);
        return [];
    }
};