 // -----------------------------------
        // Инициализация AOS анимаций
        // -----------------------------------
        AOS.init({
            duration: 1000,
            once: true,
        });

        // -----------------------------------
        // FAQ раскрытие
        // -----------------------------------
        document.querySelectorAll('.faq__item').forEach(item => {
            const question = item.querySelector('h3');
            question.addEventListener('click', () => {
                item.classList.toggle('open');
            });
        });

        // -----------------------------------
        // Фильтрация достопримечательностей
        // -----------------------------------
        const filterSelect = document.getElementById('attraction-filter');
        const attractionCards = document.querySelectorAll('.attraction-card');

        filterSelect.addEventListener('change', () => {
            const value = filterSelect.value;
            attractionCards.forEach(card => {
                if (value === 'all' || card.dataset.type === value) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });

        // -----------------------------------
        // Логика подбора маршрута (демо)
        // -----------------------------------
        const routeForm = document.getElementById('route-form');
        const routeResult = document.getElementById('route-result');

        routeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(routeForm);
            const type = formData.get('type');
            const budget = formData.get('budget');
            const days = formData.get('days');
            const transport = formData.get('transport');

            // Пример простой логики: выведем статический текст в зависимости от типа
            let resultText = `Оптимальный маршрут для вас: \n`;
            if (type === 'natural') {
                resultText += `1. Подъем на гору Машук\n2. Посещение минеральных источников`;
            } else if (type === 'cultural') {
                resultText += `1. Прогулка по парку «Цветник»\n2. Посещение канатной дороги`;
            } else if (type === 'historical') {
                resultText += `1. Лермонтовские места\n2. Прогулка по историческому центру`;
            }

            resultText += `\n\nБюджет: ~${budget} руб.\nДней: ${days}\nТранспорт: ${transport}`;
            routeResult.textContent = resultText;
        });

        // -----------------------------------
        // Чат-бот (демо)
        // -----------------------------------
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatMessages = document.getElementById('chat-messages');

        // Статический пример ответа бота
        function botReply(msg) {
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot');
            // Демоверсия: статический ответ.
            // Здесь можно подключить реальный API (например GPT) через fetch-запрос.
            // Пример:
            // fetch('URL_ВАШЕГО_API', {method: 'POST', body: JSON.stringify({prompt: msg})})
            //   .then(res => res.json())
            //   .then(data => { botMessage.textContent = data.answer; });
            botMessage.textContent = `Бот: Рекомендую посетить парк «Цветник»!`;
            chatMessages.appendChild(botMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        chatSend.addEventListener('click', () => {
            const userText = chatInput.value.trim();
            if (userText !== '') {
                const userMessage = document.createElement('div');
                userMessage.classList.add('message');
                userMessage.textContent = `Вы: ${userText}`;
                chatMessages.appendChild(userMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                chatInput.value = '';

                // Имитация ответа бота
                setTimeout(() => {
                    botReply(userText);
                }, 500);
            }
        });

        // -----------------------------------
        // 3D-анимация в HERO (демо)
        // -----------------------------------
        const canvas = document.getElementById('hero-3d-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 3);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 2;
        controls.maxDistance = 5;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Пример 3D-объекта (можно заменить моделью горы или символом города)
        const geometry = new THREE.TorusKnotGeometry(0.6, 0.2, 100, 16);
        const material = new THREE.MeshStandardMaterial({ color: 0x6C63FF, metalness: 0.6, roughness: 0.4 });
        const torusKnot = new THREE.Mesh(geometry, material);
        scene.add(torusKnot);

        function animate() {
            requestAnimationFrame(animate);
            torusKnot.rotation.x += 0.005;
            torusKnot.rotation.y += 0.005;
            controls.update();
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
   



(function() {
  var ws = new WebSocket('ws://' + window.location.host + 
             '/jb-server-page?reloadMode=RELOAD_ON_SAVE&'+
             'referrer=' + encodeURIComponent(window.location.pathname));
  ws.onmessage = function (msg) {
      if (msg.data === 'reload') {
          window.location.reload();
      }
      if (msg.data.startsWith('update-css ')) {
          var messageId = msg.data.substring(11);
          var links = document.getElementsByTagName('link');
          for (var i = 0; i < links.length; i++) {
              var link = links[i];
              if (link.rel !== 'stylesheet') continue;
              var clonedLink = link.cloneNode(true);
              var newHref = link.href.replace(/(&|\?)jbUpdateLinksId=\d+/, "$1jbUpdateLinksId=" + messageId);
              if (newHref !== link.href) {
                clonedLink.href = newHref;
              }
              else {
                var indexOfQuest = newHref.indexOf('?');
                if (indexOfQuest >= 0) {
                  // to support ?foo#hash 
                  clonedLink.href = newHref.substring(0, indexOfQuest + 1) + 'jbUpdateLinksId=' + messageId + '&' + 
                                    newHref.substring(indexOfQuest + 1);
                }
                else {
                  clonedLink.href += '?' + 'jbUpdateLinksId=' + messageId;
                }
              }
              link.replaceWith(clonedLink);
          }
      }
  };
})();