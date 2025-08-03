document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('plan-canvas');
    const ctx = canvas.getContext('2d');
    let markers = [];
    let currentMarker = null;

    // Загрузка плана
    document.getElementById('upload-plan').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                drawMarkers();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Обработка кликов
    canvas.addEventListener('click', function(e) {
        if (!canvas.width) return; // План не загружен
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        addMarker(x, y);
    });

    // Добавление маркера
    function addMarker(x, y) {
        markers.push({ x, y, type: 'default' });
        drawMarkers();
        showDefectMenu();
    }

    // Отрисовка всех маркеров
    function drawMarkers() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (document.getElementById('upload-plan').files.length > 0) {
            const img = new Image();
            img.src = URL.createObjectURL(document.getElementById('upload-plan').files[0]);
            ctx.drawImage(img, 0, 0);
        }
        
        markers.forEach(marker => {
            ctx.beginPath();
            ctx.arc(marker.x, marker.y, 15, 0, Math.PI * 2);
            ctx.fillStyle = getColorByType(marker.type);
            ctx.fill();
        });
    }

    // Показ меню дефектов
    function showDefectMenu() {
        currentMarker = markers.length - 1;
        document.getElementById('defect-menu').classList.remove('hidden');
    }

    // Сохранение дефекта
    document.getElementById('save-defect').addEventListener('click', function() {
        const type = document.getElementById('defect-type').value;
        markers[currentMarker].type = type;
        drawMarkers();
        document.getElementById('defect-menu').classList.add('hidden');
    });

    // Цвета маркеров
    function getColorByType(type) {
        const colors = {
            'default': 'red',
            'crack': 'blue',
            'corrosion': 'orange',
            'water-damage': 'lightblue',
            'rebar-exposure': 'gray',
            'chipping': 'brown'
        };
        return colors[type] || 'red';
    }
});
