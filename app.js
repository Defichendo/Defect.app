// Конфигурация типов дефектов
const DEFECT_TYPES = {
  crack: { name: "Трещина", color: "blue", shape: "circle" },
  corrosion: { name: "Коррозия", color: "orange", shape: "triangle" },
  "water-damage": { name: "Замокание", color: "lightblue", shape: "circle" },
  "rebar-exposure": { name: "Оголение арматуры", color: "gray", shape: "trapezoid" },
  chipping: { name: "Скол", color: "brown", shape: "circle" }
};

let defects = JSON.parse(localStorage.getItem('defects')) || [];
let activeMarker = null;

// Загрузка плана здания
document.getElementById('upload-plan').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  
  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById('plan-canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      
      // Восстановление ранее сохраненных маркеров
      restoreMarkers();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Восстановление маркеров при загрузке
function restoreMarkers() {
  defects.forEach(defect => {
    createMarker(defect.x, defect.y, defect.type, true);
  });
  updateDefectsTable();
}

// Создание маркера
function createMarker(x, y, type = null, isRestored = false) {
  const marker = document.createElement('div');
  marker.className = type ? `defect-marker ${type}` : 'defect-marker';
  marker.style.left = `${x}px`;
  marker.style.top = `${y}px`;
  
  // Добавляем обработчики для ПК и мобильных устройств
  marker.addEventListener('mousedown', startDrag);
  marker.addEventListener('touchstart', startDrag, { passive: false });
  
  document.getElementById('plan-canvas').parentNode.appendChild(marker);
  
  if (!isRestored) {
    activeMarker = { element: marker, x, y };
    document.getElementById('defect-menu').classList.remove('hidden');
  }
}

// Перетаскивание маркера
function startDrag(e) {
  e.preventDefault();
  const marker = e.target;
  const isTouch = e.type === 'touchstart';
  
  function moveHandler(e) {
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    
    const rect = marker.parentNode.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
  }
  
  function upHandler() {
    if (isTouch) {
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', upHandler);
    } else {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', upHandler);
    }
  }
  
  if (isTouch) {
    document.addEventListener('touchmove', moveHandler, { passive: false });
    document.addEventListener('touchend', upHandler);
  } else {
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
  }
}

// Сохранение дефекта
document.getElementById('save-defect').addEventListener('click', function() {
  const type = document.getElementById('defect-type').value;
  const photoInput = document.getElementById('defect-photo');
  
  if (photoInput.files.length === 0) {
    alert('Сделайте фото дефекта!');
    return;
  }
  
  const photo = URL.createObjectURL(photoInput.files[0]);
  const defect = {
    type,
    name: DEFECT_TYPES[type].name,
    photo,
    x: parseInt(activeMarker.element.style.left),
    y: parseInt(activeMarker.element.style.top)
  };
  
  // Обновляем внешний вид маркера
  activeMarker.element.className = `defect-marker ${type}`;
  
  // Сохраняем данные
  defects.push(defect);
  localStorage.setItem('defects', JSON.stringify(defects));
  updateDefectsTable();
  
  // Сбрасываем форму
  document.getElementById('defect-menu').classList.add('hidden');
  activeMarker = null;
  photoInput.value = '';
});

// Обновление таблицы дефектов
function updateDefectsTable() {
  const table = document.getElementById('defects-table');
  table.innerHTML = `
    <h3>Список дефектов (${defects.length})</h3>
    <table border="1">
      <tr>
        <th>Тип</th>
        <th>Фото</th>
        <th>Название</th>
      </tr>
      ${defects.map(defect => `
        <tr>
          <td><div class="defect-marker ${defect.type}" style="display: inline-block;"></div></td>
          <td><img src="${defect.photo}" width="100"></td>
          <td>${defect.name}</td>
        </tr>
      `).join('')}
    </table>
    ${defects.length > 0 ? '<button id="clear-all">Очистить все</button>' : ''}
  `;
  
  if (defects.length > 0) {
    document.getElementById('clear-all').addEventListener('click', clearAllDefects);
  }
}

// Очистка всех дефектов
function clearAllDefects() {
  if (confirm('Удалить все дефекты?')) {
    defects = [];
    localStorage.removeItem('defects');
    document.querySelectorAll('.defect-marker').forEach(marker => marker.remove());
    updateDefectsTable();
  }
}

// Инициализация при загрузке
updateDefectsTable();
