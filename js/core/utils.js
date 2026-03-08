// Hilfsfunktionen

// Zufallsgenerator mit Seed
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Bild laden
function loadImage(name, path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ name, img });
        img.src = path;
    });
}
