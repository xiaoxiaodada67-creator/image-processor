import React, { useState } from 'react';
import './ImageProcessor.css';

function ImageProcessor() {
  const [files, setFiles] = useState([]);
  const [outputDirectory, setOutputDirectory] = useState('');
  const [format, setFormat] = useState('jpg');
  const [removeMetadata, setRemoveMetadata] = useState(true);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const selectImages = async () => {
    try {
      const selectedFiles = await window.electron.selectImages();
      setFiles(selectedFiles);
    } catch (error) {
      alert('错误: ' + error.message);
    }
  };

  const selectOutputFolder = async () => {
    try {
      const folder = await window.electron.selectOutputFolder();
      setOutputDirectory(folder);
    } catch (error) {
      alert('错误: ' + error.message);
    }
  };

  const handleProcessClick = async () => {
    if (files.length === 0) {
      alert('请先选择至少一张图片');
      return;
    }

    if (!outputDirectory) {
      alert('请选择输出目录');
      return;
    }

    setProcessing(true);
    try {
      const options = {
        outputDirectory,
        format,
        removeMetadata,
        adjustments: {
          brightness,
          contrast,
        },
      };

      const response = await window.electron.processImages(files, options);

      if (response.success) {
        setResults(response.results);
        setFiles([]);
        setOutputDirectory('');
      } else {
        alert('处理图片出错: ' + response.error);
      }
    } catch (error) {
      alert('错误: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="processor-container">
      <div className="processor-card">
        <h1>🖼️ 图片处理器</h1>
        <p className="subtitle">一键批量处理图片</p>

        <div className="section">
          <h2>第一步：选择图片</h2>
          <button onClick={selectImages} className="btn btn-primary">
            📁 选择图片 ({files.length})
          </button>
          {files.length > 0 && (
            <div className="file-list">
              <p>已选择文件:</p>
              <ul>
                {files.slice(0, 5).map((file, idx) => (
                  <li key={idx}>{file.split('\\').pop()}</li>
                ))}
                {files.length > 5 && <li>... 还有 {files.length - 5} 个文件</li>}
              </ul>
            </div>
          )}
        </div>

        <div className="section">
          <h2>第二步：输出设置</h2>
          <div className="settings-group">
            <div className="setting">
              <label>输出目录:</label>
              <div className="setting-input">
                <input
                  type="text"
                  value={outputDirectory}
                  readOnly
                  placeholder="未选择目录"
                />
                <button onClick={selectOutputFolder} className="btn btn-secondary">
                  浏览
                </button>
              </div>
            </div>

            <div className="setting">
              <label>输出格式:</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="gif">GIF</option>
                <option value="bmp">BMP</option>
              </select>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>第三步：处理选项</h2>
          <div className="settings-group">
            <div className="setting checkbox">
              <input
                type="checkbox"
                id="removeMetadata"
                checked={removeMetadata}
                onChange={(e) => setRemoveMetadata(e.target.checked)}
              />
              <label htmlFor="removeMetadata">移除元数据 (EXIF, IPTC, XMP)</label>
            </div>

            <div className="setting slider">
              <label>
                亮度: <span className="value">{brightness > 0 ? '+' : ''}{brightness}%</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
              />
            </div>

            <div className="setting slider">
              <label>
                对比度: <span className="value">{contrast > 0 ? '+' : ''}{contrast}%</span>
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleProcessClick}
          disabled={processing || files.length === 0 || !outputDirectory}
          className="btn btn-success btn-large"
        >
          {processing ? '⏳ 处理中...' : '🚀 处理所有图片（一键）'}
        </button>

        {results && (
          <div className="results-section">
            <h2>✅ 处理完成</h2>
            <div className="results-list">
              {results.map((result, idx) => (
                <div key={idx} className={`result-item ${result.success ? 'success' : 'error'}`}>
                  <span className="result-icon">{result.success ? '✓' : '✗'}</span>
                  <div className="result-text">
                    <p className="result-filename">{result.inputFile.split('\\').pop()}</p>
                    <p className="result-message">{result.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setResults(null)}
              className="btn btn-secondary"
            >
              继续处理更多图片
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageProcessor;
