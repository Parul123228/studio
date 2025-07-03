"use client"

import React, { useState, useEffect } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  className?: string;
};

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 100, className }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTypingComplete(false);
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, speed);

    return () => {
      clearInterval(typingInterval);
    };
  }, [text, speed]);

  return (
    <span className={className}>
      {displayedText}
      <span className={`transition-opacity duration-300 ${isTypingComplete ? 'opacity-0' : 'opacity-100 ml-1 inline-block h-full w-1 bg-primary animate-flicker'}`}>
        |
      </span>
    </span>
  );
};

export default Typewriter;
