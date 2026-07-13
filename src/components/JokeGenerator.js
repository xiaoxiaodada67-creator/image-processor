import React, { useState } from 'react';
import './JokeGenerator.css';

function JokeGenerator() {
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jokeType, setJokeType] = useState('any');
  const [history, setHistory] = useState([]);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      let apiUrl = 'https://v2.jokeapi.dev/joke/';
      
      if (jokeType === 'any') {
        apiUrl += 'Any';
      } else if (jokeType === 'programming') {
        apiUrl += 'Programming';
      } else if (jokeType === 'knock-knock') {
        apiUrl += 'Knock-Knock';
      } else if (jokeType === 'general') {
        apiUrl += 'General';
      } else if (jokeType === 'christmas') {
        apiUrl += 'Christmas';
      }

      apiUrl += '?format=json&lang=zh';

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.type === 'single') {
        const jokeText = data.joke;
        setJoke({ text: jokeText, type: data.category });
        setHistory([{ text: jokeText, type: data.category }, ...history.slice(0, 9)]);
      } else if (data.type === 'twopart') {
        const jokeText = `${data.setup}\n\n${data.delivery}`;
        setJoke({ text: jokeText, type: data.category });
        setHistory([{ text: jokeText, type: data.category }, ...history.slice(0, 9)]);
      }
    } catch (error) {
      alert('获取笑话失败: ' + error.message);
      setJoke({ text: '获取笑话失败，请稍后重试', type: 'Error' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (joke) {
      navigator.clipboard.writeText(joke.text);
      alert('已复制到剪贴板！');
    }
  };

  const shareJoke = () => {
    if (joke) {
      const text = `😂 分享一个笑话：\n\n${joke.text}`;
      if (navigator.share) {
        navigator.share({
          title: '有趣的笑话',
          text: text,
        });
      } else {
        alert(text);
      }
    }
  };

  return (
    <div className="joke-container">
      <div className="joke-card">
        <h1>😂 随机笑话生成器</h1>
        <p className="subtitle">一键获取有趣的笑话</p>

        <div className="section">
          <h2>选择笑话类型</h2>
          <div className="joke-type-selector">
            <select value={jokeType} onChange={(e) => setJokeType(e.target.value)}>
              <option value="any">任意类型</option>
              <option value="programming">编程笑话</option>
              <option value="knock-knock">敲门笑话</option>
              <option value="general">通用笑话</option>
              <option value="christmas">圣诞笑话</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchJoke}
          disabled={loading}
          className="btn btn-primary btn-large"
        >
          {loading ? '⏳ 生成中...' : '🎲 生成笑话'}
        </button>

        {joke && (
          <div className="joke-display">
            <div className="joke-content">
              <p className="joke-text">{joke.text}</p>
              <span className="joke-category">{joke.type}</span>
            </div>

            <div className="joke-actions">
              <button onClick={copyToClipboard} className="btn btn-secondary">
                📋 复制
              </button>
              <button onClick={shareJoke} className="btn btn-secondary">
                📤 分享
              </button>
              <button onClick={fetchJoke} disabled={loading} className="btn btn-success">
                ➡️ 下一个
              </button>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="history-section">
            <h2>📜 笑话历史</h2>
            <div className="history-list">
              {history.map((item, idx) => (
                <div key={idx} className="history-item">
                  <p className="history-text">{item.text.substring(0, 100)}...</p>
                  <span className="history-category">{item.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JokeGenerator;
