const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const deleteButton = document.getElementById('deleteButton');

let circles = [];
let selectedCircle = null;
let isDragging = false;

canvas.addEventListener('mousedown', function(e) {
  const { x, y } = getMousePos(e);
  selectedCircle = getClickedCircle(x, y);

  if (selectedCircle) {
    selectedCircle.color = 'red';
    isDragging = true;
    deleteButton.style.display = 'block'; // Show delete button
  } else {
    circles.forEach(c => c.color = 'blue');
    const circle = {
      x,
      y,
      radius: 20,
      color: 'blue'
    };
    circles.push(circle);
    selectedCircle = circle;
    deleteButton.style.display = 'none'; // Hide delete button
  }
  drawAll();
});

canvas.addEventListener('mousemove', function(e) {
  if (isDragging && selectedCircle) {
    const { x, y } = getMousePos(e);
    selectedCircle.x = x;
    selectedCircle.y = y;
    drawAll();
  }
});

canvas.addEventListener('mouseup', function() {
  isDragging = false;
});

canvas.addEventListener('wheel', function(e) {
  if (selectedCircle) {
    e.preventDefault();
    selectedCircle.radius += e.deltaY < 0 ? 2 : -2;
    if (selectedCircle.radius < 5) selectedCircle.radius = 5;
    drawAll();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Delete' && selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    drawAll();
  }
});

function getMousePos(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function getClickedCircle(x, y) {
  for (let i = circles.length - 1; i >= 0; i--) {
    const c = circles[i];
    const dx = x - c.x;
    const dy = y - c.y;
    if (Math.sqrt(dx * dx + dy * dy) <= c.radius) {
      return c;
    }
  }
  return null;
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(c => {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    ctx.closePath();
  });
}

deleteButton.addEventListener('click', function() {
  if (selectedCircle) {
    circles = circles.filter(c => c !== selectedCircle);
    selectedCircle = null;
    deleteButton.style.display = 'none'; // Hide delete button
    drawAll();
  }
});
