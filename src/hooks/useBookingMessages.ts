import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Tables } from '../types/database';

export type BookingMessage = Tables<'booking_messages'> & {
  sender_name?: string;
};

export function useBookingMessages(bookingId: string | null) {
  const [messages, setMessages] = useState<BookingMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!bookingId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('booking_messages')
      .select('*, profiles!booking_messages_sender_id_fkey(name)')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    const mapped = (data ?? []).map((row: Record<string, unknown>) => {
      const profile = row.profiles as { name: string } | null;
      return {
        ...(row as Tables<'booking_messages'>),
        sender_name: profile?.name ?? 'User',
      };
    });
    setMessages(mapped);
    setLoading(false);
  }, [bookingId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function sendMessage(senderId: string, senderRole: 'provider' | 'customer', body: string) {
    if (!bookingId || !body.trim()) return;
    const { error } = await supabase.from('booking_messages').insert({
      booking_id: bookingId,
      sender_id: senderId,
      sender_role: senderRole,
      body: body.trim(),
    });
    if (error) throw error;
    await fetchMessages();
  }

  return { messages, loading, sendMessage, refetch: fetchMessages };
}
