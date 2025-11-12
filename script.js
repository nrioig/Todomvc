const input = document.querySelector(".input-container input");
const todoList = document.querySelector(".todoList");
const todoContainer = document.querySelector(".todos-content");
const tab = document.querySelector(".tab");
const tabs = tab.querySelectorAll("button");
const left = document.querySelector(".left");
const clearCom = document.querySelector(".clear-com");
const allCom = document.querySelector(".all-com");
let currentTab = "all";
const tabMap = {
  "#/": "all",
  "#/Active": "active",
  "#/Completed": "completed",
};

let liData = JSON.parse(localStorage.getItem("data")) || [];

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

function delFuc(i) {
  liData = liData.filter((e) => e.idx != i.idx);

  update();
}

function update() {
  setData();
  renderList();
}

function renderTab() {
  tabs.forEach((e) => {
    if (e.classList.contains(currentTab)) {
      e.classList.add("isActive");
    } else {
      e.classList.remove("isActive");
    }
  });
}

function renderList() {
  let filtered = [];

  const filterMap = {
    all: () => liData,

    active: () => liData.filter((e) => !e.completed),

    completed: () => liData.filter((e) => e.completed),
  };

  filtered = (filterMap[currentTab] || filterMap.all)();

  todoContainer.classList.toggle("active", liData.length > 0);

  todoList.innerHTML = "";

  renderTab()

  filtered.forEach((e) => {
    const create = (element, attri = {}) => {
      return Object.assign(document.createElement(element), attri);
    };

    const li = create("li", {
      className: e.completed ? "completed" : "",
    });
    const liCon = create("div", {
      className: "li-container",
    });
    const checkBtn = create("button", {
      className: "check-btn",
      textContent: e.completed ? "✓" : "",
    });
    const listP = create("p", {
      textContent: e.text,
    });
    const delBtn = create("button", {
      className: "del-btn",
      textContent: "X",
    });

    liCon.append(checkBtn, listP);
    li.append(liCon, delBtn);
    todoList.append(li);

    delBtn.addEventListener("click", () => delFuc(e));

    checkBtn.addEventListener("click", () => btnCheck(e.idx));

    li.addEventListener("dblclick", (e) => dbclickFuc());

    function dbclickFuc() {
      const editInput = document.createElement("input");
      let undo = listP.textContent;
      editInput.value = listP.textContent;
      listP.textContent = "";
      listP.append(editInput);
      editInput.focus();

      editInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        editFuc();
      });
      editInput.addEventListener("blur", () => {
        editFuc();
      });

      function editFuc() {
        if (editInput.value.trim() === "") {
          listP.textContent = undo;
          renderList();
        } else {
          e.text = editInput.value;
          update();
        }
      }
    }
  });
  let comLength = 0;

  liData.forEach((e) => {
    if (!e.completed) comLength++;
  });

  left.textContent =
    comLength === 1 ? `${comLength} item left` : `${comLength} items left`;
}

renderList();

input.addEventListener("keydown", (e) => {
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

clearCom.addEventListener("click", () => {
  liData = liData.filter((e) => {
    return e.completed === false;
  });

  update();
});

allCom.addEventListener("click", () => {
  const isAll = liData.every((e) => e.completed);

  liData.forEach((e) => (e.completed = !isAll));

  update();
});
