import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface WOD {
  id: string;
  title: string;
  type: 'AMRAP' | 'For Time' | 'EMOM' | 'Strength' | 'Tabata';
  duration: string;
  description: string;
  date: string;
  category: 'Benchmark' | 'Conditioning' | 'Strength' | 'Skill';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Result {
  id: string;
  wod_id: string;
  athlete_id: string;
  athlete_name: string;
  athlete_avatar: string;
  score: string;
  rx: boolean;
  date: string;
  notes?: string;
}

export function useWODStore() {
  const [wods, setWods] = useState<WOD[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWods = async () => {
    const { data, error } = await supabase
      .from('wods')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setWods(data);
    if (error) console.error('Error fetching WODs:', error);
  };

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setResults(data);
    if (error) console.error('Error fetching results:', error);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchWods(), fetchResults()]);
      setLoading(false);
    };
    loadData();

    // Set up real-time subscriptions
    const wodsSubscription = supabase
      .channel('wods_channel')
      .on('postgres_changes', { event: '*', table: 'wods' }, () => fetchWods())
      .subscribe();

    const resultsSubscription = supabase
      .channel('results_channel')
      .on('postgres_changes', { event: '*', table: 'results' }, () => fetchResults())
      .subscribe();

    return () => {
      supabase.removeChannel(wodsSubscription);
      supabase.removeChannel(resultsSubscription);
    };
  }, []);

  const addWOD = async (wod: Omit<WOD, 'id'>) => {
    const { error } = await supabase.from('wods').insert([wod]);
    if (error) console.error('Error adding WOD:', error);
  };

  const addResult = async (result: Omit<Result, 'id'>) => {
    const { error } = await supabase.from('results').insert([result]);
    if (error) console.error('Error adding result:', error);
  };

  return { wods, results, loading, addWOD, addResult };
}

/**
 * SQL SCHEMA FOR SUPABASE:
 * 
 * -- Create wods table
 * CREATE TABLE wods (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   title TEXT NOT NULL,
 *   type TEXT NOT NULL,
 *   duration TEXT,
 *   description TEXT NOT NULL,
 *   date TIMESTAMPTZ DEFAULT now(),
 *   category TEXT NOT NULL,
 *   difficulty TEXT NOT NULL
 * );
 * 
 * -- Create results table
 * CREATE TABLE results (
 *   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
 *   wod_id UUID REFERENCES wods(id) ON DELETE CASCADE,
 *   athlete_id TEXT NOT NULL,
 *   athlete_name TEXT NOT NULL,
 *   athlete_avatar TEXT,
 *   score TEXT NOT NULL,
 *   rx BOOLEAN DEFAULT true,
 *   date TIMESTAMPTZ DEFAULT now(),
 *   notes TEXT
 * );
 * 
 * -- Enable Realtime
 * ALTER PUBLICATION supabase_realtime ADD TABLE wods;
 * ALTER PUBLICATION supabase_realtime ADD TABLE results;
 */
