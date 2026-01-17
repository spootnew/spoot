
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as ReactDOMNamespace from 'react-dom';
import App from './App';

/**
 * React 19 Compatibility Polyfill
 * react-quill ve benzeri kütüphaneler, DOM erişimi için hala findDOMNode'a ihtiyaç duyabilmektedir.
 * React 19 bu fonksiyonu tamamen kaldırdığı için manuel olarak pollyfill ediyoruz.
 */
const findDOMNodePolyfill = (instance: any) => {
  if (!instance) return null;
  if (instance instanceof HTMLElement) return instance;
  if (typeof instance === 'object') {
    // Quill editör örneği ise root elementini döndür
    if (typeof instance.getEditor === 'function') return instance.getEditor().root;
    // React ref nesnesi ise current değerine bak
    if (instance.current instanceof HTMLElement) return instance.current;
    // Eğer nesne bir DOM düğümü ise kendisini döndür
    if (instance.nodeType === 1) return instance;
  }
  return null;
};

// ReactDOMNamespace (import * as) dondurulmuş (frozen) bir nesnedir, bu yüzden klonluyoruz.
const polyfill: any = { ...ReactDOMNamespace };

// Fonksiyonu pollyfill nesnesine ekle
polyfill.findDOMNode = findDOMNodePolyfill;

// 'default' özelliğini yönet (ESM/CJS uyumluluğu için kritik)
// Bazı paketleyiciler 'import ReactDOM from "react-dom"' kullanımında .default özelliğine bakar.
if (polyfill.default) {
  try {
    // Eğer .default dondurulmamışsa doğrudan ata
    polyfill.default.findDOMNode = findDOMNodePolyfill;
  } catch (e) {
    // Eğer .default dondurulmuşsa, onu da klonlayarak güncelle
    polyfill.default = { ...polyfill.default, findDOMNode: findDOMNodePolyfill };
  }
} else {
  // .default yoksa nesnenin kendisini default olarak ata
  polyfill.default = polyfill;
}

// Global window nesnesine ata. Birçok kütüphane window.ReactDOM üzerinden erişim sağlar.
(window as any).ReactDOM = polyfill;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
