const { createElement } = require("react");

const $ = (element) => document.querySelector(element);
const $$ = (element) => document.querySelectorAll(element);

const $input = $(".input-container input");
const $todoList = $(".todoList");
const $todoContainer = $(".todos-content");
const $tabs = $$(".tab button");
const $left = $(".left");
const $clearCom = $(".clear-com");
const $allCom = $(".all-com");

let currentTab = "all";
const tabMap = {
  "#/": "all",
  "#/Active": "active",
  "#/Completed": "completed",
};
const filterMap = {
  all: () => liData,
  active: () => liData.filter((e) => !e.completed),
  completed: () => liData.filter((e) => e.completed),
};

let liData = JSON.parse(localStorage.getItem("data")) || [];

const services = {
  deleteTodoByIdx(idx){
    return liData.filter(  e => e.idx != idx );
  },

  get isAllCompleted(){
    return liData.every((e) => e.completed)
  }
}


const create = (element, attri = {}) => {
  return Object.assign(document.createElement(element), attri);
};

function setData() {
  localStorage.setItem("data", JSON.stringify(liData));
}

function btnCheck(i) {
  liData.forEach((e) => {
    if (e.idx == i) {
      e.completed = !e.completed;
    }
  });

  update();
}

// function delFuc(i) {
//   liData = liData.filter((e) => e.idx != i.idx);

//   update();
// }

function update() {
  setData();
  renderList();
}

function renderTab() {
  $tabs.forEach((e) => {
    if (e.classList.contains(currentTab)) {
      e.classList.add("isActive");
    } else {
      e.classList.remove("isActive");
    }
  });
}

function renderList() {
  let filtered = [];

  filtered = (filterMap[currentTab] || filterMap.all)();

  $todoContainer.classList.toggle("active", liData.length > 0);
  $todoList.innerHTML = "";

  renderTab()

  filtered.forEach((e) => {

    const $li = create("li", {
      className: e.completed ? "completed" : "",
      innerHTML: `
        <div class="li-container">
          <button class="check-btn">${e.completed ? '✓' :'' } </button>
          <p></p>
          <button class="del-btn">X</button>
        </div>
      `
    });
    const $delBtn = $li.querySelector('.del-btn');
    const $checkBtn = $li.querySelector('.check-btn')
    const $text = $li.querySelector('p');
    $text.textContent = e.text;

    $delBtn.addEventListener("click", () => {
      liData = services.deleteTodoByIdx(e.idx);
      update();
    });
    $checkBtn.addEventListener("click", () => btnCheck(e.idx));
    $li.addEventListener("dblclick", handleDbClick);

    function handleDbClick() {
      const $editInput = createElement('input',{
        textContent:e.text
      })
      $editInput.focus();

      $editInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        editFuc();
      });
      $editInput.addEventListener("blur", () => {
        editFuc();
      });

      function editFuc() {
        if ($editInput.value.trim() !== "") {
          e.text = $editInput.value;
        } 
        update();
      }
    }
  });
  const comLength = filterMap.active().length;

  $left.textContent =
    comLength === 1 ? `${comLength} item left` : `${comLength} items left`;
}

renderList();

$input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || !input.value.trim()) return;

  liData.push({
    idx: crypto.randomUUID(),
    text: input.value,
    completed: false,
  });

  update();

  input.value = "";
});
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;

  const newTab = tabMap[hash];
  console.log(hash);

  currentTab = newTab;

  update();
});

$clearCom.addEventListener("click", () => {
  liData = liData.filter((e) => {
    return e.completed === false;
  });

  update();
});

$allCom.addEventListener("click", () => {
  const isAll = services.isAllCompleted;
  liData = isAll ? filterMap.active() : filterMap.completed()

  update();
});
