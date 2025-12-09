// Dark/Light mode toggle and main functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
    }

    // Initial trigger for animations
    window.dispatchEvent(new Event('scroll'));

    // Shrink header on scroll
    const header = document.getElementById('main-header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Scroll down
            header.classList.add('shrink');
        } else if (currentScroll < lastScroll || currentScroll <= 100) {
            // Scroll up or at top
            header.classList.remove('shrink');
        }
        
        lastScroll = currentScroll;
    });

    // Calendar functionality
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // Event data structure
    const events = [
        {
            id: 1,
            title: "TILT Annual Conference 2025",
            date: new Date(2025, 8, 8), // September 8th, 2025 (months are 0-indexed)
            description: "Join us for our annual conference exploring the future of human thought and technological advancement. Keynote speakers and workshops included.",
            color: "#dc3545"
        },
        {
            id: 2,
            title: "Philosophy Discussion Group",
            date: new Date(currentYear, currentMonth, 15),
            description: "Monthly meeting to discuss philosophical texts and ideas",
            color: "#28a745"
        },
        {
            id: 3,
            title: "Science & Society Workshop",
            date: new Date(currentYear, currentMonth, 22),
            description: "How scientific advancements are shaping our future society",
            color: "#007bff"
        }
    ];

    function generateCalendar(month, year) {
        const calendarBody = document.getElementById("calendar-body");
        const monthYearElement = document.getElementById("calendar-month-year");
        
        // Clear previous calendar
        calendarBody.innerHTML = "";
        
        // Set month and year header
        monthYearElement.textContent = `${months[month]} ${year}`;
        
        // Get first day of month and number of days in month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Create date object for today to compare
        const today = new Date();
        const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
        
        // Create calendar
        let date = 1;
        for (let i = 0; i < 6; i++) {
            // Create a table row
            const row = document.createElement("tr");
            
            // Create individual cells for each day
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    // Empty cells before the first day of the month
                    const cell = document.createElement("td");
                    const cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else if (date > daysInMonth) {
                    // Empty cells after the last day of the month
                    const cell = document.createElement("td");
                    const cellText = document.createTextNode("");
                    cell.appendChild(cellText);
                    row.appendChild(cell);
                } else {
                    // Cells with dates
                    const cell = document.createElement("td");
                    
                    // Check if this is the current day
                    if (isCurrentMonth && date === today.getDate()) {
                        const dayDiv = document.createElement("div");
                        dayDiv.className = "current-day";
                        dayDiv.textContent = date;
                        cell.appendChild(dayDiv);
                    } else {
                        const cellText = document.createTextNode(date);
                        cell.appendChild(cellText);
                    }
                    
                    // Check if this date is from a different month (for next/prev month days)
                    if ((i === 0 && j < firstDay) || date > daysInMonth) {
                        cell.classList.add("other-month");
                    }
                    
                    // Check if this date has any events
                    const hasEvent = events.some(event => {
                        const eventDate = event.date;
                        return eventDate.getDate() === date && 
                               eventDate.getMonth() === month && 
                               eventDate.getFullYear() === year;
                    });
                    
                    if (hasEvent) {
                        cell.classList.add("event-day");
                        const indicator = document.createElement("div");
                        indicator.className = "event-indicator";
                        indicator.title = "Click to view events";
                        cell.appendChild(indicator);
                        
                        // Add click event to show events
                        cell.addEventListener('click', () => {
                            showEventsForDate(date, month, year);
                        });
                    }
                    
                    row.appendChild(cell);
                    date++;
                }
            }
            
            // Append the row to the calendar body
            calendarBody.appendChild(row);
            
            // Stop making rows if we've run out of days
            if (date > daysInMonth) {
                break;
            }
        }
    }

    // Function to show events for a specific date
    function showEventsForDate(day, month, year) {
        const selectedDate = new Date(year, month, day);
        
        // Find events for this date
        const eventsForDate = events.filter(event => {
            const eventDate = event.date;
            return eventDate.getDate() === day && 
                   eventDate.getMonth() === month && 
                   eventDate.getFullYear() === year;
        });
        
        if (eventsForDate.length > 0) {
            showEventModal(eventsForDate, selectedDate);
        }
    }

    // Function to show event modal
    function showEventModal(events, date) {
        // Create or show modal
        let modal = document.getElementById('event-modal');
        let overlay = document.getElementById('modal-overlay');
        
        if (!modal) {
            // Create modal
            modal = document.createElement('div');
            modal.id = 'event-modal';
            modal.className = 'event-modal';
            
            // Create overlay
            overlay = document.createElement('div');
            overlay.id = 'modal-overlay';
            overlay.className = 'overlay';
            overlay.addEventListener('click', closeEventModal);
            
            document.body.appendChild(modal);
            document.body.appendChild(overlay);
        }
        
        // Build modal content
        let modalContent = `
            <button class="close-btn">&times;</button>
            <h3>Events on ${date.toDateString()}</h3>
        `;
        
        events.forEach(event => {
            modalContent += `
                <div class="event-item" style="border-left: 4px solid ${event.color}; padding-left: 10px; margin-bottom: 15px;">
                    <h4 style="margin-top: 0; color: ${event.color};">${event.title}</h4>
                    <p class="event-description">${event.description}</p>
                </div>
            `;
        });
        
        modal.innerHTML = modalContent;
        
        // Add close event to button
        modal.querySelector('.close-btn').addEventListener('click', closeEventModal);
        
        // Show modal and overlay
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Function to close event modal
    function closeEventModal() {
        const modal = document.getElementById('event-modal');
        const overlay = document.getElementById('modal-overlay');
        
        if (modal) modal.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    }

    // Navigation functions
    document.getElementById("prev-month").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.getElementById("next-month").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.getElementById("today").addEventListener("click", () => {
        currentDate = new Date();
        currentMonth = currentDate.getMonth();
        currentYear = currentDate.getFullYear();
        generateCalendar(currentMonth, currentYear);
    });

    // Initialize calendar
    generateCalendar(currentMonth, currentYear);

    // NYT News API Integration
    const newsContainer = document.getElementById('news-container');
    const refreshButton = document.getElementById('refresh-news');
    
    // NYT API Key
    const API_KEY = '6NNf0KIZZZElhq4ZSOTfYqInqbB84dRN';
    
    // Function to fetch news from NYT
    async function fetchNews() {
        try {
            newsContainer.innerHTML = '<div class="loading">Loading news...</div>';
            
            // Fetch news from NYT API
            const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                displayNews(data.results);
            } else {
                throw new Error('No news articles found in response');
            }
            
        } catch (error) {
            console.error('Error fetching news:', error);
            
            // Fallback to mock data if API fails
            const mockNews = [
                {
                    title: 'Climate Change Agreement Reached at International Summit',
                    abstract: 'World leaders have agreed on a new set of measures to combat climate change, aiming for carbon neutrality by 2050.',
                    url: 'https://www.nytimes.com/',
                    byline: 'By JANE DOE',
                    published_date: '2023-09-15',
                    multimedia: [
                        {
                            url: 'https://via.placeholder.com/300x160?text=Climate+News',
                            format: 'Standard Thumbnail'
                        }
                    ]
                },
                {
                    title: 'New Breakthrough in Quantum Computing',
                    abstract: 'Scientists announce a major advancement in quantum computing that could revolutionize technology industries.',
                    url: 'https://www.nytimes.com/',
                    byline: 'By JOHN SMITH',
                    published_date: '2023-09-14',
                    multimedia: [
                        {
                            url: 'https://via.placeholder.com/300x160?text=Quantum+Computing',
                            format: 'Standard Thumbnail'
                        }
                    ]
                },
                {
                    title: 'Global Economic Forum Addresses Rising Inflation',
                    abstract: 'Economists and policymakers gather to discuss strategies for managing inflation and supporting economic growth.',
                    url: 'https://www.nytimes.com/',
                    byline: 'By ALICE JOHNSON',
                    published_date: '2023-09-13',
                    multimedia: [
                        {
                            url: 'https://via.placeholder.com/300x160?text=Economy',
                            format: 'Standard Thumbnail'
                        }
                    ]
                },
                {
                    title: 'Space Exploration Reaches New Milestone',
                    abstract: 'The latest space mission has successfully reached its destination, marking a new era in interstellar exploration.',
                    url: 'https://www.nytimes.com/',
                    byline: 'By ROBERT WILLIAMS',
                    published_date: '2023-09-12',
                    multimedia: [
                        {
                            url: 'https://via.placeholder.com/300x160?text=Space',
                            format: 'Standard Thumbnail'
                        }
                    ]
                }
            ];
            
            displayNews(mockNews);
            
            // Show error message but still display mock data
            newsContainer.innerHTML = `
                <div class="error">
                    <p>NYT API connection failed. Showing sample news.</p>
                    <p><small>${error.message}</small></p>
                </div>
            ` + newsContainer.innerHTML;
        }
    }
    
    // Function to display news articles
    function displayNews(articles) {
        if (!articles || articles.length === 0) {
            newsContainer.innerHTML = '<div class="error">No news articles found.</div>';
            return;
        }
        
        // Limit to 6 articles for better layout
        const articlesToShow = articles.slice(0, 6);
        
        newsContainer.innerHTML = articlesToShow.map(article => {
            // Find a suitable image
            let imageUrl = 'https://via.placeholder.com/300x160?text=News';
            if (article.multimedia && article.multimedia.length > 0) {
                // Try to find a large image first
                const largeImage = article.multimedia.find(media => media.format === 'superJumbo');
                const normalImage = article.multimedia.find(media => media.format === 'Normal');
                const thumbImage = article.multimedia.find(media => media.format === 'Standard Thumbnail');
                
                if (largeImage) imageUrl = largeImage.url;
                else if (normalImage) imageUrl = normalImage.url;
                else if (thumbImage) imageUrl = thumbImage.url;
                else imageUrl = article.multimedia[0].url;
            }
            
            return `
                <div class="news-card">
                    <img src="${imageUrl}" alt="${article.title}" class="news-image">
                    <div class="news-content">
                        <h3 class="news-title">
                            <a href="${article.url}" target="_blank" rel="noopener">${article.title}</a>
                        </h3>
                        <p class="news-description">${article.abstract}</p>
                        <div class="news-meta">
                            <span>${article.byline || 'By New York Times'}</span>
                            <span>${new Date(article.published_date).toLocaleDateString()}</span>
                        </div>
                        </div>
                </div>
            `;
        }).join('');
    }
    
    // Event listener for refresh button
    refreshButton.addEventListener('click', fetchNews);
    
    // Fetch news on page load
    fetchNews();

    // Stock Market Data Section
    const stockSelect = document.getElementById('stock-select');
    const timeframeSelect = document.getElementById('timeframe-select');
    const refreshStocksButton = document.getElementById('refresh-stocks');
    const stockChartCanvas = document.getElementById('stock-chart');
    const stockPriceElement = document.getElementById('stock-price');
    const changeAmountElement = document.getElementById('change-amount');
    const changePercentElement = document.getElementById('change-percent');
    const stockInfoElement = document.getElementById('stock-info');

    let stockChart = null;
    const ALPHA_VANTAGE_API_KEY = 'd11672c0-1325-4987-be09-22caa6f2eee6';

    // Function to fetch stock data
    async function fetchStockData(symbol = 'AAPL', timeframe = 'TIME_SERIES_DAILY') {
        try {
            // Show loading state properly (do NOT clear out the whole info box)
            stockPriceElement.textContent = 'Loading...';
            changeAmountElement.textContent = '--';
            changePercentElement.textContent = '(--)';
            stockPriceElement.className = 'stock-price';
            changeAmountElement.className = '';
            changePercentElement.className = '';

            // Fetch from API
            const response = await fetch(`https://www.alphavantage.co/query?function=${timeframe}&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Handle time series
            let timeSeriesData;
            if (data['Time Series (Daily)']) {
                timeSeriesData = data['Time Series (Daily)'];
            } else if (data['Weekly Time Series']) {
                timeSeriesData = data['Weekly Time Series'];
            } else if (data['Monthly Time Series']) {
                timeSeriesData = data['Monthly Time Series'];
            } else {
                throw new Error('No time series data found in response');
            }

            const dates = Object.keys(timeSeriesData).sort();
            const values = dates.map(date => {
                return {
                    date: date,
                    price: parseFloat(timeSeriesData[date]['4. close'])
                };
            });

            const currentPrice = values[values.length - 1].price;
            const previousPrice = values[values.length - 2].price;

            displayStockData({
                symbol: symbol,
                values: values,
                currentPrice: currentPrice,
                previousPrice: previousPrice
            });

        } catch (error) {
            console.error('Error fetching stock data:', error);
            // Show error in numerical fields (do NOT clear out info box)
            stockPriceElement.textContent = 'Error';
            changeAmountElement.textContent = '--';
            changePercentElement.textContent = '(--)';
            stockPriceElement.className = 'stock-price';
            changeAmountElement.className = '';
            changePercentElement.className = '';

            // Fallback to mock data if API fails
            const mockData = generateMockStockData(symbol, timeframe);
            displayStockData(mockData);
        }
    }

    // Function to generate mock stock data
    function generateMockStockData(symbol, timeframe) {
        const data = { 
            symbol: symbol,
            values: [],
            currentPrice: 0,
            previousPrice: 0
        };
        
        // Set base price based on symbol
        const basePrices = {
            'AAPL': 170, 'MSFT': 330, 'GOOGL': 135, 
            'AMZN': 140, 'TSLA': 240, 'SPY': 450
        };
        
        const basePrice = basePrices[symbol] || 100;
        const volatility = basePrice * 0.02; // 2% volatility
        
        // Generate data points
        const points = timeframe === 'TIME_SERIES_MONTHLY' ? 30 : 
                      timeframe === 'TIME_SERIES_WEEKLY' ? 60 : 90;
        
        let currentValue = basePrice;
        const values = [];
        
        for (let i = points; i >= 0; i--) {
            // Random walk for stock price
            const change = (Math.random() - 0.5) * volatility;
            currentValue += change;
            // Ensure price doesn't go negative
            currentValue = Math.max(5, currentValue);
            // Format date
            const date = new Date();
            date.setDate(date.getDate() - i);
            values.push({
                date: date.toISOString().split('T')[0],
                price: parseFloat(currentValue.toFixed(2))
            });
        }
        
        data.values = values;
        data.currentPrice = values[values.length - 1].price;
        data.previousPrice = values[values.length - 2].price;
        
        return data;
    }

    // Function to display stock data in chart
    function displayStockData(stockData) {
        const dates = stockData.values.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
            });
        });
        
        const prices = stockData.values.map(item => item.price);
        
        // Calculate price change
        const change = stockData.currentPrice - stockData.previousPrice;
        const changePercent = (change / stockData.previousPrice) * 100;
        
        // Update price display
        stockPriceElement.textContent = `$${stockData.currentPrice.toFixed(2)}`;
        changeAmountElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
        changePercentElement.textContent = `(${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
        
        // Set color based on change
        if (change > 0) {
            changeAmountElement.className = 'positive';
            changePercentElement.className = 'positive';
            stockPriceElement.className = 'stock-price positive';
        } else if (change < 0) {
            changeAmountElement.className = 'negative';
            changePercentElement.className = 'negative';
            stockPriceElement.className = 'stock-price negative';
        } else {
            changeAmountElement.className = '';
            changePercentElement.className = '';
            stockPriceElement.className = 'stock-price';
        }
        
        // Create or update chart
        const ctx = stockChartCanvas.getContext('2d');
        if (stockChart) {
            stockChart.destroy();
        }
        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${stockData.symbol} Price`,
                    data: prices,
                    borderColor: change >= 0 ? '#28a745' : '#dc3545',
                    backgroundColor: change >= 0 ? 'rgba(40, 167, 69, 0.1)' : 'rgba(220, 53, 69, 0.1)',
                    fill: true,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `$${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    // Event listeners for stock controls
    if (stockSelect) {
        stockSelect.addEventListener('change', () => {
            fetchStockData(stockSelect.value, timeframeSelect.value);
        });
    }
    
    if (timeframeSelect) {
        timeframeSelect.addEventListener('change', () => {
            fetchStockData(stockSelect.value, timeframeSelect.value);
        });
    }
    
    if (refreshStocksButton) {
        refreshStocksButton.addEventListener('click', () => {
            fetchStockData(stockSelect.value, timeframeSelect.value);
        });
    }

    // Initialize stock data
    fetchStockData();

    // Currency Exchange Rates Section
    const currencyContainer = document.getElementById('currency-container');
    const refreshCurrencyButton = document.getElementById('refresh-currency');

    // Store previous rates to calculate changes
    let previousRates = {};

    // Function to fetch currency data using a free API
    async function fetchCurrencyData() {
        try {
            if (currencyContainer) {
                currencyContainer.innerHTML = '<div class="loading">Loading currency data...</div>';
            }
            
            // Using Frankfurter API (free, no API key required)
            const response = await fetch('https://api.frankfurter.app/latest?from=USD');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data && data.rates) {
                const rates = data.rates;
                const currentTime = new Date().toISOString();
                
                // Calculate changes if we have previous data
                let changes = {};
                if (Object.keys(previousRates).length > 0) {
                    changes = calculateChanges(previousRates, rates);
                }
                
                // Store current rates for next comparison
                previousRates = {...rates};
                
                // Prepare currency data
                const currencyData = [
                    {
                        pair: "USD/EUR",
                        rate: rates.EUR || 0,
                        change: changes.EUR || 0,
                        changePercent: changes.EUR ? (changes.EUR / (rates.EUR - changes.EUR)) * 100 : 0,
                        lastUpdated: currentTime
                    },
                    {
                        pair: "USD/TRY",
                        rate: rates.TRY || 0,
                        change: changes.TRY || 0,
                        changePercent: changes.TRY ? (changes.TRY / (rates.TRY - changes.TRY)) * 100 : 0,
                        lastUpdated: currentTime
                    },
                    {
                        pair: "EUR/TRY",
                        rate: rates.TRY && rates.EUR ? rates.TRY / rates.EUR : 0,
                        change: changes.EUR_TRY || 0,
                        changePercent: changes.EUR_TRY ? (changes.EUR_TRY / ((rates.TRY / rates.EUR) - changes.EUR_TRY)) * 100 : 0,
                        lastUpdated: currentTime
                    }
                ];
                
                displayCurrencyData(currencyData);
            } else {
                throw new Error('No currency data found in response');
            }
            
        } catch (error) {
            console.error('Error fetching currency data:', error);
            
            // Fallback to mock data if API fails
            const mockCurrencyData = [
                {
                    pair: "USD/EUR",
                    rate: 0.93,
                    change: 0.002,
                    changePercent: 0.22,
                    lastUpdated: new Date().toISOString()
                },
                {
                    pair: "USD/TRY",
                    rate: 32.15,
                    change: -0.25,
                    changePercent: -0.77,
                    lastUpdated: new Date().toISOString()
                },
                {
                    pair: "EUR/TRY",
                    rate: 34.58,
                    change: 0.12,
                    changePercent: 0.35,
                    lastUpdated: new Date().toISOString()
                }
            ];
            
            displayCurrencyData(mockCurrencyData);
            
            // Show error message but still display data
            if (currencyContainer) {
                currencyContainer.innerHTML = `
                    <div class="error">
                        <p>Currency API connection issue. Showing sample data.</p>
                        <p><small>${error.message}</small></p>
                    </div>
                ` + currencyContainer.innerHTML;
            }
        }
    }

    // Function to calculate changes between previous and current rates
    function calculateChanges(prevRates, currentRates) {
        const changes = {};
        
        // Calculate direct rate changes
        if (prevRates.EUR && currentRates.EUR) {
            changes.EUR = currentRates.EUR - prevRates.EUR;
        }
        if (prevRates.TRY && currentRates.TRY) {
            changes.TRY = currentRates.TRY - prevRates.TRY;
        }
        
        // Calculate cross rate changes (EUR/TRY)
        if (prevRates.EUR && prevRates.TRY && currentRates.EUR && currentRates.TRY) {
            const prevEurTry = prevRates.TRY / prevRates.EUR;
            const currentEurTry = currentRates.TRY / currentRates.EUR;
            changes.EUR_TRY = currentEurTry - prevEurTry;
        }
        
        return changes;
    }

    // Function to display currency data
    function displayCurrencyData(currencies) {
        if (!currencyContainer) return;
        
        if (!currencies || currencies.length === 0) {
            currencyContainer.innerHTML = '<div class="error">No currency data found.</div>';
            return;
        }
        
        currencyContainer.innerHTML = currencies.map(currency => {
            const isPositive = currency.change >= 0;
            const changeIcon = isPositive ? '↗' : '↘';
            
            return `
                <div class="currency-card">
                    <div class="currency-pair">
                        <span>${currency.pair}</span>
                        <span class="currency-flag">${getFlagEmoji(currency.pair)}</span>
                    </div>
                    <div class="currency-rate">${currency.rate.toFixed(4)}</div>
                    <div class="currency-change ${isPositive ? 'positive' : 'negative'}">
                        <span>${changeIcon} ${isPositive ? '+' : ''}${currency.change.toFixed(4)}</span>
                        <span>(${isPositive ? '+' : ''}${currency.changePercent.toFixed(2)}%)</span>
                    </div>
                    <div class="currency-info">
                        <span>Last updated:</span>
                        <span>${new Date(currency.lastUpdated).toLocaleTimeString()}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Helper function to get flag emojis for currency pairs
    function getFlagEmoji(pair) {
        const flagMap = {
            'USD': '🇺🇸',
            'EUR': '🇪🇺',
            'TRY': '🇹🇷',
        };
        
        const [from, to] = pair.split('/');
        return `${flagMap[from] || '💵'} → ${flagMap[to] || '💵'}`;
    }

    // Event listener for refresh button
    if (refreshCurrencyButton) {
        refreshCurrencyButton.addEventListener('click', fetchCurrencyData);
    }

    // Fetch currency data on page load
    fetchCurrencyData();

    // Refresh currency data every 5 minutes
    setInterval(fetchCurrencyData, 5 * 60 * 1000);
    
    // Initialize satellite map with better tile source
    function initMap() {
        const mapElement = document.getElementById('satellite-map');
        if (!mapElement) return;
        
        // Create map centered on the world
        const map = L.map('satellite-map').setView([20, 0], 2);
        
        // Add better satellite tile layer
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 18
        });
        
        // Add a fallback standard map layer
        const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18
        });
        
        // Add layer control
        const baseMaps = {
            "Satellite": satelliteLayer,
            "Standard": standardLayer
        };
        
        // Add the satellite layer by default
        satelliteLayer.addTo(map);
        L.control.layers(baseMaps).addTo(map);
        
        // Add some markers for the cities we're showing clocks for
        const cities = [
            {name: "New York", coords: [40.7128, -74.0060]},
            {name: "Istanbul", coords: [41.0082, 28.9784]},
            {name: "London", coords: [51.5074, -0.1278]},
            {name: "Tokyo", coords: [35.6762, 139.6503]}
        ];
        
        cities.forEach(city => {
            L.marker(city.coords)
                .addTo(map)
                .bindPopup(city.name);
        });
    }

    // Update world clocks
    function updateClocks() {
        const timeOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false 
        };
        
        const dateOptions = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        
        // New York (EST/EDT)
        const nyTime = new Date().toLocaleString('en-US', { 
            timeZone: 'America/New_York',
            ...timeOptions
        });
        const nyDate = new Date().toLocaleString('en-US', { 
            timeZone: 'America/New_York',
            ...dateOptions
        });
        if (document.getElementById('time-ny')) {
            document.getElementById('time-ny').textContent = nyTime;
        }
        if (document.getElementById('date-ny')) {
            document.getElementById('date-ny').textContent = nyDate;
        }
        
        // Istanbul
        const istanbulTime = new Date().toLocaleString('en-US', { 
            timeZone: 'Europe/Istanbul',
            ...timeOptions
        });
        const istanbulDate = new Date().toLocaleString('en-US', { 
            timeZone: 'Europe/Istanbul',
            ...dateOptions
        });
        if (document.getElementById('time-istanbul')) {
            document.getElementById('time-istanbul').textContent = istanbulTime;
        }
        if (document.getElementById('date-istanbul')) {
            document.getElementById('date-istanbul').textContent = istanbulDate;
        }
        
        // London
        const londonTime = new Date().toLocaleString('en-US', { 
            timeZone: 'Europe/London',
            ...timeOptions
        });
        const londonDate = new Date().toLocaleString('en-US', { 
            timeZone: 'Europe/London',
            ...dateOptions
        });
        if (document.getElementById('time-london')) {
            document.getElementById('time-london').textContent = londonTime;
        }
        if (document.getElementById('date-london')) {
            document.getElementById('date-london').textContent = londonDate;
        }
        
        // Tokyo
        const tokyoTime = new Date().toLocaleString('en-US', { 
            timeZone: 'Asia/Tokyo',
            ...timeOptions
        });
        const tokyoDate = new Date().toLocaleString('en-US', { 
            timeZone: 'Asia/Tokyo',
            ...dateOptions
        });
        if (document.getElementById('time-tokyo')) {
            document.getElementById('time-tokyo').textContent = tokyoTime;
        }
        if (document.getElementById('date-tokyo')) {
            document.getElementById('date-tokyo').textContent = tokyoDate;
        }
    }

    // Initialize map and clocks when page loads
    initMap();
    updateClocks();
    
    // Update clocks every second
    setInterval(updateClocks, 1000);

    // Doodle Den Canvas functionality
    const canvas = document.getElementById('doodle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Set canvas size appropriately
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth - 40; // Account for padding
            canvas.height = Math.min(500, window.innerHeight * 0.6);
            redrawCanvas();
        }
        
        // Initialize canvas with white background
        function initCanvas() {
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#1a1a1a' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Redraw canvas content (for resizing)
        function redrawCanvas() {
            // This would need to be implemented if you want to preserve drawings on resize
            // For now, we'll just reinitialize
            initCanvas();
        }
        
        // Drawing state
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let currentTool = 'ballpoint';
        let currentColor = '#000000';
        let brushSize = 5;
        let globalAlpha = 1;
        
        // Initialize
        initCanvas();
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Tool buttons
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                toolButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTool = btn.dataset.tool;
                
                // Set tool-specific properties
                switch(currentTool) {
                    case 'ballpoint':
                        brushSize = 5;
                        globalAlpha = 1;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        break;
                    case 'pencil':
                        brushSize = 3;
                        globalAlpha = 0.7;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        break;
                    case 'marker':
                        brushSize = 10;
                        globalAlpha = 0.8;
                        ctx.lineCap = 'square';
                        ctx.lineJoin = 'bevel';
                        break;
                    case 'brush':
                        brushSize = 15;
                        globalAlpha = 0.9;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        break;
                    case 'highlighter':
                        brushSize = 20;
                        globalAlpha = 0.3;
                        ctx.lineCap = 'square';
                        ctx.lineJoin = 'bevel';
                        break;
                    case 'calligraphy':
                        brushSize = 8;
                        globalAlpha = 1;
                        ctx.lineCap = 'square';
                        ctx.lineJoin = 'miter';
                        break;
                    case 'eraser':
                        brushSize = document.getElementById('brush-size').value;
                        globalAlpha = 1;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        break;
                    case 'spray':
                        brushSize = 15;
                        globalAlpha = 0.5;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        break;
                }
                
                document.getElementById('brush-size').value = brushSize;
                document.getElementById('brush-size-value').textContent = `${brushSize}px`;
            });
        });
        
        // Brush size control
        const brushSizeSlider = document.getElementById('brush-size');
        const brushSizeValue = document.getElementById('brush-size-value');
        
        if (brushSizeSlider && brushSizeValue) {
            brushSizeSlider.addEventListener('input', () => {
                brushSize = parseInt(brushSizeSlider.value);
                brushSizeValue.textContent = `${brushSize}px`;
            });
        }
        
        // Color selection
        const colorOptions = document.querySelectorAll('.color-option');
        const customColorPicker = document.getElementById('custom-color-picker');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                currentColor = option.dataset.color;
            });
        });
        
        if (customColorPicker) {
            customColorPicker.addEventListener('input', () => {
                currentColor = customColorPicker.value;
                colorOptions.forEach(o => o.classList.remove('selected'));
            });
        }
        
        // Drawing functions
        function startDrawing(e) {
            isDrawing = true;
            [lastX, lastY] = getPosition(e);
            
            if (currentTool === 'spray') {
                sprayPaint(lastX, lastY);
            }
        }
        
        function draw(e) {
            if (!isDrawing) return;
            
            const [x, y] = getPosition(e);
            
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            
            if (currentTool === 'eraser') {
                ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#1a1a1a' : '#ffffff';
            } else {
                ctx.strokeStyle = currentColor;
            }
            
            ctx.lineWidth = brushSize;
            ctx.globalAlpha = globalAlpha;
            ctx.stroke();
            
            // Special tools
            if (currentTool === 'spray') {
                sprayPaint(x, y);
            }
            
            [lastX, lastY] = [x, y];
        }
        
        function stopDrawing() {
            isDrawing = false;
        }
        
        function sprayPaint(x, y) {
            ctx.fillStyle = currentColor;
            ctx.globalAlpha = globalAlpha;
            
            const density = brushSize * 2;
            for (let i = 0; i < density; i++) {
                const offsetX = (Math.random() - 0.5) * brushSize * 2;
                const offsetY = (Math.random() - 0.5) * brushSize * 2;
                
                if (Math.sqrt(offsetX * offsetX + offsetY * offsetY) <= brushSize) {
                    ctx.beginPath();
                    ctx.arc(x + offsetX, y + offsetY, Math.random() * 2 + 1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        function getPosition(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            
            let clientX, clientY;
            
            if (e.type.includes('touch')) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }
            
            return [
                (clientX - rect.left) * scaleX,
                (clientY - rect.top) * scaleY
            ];
        }
        
        // Event listeners for drawing
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Touch support
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startDrawing(e);
        });
        
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            draw(e);
        });
        
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopDrawing();
        });
        
        // Clear canvas
        const clearButton = document.getElementById('clear-canvas');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to clear the canvas?')) {
                    initCanvas();
                }
            });
        }
        
        // Save drawing
        const saveButton = document.getElementById('save-doodle');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                
                tempCanvas.width = canvas.width;
                tempCanvas.height = canvas.height;
                
                // Fill with white background for saving
                tempCtx.fillStyle = '#ffffff';
                tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                tempCtx.drawImage(canvas, 0, 0);
                
                const dataURL = tempCanvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = 'tilt-doodle.png';
                link.href = dataURL;
                link.click();
            });
        }
        
        // Fullscreen toggle
        const fullscreenButton = document.getElementById('toggle-fullscreen');
        if (fullscreenButton) {
            fullscreenButton.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    canvas.requestFullscreen().catch(err => {
                        alert(`Error attempting to enable fullscreen: ${err.message}`);
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }
        
        // Handle dark mode changes
        const observer = new MutationObserver(() => {
            // If we're in eraser mode, we might need to adjust the eraser color
            if (currentTool === 'eraser') {
                // Just redraw the canvas to update the background
                initCanvas();
            }
        });
        
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    }
}); // Closing brace for main DOMContentLoaded function
// Add this to your script.js file
document.addEventListener('DOMContentLoaded', function() {
    // Get all quick navigation cards
    const navCards = document.querySelectorAll('.quick-nav-card');
    
    // Add IDs to your existing sections (if they don't have them)
    // You'll need to add these IDs to your HTML sections:
    // #news-section, #stocks-section, #currency-section, 
    // #map-section, #calendar-section, #doodle-section
    
    // Smooth scroll to section
    navCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate header height offset
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight the section
                targetSection.classList.add('section-highlight');
                
                // Remove highlight after animation
                setTimeout(() => {
                    targetSection.classList.remove('section-highlight');
                }, 2000);
            }
        });
    });
    
    // Scroll up/down buttons
    const scrollUpBtn = document.querySelector('.scroll-up');
    const scrollDownBtn = document.querySelector('.scroll-down');
    
    if (scrollUpBtn) {
        scrollUpBtn.addEventListener('click', () => {
            window.scrollBy({
                top: -window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        });
    }
    
    if (scrollDownBtn) {
        scrollDownBtn.addEventListener('click', () => {
            window.scrollBy({
                top: window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        });
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Number keys 1-6 for quick navigation
        if (e.key >= '1' && e.key <= '6') {
            const index = parseInt(e.key) - 1;
            const navCard = navCards[index];
            
            if (navCard) {
                e.preventDefault();
                navCard.click();
            }
        }
        
        // Arrow up/down for scrolling
        if (e.key === 'ArrowUp' && e.ctrlKey) {
            e.preventDefault();
            window.scrollBy({ top: -500, behavior: 'smooth' });
        }
        
        if (e.key === 'ArrowDown' && e.ctrlKey) {
            e.preventDefault();
            window.scrollBy({ top: 500, behavior: 'smooth' });
        }
    });
});
