(function () {
    const chatHTML = `
        <button class="open-button" onclick="openForm()">Chat</button>
        <div class="chat-popup" id="myForm">
            <form action="#" class="form-container">
                <h1>Live Chat</h1>
                <div class="container">
                    <img src="https://os247.github.io/cdn/assets/images/head.svg" alt="Avatar" style="width:100%;">
                    <span>User</span>
                    <p>Hi, I need help with my order.</p>
                    <span class="time-right">11:00</span>
                </div>
                <textarea placeholder="Type message.." name="msg" required></textarea>
                <button type="button" class="btn" onclick="sendMessage()">Send</button>
                <button type="button" class="btn cancel" onclick="closeForm()">Close</button>
            </form>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    const socket = new WebSocket('ws://1stop.000.pe:8080');

    window.openForm = function () {
        document.getElementById("myForm").style.display = "block";
    };

    window.closeForm = function () {
        document.getElementById("myForm").style.display = "none";
    };

    window.sendMessage = function () {
        const textarea = document.querySelector('textarea[name="msg"]');
        const message = textarea.value;
        socket.send(JSON.stringify({ type: 'message', username: 'User', message }));
        textarea.value = '';
    };

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        const container = document.createElement("div");
        container.className = "container darker";
        container.innerHTML = `
            <img src="https://os247.github.io/cdn/assets/images/logo.avif" alt="Avatar" class="right" style="width:100%;">
            <span>${data.username}</span>
            <p>${data.message}</p>
            <span class="time-left">${new Date().toLocaleTimeString()}</span>
        `;
        document.querySelector(".form-container").appendChild(container);
    };
})();