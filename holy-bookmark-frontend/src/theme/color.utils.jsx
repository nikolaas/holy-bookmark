// function LightenDarkenColor(col, amt) {
//     let usePound = false;
//
//     if (col[0] === "#") {
//         col = col.slice(1);
//         usePound = true;
//     }
//
//     const num = parseInt(col,16);
//
//     let r = (num >> 16) + amt;
//
//     if (r > 255) {
//         r = 255;
//     } else if (r < 0) {
//         r = 0;
//     }
//
//     let b = ((num >> 8) & 0x00FF) + amt;
//
//     if (b > 255) {
//         b = 255;
//     } else if (b < 0) {
//         b = 0;
//     }
//
//     let g = (num & 0x0000FF) + amt;
//
//     if (g > 255) {
//         g = 255;
//     } else if (g < 0) {
//         g = 0;
//     }
//
//     return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
// }

const ColorLuminance = (color, lum) => {
    // validate hex string
    let hex = String(color).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
    }

    return rgb;
};

export function darken(col, amt) {
    return ColorLuminance(col, -amt);
}

export function lighten(col, amt) {
    return ColorLuminance(col, amt);
}
