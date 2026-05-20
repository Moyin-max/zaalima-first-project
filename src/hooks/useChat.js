import { useState, useCallback, useRef, useEffect } from 'react';

let msgIdCounter = 100;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001';

export function useChat(sessionId = null) {
  const [messages, setMessages]         = useState([]);
  const [isStreaming, setIsStreaming]   = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const currentSessionId = useRef(sessionId);
  const streamRef = useRef(null);

  // Load history if sessionId changes
  useEffect(() => {
    currentSessionId.current = sessionId;
    if (sessionId && !sessionId.startsWith('temp-')) {
      fetch(`${API_URL}/api/chat/sessions/${sessionId}`)
        .then(r => r.json())
        .then(data => {
          if (data.messages) setMessages(data.messages);
        })
        .catch(e => console.error('Failed to fetch session history:', e));
    } else {
      setMessages([]);
    }
  }, [sessionId]);

  const saveToBackend = useCallback(async (msgs) => {
    if (!currentSessionId.current) return;
    try {
      const res = await fetch(`${API_URL}/api/chat/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentSessionId.current.startsWith('temp-') ? null : currentSessionId.current,
          title: msgs[0]?.content?.slice(0, 30) || 'New Chat',
          messages: msgs
        })
      });
      const data = await res.json();
      if (data.id && currentSessionId.current !== data.id) {
        currentSessionId.current = data.id;
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }, []);

  const sendMessage = useCallback((text) => {
    if (!text.trim() || isStreaming) return;

    const userMsg = {
      id: `m${++msgIdCounter}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsStreaming(true);
    setStreamingText('');

    const es = new EventSource(`${API_URL}/api/chat/stream?q=${encodeURIComponent(text.trim())}`);
    
    let fullText = '';
    let sources = [];
    es.onmessage = (e) => {
      if (e.data === '[DONE]') {
        es.close();
        setIsStreaming(false);
        setStreamingText('');
        
        const aiMsg = {
          id: `m${++msgIdCounter}`,
          role: 'assistant',
          content: fullText,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sources: sources.map(s => ({
            id: s._id,
            fileName: s.filename,
            page: s.page || 1,
            snippet: s.text,
            relevance: s.score || 0.9
          })),
          citations: sources.map((s, i) => ({
            label: `${s.filename} • Page ${s.page || 'n/a'}`,
            sourceId: s.docId + i
          }))
        };
        const updatedMessages = [...newMessages, aiMsg];
        setMessages(updatedMessages);
        saveToBackend(updatedMessages);
        return;
      }

      try {
        const payload = JSON.parse(e.data);
        if (payload.delta) {
          fullText += payload.delta;
          setStreamingText(fullText);
        }
        if (payload.sources) {
          sources = payload.sources;
        }
      } catch (err) {
        console.error('Error parsing SSE:', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE Error:', err);
      es.close();
      setIsStreaming(false);
      setMessages(prev => [...prev, {
        id: `m${++msgIdCounter}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the backend.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    };

    streamRef.current = es;
  }, [isStreaming]);

  const stopStreaming = useCallback(() => {
    if (streamRef.current instanceof EventSource) {
      streamRef.current.close();
      streamRef.current = null;
    } else if (streamRef.current) {
      clearInterval(streamRef.current);
      streamRef.current = null;
    }
    setIsStreaming(false);
    setStreamingText('');
  }, []);

  const clearMessages = useCallback(() => {
    stopStreaming();
    setMessages([]);
  }, [stopStreaming]);

  return { messages, isStreaming, streamingText, sendMessage, clearMessages, stopStreaming };
}
