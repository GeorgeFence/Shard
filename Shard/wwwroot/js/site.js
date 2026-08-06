
function updateStatusProgress(percent, message) {
    const bar =
        document.getElementById("statusProgressFill");

    const text =
        document.getElementById("statusProgressText");

    const msg =
        document.getElementById("statusMessage");


    if (!bar)
        return;


    bar.style.width =
        percent + "%";


    text.innerText =
        percent + "%";


    if (message)
        msg.innerText = message;
}
function progress(value, text) {
    value = Math.max(0, Math.min(100, value));


    let fill =
        document.getElementById("statusProgressFill");


    let label =
        document.getElementById("statusProgressText");


    let message =
        document.getElementById("statusMessage");



    if (fill) {
        fill.style.width =
            value + "%";
    }



    if (label) {
        label.innerText =
            Math.round(value) + "%";
    }



    if (message && text) {
        message.innerText =
            text;
    }
}
window.progress = function (value, text) {

    value = Math.max(0, Math.min(100, value));

    const fill =
        document.getElementById("statusProgressFill");

    const label =
        document.getElementById("statusProgressText");

    const message =
        document.getElementById("statusMessage");


    if (fill)
        fill.style.width = value + "%";


    if (label)
        label.innerText = Math.round(value) + "%";


    if (message && text)
        message.innerText = text;
};
