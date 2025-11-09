const input = document.querySelector(".input-container input");
const todoList = document.querySelector(".todoList");
const todoContainer = document.querySelector(".todos-content");
const tab = document.querySelector(".tab");
const tabs = tab.querySelectorAll("button");
const left = document.querySelector(".left");
const clearCom = document.querySelector(".clear-com");
const allCom = document.querySelector(".all-com");
let currentTab = "all";
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

  setData();

  renderList();
}

function delFuc(i) {
  liData = liData.filter((e) => e.idx != i.idx);

  setData();

  renderList();
}

renderList = () => {
  let filtered = [];

  if (currentTab === "active") {
    filtered = liData.filter((e) => {
      return e.completed === false;
    });
  } else if (currentTab === "completed") {
    filtered = liData.filter((e) => {
      return e.completed === true;
    });
  } else {
    filtered = liData;
  }

  todoContainer.classList.toggle("active", liData.length > 0);

  todoList.innerHTML = "";

  filtered.forEach((e) => {
    function dbclickFuc() {
      const editInput = document.createElement("input");
      let undo = listP.textContent;
      editInput.value = listP.textContent;
      listP.textContent = "";
      listP.append(editInput);
      editInput.focus();

      editInput.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        try {
          editFuc();
        } catch (error) {}
      });
      editInput.addEventListener("blur", () => {
        try {
          editFuc();
        } catch (error) {}
      });

      function editFuc() {
        if (editInput.value.trim() === "") {
          listP.textContent = undo;
          renderList();
        } else {
          e.text = editInput.value;
          setData();
          renderList();
        }
      }
    }

    const li = document.createElement("li");
    const liCon = document.createElement("div");
    const checkBtn = document.createElement("button");
    const listP = document.createElement("p");
    const delBtn = document.createElement("button");

    checkBtn.className = "check-btn";
    delBtn.className = "del-btn";
    liCon.className = "li-container";
    li.classList.toggle("completed", e.completed);
    e.completed ? (checkBtn.textContent = "✓") : (checkBtn.textContent = "");

    listP.textContent = e.text;
    delBtn.textContent = "X";

    liCon.append(checkBtn);
    liCon.append(listP);

    li.append(liCon);
    li.append(delBtn);

    todoList.append(li);

    delBtn.addEventListener("click", () => delFuc(e));

    checkBtn.addEventListener("click", () => btnCheck(e.idx));

    li.addEventListener("dblclick", (e) => dbclickFuc());
  });
  let comLength = 0;

  liData.forEach((e) => {
    if (!e.completed) comLength++;
  });

  left.textContent =
    comLength === 1 ? `${comLength} item left` : `${comLength} items left`;
};

renderList();

input.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || !input.value.trim()) return;

  liData.push({
    idx: crypto.randomUUID(),
    text: input.value,
    completed: false,
  });

  setData();

  renderList();

  input.value = "";
});

tab.addEventListener("click", (btn) => {
  if (btn.target.classList.contains("all")) {
    currentTab = "all";
  } else if (btn.target.classList.contains("active")) {
    currentTab = "active";
  } else if (btn.target.classList.contains("completed")) {
    currentTab = "completed";
  }
  tabs.forEach((e) => {
    if (e.classList.contains(currentTab)) {
      e.style.border = "1px solid red";
    } else {
      e.style.border = "none";
    }
  });
  renderList();
});

clearCom.addEventListener("click", () => {
  liData = liData.filter((e) => {
    return e.completed === false;
  });

  setData();
  renderList();
});

allCom.addEventListener("click", () => {
  const isAll = liData.every((e) => e.completed);

  liData.forEach((e) => e.completed = !isAll);

  setData();
  renderList();
});
