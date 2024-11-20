'use client';

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type User = {
    id: string;
  };
  
type ChatBotProps = {
    user: User;
};

const ChatBot: React.FC<ChatBotProps> = ({ user }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{ text: string, isUser: boolean}>>([]);
    const [auctionDetails, setAuctionDetails] = useState<any>(null);

    useEffect(() => {
        setMessages([{ text: "Welcome to Constrauction! How can i help you?", isUser: false }]);
    }, [])

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if(!input.trim()) return;

        setMessages([...messages, { text: input, isUser: true}]);
        setInput('');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    userId: user.id,
                    auctionDetails: auctionDetails
                }),
            });
            if(!response.ok){
                // console.log(response);
                throw new Error('Failed to get response from Chatbot');
            }

            const data = await response.json();
            setMessages(prev => [...prev, { text: data.response, isUser: false}]);

            if(data.auctionDetails){
                setAuctionDetails(data.auctionDetails)
            }

            if(data.auctionComplete){
                setAuctionDetails(null);
            }
        } catch (error) {
            console.error('Error', error);
            setMessages(prev => [ ...prev, { text: 'Sorry, there was an error processing your request.', isUser: false}]);
        }
    }

    return (
        <div className="flex flex-col h-[400px] w-[300px] border rounded-lg overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto">
                {
                    messages.map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.isUser ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-blue-500 text-white': 'bg-gray-200'}`}>
                                {msg.text}
                            </span>
                        </div>
                    ))
                }
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                    <Input 
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                </div>
            </form>
        </div>
    )
}

export default ChatBot;