// Загрузка плана здания
const planInput = document.getElementById('upload-plan');
const canvas = document.getElementById('plan-canvas');
const ctx = canvas.getContext('2d');

planInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = event.target.result;
  };
  
  reader.readAsDataURL(file);
});

// Добавление дефектов
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  // Рисуем точку
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Показываем форму
  document.getElementById('defect-form').classList.remove('hidden');
  
  // Сохранение дефекта
  document.getElementById('save-defect').onclick = () => {
    const photoInput = document.getElementById('upload-photo');
    const defectType = document.getElementById('defect-type').value;
    
    // Здесь можно сохранить данные в LocalStorage или Firebase
    console.log({ x, y, photo: photoInput.files[0], defectType });
    
    alert('Дефект сохранен!');
  };
});