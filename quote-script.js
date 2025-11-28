    // Quote of the Day Feature
    function getQuoteOfTheDay() {
        const quotes = [
            "The unexamined life is not worth living. - Socrates",
            "Life is what happens when you're busy making other plans. - John Lennon",
            "The purpose of our lives is to be happy. - Dalai Lama",
            "Get busy living or get busy dying. - Stephen King",
            "You only live once, but if you do it right, once is enough. - Mae West",
            "The greatest glory in living lies not in never falling, but in rising every time we fall. - Nelson Mandela",
            "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
            "Life is either a daring adventure or nothing at all. - Helen Keller",
            "The way to get started is to quit talking and begin doing. - Walt Disney",
            "If life were predictable it would cease to be life, and be without flavor. - Eleanor Roosevelt",
            "If you look at what you have in life, you'll always have more. - Oprah Winfrey",
            "Life is a long lesson in humility. - James M. Barrie",
            "In the end, it's not the years in your life that count. It's the life in your years. - Abraham Lincoln",
            "Love the life you live. Live the life you love. - Bob Marley",
            "Life is really simple, but we insist on making it complicated. - Confucius",
            "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
            "The best way to predict your future is to create it. - Abraham Lincoln",
            "The only impossible journey is the one you never begin. - Tony Robbins",
            "It is during our darkest moments that we must focus to see the light. - Aristotle",
            "Whoever is happy will make others happy too. - Anne Frank"
        ];
        
        // Get today's date as a unique seed for the day
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        
        // Simple deterministic random based on the date
        const index = seed % quotes.length;
        
        return quotes[index];
    }

    // Function to update the quote in the blog section
    function updateQuoteOfTheDay() {
        const quoteElement = document.querySelector('.newsflash blockquote');
        if (quoteElement) {
            quoteElement.textContent = getQuoteOfTheDay();
        }
    }

    // Update the quote when the page loads
    updateQuoteOfTheDay();
