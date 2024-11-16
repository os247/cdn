function openForm() {
            document.getElementById("myForm").style.display = "block";
        }

        function closeForm() {
            document.getElementById("myForm").style.display = "none";
        }

        // WebSocket integration
        const socket = new WebSocket('ws://127.0.0.1:8080');
        
        socket.onmessage = (event) => {
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

        function sendMessage() {
            const textarea = document.querySelector('textarea[name="msg"]');
            const message = textarea.value;
            socket.send(JSON.stringify({ type: 'message', username: 'User', message }));
            textarea.value = '';

            const container = document.createElement("div");
            container.className = "container";
            container.innerHTML = `
                <img src="https://os247.github.io/cdn/assets/images/head.svg" alt="Avatar" style="width:100%;">
                <span>User</span>
                <p>${message}</p>
                <span class="time-right">${new Date().toLocaleTimeString()}</span>
            `;
            document.querySelector(".form-container").appendChild(container);
        }
