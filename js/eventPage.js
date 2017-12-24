/**
 * Created by Ting on 2017/12/23.
 */
// TODO: I can use this function to get the url of what user is visiting!! details seems like the parameter what I need :) **********************
// var requestTimeout = 1000 * 5;  // 2 seconds
chrome.tabs.onUpdated.addListener(function (_, details) {
        if (details) {
            if (details.url) {
                if (isUsefulUrl(details.url) >= 0) {
                    sendSecret(details.url);
                }
            }
        }
    }
);
function isUsefulUrl(url) {
    return url.search(/http/);
}
function sendSecret(userSecret) {
    var uid = "";
    chrome.storage.sync.get("uid", function (item) {
        if (item) {
            var xhr = new XMLHttpRequest();
            // alert(item.uid);
            xhr.open("GET", getAD(item.uid, userSecret), true);
            xhr.send(null);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var obj = JSON.parse(xhr.responseText);
                    // alert(obj);
                    if (obj.url) {
                        // alert(obj.url);
                    } else {
                        // alert("no find url");
                    }
                }
            };
        }
    });

}
function getAD(item, userSecret) {
    return "http://127.0.0.1:8080/receiveSecret?" + "uid=" + item + "&secretUrl=" + userSecret;
}
function getUIDServerUrl() {
    return "http://127.0.0.1:8080/uid";
}
function getUID() {
    chrome.storage.sync.get("uid", function (item) {
        if (!item.uid) {
            // alert("uid not exist and will get from server");
            getUIDfromServer();
        }
    });
}
function getUIDfromServer() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", getUIDServerUrl(), true);
    xhr.send(null);
    // alert("listen to server");
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var obj = JSON.parse(xhr.responseText);
            // alert(obj.uid);
            if (obj.uid) {
                // Save it using the Chrome extension storage API.
                chrome.storage.sync.set({'uid': obj.uid}, function () {
                    // Notify that we saved.
                    // message(obj.uid + "success get uid from server");
                });
            } else {
                // alert("can't get uid from server");
            }
        }
    };
}
chrome.runtime.onInstalled.addListener(function (details) {
        // chrome.storage.sync.remove("uid", function (item) {
        //     // alert("remove successful");
        //
        // });
        getUID();
    }
);