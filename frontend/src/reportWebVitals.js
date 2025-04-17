/**
 * Diese Funktion reportWebVitals wird verwendet, um Leistungsdaten der Webanwendung zu sammeln und zu melden.
 * Wenn eine onPerfEntry-Funktion übergeben wird, werden die Leistungsmetriken CLS, FID, FCP, LCP und TTFB mithilfe
 * des web-vitals-Pakets gesammelt und an die übergebene Funktion weitergegeben.
 */

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
