//проверка на пробелы
function space (str) {
  return str.trim() != "";
}

let allList = document.querySelector('ul');
let allDoneList = document.querySelector('ul.done__list');
//сохранение задач
function saveLocal () {
  let allTasks;
  let allTDone;
  if (allList.innerHTML) {
    allTasks = allList.innerHTML;
    localStorage.setItem('allTasks', allTasks)
  }
  if (allDoneList.innerHTML) {
    allDone = allDoneList.innerHTML;
    localStorage.setItem('allDone', allDone)
  }
}

if (localStorage.getItem('allTasks')) {
  allList.innerHTML = localStorage.getItem('allTasks')
}
if (localStorage.getItem('allDone')) {
  allDoneList.innerHTML = localStorage.getItem('allDone')
}

//очистить все списки
window.onkeydown = function (event) {
  if (event.ctrlKey && event.code === 'KeyD') {
    event.preventDefault();
    localStorage.clear()
    window.location.reload();
  }
}
//создание новой задачи
const taskInput = document.getElementById('taskInput');
function createTask () {
  const tasksList = document.getElementById('tasksList');
  const taskText = taskInput.value;
  if (space(taskText))  {
    const newLi = document.createElement('li');
    newLi.classList.add('tasks__item');
    newLi.insertAdjacentHTML(`beforeend`,
      `<div class="tasks__box"></div>`)
    const textSpan = document.createElement('span');
    textSpan.classList.add('tasks__text');
    textSpan.innerText = taskText;
    newLi.append(textSpan);
    newLi.insertAdjacentHTML(`beforeend`,
      `
            <div class="tasks__edit"><img src="./assets/img/pen30.png" alt="Edit"></div>
            <div class="tasks__update"><img src="./assets/img/flag30.png" alt="Update"></div>
            <div class="tasks__del"><img src="./assets/img/trash30.png" alt="Delete"></div>`)
    tasksList.append(newLi);
    taskInput.value = "";
  }
  else {
    alert('Enter task!');
  }
  saveLocal();
}


taskInput.onkeypress = function (e) {
  if (e.key === 'Enter') {
    createTask();
  }
}

taskInput.addEventListener('keyup', function (e){
  if (e.key === 'Escape') {
    this.value = "";
  }
})

addEventListener('click', function (e) {
  //добавление новой задачи кнопкой
  if (e.target.closest('#addBtn')) {
    createTask();
  }
    //отметить елемент чекбокс
  if (e.target.closest('.tasks__box')) {
    e.target.closest('.tasks__box').classList.toggle('checked');
  }
 // отметить/убрать отметки со всех задач
  const boxes = document.querySelectorAll('.tasks__box');
  if (e.target.closest('.controls__check-button')) {
    if (boxes[0].classList.contains('checked')) {
      for (let tList of boxes) {
        tList.classList.remove('checked');
      }
    } else {
      for (let tList of boxes) {
        tList.classList.add('checked');
      }
    }
  }
    //удалить задачу кнопкой
  if (e.target.closest('.tasks__del')) {
    e.target.closest('.tasks__item').remove();
  }
    //удалить все отмеченные задачи
  if (e.target.closest('.controls__del-button')) {
    for (let list of boxes) {
      if (list.classList.contains('checked')) {
        list.parentElement.remove();
      }
    }
  }
  // редактировать задачу
  if (e.target.closest('.tasks__edit')) {
    const editBtn = e.target.closest('.tasks__edit');
    let taskElement = editBtn.previousElementSibling;
    const editInput = document.createElement('input');
    editInput.classList.add('tasks__edit-input');
    editInput.classList.add('task-input');
    editInput.type = 'text';
    editBtn.previousElementSibling.outerHTML = editInput.outerHTML;
    editBtn.previousElementSibling.value = taskElement.innerHTML;
    editBtn.previousElementSibling.placeholder = 'Enter task';
    editBtn.classList.toggle('active');
    editBtn.nextElementSibling.classList.toggle('active');
    editBtn.previousElementSibling.focus();
  }
  // нажатие кнопки update
  if (e.target.closest('.tasks__update')) {
    updateTask(e.target.closest('.tasks__update').previousElementSibling.previousElementSibling)
  }
  saveLocal();
})

addEventListener('keypress', function (e) {
  if (e.target.classList.contains('tasks__edit-input')  && e.key === 'Enter') {
    updateTask(e.target)
  }
})

 //сохранение изменений задачи
function updateTask (targets) {
  const newTaskValue = targets.value;
  if (space(newTaskValue)) {
    const newTask = document.createElement('span');
    targets.nextElementSibling.classList.toggle('active');
    targets.nextElementSibling.nextElementSibling.classList.toggle('active');
    newTask.classList.add('tasks__text');
    newTask.innerText = newTaskValue;
    targets.outerHTML = newTask.outerHTML;
  } else {
    return alert('Enter task');
  }
  saveLocal();
}

//перенести отмеченные задачи в выполненый список
const doneBtn = document.querySelector('.controls__done-button');
doneBtn.onclick = function() {
  const tasksLi = document.querySelectorAll('.tasks__item');
  let newDoneList = Array.from(tasksLi).filter(function (item, index, array) {
    return item.firstElementChild.classList.contains('checked');
  })
  let doneList = document.getElementById('doneList');
  for (let d of newDoneList) {
    let node = document.createElement('li');
    node.className = 'done__item';
    node.appendChild(document.createElement('span'));
    if (d.children[1].tagName === 'INPUT') {
      node.firstElementChild.innerHTML = d.children[1].value;
    } else {
      node.firstElementChild.innerHTML = d.children[1].innerHTML;
    }
    doneList.prepend(node);
    d.remove();
  }
  saveLocal();
}


