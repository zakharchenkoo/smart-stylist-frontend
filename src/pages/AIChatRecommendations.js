import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiChatAPI, clothesAPI, outfitAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const AIChatRecommendations = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [recommendedClothes, setRecommendedClothes] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [outfitName, setOutfitName] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    startChat();
  }, []);

  const startChat = async () => {
    try {
      setLoading(true);
      setIsFinal(false);
      setRecommendedClothes([]);
      const response = await aiChatAPI.startChat();
      setMessages([response.data]);
    } catch (err) {
      console.error('Failed to start chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: userInput
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setUserInput('');
    setLoading(true);

    try {
      const response = await aiChatAPI.sendMessage(user.id, updatedMessages);
      
      setMessages([...updatedMessages, response.data.message]);
      
      if (response.data.isFinal) {
        setIsFinal(true);
        
        if (response.data.clothesIds && response.data.clothesIds.length > 0) {
          await loadRecommendedClothes(response.data.clothesIds);
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendedClothes = async (clothesIds) => {
    try {
      const clothesPromises = clothesIds.map(id => 
        clothesAPI.getClothesById(id).catch(err => {
          console.error(`Failed to load clothes ${id}:`, err);
          return null;
        })
      );
      
      const clothesResponses = await Promise.all(clothesPromises);
      const clothes = clothesResponses
        .filter(response => response !== null)
        .map(response => response.data);
      
      setRecommendedClothes(clothes);
    } catch (err) {
      console.error('Failed to load recommended clothes:', err);
    }
  };

  const handleGetAnotherRecommendation = async () => {
    setLoading(true);
    
    const requestMessage = {
      role: 'user',
      content: 'Can you suggest a different outfit with the same preferences?'
    };
    
    const updatedMessages = [...messages, requestMessage];
    setMessages(updatedMessages);

    try {
      const response = await aiChatAPI.sendMessage(user.id, updatedMessages);
      
      setMessages([...updatedMessages, response.data.message]);
      
      if (response.data.isFinal) {
        if (response.data.clothesIds && response.data.clothesIds.length > 0) {
          await loadRecommendedClothes(response.data.clothesIds);
        }
      }
    } catch (err) {
      console.error('Failed to get another recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOutfit = async () => {
    if (!outfitName.trim()) {
      alert('Please enter an outfit name');
      return;
    }

    try {
      await outfitAPI.createOutfit({
        name: outfitName,
        userId: user.id,
        clothesIds: recommendedClothes.map(c => c.id)
      });

      setShowSaveModal(false);
      setOutfitName('');
      alert('Outfit saved successfully!');
      navigate('/outfits');
    } catch (err) {
      console.error('Failed to save outfit:', err);
      alert('Failed to save outfit');
    }
  };

  const handleRestart = () => {
    setMessages([]);
    setIsFinal(false);
    setRecommendedClothes([]);
    startChat();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header with Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              💬 AI Fashion Stylist Chat
            </h1>
            <p className="text-gray-600">
              Have a conversation with AI to get personalized outfit recommendations
            </p>
          </div>
          
          <button
            onClick={handleRestart}
            className="btn-secondary whitespace-nowrap"
          >
            🔄 Start New Chat
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col" style={{ height: '600px' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-2">🤖</span>
                          <span className="font-semibold">AI Stylist</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              {!isFinal && (
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your answer..."
                      className="flex-1 input-field"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading || !userInput.trim()}
                      className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

              {isFinal && (
                <div className="border-t p-4 bg-gray-50">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="btn-primary"
                      disabled={recommendedClothes.length === 0}
                    >
                      💾 Save Outfit
                    </button>
                    <button
                      onClick={handleGetAnotherRecommendation}
                      className="btn-secondary"
                      disabled={loading}
                    >
                      🔄 Get Another Option
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {recommendedClothes.length > 0 ? '✨ Recommended Outfit' : '👗 Waiting for Recommendation'}
              </h2>
              
              {recommendedClothes.length > 0 ? (
                <div className="space-y-4">
                  {recommendedClothes.map((item) => (
                    <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                        }}
                      />
                      <div className="p-3">
                        <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: item.color.toLowerCase() }}
                          ></div>
                          <p className="text-xs text-gray-600 capitalize">{item.color}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">💬</p>
                  <p className="text-gray-500 text-sm">
                    Answer the AI's questions to get personalized outfit recommendations
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save Outfit Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Save AI Recommended Outfit
            </h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Outfit Name
              </label>
              <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="e.g., AI Theatre Elegant Look"
                className="input-field"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOutfit}
                className="flex-1 btn-primary"
              >
                Save Outfit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatRecommendations;
