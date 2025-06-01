import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  ThemeProvider,
  createTheme,
  CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Create a custom theme with calming colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#6B8E23', // Olive green - calming and friendly
    },
    background: {
      default: '#F5F5F5', // Light gray background
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2C3E50',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
      color: '#34495E',
    },
  },
});

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat history
    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatHistory, userMessage]
        }),
      });

      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If we can't parse JSON, it's likely a server connection issue
        throw new Error('Unable to connect to the chat server. Please make sure the server is running on port 3001.');
      }

      if (!response.ok) {
        throw new Error(errorData.details || 'Network response was not ok');
      }
      
      // Add assistant's response to chat history
      const assistantMessage = {
        role: 'assistant',
        content: errorData.message
      };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error details:', error);
      // Add error message to chat history with more details
      setChatHistory(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}. Please check the console for more details.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Typography variant="h1" component="h1" gutterBottom>
              Welcome
            </Typography>
            <Typography variant="h2" component="h2" align="center" sx={{ mb: 4 }}>
              Let's have a friendly chat
            </Typography>
          </Box>

          {/* Chat History */}
          <Box sx={{ mb: 3, maxHeight: '400px', overflowY: 'auto' }}>
            {chatHistory.map((msg, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  bgcolor: msg.role === 'user' ? 'primary.light' : 'white',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  ml: msg.role === 'user' ? 'auto' : 0,
                }}
              >
                <Typography>{msg.content}</Typography>
              </Paper>
            ))}
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>

          {/* Message Input */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'white',
            }}
          >
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isLoading}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  disabled={!message.trim() || isLoading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                  }}
                >
                  Send
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 