
        // Koyu/Açık mod değiştirici
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            
            // Tercihi localStorage'a kaydet
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });

        // Kaydedilmiş tema tercihini kontrol et
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }

        // Aşağı kaydırıldığında başlığı küçült
        const header = document.getElementById('main-header');
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Aşağı kaydırma
                header.classList.add('shrink');
            } else if (currentScroll < lastScroll || currentScroll <= 100) {
                // Yukarı kaydırma veya en üstte
                header.classList.remove('shrink');
            }
            
            lastScroll = currentScroll;
        });

        // Takvim işlevselliği
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();

        const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
            "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

        // Etkinlik veri yapısı
        const events = [
            {
                id: 1,
                title: "TILT Yıllık Konferansı 2025",
                date: new Date(2025, 8, 8), // 8 Eylül 2025 (aylar 0'dan başlar)
                description: "İnsan düşüncesinin ve teknolojik ilerlemenin geleceğini keşfedeceğimiz yıllık konferansımıza katılın. Açılış konuşmacıları ve atölye çalışmaları dahil.",
                color: "#dc3545"
            },
            {
                id: 2,
                title: "Felsefe Tartışma Grubu",
                date: new Date(currentYear, currentMonth, 15),
                description: "Felsefi metinleri ve fikirleri tartışmak için aylık toplantı",
                color: "#28a745"
            },
            {
                id: 3,
                title: "Bilim ve Toplum Atölyesi",
                date: new Date(currentYear, currentMonth, 22),
                description: "Bilimsel ilerlemeler gelecek toplumumuzu nasıl şekillendiriyor",
                color: "#007bff"
            }
        ];

        function generateCalendar(month, year) {
            const calendarBody = document.getElementById("calendar-body");
            const monthYearElement = document.getElementById("calendar-month-year");
            
            // Önceki takvimi temizle
            calendarBody.innerHTML = "";
            
            // Ay ve yıl başlığını ayarla
            monthYearElement.textContent = `${months[month]} ${year}`;
            
            // Ayın ilk gününü ve ayın gün sayısını al
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Karşılaştırma için bugünün tarih nesnesini oluştur
            const today = new Date();
            const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
            
            // Takvimi oluştur
            let date = 1;
            for (let i = 0; i < 6; i++) {
                // Bir tablo satırı oluştur
                const row = document.createElement("tr");
                
                // Her gün için tek tek hücreler oluştur
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        // Ayın ilk gününden önceki boş hücreler
                        const cell = document.createElement("td");
                        const cellText = document.createTextNode("");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else if (date > daysInMonth) {
                        // Ayın son gününden sonraki boş hücreler
                        const cell = document.createElement("td");
                        const cellText = document.createTextNode("");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    } else {
                        // Tarih içeren hücreler
                        const cell = document.createElement("td");
                        
                        // Bugünün günü olup olmadığını kontrol et
                        if (isCurrentMonth && date === today.getDate()) {
                            const dayDiv = document.createElement("div");
                            dayDiv.className = "current-day";
                            dayDiv.textContent = date;
                            cell.appendChild(dayDiv);
                        } else {
                            const cellText = document.createTextNode(date);
                            cell.appendChild(cellText);
                        }
                        
                        // Bu tarihin farklı bir aya ait olup olmadığını kontrol et (sonraki/önceki ay günleri için)
                        if ((i === 0 && j < firstDay) || date > daysInMonth) {
                            cell.classList.add("other-month");
                        }
                        
                        // Bu tarihte herhangi bir etkinlik olup olmadığını kontrol et
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
                            indicator.title = "Etkinlikleri görüntülemek için tıklayın";
                            cell.appendChild(indicator);
                            
                            // Etkinlikleri göstermek için tıklama olayı ekle
                            cell.addEventListener('click', () => {
                                showEventsForDate(date, month, year);
                            });
                        }
                        
                        row.appendChild(cell);
                        date++;
                    }
                }
                
                // Satırı takvim gövdesine ekle
                calendarBody.appendChild(row);
                
                // Günler biterse satır yapmayı durdur
                if (date > daysInMonth) {
                    break;
                }
            }
        }

        // Belirli bir tarih için etkinlikleri gösteren fonksiyon
        function showEventsForDate(day, month, year) {
            const selectedDate = new Date(year, month, day);
            
            // Bu tarih için etkinlikleri bul
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

        // Etkinlik modalını gösteren fonksiyon
        function showEventModal(events, date) {
            // Modal oluştur veya göster
            let modal = document.getElementById('event-modal');
            let overlay = document.getElementById('modal-overlay');
            
            if (!modal) {
                // Modal oluştur
                modal = document.createElement('div');
                modal.id = 'event-modal';
                modal.className = 'event-modal';
                
                // Overlay oluştur
                overlay = document.createElement('div');
                overlay.id = 'modal-overlay';
                overlay.className = 'overlay';
                overlay.addEventListener('click', closeEventModal);
                
                document.body.appendChild(modal);
                document.body.appendChild(overlay);
            }
            
            // Modal içeriğini oluştur
            let modalContent = `
                <button class="close-btn">&times;</button>
                <h3>${date.toLocaleDateString('tr-TR')} Tarihindeki Etkinlikler</h3>
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
            
            // Butona kapatma olayı ekle
            modal.querySelector('.close-btn').addEventListener('click', closeEventModal);
            
            // Modal ve overlay'i göster
            modal.style.display = 'block';
            overlay.style.display = 'block';
        }

        // Etkinlik modalını kapatan fonksiyon
        function closeEventModal() {
            const modal = document.getElementById('event-modal');
            const overlay = document.getElementById('modal-overlay');
            
            if (modal) modal.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
        }

        // Navigasyon fonksiyonları
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

        // Takvimi başlat
        generateCalendar(currentMonth, currentYear);

        // NYT Haber API Entegrasyonu
        const newsContainer = document.getElementById('news-container');
        const refreshButton = document.getElementById('refresh-news');
        
        // NYT API Anahtarı
        const API_KEY = '6NNf0KIZZZElhq4ZSOTfYqInqbB84dRN';
        
        // NYT'den haber getiren fonksiyon
        async function fetchNews() {
            try {
                newsContainer.innerHTML = '<div class="loading">Haberler yükleniyor...</div>';
                
                // NYT API'den haberleri getir
                const response = await fetch(`https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${API_KEY}`);
                
                if (!response.ok) {
                    throw new Error(`HTTP hatası! durum: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    displayNews(data.results);
                } else {
                    throw new Error('Yanıtta hiç haber makalesi bulunamadı');
                }
                
            } catch (error) {
                console.error('Haber getirme hatası:', error);
                
                // API başarısız olursa yedek veri kullan
                const mockNews = [
                    {
                        title: 'İklim Değişikliği Anlaşması Uluslararası Zirvede Sağlandı',
                        abstract: 'Dünya liderleri, 2050 yılına kadar karbon nötrlüğü hedefleyen iklim değişikliğiyle mücadele için yeni bir dizi önlem üzerinde anlaştı.',
                        url: 'https://www.nytimes.com/',
                        byline: 'JANE DOE',
                        published_date: '2023-09-15',
                        multimedia: [
                            {
                                url: 'https://via.placeholder.com/300x160?text=İklim+Haberleri',
                                format: 'Standard Thumbnail'
                            }
                        ]
                    },
                    {
                        title: 'Kuantum Hesaplamada Yeni Çığır Açıldı',
                        abstract: 'Bilim insanları, teknoloji endüstrilerinde devrim yaratabilecek kuantum hesaplamada büyük bir ilerleme duyurdu.',
                        url: 'https://www.nytimes.com/',
                        byline: 'JOHN SMITH',
                        published_date: '2023-09-14',
                        multimedia: [
                            {
                                url: 'https://via.placeholder.com/300x160?text=Kuantum+Hesaplama',
                                format: 'Standard Thumbnail'
                            }
                        ]
                    },
                    {
                        title: 'Küresel Ekonomik Forum Yükselen Enflasyonu Ele Alıyor',
                        abstract: 'Ekonomistler ve politika yapıcılar, enflasyonu yönetmek ve ekonomik büyümeyi desteklemek için stratejileri tartışmak üzere bir araya geldi.',
                        url: 'https://www.nytimes.com/',
                        byline: 'ALICE JOHNSON',
                        published_date: '2023-09-13',
                        multimedia: [
                            {
                                url: 'https://via.placeholder.com/300x160?text=Ekonomi',
                                format: 'Standard Thumbnail'
                            }
                        ]
                    },
                    {
                        title: 'Uzay Keşfi Yeni Bir Dönüm Noktasına Ulaştı',
                        abstract: 'Son uzay görevi başarıyla hedefine ulaşarak yıldızlararası keşifte yeni bir çağ başlattı.',
                        url: 'https://www.nytimes.com/',
                        byline: 'ROBERT WILLIAMS',
                        published_date: '2023-09-12',
                        multimedia: [
                            {
                                url: 'https://via.placeholder.com/300x160?text=Uzay',
                                format: 'Standard Thumbnail'
                            }
                        ]
                    }
                ];
                
                displayNews(mockNews);
                
                // Hata mesajını göster ama yine de yedek veriyi görüntüle
                newsContainer.innerHTML = `
                    <div class="error">
                        <p>NYT API bağlantısı başarısız oldu. Örnek haberler gösteriliyor.</p>
                        <p><small>${error.message}</small></p>
                    </div>
                ` + newsContainer.innerHTML;
            }
        }
        
        // Haber makalelerini görüntüleyen fonksiyon
        function displayNews(articles) {
            if (!articles || articles.length === 0) {
                newsContainer.innerHTML = '<div class="error">Hiç haber makalesi bulunamadı.</div>';
                return;
            }
            
            // Daha iyi düzen için 4 makale ile sınırla
            const articlesToShow = articles.slice(0, 6);
            
            newsContainer.innerHTML = articlesToShow.map(article => {
                // Uygun bir resim bul
                let imageUrl = 'https://via.placeholder.com/300x160?text=Haber';
                if (article.multimedia && article.multimedia.length > 0) {
                    // Önce büyük bir resim bulmaya çalış
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
                                <span>${article.byline || 'New York Times'}</span>
                                <span>${new Date(article.published_date).toLocaleDateString('tr-TR')}</span>
                            </div>
                            </div>
                    </div>
                `;
            }).join('');
        }
        
        // Yenile butonu için olay dinleyicisi
        refreshButton.addEventListener('click', fetchNews);
        
        // Sayfa yüklendiğinde haberleri getir
        fetchNews();
        
        // Borsa Verileri Bölümü
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
    
    // Borsa verilerini getiren fonksiyon
    async function fetchStockData(symbol = 'AAPL', timeframe = 'TIME_SERIES_DAILY') {
        try {
            stockInfoElement.innerHTML = '<div class="loading">Borsa verileri yükleniyor...</div>';
            
            // Alpha Vantage API kullan
            const response = await fetch(`https://www.alphavantage.co/query?function=${timeframe}&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`HTTP hatası! durum: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Hangi zaman dilimi verisine sahip olduğumuzu kontrol et
            let timeSeriesData;
            if (data['Time Series (Daily)']) {
                timeSeriesData = data['Time Series (Daily)'];
            } else if (data['Weekly Time Series']) {
                timeSeriesData = data['Weekly Time Series'];
            } else if (data['Monthly Time Series']) {
                timeSeriesData = data['Monthly Time Series'];
            } else {
                throw new Error('Yanıtta zaman serisi verisi bulunamadı');
            }
            
            // Veriyi işle
            const dates = Object.keys(timeSeriesData).sort();
            const values = dates.map(date => {
                return {
                    date: date,
                    price: parseFloat(timeSeriesData[date]['4. close'])
                };
            });
            
            // Mevcut ve önceki fiyatları al
            const currentPrice = values[values.length - 1].price;
            const previousPrice = values[values.length - 2].price;
            
            displayStockData({
                symbol: symbol,
                values: values,
                currentPrice: currentPrice,
                previousPrice: previousPrice
            });
            
        } catch (error) {
            console.error('Borsa verileri getirme hatası:', error);
            
            // API başarısız olursa yedek veri kullan
            const mockData = generateMockStockData(symbol, timeframe);
            displayStockData(mockData);
            
            // Hata mesajını göster ama yine de veriyi görüntüle
            stockInfoElement.innerHTML = `
                <div class="error">
                    <p>Alpha Vantage API bağlantı sorunu. Örnek veriler gösteriliyor.</p>
                    <p><small>${error.message}</small></p>
                </div>
            ` + stockInfoElement.innerHTML;
        }
    }
    
    // Yedek borsa verisi oluşturan fonksiyon
    function generateMockStockData(symbol, timeframe) {
        const data = { 
            symbol: symbol,
            values: [],
            currentPrice: 0,
            previousPrice: 0
        };
        
        // Sembole göre temel fiyatı ayarla
        const basePrices = {
            'AAPL': 170, 'MSFT': 330, 'GOOGL': 135, 
            'AMZN': 140, 'TSLA': 240, 'SPY': 450
        };
        
        const basePrice = basePrices[symbol] || 100;
        const volatility = basePrice * 0.02; // %2 oynaklık
        
        // Veri noktaları oluştur
        const points = timeframe === 'TIME_SERIES_MONTHLY' ? 30 : 
                      timeframe === 'TIME_SERIES_WEEKLY' ? 60 : 90;
        
        let currentValue = basePrice;
        const values = [];
        
        for (let i = points; i >= 0; i--) {
            // Hisse fiyatı için rastgele yürüyüş
            const change = (Math.random() - 0.5) * volatility;
            currentValue += change;
            
            // Fiyatın negatif olmamasını sağla
            currentValue = Math.max(5, currentValue);
            
            // Tarihi biçimlendir
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
    
    // Borsa verilerini grafikte görüntüleyen fonksiyon
    function displayStockData(stockData) {
        const dates = stockData.values.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString('tr-TR', { 
                month: 'short', 
                day: 'numeric' 
            });
        });
        
        const prices = stockData.values.map(item => item.price);
        
        // Fiyat değişimini hesapla
        const change = stockData.currentPrice - stockData.previousPrice;
        const changePercent = (change / stockData.previousPrice) * 100;
        
        // Fiyat görüntüsünü güncelle
        stockPriceElement.textContent = `$${stockData.currentPrice.toFixed(2)}`;
        changeAmountElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
        changePercentElement.textContent = `(${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
        
        // Değişime göre renk ayarla
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
        
        // Grafik oluştur veya güncelle
        const ctx = stockChartCanvas.getContext('2d');
        
        if (stockChart) {
            stockChart.destroy();
        }
        
        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: `${stockData.symbol} Fiyatı`,
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
    
    // Borsa kontrolleri için olay dinleyicileri
    stockSelect.addEventListener('change', () => {
        fetchStockData(stockSelect.value, timeframeSelect.value);
    });
    
    timeframeSelect.addEventListener('change', () => {
        fetchStockData(stockSelect.value, timeframeSelect.value);
    });
    
    refreshStocksButton.addEventListener('click', () => {
        fetchStockData(stockSelect.value, timeframeSelect.value);
    });
    
    // Borsa verilerini başlat
    fetchStockData();

          // Currency Exchange Rates Section
const currencyContainer = document.getElementById('currency-container');
const refreshCurrencyButton = document.getElementById('refresh-currency');

// Store previous rates to calculate changes
let previousRates = {};


      // Döviz verilerini getiren fonksiyon
    async function fetchCurrencyData() {
        try {
            currencyContainer.innerHTML = '<div class="loading">Döviz verileri yükleniyor...</div>';
            
           // Using Frankfurter API (free, no API key required)
        const response = await fetch('https://api.frankfurter.app/latest?from=USD');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
            
            const data = await response.json();
            
            if (data && data.conversion_rates) {
                const rates = data.conversion_rates;
                const currentTime = new Date().toISOString();
                
                // Önceki verilerimiz varsa değişiklikleri hesapla
                let changes = {};
                if (Object.keys(previousRates).length > 0) {
                    changes = calculateChanges(previousRates, rates);
                }
                
                // Bir sonraki karşılaştırma için mevcut oranları sakla
                previousRates = {...rates};
                
                // Döviz verilerini hazırla
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
                throw new Error('Yanıtta döviz verisi bulunamadı');
            }
            
        } catch (error) {
            console.error('Döviz verileri getirme hatası:', error);
            
            // API başarısız olursa yedek veri kullan
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
            
            // Hata mesajını göster ama yine de veriyi görüntüle
            currencyContainer.innerHTML = `
                <div class="error">
                    <p>Döviz API bağlantı sorunu. Örnek veriler gösteriliyor.</p>
                    <p><small>${error.message}</small></p>
                </div>
            ` + currencyContainer.innerHTML;
        }
    }
    
    // Önceki ve mevcut oranlar arasındaki değişiklikleri hesaplayan fonksiyon
    function calculateChanges(prevRates, currentRates) {
        const changes = {};
        
        // Doğrudan oran değişikliklerini hesapla
        if (prevRates.EUR && currentRates.EUR) {
            changes.EUR = currentRates.EUR - prevRates.EUR;
        }
        if (prevRates.TRY && currentRates.TRY) {
            changes.TRY = currentRates.TRY - prevRates.TRY;
        }
        
        // Çapraz oran değişikliklerini hesapla (EUR/TRY)
        if (prevRates.EUR && prevRates.TRY && currentRates.EUR && currentRates.TRY) {
            const prevEurTry = prevRates.TRY / prevRates.EUR;
            const currentEurTry = currentRates.TRY / currentRates.EUR;
            changes.EUR_TRY = currentEurTry - prevEurTry;
        }
        
        return changes;
    }
    
    // Döviz verilerini görüntüleyen fonksiyon
    function displayCurrencyData(currencies) {
        if (!currencies || currencies.length === 0) {
            currencyContainer.innerHTML = '<div class="error">Döviz verisi bulunamadı.</div>';
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
                        <span>Son güncelleme:</span>
                        <span>${new Date(currency.lastUpdated).toLocaleTimeString('tr-TR')}</span>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Döviz çiftleri için bayrak emojilerini alan yardımcı fonksiyon
    function getFlagEmoji(pair) {
        const flagMap = {
            'USD': '🇺🇸',
            'EUR': '🇪🇺',
            'TRY': '🇹🇷',
          
        };
        
        const [from, to] = pair.split('/');
        return `${flagMap[from] || '💵'} → ${flagMap[to] || '💵'}`;
    }
    
    // Yenile butonu için olay dinleyicisi
    refreshCurrencyButton.addEventListener('click', fetchCurrencyData);
    
    // Sayfa yüklendiğinde döviz verilerini getir
    fetchCurrencyData();
    
    // Döviz verilerini her 5 dakikada bir yenile
    setInterval(fetchCurrencyData, 5 * 60 * 1000);
        
        // Daha iyi döşeme kaynağı ile uydu haritasını başlat
        function initMap() {
            // Dünya merkezli harita oluştur
            const map = L.map('satellite-map').setView([20, 0], 2);
            
            // Daha iyi uydu döşeme katmanı ekle
            const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Döşemeler &copy; Esri &mdash; Kaynak: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP ve GIS Kullanıcı Topluluğu',
                maxZoom: 18
            });
            
            // Yedek standart harita katmanı ekle
            const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katkıda bulunanlar',
                maxZoom: 18
            });
            
            // Katman kontrolü ekle
            const baseMaps = {
                "Uydu": satelliteLayer,
                "Standart": standardLayer
            };
            
            // Varsayılan olarak uydu katmanını ekle
            satelliteLayer.addTo(map);
            L.control.layers(baseMaps).addTo(map);
            
            // Saatlerini gösterdiğimiz şehirler için bazı işaretçiler ekle
            const cities = [
                {name: "New York", coords: [40.7128, -74.0060]},
                {name: "İstanbul", coords: [41.0082, 28.9784]},
                {name: "Londra", coords: [51.5074, -0.1278]},
                {name: "Tokyo", coords: [35.6762, 139.6503]}
            ];
            
            cities.forEach(city => {
                L.marker(city.coords)
                    .addTo(map)
                    .bindPopup(city.name);
            });
        }

        // Dünya saatlerini güncelle
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
            const nyTime = new Date().toLocaleString('tr-TR', { 
                timeZone: 'America/New_York',
                ...timeOptions
            });
            const nyDate = new Date().toLocaleString('tr-TR', { 
                timeZone: 'America/New_York',
                ...dateOptions
            });
            document.getElementById('time-ny').textContent = nyTime;
            document.getElementById('date-ny').textContent = nyDate;
            
            // İstanbul
            const istanbulTime = new Date().toLocaleString('tr-TR', { 
                timeZone: 'Europe/Istanbul',
                ...timeOptions
            });
            const istanbulDate = new Date().toLocaleString('tr-TR', { 
                timeZone: 'Europe/Istanbul',
                ...dateOptions
            });
            document.getElementById('time-istanbul').textContent = istanbulTime;
            document.getElementById('date-istanbul').textContent = istanbulDate;
            
            // Londra
            const londonTime = new Date().toLocaleString('tr-TR', { 
                timeZone: 'Europe/London',
                ...timeOptions
            });
            const londonDate = new Date().toLocaleString('tr-TR', { 
                timeZone: 'Europe/London',
                ...dateOptions
            });
            document.getElementById('time-london').textContent = londonTime;
            document.getElementById('date-london').textContent = londonDate;
            
            // Tokyo
            const tokyoTime = new Date().toLocaleString('tr-TR', { 
                timeZone: 'Asia/Tokyo',
                ...timeOptions
            });
            const tokyoDate = new Date().toLocaleString('tr-TR', { 
                timeZone: 'Asia/Tokyo',
                ...dateOptions
            });
            document.getElementById('time-tokyo').textContent = tokyoTime;
            document.getElementById('date-tokyo').textContent = tokyoDate;
        }

        // Sayfa yüklendiğinde harita ve saatleri başlat
        document.addEventListener('DOMContentLoaded', () => {
            initMap();
            updateClocks();
            
            // Saatleri her saniye güncelle
            setInterval(updateClocks, 1000);
        });
        
        // Günün Sözü Özelliği
function getQuoteOfTheDay() {
    const quotes = [
        "Sorgulanmamış bir hayat yaşamaya değmez. - Sokrates",
        "Hayat, sen başka planlar yaparken olan şeydir. - John Lennon",
        "Hayatımızın amacı mutlu olmaktır. - Dalay Lama",
        "Ya yaşamakla meşgul olun ya da ölmekle. - Stephen King",
        "Sadece bir kez yaşarsınız, ama doğru yaşarsanız, bir kez yeterlidir. - Mae West",
        "Yaşamaktaki en büyük zafer hiç düşmemekte değil, her düştüğümüzde kalkabilmektedir. - Nelson Mandela",
        "Zamanın kısıtlı, bu yüzden onu başkasının hayatını yaşayarak harcama. - Steve Jobs",
        "Hayat ya cesur bir maceradır ya da hiçbir şey. - Helen Keller",
        "Başlamanın yolu, konuşmayı bırakıp yapmaya başlamaktır. - Walt Disney",
        "Hayat öngörülebilir olsaydı, hayat olmaktan çıkar ve tatsız olurdu. - Eleanor Roosevelt",
        "Hayatta sahip olduklarınıza bakarsanız, her zaman daha fazlasına sahip olursunuz. - Oprah Winfrey",
        "Hayat alçakgönüllülük üzerine uzun bir derstir. - James M. Barrie",
        "Sonunda, hayatınızdaki yıllar değil, yıllarınızdaki hayat önemlidir. - Abraham Lincoln",
        "Yaşadığın hayatı sev. Sevdiğin hayatı yaşa. - Bob Marley",
        "Hayat aslında basittir, ama biz onu karmaşık hale getirmekte ısrar ederiz. - Konfüçyüs",
        "Gelecek, hayallerinin güzelliğine inananlarındır. - Eleanor Roosevelt",
        "Geleceğinizi tahmin etmenin en iyi yolu onu yaratmaktır. - Abraham Lincoln",
        "İmkansız olan tek yolculuk, asla başlamadığınız yolculuktur. - Tony Robbins",
        "En karanlık anlarımızda, ışığı görmek için odaklanmalıyız. - Aristoteles",
        "Mutlu olan herkes başkalarını da mutlu edecektir. - Anne Frank"
    ];
    
    // Gün için benzersiz bir tohum olarak bugünün tarihini al
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Tarihe dayalı basit deterministik rastgele
    const index = seed % quotes.length;
    
    return quotes[index];
}

// Blog bölümündeki sözü güncelleyen fonksiyon
function updateQuoteOfTheDay() {
    const quoteElement = document.querySelector('.newsflash blockquote');
    if (quoteElement) {
        quoteElement.textContent = getQuoteOfTheDay();
    }
}

// Sayfa yüklendiğinde sözü güncelle
document.addEventListener('DOMContentLoaded', updateQuoteOfTheDay);
          document.addEventListener('DOMContentLoaded', function() {
        // Canvas kurulumu
        const canvas = document.getElementById('doodle-canvas');
        const ctx = canvas.getContext('2d');
        
        // Canvas boyutunu uygun şekilde ayarla
        function resizeCanvas() {
            const container = canvas.parentElement;
            canvas.width = container.clientWidth - 40; // Dolgu için hesaba kat
            canvas.height = Math.min(500, window.innerHeight * 0.6);
            redrawCanvas();
        }
        
        // Beyaz arka planla canvas'ı başlat
        function initCanvas() {
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#1a1a1a' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Canvas içeriğini yeniden çiz (yeniden boyutlandırma için)
        function redrawCanvas() {
            // Yeniden boyutlandırmada çizimleri korumak istiyorsanız bunun uygulanması gerekir
            // Şimdilik sadece yeniden başlatacağız
            initCanvas();
        }
        
        // Çizim durumu
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        let currentTool = 'ballpoint';
        let currentColor = '#000000';
        let brushSize = 5;
        let globalAlpha = 1;
        
        // Başlat
        initCanvas();
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Araç butonları
        const toolButtons = document.querySelectorAll('.tool-btn');
        toolButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                toolButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentTool = btn.dataset.tool;
                
                // Araç özel özellikleri ayarla
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
        
        // Fırça boyutu kontrolü
        const brushSizeSlider = document.getElementById('brush-size');
        const brushSizeValue = document.getElementById('brush-size-value');
        
        brushSizeSlider.addEventListener('input', () => {
            brushSize = parseInt(brushSizeSlider.value);
            brushSizeValue.textContent = `${brushSize}px`;
        });
        
        // Renk seçimi
        const colorOptions = document.querySelectorAll('.color-option');
        const customColorPicker = document.getElementById('custom-color-picker');
        
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                currentColor = option.dataset.color;
            });
        });
        
        customColorPicker.addEventListener('input', () => {
            currentColor = customColorPicker.value;
            colorOptions.forEach(o => o.classList.remove('selected'));
        });
        
        // Çizim fonksiyonları
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
            
            // Özel araçlar
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
        
        // Çizim için olay dinleyicileri
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        // Dokunmatik destek
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
        
        // Canvas'ı temizle
        document.getElementById('clear-canvas').addEventListener('click', () => {
            if (confirm('Canvas\'ı temizlemek istediğinizden emin misiniz?')) {
                initCanvas();
            }
        });
        
        // Çizimi kaydet
        document.getElementById('save-doodle').addEventListener('click', () => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            
            // Kaydetme için beyaz arka planla doldur
            tempCtx.fillStyle = '#ffffff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            
            const dataURL = tempCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = 'tilt-doodle.png';
            link.href = dataURL;
            link.click();
        });
        
        // Tam ekran geçişi
        document.getElementById('toggle-fullscreen').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                canvas.requestFullscreen().catch(err => {
                    alert(`Tam ekran etkinleştirilirken hata: ${err.message}`);
                });
            } else {
                document.exitFullscreen();
            }
        });
        
        // Koyu mod değişikliklerini yönet
        const observer = new MutationObserver(() => {
            // Silgi modundaysak, silgi rengini ayarlamamız gerekebilir
            if (currentTool === 'eraser') {
                // Sadece arka planı güncellemek için canvas'ı yeniden çiz
                initCanvas();
            }
        });
        
        observer.observe(document.body, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
    });

