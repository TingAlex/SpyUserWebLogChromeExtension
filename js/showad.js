/**
 * Created by Ting on 2017/12/25.
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        alert("get request from background");
        var ifram = document.createElement('iframe');
        ifram.setAttribute('width', '640px');
        ifram.setAttribute('height', '480px');
        ifram.setAttribute('src', request.greeting);
        ifram.setAttribute('frameborder', '0');
        ifram.setAttribute('marginwidth', '0');
        ifram.setAttribute('marginheight', '0');
        ifram.setAttribute('style', 'border: none; max-width:100%; max-height:100vh');
        document.body.appendChild(ifram);
    }
);

// var ifram = document.createElement('iframe');
// ifram.setAttribute('width', '640px');
// ifram.setAttribute('height', '480px');
// ifram.setAttribute('src', 'https://forms.office.com/Pages/ResponsePage.aspx?id=oBzDhDusrk6tEVGdgCM-b2DJ_fQODH9HlYefNBh-r3tUMTdOMFdETzczMzc2UUU5TUxINllGS0ZHSi4u&embed=true');
// ifram.setAttribute('frameborder', '0');
// ifram.setAttribute('marginwidth', '0');
// ifram.setAttribute('marginheight', '0');
// ifram.setAttribute('style', 'border: none; max-width:100%; max-height:100vh');
// document.body.appendChild(ifram);